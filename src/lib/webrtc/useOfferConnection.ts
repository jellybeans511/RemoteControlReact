import { useCallback, useEffect, useRef, useState } from "react";
import {
  OfferConnection,
  OfferConnectionOptions,
  SignalData,
  SignalEnvelope,
  SignalingMessage,
} from "./types";

const ICE_SERVERS = [{ urls: "stun:10.100.0.35:3478" }];

export const useOfferConnection = (opts: OfferConnectionOptions) => {
  const {
    signalingUrl,
    offerPeerId,
    targetPeerId,
    useIceServers,
    videoCodec,
    onRemoteStream,
    onSignalingState,
    onIceState,
    onDataChannel,
  } = opts;

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pendingRemoteIceRef = useRef<RTCIceCandidateInit[]>([]);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const logState = (msg: string) => {
    setStatus((prev) => prev); // no-op to trigger subscribers if needed
    if (onSignalingState) onSignalingState(msg);
  };

  const close = useCallback(() => {
    try {
      pcRef.current?.getSenders().forEach((s) => s.track && s.track.stop());
      pcRef.current?.close();
    } catch (_) {}
    pcRef.current = null;
    try {
      wsRef.current?.close();
    } catch (_) {}
    wsRef.current = null;
    setStatus("idle");
  }, []);

  const handleSignal = useCallback(async (data: SignalData) => {
    const pc = pcRef.current;
    if (!pc) return;
    if (data?.kind === "answer" && data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
      while (pendingRemoteIceRef.current.length > 0) {
        const cand = pendingRemoteIceRef.current.shift();
        if (cand) {
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        }
      }
    } else if (data?.kind === "ice" && data.candidate) {
      if (!pc.remoteDescription) {
        pendingRemoteIceRef.current.push(data.candidate);
      } else {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    }
  }, []);

  const start = useCallback(async () => {
    close();
    if (!offerPeerId || !targetPeerId) {
      setStatus("error");
      throw new Error("offerPeerId and targetPeerId are required");
    }
    const ws = new WebSocket(signalingUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      setStatus("connecting");
      const register: SignalingMessage = {
        type: "register",
        payload: { role: "offer", peerId: offerPeerId },
      };
      ws.send(JSON.stringify(register));
    };
    ws.onerror = () => {
      setStatus("error");
      onSignalingState?.("Error");
    };
    ws.onclose = () => {
      onSignalingState?.("Disconnected");
    };
    ws.onmessage = async (event) => {
      const msg: SignalingMessage = JSON.parse(event.data);
      if (msg.type === "signal" && msg.data) {
        await handleSignal(msg.data);
      } else if (msg.type === "answer" || msg.type === "ice") {
        await handleSignal({ kind: msg.type === "answer" ? "answer" : "ice", ...msg.payload } as SignalData);
      }
    };

    const pc = new RTCPeerConnection(useIceServers ? { iceServers: ICE_SERVERS } : {});
    pcRef.current = pc;
    remoteStreamRef.current = new MediaStream();
    if (onRemoteStream && remoteStreamRef.current) {
      onRemoteStream(remoteStreamRef.current);
    }
    const dc = pc.createDataChannel("control", { ordered: true });
    dataChannelRef.current = dc;
    setDataChannel(dc);
    const handleDc = (channel: RTCDataChannel) => {
      if (onDataChannel) onDataChannel(channel);
    };
    dc.onopen = () => handleDc(dc);
    dc.onclosing = () => setStatus("connecting");
    dc.onclose = () => setDataChannel(null);
    handleDc(dc);

    pc.addTransceiver("video", { direction: "recvonly" });
    pc.addTransceiver("audio", { direction: "recvonly" });

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.readyState === WebSocket.OPEN) {
        const sig: SignalEnvelope = {
          type: "signal",
          from: { role: "offer", peerId: offerPeerId },
          to: { role: "answer", peerId: targetPeerId },
          data: { kind: "ice", candidate: event.candidate },
        };
        ws.send(JSON.stringify(sig));
      }
    };
    pc.oniceconnectionstatechange = () => {
      onIceState?.(pc.iceConnectionState);
    };
    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream();
      remoteStreamRef.current.addTrack(event.track);
      if (onRemoteStream && remoteStreamRef.current) {
        onRemoteStream(remoteStreamRef.current);
      }
    };

    const offer = await pc.createOffer();
    if (videoCodec) {
      offer.sdp = prioritizeCodec(offer.sdp || "", videoCodec);
    }
    await pc.setLocalDescription(offer);

    const sigOffer: SignalEnvelope = {
      type: "signal",
      from: { role: "offer", peerId: offerPeerId },
      to: { role: "answer", peerId: targetPeerId },
      data: { kind: "offer", sdp: offer.sdp },
    };
    ws.send(JSON.stringify(sigOffer));
    setStatus("connected");
  }, [close, offerPeerId, targetPeerId, signalingUrl, useIceServers, videoCodec, handleSignal, onRemoteStream, onIceState, onSignalingState]);

  useEffect(() => {
    return () => close();
  }, [close]);

  const conn: OfferConnection = {
    start,
    close,
    dataChannel,
  };

  return { status, connection: conn, dataChannel };
};

// Very small SDP codec preference helper (offer-side only)
function prioritizeCodec(sdp: string, codec: "AV1" | "VP9" | "H264" | "VP8") {
  const lines = sdp.split("\n");
  const mLineIndex = lines.findIndex((l) => l.startsWith("m=video"));
  if (mLineIndex === -1) return sdp;
  const rtpMaps = lines
    .map((l, i) => ({ line: l, i }))
    .filter(({ line }) => line.startsWith("a=rtpmap:"))
    .map(({ line, i }) => {
      const match = line.match(/a=rtpmap:(\d+)\s+(\w+)/);
      return match ? { payload: match[1], codec: match[2], i } : null;
    })
    .filter(Boolean) as { payload: string; codec: string; i: number }[];
  const preferred = rtpMaps.find((r) => r.codec.toUpperCase().includes(codec.toUpperCase()));
  if (!preferred) return sdp;
  const mParts = lines[mLineIndex].trim().split(" ");
  const mHeader = mParts.slice(0, 3);
  const payloads = mParts.slice(3);
  const filtered = payloads.filter((p) => p !== preferred.payload);
  lines[mLineIndex] = [...mHeader, preferred.payload, ...filtered].join(" ");
  return lines.join("\n");
}
