import { createTopicStore, TopicStore } from "../../lib/store/topicStore";
import {
  AutorunTelemetry,
  CameraCapabilities,
  ControlChannelInfo,
  FeedbackConfig,
  VehicleConfig,
  VehicleStatuses,
  VideoProfile,
} from "../../lib/types/vehicle";
import {
  defaultAutorunTelemetry,
  defaultCapabilities,
  defaultControlChannel,
  defaultFeedbackConfig,
  defaultStatuses,
  defaultVehicleConfig,
  defaultVideoProfile,
} from "./defaults";

export type VehicleTopics = {
  config: TopicStore<VehicleConfig>;
  videoProfile: TopicStore<VideoProfile>;
  feedback: TopicStore<FeedbackConfig>;
  statuses: TopicStore<VehicleStatuses>;
  capabilities: TopicStore<CameraCapabilities>;
  devices: TopicStore<MediaDeviceInfo[]>;
  stream: TopicStore<MediaStream | null>;
  autorunTelemetry: TopicStore<AutorunTelemetry>;
  controlChannel: TopicStore<ControlChannelInfo>;
};

export const createVehicleTopics = (): VehicleTopics => ({
  config: createTopicStore(defaultVehicleConfig),
  videoProfile: createTopicStore(defaultVideoProfile),
  feedback: createTopicStore(defaultFeedbackConfig),
  statuses: createTopicStore(defaultStatuses),
  capabilities: createTopicStore(defaultCapabilities),
  devices: createTopicStore([]),
  stream: createTopicStore<MediaStream | null>(null),
  autorunTelemetry: createTopicStore(defaultAutorunTelemetry),
  controlChannel: createTopicStore(defaultControlChannel),
});
