export type Engine = "pure" | "oldskyway" | "newskyway";

export type Role = "offer" | "answer";

export type PeerRef = { role: Role; peerId: string };

export type SignalData =
  | { kind: "offer"; sdp: string }
  | { kind: "answer"; sdp: string }
  | { kind: "ice"; candidate: RTCIceCandidateInit };

// Register message used by the built-in signaling server
export type RegisterMessage = {
  type: "register";
  payload: {
    role: Role;
    peerId: string;
    roomId?: string;
  };
};

export type SignalEnvelope = {
  type: "signal";
  roomId?: string;
  from: PeerRef;
  to: PeerRef;
  data: SignalData;
};

// Legacy message shapes kept for backward compatibility with older offer/answer flows
export type LegacyAnswerMessage = { type: "answer"; payload: { sdp: string } };
export type LegacyIceMessage = {
  type: "ice" | "ice-answer" | "ice-offer";
  payload: { candidate: RTCIceCandidateInit };
};

export type LegacyOfferMessage = { type: "offer"; payload: { sdp: string } };

export type SignalingMessage =
  | RegisterMessage
  | SignalEnvelope
  | LegacyAnswerMessage
  | LegacyIceMessage
  | LegacyOfferMessage;

export type OfferConnectionOptions = {
  signalingUrl: string;
  offerPeerId: string;
  targetPeerId: string;
  useIceServers: boolean;
  videoCodec?: "AV1" | "VP9" | "H264" | "VP8";
  onRemoteStream?: (stream: MediaStream) => void;
  onSignalingState?: (state: string) => void;
  onIceState?: (state: string) => void;
  onDataChannel?: (dc: RTCDataChannel) => void;
};

export type OfferConnection = {
  start: () => Promise<void>;
  close: () => void;
  dataChannel: RTCDataChannel | null;
};

export type AnswerConnectionOptions = {
  signalingUrl: string;
  answerPeerId: string;
  useIceServers: boolean;
  mediaStream: MediaStream | null;
  onSignalingState?: (state: string) => void;
  onIceState?: (state: string) => void;
  onDataChannel?: (dc: RTCDataChannel) => void;
};

export type AnswerConnection = {
  start: () => Promise<void>;
  close: () => void;
  replaceStream: (stream: MediaStream) => void;
  setVideoBitrate: (bitrate: number) => Promise<void>;
  dataChannel: RTCDataChannel | null;
};
