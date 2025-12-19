import React, { useEffect, useRef, useState, useCallback } from "react";
import { useOfferConnection } from "../../lib/webrtc/useOfferConnection";
import { useGamepadControl } from "../../lib/gamepad/useGamepadControl";
import { ControlInfo, DetectionInfo, RobotInfo } from "../../lib/types/telemetry";
import { createControlPublisher } from "../../lib/control/controlPublisher";
import { startOldSkywayOffer } from "../../lib/skyway/oldSkywayOffer";
import { createCanvasRenderer } from "../../lib/canvas/canvasRenderer";
import { MonitorCardState } from "../types/monitor";
import { Section } from "./Section";
import { useInference } from "../hooks/useInference";

export type MonitorCardProps = {
    card: MonitorCardState;
    onChange: (updater: (card: MonitorCardState) => MonitorCardState) => void;
    onRemove?: () => void;
};

/**
 * 単一のモニターカードコンポーネント
 * WebRTC接続、映像受信、ゲームパッド制御、推論を統合
 */
export const MonitorCard: React.FC<MonitorCardProps> = ({
    card,
    onChange,
    onRemove,
}) => {
    // --- State ---
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<ReturnType<typeof createCanvasRenderer> | null>(null);
    const controlPublisherRef = useRef<ReturnType<typeof createControlPublisher> | null>(null);
    const skywayConnRef = useRef<{ close: () => void } | null>(null);

    const { control, pads, ordered } = useGamepadControl();
    const [robotInfo, setRobotInfo] = useState<RobotInfo>({
        gnssSpeed: 0,
        headingError: 0,
        lateralError: 0,
    });
    const [detectionInfo, setDetectionInfo] = useState<DetectionInfo>({
        isEnabled: false,
        detections: [],
    });
    const [runInference, setRunInference] = useState(false);
    const [controlChannel, setControlChannel] = useState<RTCDataChannel | null>(null);
    const [skywayStatus, setSkywayStatus] = useState<"idle" | "opening" | "connected" | "error">("idle");
    const [telemetryStatus, setTelemetryStatus] = useState<string>("Idle");

    // Refs for latest values (used in callbacks)
    const robotInfoRef = useRef<RobotInfo>(robotInfo);
    const controlRef = useRef<ControlInfo>(control);
    const detectionRef = useRef<DetectionInfo>(detectionInfo);

    // --- Helpers ---
    const setField = <K extends keyof MonitorCardState>(
        key: K,
        value: MonitorCardState[K]
    ) => onChange((prev) => ({ ...prev, [key]: value }));

    // --- WebRTC Connection ---
    const { connection, dataChannel } = useOfferConnection({
        signalingUrl: card.signalingUrl,
        offerPeerId: card.offerPeerId,
        targetPeerId: card.targetPeerId,
        useIceServers: card.useStunTurn,
        videoCodec: card.videoCodec,
        onRemoteStream: (stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play?.().catch(() => { });
            }
        },
        onSignalingState: (s) => setField("signalingStatus", s),
        onIceState: (s) => setField("stunStatus", s),
        onDataChannel: (dc) => setControlChannel(dc),
    });

    // --- Keep refs updated ---
    useEffect(() => { robotInfoRef.current = robotInfo; }, [robotInfo]);
    useEffect(() => { controlRef.current = control; }, [control]);
    useEffect(() => { detectionRef.current = detectionInfo; }, [detectionInfo]);

    // --- Inference Hook ---
    const handleDetections = useCallback((det: DetectionInfo) => {
        setDetectionInfo(det);
    }, []);

    useInference(videoRef, runInference, handleDetections);

    // --- Control Publisher ---
    useEffect(() => {
        if (!controlPublisherRef.current) {
            controlPublisherRef.current = createControlPublisher(33);
        }
        controlPublisherRef.current.setControlSource(() => controlRef.current);
    }, [control]);

    // --- SkyWay Functions ---
    const cleanupSkyway = useCallback(() => {
        skywayConnRef.current?.close();
        skywayConnRef.current = null;
        setControlChannel(null);
        setSkywayStatus("idle");
    }, []);

    const createSkywayPeer = async () => {
        cleanupSkyway();
        if (typeof (window as any).Peer === "undefined") {
            console.error("SkyWay old SDK (Peer) is not loaded");
            setSkywayStatus("error");
            return;
        }
        if (!card.skywayApiKey) {
            console.warn("SkyWay API Key required");
            setSkywayStatus("error");
            return;
        }
        setSkywayStatus("opening");
        try {
            const conn = await startOldSkywayOffer({
                apiKey: card.skywayApiKey,
                localPeerId: card.skywayLocalId || undefined,
                onOpen: (id) => setField("skywayMyId", id),
                onStream: (stream) => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                },
            });
            skywayConnRef.current = conn;
            setControlChannel((conn as any).dataChannel as RTCDataChannel | null);
            setSkywayStatus("connected");
        } catch (e) {
            console.error("Old SkyWay peer create failed", e);
            setSkywayStatus("error");
        }
    };

    const connectSkywayRemote = async () => {
        cleanupSkyway();
        if (typeof (window as any).Peer === "undefined") {
            console.error("SkyWay old SDK (Peer) is not loaded");
            setSkywayStatus("error");
            return;
        }
        if (!card.skywayApiKey || !card.skywayRemoteId) {
            console.warn("SkyWay API key or remote id missing");
            setSkywayStatus("error");
            return;
        }
        setSkywayStatus("opening");
        try {
            const conn = await startOldSkywayOffer({
                apiKey: card.skywayApiKey,
                localPeerId: card.skywayLocalId || undefined,
                remotePeerId: card.skywayRemoteId,
                onOpen: (id) => setField("skywayMyId", id),
                onStream: (stream) => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                },
            });
            skywayConnRef.current = conn;
            setControlChannel((conn as any).dataChannel as RTCDataChannel | null);
            setSkywayStatus("connected");
        } catch (e) {
            console.error("Old SkyWay connect failed", e);
            setSkywayStatus("error");
        }
    };

    useEffect(() => {
        if (card.engine !== "oldskyway") cleanupSkyway();
        return () => cleanupSkyway();
    }, [card.engine, cleanupSkyway]);

    // --- Control Publisher Sender ---
    useEffect(() => {
        const publisher = controlPublisherRef.current;
        if (!publisher) return;

        const dc: any = controlChannel || dataChannel;

        const applySender = (channel: any) => {
            if (channel && channel.readyState === "open") {
                publisher.setSender((payload) => channel.send(JSON.stringify(payload)));
                publisher.start();
            } else {
                publisher.setSender(null);
                publisher.stop();
            }
        };

        if (card.engine === "pure" || card.engine === "oldskyway") {
            applySender(dc);
            if (dc && typeof dc.addEventListener === "function") {
                const onOpen = () => applySender(dc);
                const onClose = () => applySender(null);
                dc.addEventListener("open", onOpen);
                dc.addEventListener("close", onClose);
                return () => {
                    dc.removeEventListener("open", onOpen);
                    dc.removeEventListener("close", onClose);
                };
            }
            return;
        }

        publisher.stop();
        publisher.setSender(null);
    }, [card.engine, controlChannel, dataChannel]);

    // --- Telemetry Receiver ---
    useEffect(() => {
        const dc = (controlChannel || dataChannel) as any;
        if (!dc) return;

        const handleMessage = (event: MessageEvent) => {
            let msg: any = event.data;
            try {
                msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
            } catch {
                /* ignore */
            }
            if (msg?.type === "outputAutorunInfo") {
                const payload = msg.payload || msg;
                const next: RobotInfo = {
                    gnssSpeed: Number(payload.gnssSpeed) || 0,
                    headingError: Number(payload.headingError) || 0,
                    lateralError: Number(payload.lateralError) || 0,
                };
                setRobotInfo(next);
                robotInfoRef.current = next;
                setTelemetryStatus("Receiving");
            } else if (msg?.type === "inferenceResults" || msg?.type === "offerInferenceResults") {
                const detections = msg.payload?.detections || msg.detections || [];
                setDetectionInfo({ isEnabled: true, detections });
            }
        };

        if (typeof dc.addEventListener === "function") {
            dc.addEventListener("message", handleMessage);
            return () => dc.removeEventListener("message", handleMessage);
        }

        const prev = dc.onmessage;
        dc.onmessage = (ev: MessageEvent) => {
            handleMessage(ev);
            if (typeof prev === "function") prev(ev);
        };
        return () => { dc.onmessage = prev; };
    }, [controlChannel, dataChannel]);

    // --- Canvas Renderer ---
    useEffect(() => {
        if (!canvasRef.current || !videoRef.current) return;

        const renderer = createCanvasRenderer({
            canvas: canvasRef.current,
            video: videoRef.current,
            getRobotInfo: () => robotInfoRef.current,
            getControlInfo: () => controlRef.current,
            getDetectionInfo: () => detectionRef.current,
        });
        rendererRef.current = renderer;
        renderer.start();

        const onFullscreenChange = () => {
            if (!document.fullscreenElement) renderer.hide();
        };
        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", onFullscreenChange);
            renderer.stop();
        };
    }, [card.id]);

    // --- Handlers ---
    const handleConnect = () => {
        connection.start().catch((e) => {
            console.error(e);
            setField("signalingStatus", "Error");
        });
    };

    const handleSendVideoQuality = () => {
        const dc = (controlChannel || dataChannel) as RTCDataChannel | null;
        if (!dc || dc.readyState !== "open") {
            console.warn("DataChannel not open");
            return;
        }
        const payload = {
            type: "videoQualityChange",
            width: Number(card.videoWidth),
            height: Number(card.videoHeight),
            framerate: Number(card.videoFramerate),
            bitrate: Number(card.videoBitrate),
        };
        try {
            dc.send(JSON.stringify(payload));
        } catch (e) {
            console.error("Failed to send video quality change", e);
        }
    };

    const enterCanvasFullscreen = () => {
        const canvas = canvasRef.current;
        if (canvas && canvas.requestFullscreen) {
            rendererRef.current?.show();
            canvas.requestFullscreen();
        }
    };

    // --- Render ---
    return (
        <div style={{ border: "1px solid #ccc", padding: 12, marginTop: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <strong>Monitor</strong>
                {onRemove && (
                    <button onClick={onRemove} style={{ marginLeft: "auto" }}>
                        Remove
                    </button>
                )}
            </div>

            {/* Engine Selection */}
            <Section title="WebRTC Engine">
                <label>
                    <input
                        type="radio"
                        name={`engine-${card.id}`}
                        value="pure"
                        checked={card.engine === "pure"}
                        onChange={() => setField("engine", "pure")}
                    />
                    Pure WebRTC
                </label>
                <label style={{ marginLeft: 12 }}>
                    <input
                        type="radio"
                        name={`engine-${card.id}`}
                        value="oldskyway"
                        checked={card.engine === "oldskyway"}
                        onChange={() => setField("engine", "oldskyway")}
                    />
                    Old SkyWay
                </label>
                <label style={{ marginLeft: 12 }}>
                    <input
                        type="radio"
                        name={`engine-${card.id}`}
                        value="newskyway"
                        checked={card.engine === "newskyway"}
                        onChange={() => setField("engine", "newskyway")}
                    />
                    New SkyWay (stub)
                </label>
            </Section>

            {/* 共通: Video & Canvas（全Engine共通） */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: 220, height: 140, background: "#000", borderRadius: 6 }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button onClick={enterCanvasFullscreen}>Canvas Full Screen</button>
                    <label style={{ fontSize: 12 }}>
                        <input
                            type="checkbox"
                            checked={runInference}
                            onChange={(e) => setRunInference(e.target.checked)}
                        />{" "}
                        Enable ONNX detection overlay
                    </label>
                    <small>Canvasは通常hidden。Full Screenボタンで表示。</small>
                </div>
            </div>
            <canvas ref={canvasRef} width={640} height={360} hidden />
            <div style={{ marginTop: 4, fontSize: 12, color: "#333" }}>
                Detections: {detectionInfo.detections.length} / Inference: {runInference ? "Running" : "Stopped"}
            </div>

            {/* Pure WebRTC専用設定 */}
            {card.engine === "pure" && (
                <>
                    <Section title="Pure WebRTC Connection">
                        <div style={{ marginTop: 6 }}>
                            Offer Peer ID:
                            <input
                                type="text"
                                value={card.offerPeerId}
                                onChange={(e) => setField("offerPeerId", e.target.value)}
                                style={{ width: 180, marginLeft: 6 }}
                            />
                        </div>
                        <div style={{ marginTop: 6 }}>
                            Target Vehicle Peer ID:
                            <input
                                type="text"
                                value={card.targetPeerId}
                                onChange={(e) => setField("targetPeerId", e.target.value)}
                                style={{ width: 180, marginLeft: 6 }}
                            />
                        </div>
                        <div style={{ marginTop: 6 }}>
                            Signaling WS URL:
                            <input
                                type="text"
                                value={card.signalingUrl}
                                onChange={(e) => setField("signalingUrl", e.target.value)}
                                style={{ width: 220, marginLeft: 6 }}
                            />
                            <button style={{ marginLeft: 6 }} onClick={handleConnect}>
                                Connect
                            </button>
                        </div>
                    </Section>

                    <h3>Network Status</h3>
                    <table>
                        <tbody>
                            <tr><th>Signaling: <span>{card.signalingStatus}</span></th></tr>
                            <tr><th>STUN: <span>{card.stunStatus}</span></th></tr>
                            <tr><th>TURN: <span>{card.turnStatus}</span></th></tr>
                        </tbody>
                    </table>
                    <div style={{ margin: "4px 0 10px 0" }}>
                        <input
                            type="checkbox"
                            id={`use-stun-${card.id}`}
                            checked={card.useStunTurn}
                            onChange={(e) => setField("useStunTurn", e.target.checked)}
                        />
                        <label htmlFor={`use-stun-${card.id}`}>Use STUN/TURN</label>
                    </div>

                    <Section title="GCC/Feedback Options">
                        <div>
                            <input type="checkbox" checked={card.disableTcc} onChange={(e) => setField("disableTcc", e.target.checked)} />
                            <label>Disable TCC</label>
                        </div>
                        <div>
                            <input type="checkbox" checked={card.disableTwccExtmap} onChange={(e) => setField("disableTwccExtmap", e.target.checked)} />
                            <label>Disable TWCC extmap</label>
                        </div>
                        <div>
                            <input type="checkbox" checked={card.disableRemb} onChange={(e) => setField("disableRemb", e.target.checked)} />
                            <label>Disable REMB</label>
                        </div>
                        <div>
                            <input type="checkbox" checked={card.disableNackPliFir} onChange={(e) => setField("disableNackPliFir", e.target.checked)} />
                            <label>Disable NACK/PLI/FIR</label>
                        </div>
                        <div>
                            <input type="checkbox" checked={card.disableRtcpRsize} onChange={(e) => setField("disableRtcpRsize", e.target.checked)} />
                            <label>Disable RTCP Reduced-Size</label>
                        </div>
                    </Section>

                    <Section title="Video Quality">
                        <div style={{ marginTop: 4 }}>
                            Codec:
                            <select
                                value={card.videoCodec}
                                onChange={(e) => setField("videoCodec", e.target.value as MonitorCardState["videoCodec"])}
                                style={{ marginLeft: 6 }}
                            >
                                <option value="AV1">AV1</option>
                                <option value="VP9">VP9</option>
                                <option value="H264">H264</option>
                                <option value="VP8">VP8</option>
                            </select>
                        </div>
                        <div style={{ marginTop: 4 }}>Height: <input type="number" value={card.videoHeight} onChange={(e) => setField("videoHeight", e.target.value)} style={{ width: 100 }} /></div>
                        <div style={{ marginTop: 4 }}>Width: <input type="number" value={card.videoWidth} onChange={(e) => setField("videoWidth", e.target.value)} style={{ width: 100 }} /></div>
                        <div style={{ marginTop: 4 }}>FrameRate: <input type="number" value={card.videoFramerate} onChange={(e) => setField("videoFramerate", e.target.value)} style={{ width: 100 }} /> Hz</div>
                        <div style={{ marginTop: 4 }}>Bitrate: <input type="number" value={card.videoBitrate} onChange={(e) => setField("videoBitrate", e.target.value)} style={{ width: 140 }} /> bps</div>
                        <button style={{ marginTop: 6 }} onClick={handleSendVideoQuality}>SetVideoQuality</button>
                    </Section>
                </>
            )}

            {/* 共通: Gamepad（Pure/OldSkyWay両方で有効） */}
            {(card.engine === "pure" || card.engine === "oldskyway") && (
                <Section title="Gamepad (monitor side)">
                    <div>Gamepads detected: {pads.length}</div>
                    {pads.slice(0, 2).map((p) => (
                        <div key={p.index} style={{ fontSize: 12, color: "#444" }}>#{p.index}: {p.id}</div>
                    ))}
                    <div style={{ marginTop: 4, fontSize: 12 }}>Ordered: {ordered[0]?.id || "-"} / {ordered[1]?.id || "-"}</div>
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                        <div>Steer: {control.inputSteer}</div>
                        <div>Gear: {control.inputGear}</div>
                        <div>Speed: {control.inputSpeed} km/h</div>
                        <div>Shuttle: {control.inputShuttle}</div>
                        <div>PTO Height: {control.inputPtoHeight}%</div>
                        <div>Remote Mode: {control.isRemoteCont ? "ON" : "OFF"}</div>
                        <div>Telemetry: {telemetryStatus} / {robotInfo.gnssSpeed ?? 0} km/h</div>
                    </div>
                </Section>
            )}

            {/* Old SkyWay */}
            {card.engine === "oldskyway" && (
                <Section title="Old SkyWay">
                    <div style={{ marginTop: 6 }}>
                        SkyWay API Key:
                        <input
                            type="text"
                            value={card.skywayApiKey}
                            onChange={(e) => setField("skywayApiKey", e.target.value)}
                            style={{ width: 280, marginLeft: 6 }}
                        />
                    </div>
                    <div style={{ marginTop: 6 }}>
                        Local Peer ID:
                        <input
                            type="text"
                            value={card.skywayLocalId}
                            onChange={(e) => setField("skywayLocalId", e.target.value)}
                            style={{ width: 220, marginLeft: 6 }}
                        />
                        <span style={{ marginLeft: 8 }}>My ID: {card.skywayMyId}</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                        Remote ID:
                        <input
                            type="text"
                            value={card.skywayRemoteId}
                            onChange={(e) => setField("skywayRemoteId", e.target.value)}
                            style={{ width: 280, marginLeft: 6 }}
                        />
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                        <button onClick={createSkywayPeer}>Create Peer</button>
                        <button onClick={connectSkywayRemote}>Connect Remote</button>
                        <button onClick={cleanupSkyway}>Disconnect</button>
                        <span style={{ fontSize: 12, color: "#444" }}>Status: {skywayStatus}</span>
                    </div>
                </Section>
            )}

            {/* New SkyWay */}
            {card.engine === "newskyway" && (
                <Section title="New SkyWay">
                    <p>工事中…</p>
                </Section>
            )}
        </div>
    );
};
