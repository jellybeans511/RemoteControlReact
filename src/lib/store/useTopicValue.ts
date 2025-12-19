import { useSyncExternalStore } from "react";
import { TopicStore } from "./topicStore";

export const useTopicValue = <T>(topic: TopicStore<T>): T => {
  return useSyncExternalStore(topic.subscribe, topic.get, topic.get);
};

export const useTopicSelector = <T, U>(
  topic: TopicStore<T>,
  selector: (value: T) => U
): U => {
  const getSnapshot = () => selector(topic.get());
  return useSyncExternalStore(topic.subscribe, getSnapshot, getSnapshot);
};
