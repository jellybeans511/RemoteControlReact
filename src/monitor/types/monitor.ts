import { Engine } from "../../lib/webrtc/types";

/**
 * 1つのモニターカードの状態
 */
export type MonitorCardState = {
    id: string;
    engine: Engine;
    offerPeerId: string;
    targetPeerId: string;
    videoCodec: "AV1" | "VP9" | "H264" | "VP8";
    remoteVideoEnabled: boolean;
    signalingUrl: string;
    signalingStatus: string;
    stunStatus: string;
    turnStatus: string;
    useStunTurn: boolean;
    disableTcc: boolean;
    disableTwccExtmap: boolean;
    disableRemb: boolean;
    disableNackPliFir: boolean;
    disableRtcpRsize: boolean;
    videoHeight: string;
    videoWidth: string;
    videoFramerate: string;
    videoBitrate: string;
    skywayApiKey: string;
    skywayLocalId: string;
    skywayMyId: string;
    skywayRemoteId: string;
};

/**
 * デフォルト値
 */
export const DEFAULT_SIGNALING_URL = "ws://localhost:8080";
export const DEFAULT_SKYWAY_API_KEY = "e316eaa7-4c1c-468c-b23a-9ce51b074ab7";

/**
 * 新しいMonitorCardStateを作成
 */
export const createMonitorCardState = (): MonitorCardState => {
    const id =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `card-${Date.now().toString(16)}`;

    return {
        id,
        engine: "pure",
        offerPeerId: "offer-1",
        targetPeerId: "robot-1",
        videoCodec: "AV1",
        remoteVideoEnabled: true,
        signalingUrl: DEFAULT_SIGNALING_URL,
        signalingStatus: "Disconnected",
        stunStatus: "Waiting...",
        turnStatus: "Waiting...",
        useStunTurn: true,
        disableTcc: true,
        disableTwccExtmap: true,
        disableRemb: true,
        disableNackPliFir: false,
        disableRtcpRsize: false,
        videoHeight: "1280",
        videoWidth: "1920",
        videoFramerate: "30",
        videoBitrate: "1000000",
        skywayApiKey: DEFAULT_SKYWAY_API_KEY,
        skywayLocalId: "",
        skywayMyId: "(waiting)",
        skywayRemoteId: "",
    };
};
