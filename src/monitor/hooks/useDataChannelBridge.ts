import { useEffect, useRef, useState, useCallback } from "react";
import { createControlPublisher } from "../../lib/control/controlPublisher";
import { ControlInfo, DetectionInfo, RobotInfo } from "../../lib/types/telemetry";

type UseDataChannelBridgeProps = {
    dataChannel: RTCDataChannel | null;
    controlRef: React.MutableRefObject<ControlInfo>;
};

export const useDataChannelBridge = ({ dataChannel, controlRef }: UseDataChannelBridgeProps) => {
    const [robotInfo, setRobotInfo] = useState<RobotInfo>({
        gnssSpeed: 0,
        headingError: 0,
        lateralError: 0,
    });
    const [detectionInfo, setDetectionInfo] = useState<DetectionInfo>({
        isEnabled: false,
        detections: [],
    });
    const [telemetryStatus, setTelemetryStatus] = useState<string>("Idle");

    const controlPublisherRef = useRef<ReturnType<typeof createControlPublisher> | null>(null);

    // --- Control Publisher Initialization ---
    useEffect(() => {
        if (!controlPublisherRef.current) {
            controlPublisherRef.current = createControlPublisher(33);
        }
        // controlRefの参照先は常に最新のものを返すように設定
        controlPublisherRef.current.setControlSource(() => controlRef.current);
    }, [controlRef]);

    // --- Sender & Receiver Connection ---
    useEffect(() => {
        const publisher = controlPublisherRef.current;
        if (!publisher) return;

        if (!dataChannel) {
            publisher.stop();
            publisher.setSender(null);
            return;
        }

        const dc = dataChannel as any; // support customized data channel objects

        // Sender Setup
        const applySender = (channel: any) => {
            if (channel && channel.readyState === "open") {
                publisher.setSender((payload) => {
                    try {
                        channel.send(JSON.stringify(payload));
                    } catch (e) {
                        console.error("Send failed", e);
                    }
                });
                publisher.start();
            } else {
                publisher.setSender(null);
                publisher.stop();
            }
        };

        // Receiver Setup
        const handleMessage = (event: MessageEvent) => {
            let msg: any = event.data;
            try {
                msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
            } catch { /* ignore */ }

            if (msg?.type === "outputAutorunInfo") {
                const payload = msg.payload || msg;
                setRobotInfo({
                    gnssSpeed: Number(payload.gnssSpeed) || 0,
                    headingError: Number(payload.headingError) || 0,
                    lateralError: Number(payload.lateralError) || 0,
                });
                setTelemetryStatus("Receiving");
            } else if (msg?.type === "inferenceResults" || msg?.type === "offerInferenceResults") {
                const detections = msg.payload?.detections || msg.detections || [];
                if (detections.length > 0) {
                    setDetectionInfo({ isEnabled: true, detections });
                } else {
                    setDetectionInfo((prev) => ({ ...prev, detections: [] }));
                }
            }
        };

        // Initial setup
        applySender(dc);

        // Event Listeners
        const onOpen = () => applySender(dc);
        const onClose = () => applySender(null);

        // addEventListenerがある場合 (Standard WebRTC)
        if (typeof dc.addEventListener === "function") {
            dc.addEventListener("open", onOpen);
            dc.addEventListener("close", onClose);
            dc.addEventListener("message", handleMessage);
            return () => {
                dc.removeEventListener("open", onOpen);
                dc.removeEventListener("close", onClose);
                dc.removeEventListener("message", handleMessage);
                publisher.stop();
            };
        }
        // on*** プロパティの場合 (一部のレガシー実装など)
        else {
            // 注: 既存のon***を上書きするため注意が必要だが、今回は専有と仮定
            const prevOpen = dc.onopen;
            const prevClose = dc.onclose;
            const prevMessage = dc.onmessage;

            dc.onopen = (ev: any) => {
                onOpen();
                if (prevOpen) prevOpen(ev);
            }
            dc.onclose = (ev: any) => {
                onClose();
                if (prevClose) prevClose(ev);
            }
            dc.onmessage = (ev: any) => {
                handleMessage(ev);
                if (prevMessage) prevMessage(ev);
            }
            return () => {
                dc.onopen = prevOpen;
                dc.onclose = prevClose;
                dc.onmessage = prevMessage;
                publisher.stop();
            }
        }
    }, [dataChannel]);

    const sendVideoQuality = useCallback((quality: { width: number, height: number, framerate: number, bitrate: number }) => {
        if (!dataChannel || dataChannel.readyState !== "open") {
            console.warn("DataChannel not open");
            return;
        }
        try {
            dataChannel.send(JSON.stringify({ type: "videoQualityChange", ...quality }));
        } catch (e) {
            console.error("Failed to send video quality", e);
        }
    }, [dataChannel]);

    return {
        robotInfo,
        detectionInfo,
        setDetectionInfo, // Inferenceなどで外部からセットする場合に使用
        telemetryStatus,
        sendVideoQuality
    };
};
