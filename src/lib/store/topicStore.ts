export type TopicStore<T> = {
  get: () => T;
  set: (value: T) => void;
  update: (updater: (prev: T) => T) => void;
  subscribe: (listener: (value: T) => void) => () => void;
};

export const createTopicStore = <T>(initialValue: T): TopicStore<T> => {
  let current = initialValue;
  const listeners = new Set<(value: T) => void>();

  const notify = () => {
    const value = current;
    listeners.forEach((listener) => listener(value));
  };

  const get = () => current;

  const set = (value: T) => {
    current = value;
    notify();
  };

  const update = (updater: (prev: T) => T) => {
    current = updater(current);
    notify();
  };

  const subscribe = (listener: (value: T) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { get, set, update, subscribe };
};
