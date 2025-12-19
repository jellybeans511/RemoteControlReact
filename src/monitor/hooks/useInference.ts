import { useEffect, useRef, useState } from "react";
import { DetectionInfo } from "../../lib/types/telemetry";
import { createInferenceEngine } from "../../lib/inference/inferenceEngine";

/**
 * ONNX推論を実行するhook
 * 
 * @param videoRef - 推論対象の映像要素
 * @param enabled - 推論を実行するかどうか
 * @param onDetections - 検出結果を受け取るコールバック
 * @returns isRunning - 推論が実行中かどうか
 */
export const useInference = (
    videoRef: React.RefObject<HTMLVideoElement>,
    enabled: boolean,
    onDetections: (detection: DetectionInfo) => void
) => {
    const [isRunning, setIsRunning] = useState(false);
    const onDetectionsRef = useRef(onDetections);

    // コールバック参照を最新に保つ
    useEffect(() => {
        onDetectionsRef.current = onDetections;
    }, [onDetections]);

    useEffect(() => {
        if (!enabled) {
            setIsRunning(false);
            onDetectionsRef.current({ isEnabled: false, detections: [] });
            return;
        }

        let cancelled = false;
        const engine = createInferenceEngine();

        (async () => {
            const ok = await engine.initialize();
            if (!ok || cancelled) return;

            setIsRunning(true);
            let lastTs = 0;

            const loop = async (ts: number) => {
                if (cancelled) return;

                const video = videoRef.current;
                if (!video) {
                    requestAnimationFrame(loop);
                    return;
                }

                // 約8fps (120ms間隔) で推論
                if (ts - lastTs < 120) {
                    requestAnimationFrame(loop);
                    return;
                }
                lastTs = ts;

                try {
                    const res = await engine.run(video);
                    if (res && !cancelled) {
                        onDetectionsRef.current({
                            isEnabled: true,
                            detections: res.detections,
                        });
                    }
                } catch (err) {
                    console.error("inference error", err);
                }

                requestAnimationFrame(loop);
            };

            requestAnimationFrame(loop);
        })();

        return () => {
            cancelled = true;
            setIsRunning(false);
            engine.dispose();
        };
    }, [enabled, videoRef]);

    return { isRunning };
};
