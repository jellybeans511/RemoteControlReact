import { createTopicStore } from "../../packages/pubsub/topicStore.js";
import { createLogger } from "../../packages/logging/createLogger.js";

const createAppTopics = () => ({
  connectionState: createTopicStore({ initialValue: "idle" }),
  control: createTopicStore({ initialValue: null }),
  telemetry: createTopicStore({ initialValue: null }),
  logs: createTopicStore({ initialValue: [] }),
});

const topics = createAppTopics();
const logger = createLogger({ logsTopic: topics.logs, namespace: "vehicle-answer" });

logger.info({ event: "app.bootstrap", message: "vehicle-answer wiring started" });

const startLegacyAnswer = async () => {
  try {
    const legacyAnswerModule = await import("../../answer.js");
    logger.info({ event: "legacy.answer.loaded", message: "legacy answer module executed", detail: { keys: Object.keys(legacyAnswerModule || {}) } });
    return legacyAnswerModule;
  } catch (error) {
    logger.error({
      event: "legacy.answer.error",
      message: "Failed to execute legacy answer entrypoint",
      error,
    });
    throw error;
  }
};

startLegacyAnswer();

export { topics, logger };
