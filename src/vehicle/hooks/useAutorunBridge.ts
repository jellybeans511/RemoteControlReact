import React from "react";
import { defaultAutorunTelemetry } from "../state/defaults";
import { VehicleTopics } from "../state/vehicleTopics";

type AutorunBridgeDeps = {
  topics: VehicleTopics;
  url: string;
};

export const useAutorunBridge = ({ topics, url }: AutorunBridgeDeps) => {
  const socketRef = React.useRef<WebSocket | null>(null);

  const ensureSocket = React.useCallback(() => {
    const current = socketRef.current;
    if (
      current &&
      (current.readyState === WebSocket.OPEN || current.readyState === WebSocket.CONNECTING)
    ) {
      return current;
    }
    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;
      ws.onopen = () => {
        topics.statuses.update((prev) => ({ ...prev, autorun: "Connected" }));
        try {
          ws.send(JSON.stringify({ type: "remote-control" }));
        } catch {
          /* ignore */
        }
      };
      ws.onerror = () => topics.statuses.update((prev) => ({ ...prev, autorun: "Error" }));
      ws.onclose = () => topics.statuses.update((prev) => ({ ...prev, autorun: "Disconnected" }));
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg?.type === "autorun-output-data") {
            const payload = msg.payload?.outputAutorunInfo || msg.payload || msg;
            const merged = { ...defaultAutorunTelemetry, ...payload };
            topics.autorunTelemetry.set(merged);
          }
        } catch (e) {
          console.warn("Autorun message parse failed", e);
        }
      };
      return ws;
    } catch (e) {
      topics.statuses.update((prev) => ({ ...prev, autorun: "Error" }));
      console.error("Failed to open autorun socket", e);
      return null;
    }
  }, [topics.autorunTelemetry, topics.statuses, url]);

  React.useEffect(() => {
    const ws = ensureSocket();
    return () => {
      try {
        ws?.close();
      } catch {
        /* ignore */
      }
      socketRef.current = null;
    };
  }, [ensureSocket]);

  const forwardControl = React.useCallback(
    (payload: unknown) => {
      const ws = ensureSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(
            JSON.stringify({
              type: "inputAutorunInfo",
              payload: { inputInfo: payload },
            })
          );
        } catch (e) {
          console.warn("Send to autorun failed", e);
        }
      }
    },
    [ensureSocket]
  );

  return { forwardControl };
};
