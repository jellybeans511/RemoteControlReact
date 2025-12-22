import {
  AutorunTelemetry,
  CameraCapabilities,
  ControlChannelInfo,
  FeedbackConfig,
  VehicleConfig,
  VehicleStatuses,
  VideoProfile,
} from "../../lib/types/vehicle";

export const DEFAULT_SIGNALING_URL = "ws://localhost:8080";
export const DEFAULT_SKYWAY_API_KEY = "e316eaa7-4c1c-468c-b23a-9ce51b074ab7";
export const AUTORUN_WS_URL = "ws://127.0.0.1:8081";

export const defaultVehicleConfig: VehicleConfig = {
  engine: "pure",
  answerPeerId: "robot-1",
  signalingUrl: DEFAULT_SIGNALING_URL,
  useStunTurn: true,
  skywayApiKey: DEFAULT_SKYWAY_API_KEY,
  skywayLocalId: "",
  skywayMyId: "(waiting)",
};

export const defaultVideoProfile: VideoProfile = {
  width: 1920,
  height: 1280,
  frameRate: 30,
  bitrate: 1_000_000,
  deviceId: "default",
};

export const defaultFeedbackConfig: FeedbackConfig = {
  disableTcc: true,
  disableTwccExtmap: true,
  disableRemb: true,
  disableNackPliFir: false,
  disableRtcpRsize: false,
};

export const defaultStatuses: VehicleStatuses = {
  signaling: "Disconnected",
  stun: "Waiting...",
  turn: "Waiting...",
  control: "closed",
  autorun: "Disconnected",
};

export const defaultCapabilities: CameraCapabilities = {};

export const defaultControlChannel: ControlChannelInfo = {
  channel: null,
  state: "closed",
};

export const defaultAutorunTelemetry: AutorunTelemetry = {
  lat: 0,
  lon: 0,
  gnssQuality: 0,
  gnssSpeed: 0,
  heading: 0,
  headingError: 0,
  lateralError: 0,
  steerAngle: 0,
  realSteerAngle: 0,
  stopStatus: 0,
};
