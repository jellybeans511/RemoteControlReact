import { createTopicStore } from "../../packages/pubsub/topicStore.js";
import { createLogger } from "../../packages/logging/createLogger.js";

const createAppTopics = () => ({
  connectionState: createTopicStore({ initialValue: "idle" }),
  control: createTopicStore({ initialValue: null }),
  telemetry: createTopicStore({ initialValue: null }),
  logs: createTopicStore({ initialValue: [] }),
});

const topics = createAppTopics();
const logger = createLogger({ logsTopic: topics.logs, namespace: "monitor-offer" });

logger.info({ event: "app.bootstrap", message: "monitor-offer wiring started" });

const startLegacyOffer = async () => {
  try {
    const legacyOfferModule = await import("../../offer.js");
    logger.info({ event: "legacy.offer.loaded", message: "legacy offer module executed", detail: { keys: Object.keys(legacyOfferModule || {}) } });
    return legacyOfferModule;
  } catch (error) {
    logger.error({
      event: "legacy.offer.error",
      message: "Failed to execute legacy offer entrypoint",
      error,
    });
    throw error;
  }
};

startLegacyOffer();

export { topics, logger };
