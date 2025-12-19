import { Engine } from "./webrtc";
import { RTCDataChannelLike } from "../skyway/oldSkywayAnswer";

export type VehicleEngine = Engine;

export type VideoProfile = {
  width: number | null;
  height: number | null;
  frameRate: number | null;
  bitrate: number | null;
  deviceId: string;
};

export type FeedbackConfig = {
  disableTcc: boolean;
  disableTwccExtmap: boolean;
  disableRemb: boolean;
  disableNackPliFir: boolean;
  disableRtcpRsize: boolean;
};

export type VehicleConfig = {
  engine: VehicleEngine;
  answerPeerId: string;
  signalingUrl: string;
  useStunTurn: boolean;
  skywayApiKey: string;
  skywayLocalId: string;
  skywayMyId: string;
};

export type CameraCapabilities = {
  widthMax?: number;
  heightMax?: number;
  frameRateMax?: number;
};

export type ControlChannelState = "closed" | "connecting" | "open" | "error";

export type ControlChannelInfo = {
  channel: RTCDataChannel | RTCDataChannelLike | null;
  state: ControlChannelState;
};

export type VehicleStatuses = {
  signaling: string;
  stun: string;
  turn: string;
  control: ControlChannelState;
  autorun: string;
};

export type AutorunTelemetry = {
  lat: number;
  lon: number;
  gnssQuality: number;
  gnssSpeed: number;
  heading: number;
  headingError: number;
  lateralError: number;
  steerAngle: number;
  realSteerAngle: number;
  stopStatus: number;
};

export type VideoQualityChange = {
  width?: number;
  height?: number;
  framerate?: number;
  bitrate?: number;
};

export type ControlMessage =
  | { type: "inputAutorunInfo"; payload?: unknown; inputInfo?: unknown }
  | ({ type: "videoQualityChange" } & VideoQualityChange)
  | { type: "offerInferenceResults"; payload?: unknown }
  | { type: string; payload?: unknown };
