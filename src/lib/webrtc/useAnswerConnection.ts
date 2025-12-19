import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnswerConnection,
  AnswerConnectionOptions,
  SignalData,
  SignalEnvelope,
  SignalingMessage,
} from "./types";

const ICE_SERVERS = [{ urls: "stun:10.100.0.35:3478" }];

export const useAnswerConnection = (opts: AnswerConnectionOptions) => {
  const {
    signalingUrl,
    answerPeerId,
    useIceServers,
    mediaStream,
    onSignalingState,
    onIceState,
    onDataChannel,
  } = opts;

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const targetOfferIdRef = useRef<string | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pendingRemoteIceRef = useRef<RTCIceCandidateInit[]>([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting_offer" | "connected" | "error">("idle");

  const close = useCallback(() => {
    try {
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
    if (data.kind === "offer" && data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));
      // Apply any ICE that arrived before the offer
      while (pendingRemoteIceRef.current.length > 0) {
        const cand = pendingRemoteIceRef.current.shift();
        if (cand) {
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        }
      }
    } else if (data.kind === "ice" && data.candidate) {
      if (!pc.remoteDescription) {
        pendingRemoteIceRef.current.push(data.candidate);
      } else {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    }
    // Answer is sent in start() after setting remote description.
  }, []);

  const flushPendingIce = useCallback(
    (ws: WebSocket) => {
      const targetPeerId = targetOfferIdRef.current;
      if (!targetPeerId || ws.readyState !== WebSocket.OPEN) return;
      while (pendingIceRef.current.length > 0) {
        const candidate = pendingIceRef.current.shift();
        if (!candidate) continue;
        const sig: SignalEnvelope = {
          type: "signal",
          from: { role: "answer", peerId: answerPeerId },
          to: { role: "offer", peerId: targetPeerId },
          data: { kind: "ice", candidate },
        };
        ws.send(JSON.stringify(sig));
      }
    },
    [answerPeerId]
  );

  const start = useCallback(async () => {
    close();
    if (!answerPeerId) {
      setStatus("error");
      throw new Error("answerPeerId is required");
    }
    if (!mediaStream) {
      setStatus("error");
      throw new Error("mediaStream is required (capture first)");
    }

    const ws = new WebSocket(signalingUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      setStatus("waiting_offer");
      onSignalingState?.("Connected");
      const register: SignalingMessage = {
        type: "register",
        payload: { role: "answer", peerId: answerPeerId },
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

    const pc = new RTCPeerConnection(useIceServers ? { iceServers: ICE_SERVERS } : {});
    pcRef.current = pc;
    mediaStream.getTracks().forEach((t) => pc.addTrack(t, mediaStream));

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.readyState === WebSocket.OPEN) {
        const targetPeerId = targetOfferIdRef.current;
        const candidateInit: RTCIceCandidateInit =
          typeof event.candidate.toJSON === "function" ? event.candidate.toJSON() : event.candidate;
        if (targetPeerId) {
          const sig: SignalEnvelope = {
            type: "signal",
            from: { role: "answer", peerId: answerPeerId },
            to: { role: "offer", peerId: targetPeerId },
            data: { kind: "ice", candidate: candidateInit },
          };
          ws.send(JSON.stringify(sig));
        } else {
          pendingIceRef.current.push(candidateInit);
        }
      }
    };
    pc.oniceconnectionstatechange = () => {
      onIceState?.(pc.iceConnectionState);
    };
    pc.ondatachannel = (event) => {
      const dc = event.channel;
      dataChannelRef.current = dc;
      setDataChannel(dc);
      if (onDataChannel) onDataChannel(dc);
      dc.onclose = () => setDataChannel(null);
    };

    ws.onmessage = async (event) => {
      const msg: SignalingMessage = JSON.parse(event.data);
      if (msg.type === "signal" && msg.data) {
        if (msg.from?.peerId) {
          targetOfferIdRef.current = msg.from.peerId;
          flushPendingIce(ws);
        }
        // fill target from msg.from
        await handleSignal(msg.data);
        if (msg.data.kind === "offer" && msg.data.sdp) {
          // respond with answer
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          const sig: SignalEnvelope = {
            type: "signal",
            from: { role: "answer", peerId: answerPeerId },
            to: { role: "offer", peerId: msg.from.peerId },
            data: { kind: "answer", sdp: answer.sdp || "" },
          };
          ws.send(JSON.stringify(sig));
          setStatus("connected");
          flushPendingIce(ws);
        }
      } else if (msg.type === "offer") {
        await handleSignal({ kind: "offer", sdp: msg.payload.sdp });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", payload: { sdp: answer.sdp || "" } }));
        setStatus("connected");
      } else if (msg.type === "ice" || msg.type === "ice-offer") {
        await handleSignal({ kind: "ice", candidate: msg.payload.candidate });
      }
    };
  }, [answerPeerId, signalingUrl, useIceServers, mediaStream, close, handleSignal, onIceState, onSignalingState, flushPendingIce]);

  const replaceStream = useCallback((nextStream: MediaStream) => {
    const pc = pcRef.current;
    if (!pc) return;
    const senders = pc.getSenders();
    const tracks = nextStream.getTracks();
    // Replace existing tracks
    tracks.forEach((track) => {
      const sender = senders.find((s) => s.track?.kind === track.kind);
      if (sender) {
        sender.replaceTrack(track);
      } else {
        pc.addTrack(track, nextStream);
      }
    });
  }, []);

  useEffect(() => {
    return () => close();
  }, [close]);

  const conn: AnswerConnection = {
    start,
    close,
    replaceStream,
    dataChannel,
  };

  return { status, connection: conn };
};
