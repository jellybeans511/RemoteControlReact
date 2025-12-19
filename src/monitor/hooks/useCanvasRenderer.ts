import { useEffect, useRef } from "react";
import { createCanvasRenderer } from "../../lib/canvas/canvasRenderer";
import { ControlInfo, DetectionInfo, RobotInfo } from "../../lib/types/telemetry";

type CanvasRendererOptions = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    getRobotInfo: () => RobotInfo;
    getControlInfo: () => ControlInfo;
    getDetectionInfo: () => DetectionInfo | undefined;
};

/**
 * Canvas描画を管理するhook
 * 
 * @returns show, hide - 表示/非表示を制御する関数
 */
export const useCanvasRenderer = ({
    canvasRef,
    videoRef,
    getRobotInfo,
    getControlInfo,
    getDetectionInfo,
}: CanvasRendererOptions) => {
    const rendererRef = useRef<ReturnType<typeof createCanvasRenderer> | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const renderer = createCanvasRenderer({
            canvas,
            video,
            getRobotInfo,
            getControlInfo,
            getDetectionInfo,
        });
        rendererRef.current = renderer;
        renderer.start();

        const onFullscreenChange = () => {
            if (!document.fullscreenElement) {
                renderer.hide();
            }
        };
        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", onFullscreenChange);
            renderer.stop();
        };
    }, [canvasRef, videoRef, getRobotInfo, getControlInfo, getDetectionInfo]);

    const show = () => rendererRef.current?.show();
    const hide = () => rendererRef.current?.hide();

    const enterFullscreen = () => {
        const canvas = canvasRef.current;
        if (canvas && canvas.requestFullscreen) {
            show();
            canvas.requestFullscreen();
        }
    };

    return { show, hide, enterFullscreen };
};
