/**
 * Minimal TopicStore (BehaviorSubject-like).
 * Holds the latest value and lets subscribers get the current snapshot immediately.
 */
export const createTopicStore = ({ initialValue, equalityFn, onError } = {}) => {
  let current = initialValue;
  const subscribers = new Set();
  const handleError = typeof onError === "function" ? onError : () => {};

  const notify = (value) => {
    subscribers.forEach((handler) => {
      try {
        handler(value);
      } catch (error) {
        // Swallow to avoid breaking other subscribers; reporting is handled by callers.
        handleError(error, value);
      }
    });
  };

  const get = () => current;

  const set = (value) => {
    if (typeof equalityFn === "function" && equalityFn(current, value)) return current;
    current = value;
    notify(current);
    return current;
  };

  const subscribe = (handler, { emitInitial = true } = {}) => {
    subscribers.add(handler);
    if (emitInitial) handler(current);
    return () => subscribers.delete(handler);
  };

  return { get, set, subscribe };
};
