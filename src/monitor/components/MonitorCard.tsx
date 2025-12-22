import React, { useEffect, useRef, useState } from "react";
import { useOfferConnection } from "../../lib/webrtc/useOfferConnection";
import { useGamepadControl } from "../../lib/gamepad/useGamepadControl";
import { ControlInfo } from "../../lib/types/telemetry";
import { createCanvasRenderer } from "../../lib/canvas/canvasRenderer";
import { MonitorCardState } from "../types/monitor";
import { Section } from "./Section";
import { useInference } from "../hooks/useInference";
import { useOldSkyway } from "../hooks/useOldSkyway";
import { useDataChannelBridge } from "../hooks/useDataChannelBridge";

export type MonitorCardProps = {
  card: MonitorCardState;
  onChange: (updater: (card: MonitorCardState) => MonitorCardState) => void;
  onRemove?: () => void;
  isTeleOpSelected: boolean;
  onSelectTeleOp: () => void;
};

/**
 * 単一のモニターカードコンポーネント
 * WebRTC接続、映像受信、ゲームパッド制御、推論を統合
 */
export const MonitorCard: React.FC<MonitorCardProps> = ({
  card,
  onChange,
  onRemove,
  isTeleOpSelected,
  onSelectTeleOp,
}) => {
  // --- State & Refs ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<ReturnType<typeof createCanvasRenderer> | null>(
    null
  );
  const [runInference, setRunInference] = useState(false);

  // --- Helpers ---
  const setField = <K extends keyof MonitorCardState>(
    key: K,
    value: MonitorCardState[K]
  ) => onChange((prev) => ({ ...prev, [key]: value }));

  // --- Gamepad Control ---
  const { control, pads, ordered } = useGamepadControl();

  // Calculate effective control based on selection
  const effectiveControl = isTeleOpSelected
    ? control
    : {
      isRemoteCont: false,
      inputSteer: 0,
      inputEngineCycle: 0,
      inputShuttle: 0,
      inputPtoOn: 0,
      inputHorn: 0,
      inputGear: 0,
      inputPtoHeight: 0,
      inputSpeed: 0,
    };

  // 最新の制御情報をRefで保持（Bridgeに渡すため）
  const controlRef = useRef<ControlInfo>(effectiveControl);
  useEffect(() => {
    controlRef.current = effectiveControl;
  }, [effectiveControl]);

  // --- WebRTC Engines ---

  // 1. Pure WebRTC
  const { connection: pureConnection, dataChannel: pureDataChannel } =
    useOfferConnection({
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
      // onDataChannel is handled by extracting pureDataChannel
    });

  // 2. Old SkyWay
  const {
    status: skywayStatus,
    myId: skywayMyId,
    dataChannel: skywayDataChannel,
    createPeer: createSkywayPeer,
    connectRemote: connectSkywayRemote,
    cleanup: cleanupSkyway,
  } = useOldSkyway({
    apiKey: card.skywayApiKey,
    localPeerId: card.skywayLocalId,
    remotePeerId: card.skywayRemoteId,
    onStream: (stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    },
  });

  // Update ID in card state when SkyWay ID changes
  useEffect(() => {
    if (skywayMyId) setField("skywayMyId", skywayMyId);
  }, [skywayMyId]);

  // Engine Switching Logic
  useEffect(() => {
    if (card.engine !== "oldskyway") cleanupSkyway();
    return () => cleanupSkyway();
  }, [card.engine, cleanupSkyway]);

  // --- DataChannel Bridge (Telemetry & Control) ---
  // アクティブなエンジンのDataChannelを選択
  const activeDataChannel =
    card.engine === "pure"
      ? pureDataChannel
      : card.engine === "oldskyway"
        ? skywayDataChannel
        : null;

  const {
    robotInfo,
    detectionInfo,
    setDetectionInfo,
    telemetryStatus,
    sendVideoQuality,
  } = useDataChannelBridge({
    dataChannel: activeDataChannel,
    controlRef,
  });

  // --- Canvas Renderer Deps ---
  const robotInfoRef = useRef(robotInfo);
  useEffect(() => {
    robotInfoRef.current = robotInfo;
  }, [robotInfo]);

  const detectionRef = useRef(detectionInfo);
  useEffect(() => {
    detectionRef.current = detectionInfo;
  }, [detectionInfo]);

  // --- Inference Hook ---
  useInference(videoRef, runInference, setDetectionInfo);

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
  const handleConnectPure = () => {
    pureConnection.start().catch((e) => {
      console.error(e);
      setField("signalingStatus", "Error");
    });
  };

  const handleSendVideoQuality = () => {
    sendVideoQuality({
      width: Number(card.videoWidth),
      height: Number(card.videoHeight),
      frameRate: Number(card.videoFramerate),
      bitrate: Number(card.videoBitrate),
    });
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
    <div
      style={{
        border: "1px solid #ccc",
        padding: 12,
        marginTop: 12,
        borderRadius: 8,
      }}
    >
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

      <div style={{ marginTop: 8 }}>
        <label
          style={{
            fontWeight: "bold",
            padding: "4px 8px",
            background: isTeleOpSelected ? "#e6fffa" : "#fff",
            border: isTeleOpSelected ? "1px solid #38b2ac" : "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          <input
            type="radio"
            checked={isTeleOpSelected}
            onChange={onSelectTeleOp}
            style={{ marginRight: 6 }}
          />
          Use Tele-Operation (Gamepad)
        </label>
      </div>

      {/* 共通: Video & Canvas（全Engine共通） */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: 220,
            height: 140,
            background: "#000",
            borderRadius: 6,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button onClick={enterCanvasFullscreen}>Canvas Full Screen</button>
          <button
            onClick={() => {
              if (!videoRef.current?.srcObject) return;
              const popup = window.open(
                "",
                `popup-${card.id}`,
                "width=800,height=600,menubar=no,toolbar=no,location=no,status=no"
              );
              if (!popup) return;

              // ポップアップウィンドウの準備
              const doc = popup.document;
              doc.title = `Video - ${card.id}`;
              doc.body.style.margin = "0";
              doc.body.style.background = "#000";
              doc.body.style.overflow = "hidden";

              // Video要素の作成
              const video = doc.createElement("video");
              video.autoplay = true;
              video.playsInline = true;
              video.muted = true; // 自動再生ポリシーのためミュート推奨だが、要件によっては音声ON
              video.style.width = "100%";
              video.style.height = "100%";
              video.style.objectFit = "contain";

              // ストリームの共有
              video.srcObject = videoRef.current.srcObject;
              doc.body.appendChild(video);

              // 閉じた時の処理（必要なら）
              popup.onbeforeunload = () => {
                // クリーンアップがあれば
              };
            }}
          >
            Pop out Video ⇱
          </button>
          <label style={{ fontSize: 12 }}>
            <input
              type="checkbox"
              checked={runInference}
              onChange={(e) => setRunInference(e.target.checked)}
            />{" "}
            Enable ONNX detection overlay
          </label>
        </div>
      </div>
      <canvas ref={canvasRef} width={640} height={360} hidden />
      <div style={{ marginTop: 4, fontSize: 12, color: "#333" }}>
        Detections: {detectionInfo.detections.length} / Inference:{" "}
        {runInference ? "Running" : "Stopped"}
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
              <button style={{ marginLeft: 6 }} onClick={handleConnectPure}>
                Connect
              </button>
            </div>
          </Section>

          <h3>Network Status</h3>
          <table>
            <tbody>
              <tr>
                <th>
                  Signaling: <span>{card.signalingStatus}</span>
                </th>
              </tr>
              <tr>
                <th>
                  STUN: <span>{card.stunStatus}</span>
                </th>
              </tr>
              <tr>
                <th>
                  TURN: <span>{card.turnStatus}</span>
                </th>
              </tr>
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
              <input
                type="checkbox"
                checked={card.disableTcc}
                onChange={(e) => setField("disableTcc", e.target.checked)}
              />
              <label>Disable TCC</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={card.disableTwccExtmap}
                onChange={(e) =>
                  setField("disableTwccExtmap", e.target.checked)
                }
              />
              <label>Disable TWCC extmap</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={card.disableRemb}
                onChange={(e) => setField("disableRemb", e.target.checked)}
              />
              <label>Disable REMB</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={card.disableNackPliFir}
                onChange={(e) =>
                  setField("disableNackPliFir", e.target.checked)
                }
              />
              <label>Disable NACK/PLI/FIR</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={card.disableRtcpRsize}
                onChange={(e) => setField("disableRtcpRsize", e.target.checked)}
              />
              <label>Disable RTCP Reduced-Size</label>
            </div>
          </Section>
        </>
      )}

      {/* 共通: Video Quality (Pure/OldSkyWay共通) */}
      <Section title="Video Quality">
        <div style={{ marginTop: 4 }}>
          Codec:
          <select
            value={card.videoCodec}
            onChange={(e) =>
              setField(
                "videoCodec",
                e.target.value as MonitorCardState["videoCodec"]
              )
            }
            style={{ marginLeft: 6 }}
          >
            <option value="AV1">AV1</option>
            <option value="VP9">VP9</option>
            <option value="H264">H264</option>
            <option value="VP8">VP8</option>
          </select>
        </div>
        <div style={{ marginTop: 4 }}>
          Height:{" "}
          <input
            type="number"
            value={card.videoHeight}
            onChange={(e) => setField("videoHeight", e.target.value)}
            style={{ width: 100 }}
          />
        </div>
        <div style={{ marginTop: 4 }}>
          Width:{" "}
          <input
            type="number"
            value={card.videoWidth}
            onChange={(e) => setField("videoWidth", e.target.value)}
            style={{ width: 100 }}
          />
        </div>
        <div style={{ marginTop: 4 }}>
          FrameRate:{" "}
          <input
            type="number"
            value={card.videoFramerate}
            onChange={(e) => setField("videoFramerate", e.target.value)}
            style={{ width: 100 }}
          />{" "}
          Hz
        </div>
        <div style={{ marginTop: 4 }}>
          Bitrate:{" "}
          <input
            type="number"
            value={card.videoBitrate}
            onChange={(e) => setField("videoBitrate", e.target.value)}
            style={{ width: 140 }}
          />{" "}
          bps
        </div>
        <button style={{ marginTop: 6 }} onClick={handleSendVideoQuality}>
          SetVideoQuality
        </button>
      </Section>

      {/* 共通: Gamepad（Pure/OldSkyWay両方で有効） */}
      {(card.engine === "pure" || card.engine === "oldskyway") && (
        <Section title="Gamepad (monitor side)">
          <div>Gamepads detected: {pads.length}</div>
          {pads.slice(0, 2).map((p) => (
            <div key={p.index} style={{ fontSize: 12, color: "#444" }}>
              #{p.index}: {p.id}
            </div>
          ))}
          <div style={{ marginTop: 4, fontSize: 12 }}>
            Ordered: {ordered[0]?.id || "-"} / {ordered[1]?.id || "-"}
          </div>
          <div style={{ marginTop: 6, fontSize: 12 }}>
            <div>Steer: {control.inputSteer}</div>
            <div>Gear: {control.inputGear}</div>
            <div>Speed: {control.inputSpeed} km/h</div>
            <div>Shuttle: {control.inputShuttle}</div>
            <div>PTO Height: {control.inputPtoHeight}%</div>
            <div>Remote Mode: {control.isRemoteCont ? "ON" : "OFF"}</div>
            <div>
              Telemetry: {telemetryStatus} / {robotInfo.gnssSpeed ?? 0} km/h
            </div>
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
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <button onClick={createSkywayPeer}>Create Peer</button>
            <button onClick={connectSkywayRemote}>Connect Remote</button>
            <button onClick={cleanupSkyway}>Disconnect</button>
            <span style={{ fontSize: 12, color: "#444" }}>
              Status: {skywayStatus}
            </span>
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
