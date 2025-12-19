import React from "react";
import {
  ControlChannelState,
  ControlMessage,
  VideoProfile,
  VideoQualityChange,
} from "../../lib/types/vehicle";
import { RTCDataChannelLike } from "../../lib/skyway/oldSkywayAnswer";
import { defaultAutorunTelemetry } from "../state/defaults";
import { VehicleTopics } from "../state/vehicleTopics";

type ControlChannelBridgeDeps = {
  topics: VehicleTopics;
  forwardControl: (payload: unknown) => void;
  applyVideoQuality: (req: Partial<VideoProfile>) => Promise<void> | void;
};

export const useControlChannelBridge = ({
  topics,
  forwardControl,
  applyVideoQuality,
}: ControlChannelBridgeDeps) => {
  const telemetryRef = React.useRef(defaultAutorunTelemetry);
  const cleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(
    () =>
      topics.autorunTelemetry.subscribe((value) => {
        telemetryRef.current = value;
      }),
    [topics.autorunTelemetry]
  );

  const setStatus = React.useCallback(
    (state: ControlChannelState) => {
      topics.statuses.update((prev) => ({ ...prev, control: state }));
      topics.controlChannel.update((prev) => ({ ...prev, state }));
    },
    [topics.controlChannel, topics.statuses]
  );

  const handleMessage = React.useCallback(
    async (msg: ControlMessage) => {
      if (msg?.type === "inputAutorunInfo") {
        forwardControl(msg);
        return;
      }
      if (msg?.type === "videoQualityChange") {
        const desired: Partial<VideoProfile> = {
          width: normalizeNumber((msg as VideoQualityChange).width),
          height: normalizeNumber((msg as VideoQualityChange).height),
          frameRate: normalizeNumber((msg as VideoQualityChange).framerate),
          bitrate: normalizeNumber((msg as VideoQualityChange).bitrate),
        };
        topics.videoProfile.update((prev) => ({
          ...prev,
          ...desired,
        }));
        await applyVideoQuality(desired);
        return;
      }
      if (msg?.type === "offerInferenceResults") {
        console.log("Received inference results from monitor:", (msg as any).payload);
      }
    },
    [applyVideoQuality, forwardControl, topics.videoProfile]
  );

  const attachControlChannel = React.useCallback(
    (channel: RTCDataChannel | RTCDataChannelLike | null) => {
      cleanupRef.current?.();
      if (!channel) {
        topics.controlChannel.set({ channel: null, state: "closed" });
        setStatus("closed");
        return;
      }

      topics.controlChannel.set({ channel, state: channel.readyState || "connecting" });
      setStatus((channel as any).readyState ?? "connecting");

      const onOpen = () => setStatus("open");
      const onClose = () => {
        setStatus("closed");
        const current = topics.controlChannel.get();
        if (current.channel === channel) {
          topics.controlChannel.set({ channel: null, state: "closed" });
        }
      };
      const onMessage = (ev: MessageEvent | { data: unknown }) => {
        const raw = (ev as any)?.data;
        let msg: ControlMessage = raw as ControlMessage;
        try {
          msg = typeof raw === "string" ? JSON.parse(raw) : (raw as ControlMessage);
        } catch {
          /* ignore parse errors */
        }
        void handleMessage(msg);
      };

      let timer: number | null = null;
      timer = window.setInterval(() => {
        if ((channel as any).readyState !== "open") return;
        const payload = { ...defaultAutorunTelemetry, ...telemetryRef.current };
        try {
          (channel as any).send(JSON.stringify({ type: "outputAutorunInfo", payload }));
        } catch (e) {
          console.warn("Send telemetry failed", e);
        }
      }, 33);

      if (typeof (channel as any).addEventListener === "function") {
        (channel as any).addEventListener("open", onOpen);
        (channel as any).addEventListener("close", onClose);
        (channel as any).addEventListener("message", onMessage);
        cleanupRef.current = () => {
          if (timer) window.clearInterval(timer);
          (channel as any).removeEventListener("open", onOpen);
          (channel as any).removeEventListener("close", onClose);
          (channel as any).removeEventListener("message", onMessage);
        };
        return;
      }

      const prevOnMessage = (channel as any).onmessage;
      const prevOnOpen = (channel as any).onopen;
      const prevOnClose = (channel as any).onclose;
      (channel as any).onmessage = (ev: MessageEvent) => {
        onMessage(ev);
        if (typeof prevOnMessage === "function") prevOnMessage(ev);
      };
      (channel as any).onopen = () => {
        onOpen();
        if (typeof prevOnOpen === "function") prevOnOpen();
      };
      (channel as any).onclose = () => {
        onClose();
        if (typeof prevOnClose === "function") prevOnClose();
      };

      cleanupRef.current = () => {
        if (timer) window.clearInterval(timer);
        (channel as any).onmessage = prevOnMessage;
        (channel as any).onopen = prevOnOpen;
        (channel as any).onclose = prevOnClose;
      };
    },
    [handleMessage, setStatus, topics.controlChannel]
  );

  React.useEffect(() => () => cleanupRef.current?.(), []);

  return { attachControlChannel };
};

const normalizeNumber = (value?: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;
