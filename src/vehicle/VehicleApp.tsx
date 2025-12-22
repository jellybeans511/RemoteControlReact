import React from "react";
import { useAnswerConnection } from "../lib/webrtc/useAnswerConnection";
import {
  createOldSkywayAnswer,
  OldSkywayAnswerConnection,
  RTCDataChannelLike as OldSkywayDataChannel,
} from "../lib/skyway/oldSkywayAnswer";
import { useTopicValue } from "../lib/store/useTopicValue";
import {
  FeedbackConfig,
  VehicleConfig,
  VehicleEngine,
  VideoProfile,
} from "../lib/types/vehicle";
import { useAutorunBridge } from "./hooks/useAutorunBridge";
import { useCameraController } from "./hooks/useCameraController";
import { useControlChannelBridge } from "./hooks/useControlChannelBridge";
import { AUTORUN_WS_URL, defaultVideoProfile } from "./state/defaults";
import { createVehicleTopics, VehicleTopics } from "./state/vehicleTopics";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <fieldset style={{ marginTop: 8, padding: 8, width: "max-content" }}>
    <legend>{title}</legend>
    {children}
  </fieldset>
);

export const VehicleApp: React.FC = () => {
  const topicsRef = React.useRef<VehicleTopics>();
  if (!topicsRef.current) {
    topicsRef.current = createVehicleTopics();
  }
  const topics = topicsRef.current;

  const config = useTopicValue(topics.config);
  const videoProfile = useTopicValue(topics.videoProfile);
  const feedback = useTopicValue(topics.feedback);
  const statuses = useTopicValue(topics.statuses);
  const devices = useTopicValue(topics.devices);
  const capabilities = useTopicValue(topics.capabilities);
  const stream = useTopicValue(topics.stream);
  const autorunTelemetry = useTopicValue(topics.autorunTelemetry);
  const controlChannel = useTopicValue(topics.controlChannel);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const skywayConnRef = React.useRef<OldSkywayAnswerConnection | null>(null);

  const setConfig = React.useCallback(
    <K extends keyof VehicleConfig>(key: K, value: VehicleConfig[K]) => {
      topics.config.update((prev) => ({ ...prev, [key]: value }));
    },
    [topics.config]
  );

  const patchVideoProfile = React.useCallback(
    (patch: Partial<VideoProfile>) => {
      topics.videoProfile.update((prev) => ({ ...prev, ...patch }));
    },
    [topics.videoProfile]
  );

  const setFeedback = React.useCallback(
    <K extends keyof FeedbackConfig>(key: K, value: FeedbackConfig[K]) => {
      topics.feedback.update((prev) => ({ ...prev, [key]: value }));
    },
    [topics.feedback]
  );

  const camera = useCameraController({ topics });
  const { forwardControl } = useAutorunBridge({ topics, url: AUTORUN_WS_URL });
  const { attachControlChannel } = useControlChannelBridge({
    topics,
    forwardControl,
    applyVideoQuality: async (req) => {
      const normalized = normalizeVideoProfile(req);
      topics.videoProfile.update((prev) => ({ ...prev, ...normalized }));
      await camera.applyOutboundConstraints(normalized);
    },
  });

  // attachControlChannelをrefで保持して依存配列を安定化
  const attachControlChannelRef = React.useRef(attachControlChannel);
  React.useEffect(() => {
    attachControlChannelRef.current = attachControlChannel;
  }, [attachControlChannel]);

  const { connection: pureConnection } = useAnswerConnection({
    signalingUrl: config.signalingUrl,
    answerPeerId: config.answerPeerId || "robot-1",
    useIceServers: config.useStunTurn,
    mediaStream: stream,
    onSignalingState: (s) =>
      topics.statuses.update((prev) => ({ ...prev, signaling: s })),
    onIceState: (s) => topics.statuses.update((prev) => ({ ...prev, stun: s })),
    onDataChannel: attachControlChannel,
  });

  const connectPure = React.useCallback(async () => {
    if (config.engine !== "pure") return;
    // 自動キャプチャ削除: 明示的にCaptureボタンを押させる
    pureConnection.start().catch((e) => {
      console.error(e);
      topics.statuses.update((prev) => ({ ...prev, signaling: "Error" }));
    });
  }, [config.engine, pureConnection, topics.statuses]);

  React.useEffect(() => {
    if (config.engine !== "pure") {
      pureConnection.close();
    }
  }, [config.engine, pureConnection]);

  React.useEffect(() => {
    if (stream && config.engine === "pure") {
      pureConnection.replaceStream(stream);
    }
  }, [config.engine, pureConnection, stream]);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Device変更時にrecapture（ストリームが既にある場合のみ）
  const prevDeviceIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const currentDeviceId = videoProfile.deviceId;
    // デバイスIDが変わった かつ ストリームが既に存在する場合のみrecapture
    if (
      prevDeviceIdRef.current !== null &&
      prevDeviceIdRef.current !== currentDeviceId &&
      topics.stream.get()
    ) {
      void camera.capture();
    }
    prevDeviceIdRef.current = currentDeviceId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoProfile.deviceId]);

  React.useEffect(() => {
    if (devices.length > 0 && (!videoProfile.deviceId || videoProfile.deviceId === "default")) {
      patchVideoProfile({ deviceId: devices[0].deviceId });
    }
  }, [devices, patchVideoProfile, videoProfile.deviceId]);

  React.useEffect(() => {
    if (config.engine !== "oldskyway") {
      skywayConnRef.current?.close();
      skywayConnRef.current = null;
      return;
    }

    // SkyWay SDKがロードされているか確認
    if (typeof (window as any).Peer === "undefined") {
      console.error("SkyWay old SDK (Peer) is not loaded on this page");
      return;
    }

    try {
      const conn = createOldSkywayAnswer({
        apiKey: config.skywayApiKey,
        localPeerId: config.skywayLocalId || undefined,
        onOpen: (id) => setConfig("skywayMyId", id),
      });
      skywayConnRef.current = conn;
      attachControlChannelRef.current(
        (conn as any).dataChannel as RTCDataChannel | OldSkywayDataChannel | null
      );
      // 既にstreamがあればセット
      const currentStream = topics.stream.get();
      if (currentStream) conn.setLocalStream(currentStream);
    } catch (e) {
      console.error("OldSkyWay answer init failed", e);
      return; // エラー時はここでreturn
    }

    return () => {
      skywayConnRef.current?.close();
      skywayConnRef.current = null;
    };
  }, [
    // attachControlChannelはrefで安定化済み
    config.engine,
    config.skywayApiKey,
    config.skywayLocalId,
    setConfig,
    topics.stream,
  ]);

  React.useEffect(() => {
    if (config.engine !== "oldskyway") return;
    const conn = skywayConnRef.current;
    if (conn && stream) conn.setLocalStream(stream);
  }, [config.engine, stream]);

  React.useEffect(() => {
    if (config.engine === "newskyway") {
      attachControlChannel(null);
    }
  }, [attachControlChannel, config.engine]);

  const summaryEngine: VehicleEngine = config.engine;

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>Vehicle (Answer) UI</h1>
      <p>
        Choose engine, capture camera, then connect. Signaling defaults to ws://localhost:8080.
      </p>

      <Section title="WebRTC Engine">
        <label>
          <input
            type="radio"
            name="engine"
            value="pure"
            checked={config.engine === "pure"}
            onChange={() => setConfig("engine", "pure")}
          />
          Pure WebRTC
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            name="engine"
            value="oldskyway"
            checked={config.engine === "oldskyway"}
            onChange={() => setConfig("engine", "oldskyway")}
          />
          Old SkyWay
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            name="engine"
            value="newskyway"
            checked={config.engine === "newskyway"}
            onChange={() => setConfig("engine", "newskyway")}
          />
          New SkyWay (stub)
        </label>
      </Section>

      <Section title="Camera">
        <div style={{ marginTop: 4 }}>
          Select Device:
          <select
            value={videoProfile.deviceId}
            onChange={(e) => patchVideoProfile({ deviceId: e.target.value })}
            style={{ marginLeft: 8 }}
          >
            <option value="default">Default Camera</option>
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || d.deviceId}
              </option>
            ))}
          </select>
          <button style={{ marginLeft: 8 }} onClick={() => void camera.capture()}>
            Get Capture
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
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
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: "#333" }}>
          Max Resolution / FPS:&nbsp;
          {capabilities.widthMax && capabilities.heightMax
            ? `${capabilities.widthMax}x${capabilities.heightMax}`
            : "N/A"}
          {" | "}
          {capabilities.frameRateMax ?? "N/A"} fps
        </div>
      </Section>

      {config.engine === "pure" && (
        <>
          <Section title="Pure WebRTC Connection">
            <div style={{ marginTop: 6 }}>
              Vehicle Peer ID:
              <input
                type="text"
                value={config.answerPeerId}
                onChange={(e) => setConfig("answerPeerId", e.target.value)}
                style={{ width: 180, marginLeft: 6 }}
                placeholder="tractor-01"
              />
            </div>
            <div style={{ marginTop: 6 }}>
              Signaling WS URL:
              <input
                type="text"
                value={config.signalingUrl}
                onChange={(e) => setConfig("signalingUrl", e.target.value)}
                style={{ width: 220, marginLeft: 6 }}
              />
              <button style={{ marginLeft: 6 }} onClick={() => void connectPure()}>
                Connect
              </button>
              <button style={{ marginLeft: 6 }} onClick={() => void camera.capture()}>
                Get Capture
              </button>
            </div>
          </Section>

          <h3>Network Status</h3>
          <table>
            <tbody>
              <tr>
                <th>
                  Signaling: <span>{statuses.signaling}</span>
                </th>
              </tr>
              <tr>
                <th>
                  STUN: <span>{statuses.stun}</span>
                </th>
              </tr>
              <tr>
                <th>
                  TURN: <span>{statuses.turn}</span>
                </th>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 4, fontSize: 12, color: "#333" }}>
            DataChannel: {controlChannel.state} / Autorun WS: {statuses.autorun}
          </div>
          <div style={{ marginTop: 2, fontSize: 12, color: "#333" }}>
            Telemetry: {autorunTelemetry.gnssSpeed ?? 0} km/h / HeadingErr{" "}
            {autorunTelemetry.headingError ?? 0}
          </div>
          <div style={{ margin: "4px 0 10px 0" }}>
            <input
              type="checkbox"
              id="use-stun-turn"
              checked={config.useStunTurn}
              onChange={(e) => setConfig("useStunTurn", e.target.checked)}
            />
            <label htmlFor="use-stun-turn">
              Use STUN/TURN (unchecked = host only)
            </label>
          </div>

          <Section title="Feedback Options">
            <div>
              <input
                type="checkbox"
                id="disable-tcc"
                checked={feedback.disableTcc}
                onChange={(e) => setFeedback("disableTcc", e.target.checked)}
              />
              <label htmlFor="disable-tcc">Disable transport-cc feedback</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="disable-twcc-extmap"
                checked={feedback.disableTwccExtmap}
                onChange={(e) => setFeedback("disableTwccExtmap", e.target.checked)}
              />
              <label htmlFor="disable-twcc-extmap">Disable TWCC extmap</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="disable-remb"
                checked={feedback.disableRemb}
                onChange={(e) => setFeedback("disableRemb", e.target.checked)}
              />
              <label htmlFor="disable-remb">Disable REMB feedback</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="disable-nack-pli-fir"
                checked={feedback.disableNackPliFir}
                onChange={(e) => setFeedback("disableNackPliFir", e.target.checked)}
              />
              <label htmlFor="disable-nack-pli-fir">Disable NACK / PLI / FIR</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="disable-rtcp-rsize"
                checked={feedback.disableRtcpRsize}
                onChange={(e) => setFeedback("disableRtcpRsize", e.target.checked)}
              />
              <label htmlFor="disable-rtcp-rsize">Disable reduced-size RTCP</label>
            </div>
          </Section>

          <Section title="Video Quality">
            <div style={{ marginTop: 4 }}>
              Height:
              <input
                type="number"
                value={videoProfile.height ?? ""}
                onChange={(e) => patchVideoProfile({ height: parseNumberInput(e.target.value) })}
                style={{ width: 100, marginLeft: 6 }}
              />
            </div>
            <div style={{ marginTop: 4 }}>
              Width:
              <input
                type="number"
                value={videoProfile.width ?? ""}
                onChange={(e) => patchVideoProfile({ width: parseNumberInput(e.target.value) })}
                style={{ width: 100, marginLeft: 6 }}
              />
            </div>
            <div style={{ marginTop: 4 }}>
              FrameRate:
              <input
                type="number"
                value={videoProfile.frameRate ?? ""}
                onChange={(e) => patchVideoProfile({ frameRate: parseNumberInput(e.target.value) })}
                style={{ width: 100, marginLeft: 6 }}
              />{" "}
              Hz
            </div>
            <div style={{ marginTop: 4 }}>
              Bitrate:
              <input
                type="number"
                value={videoProfile.bitrate ?? ""}
                onChange={(e) => patchVideoProfile({ bitrate: parseNumberInput(e.target.value) })}
                style={{ width: 140, marginLeft: 6 }}
              />{" "}
              bps
            </div>
            <button
              style={{ marginTop: 6 }}
              onClick={() => void camera.applyOutboundConstraints(videoProfile)}
            >
              Set Video Quality
            </button>
            <button
              style={{ marginTop: 6, marginLeft: 8 }}
              onClick={() => patchVideoProfile(defaultVideoProfile)}
            >
              Reset
            </button>
          </Section>
        </>
      )}

      {config.engine === "oldskyway" && (
        <Section title="Old SkyWay">
          <div style={{ marginTop: 6 }}>
            SkyWay API Key:
            <input
              type="text"
              value={config.skywayApiKey}
              onChange={(e) => setConfig("skywayApiKey", e.target.value)}
              style={{ width: 280, marginLeft: 6 }}
              placeholder="Enter SkyWay API Key"
            />
          </div>
          <div style={{ marginTop: 6 }}>
            Local Peer ID (optional):
            <input
              type="text"
              value={config.skywayLocalId}
              onChange={(e) => setConfig("skywayLocalId", e.target.value)}
              style={{ width: 220, marginLeft: 6 }}
              placeholder="auto or specify fixed id"
            />
            <span style={{ marginLeft: 8 }}>
              My ID: <span>{config.skywayMyId}</span>
            </span>
          </div>
          <small>SkyWay old SDK must be loaded separately in the page.</small>
        </Section>
      )}

      {config.engine === "newskyway" && (
        <Section title="New SkyWay">
          <p>Stub. Wire a driver that matches the createX + deps pattern.</p>
        </Section>
      )}

      <div style={{ marginTop: 12, color: "#444" }}>
        <strong>Current engine</strong> {summaryEngine}
      </div>
    </div>
  );
};

const parseNumberInput = (value: string) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeVideoProfile = (req: Partial<VideoProfile>): Partial<VideoProfile> => {
  const next: Partial<VideoProfile> = {
    width: normalizeNumber(req.width),
    height: normalizeNumber(req.height),
    frameRate: normalizeNumber(req.frameRate),
    bitrate: normalizeNumber(req.bitrate),
  };
  if (typeof req.deviceId === "string") {
    next.deviceId = req.deviceId;
  }
  return next;
};

const normalizeNumber = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;
