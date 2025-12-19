import { useEffect, useRef, useState } from "react";
import { DetectionInfo, RobotInfo } from "../../lib/types/telemetry";

type TelemetryReceiverCallbacks = {
    onRobotInfo: (info: RobotInfo) => void;
    onDetectionInfo: (info: DetectionInfo) => void;
};

/**
 * DataChannelからテレメトリーを受信するhook
 * 
 * @param dataChannel - RTCDataChannel
 * @param callbacks - 受信時のコールバック
 * @returns status - テレメトリー受信状態
 */
export const useTelemetryReceiver = (
    dataChannel: RTCDataChannel | null,
    callbacks: TelemetryReceiverCallbacks
) => {
    const [status, setStatus] = useState<"idle" | "receiving">("idle");
    const callbacksRef = useRef(callbacks);

    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {
        const dc = dataChannel;
        if (!dc) {
            setStatus("idle");
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            let msg: unknown = event.data;
            try {
                msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
            } catch {
                /* ignore parse errors */
            }

            const data = msg as Record<string, unknown>;

            // ロボット情報（テレメトリー）
            if (data?.type === "outputAutorunInfo") {
                const payload = (data.payload as Record<string, unknown>) || data;
                const next: RobotInfo = {
                    gnssSpeed: Number(payload.gnssSpeed) || 0,
                    headingError: Number(payload.headingError) || 0,
                    lateralError: Number(payload.lateralError) || 0,
                };
                callbacksRef.current.onRobotInfo(next);
                setStatus("receiving");
            }

            // 推論結果（Vehicle側から）
            if (data?.type === "inferenceResults" || data?.type === "offerInferenceResults") {
                const payload = data.payload as Record<string, unknown> | undefined;
                const detections = (payload?.detections as DetectionInfo["detections"]) ||
                    (data.detections as DetectionInfo["detections"]) || [];
                callbacksRef.current.onDetectionInfo({ isEnabled: true, detections });
            }
        };

        if (typeof dc.addEventListener === "function") {
            dc.addEventListener("message", handleMessage);
            return () => dc.removeEventListener("message", handleMessage);
        }

        // fallback for non-standard RTCDataChannel
        const prev = dc.onmessage;
        dc.onmessage = (ev: MessageEvent) => {
            handleMessage(ev);
            if (typeof prev === "function") prev.call(dc, ev);
        };
        return () => {
            dc.onmessage = prev;
        };
    }, [dataChannel]);

    return { status };
};
