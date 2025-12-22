import { useCallback, useEffect, useRef, useState } from "react";
import { startOldSkywayOffer } from "../../lib/skyway/oldSkywayOffer";

type UseOldSkywayProps = {
    apiKey: string;
    localPeerId?: string;
    remotePeerId?: string;
    onStream?: (stream: MediaStream) => void;
};

export const useOldSkyway = ({
    apiKey,
    localPeerId,
    remotePeerId,
    onStream,
}: UseOldSkywayProps) => {
    const [status, setStatus] = useState<"idle" | "opening" | "connected" | "error">("idle");
    const [myId, setMyId] = useState<string>("");
    const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

    const connRef = useRef<{ close: () => void } | null>(null);

    const cleanup = useCallback(() => {
        connRef.current?.close();
        connRef.current = null;
        setDataChannel(null);
        setStatus("idle");
    }, []);

    // SkyWay SDKのチェック
    const checkSdk = () => {
        if (typeof (window as any).Peer === "undefined") {
            console.error("SkyWay old SDK (Peer) is not loaded");
            setStatus("error");
            return false;
        }
        return true;
    };

    const createPeer = useCallback(async () => {
        cleanup();
        if (!checkSdk()) return;
        if (!apiKey) {
            console.warn("SkyWay API Key required");
            setStatus("error");
            return;
        }

        setStatus("opening");
        try {
            const conn = await startOldSkywayOffer({
                apiKey,
                localPeerId: localPeerId || undefined,
                onOpen: (id) => setMyId(id),
                onStream: (stream) => onStream?.(stream),
            });
            connRef.current = conn;
            setDataChannel((conn as any).dataChannel as RTCDataChannel | null);
            setStatus("connected");
        } catch (e) {
            console.error("Old SkyWay peer create failed", e);
            setStatus("error");
        }
    }, [apiKey, localPeerId, onStream, cleanup]);

    const connectRemote = useCallback(async () => {
        cleanup();
        if (!checkSdk()) return;
        if (!apiKey || !remotePeerId) {
            console.warn("SkyWay API key or remote id missing");
            setStatus("error");
            return;
        }

        setStatus("opening");
        try {
            const conn = await startOldSkywayOffer({
                apiKey,
                localPeerId: localPeerId || undefined,
                remotePeerId,
                onOpen: (id) => setMyId(id),
                onStream: (stream) => onStream?.(stream),
            });
            connRef.current = conn;
            setDataChannel((conn as any).dataChannel as RTCDataChannel | null);
            setStatus("connected");
        } catch (e) {
            console.error("Old SkyWay connect failed", e);
            setStatus("error");
        }
    }, [apiKey, localPeerId, remotePeerId, onStream, cleanup]);

    // アンマウント時または再実行時にクリーンアップ
    useEffect(() => {
        return () => {
            connRef.current?.close();
        };
    }, []);

    return {
        status,
        myId,
        dataChannel,
        createPeer,
        connectRemote,
        cleanup,
    };
};
