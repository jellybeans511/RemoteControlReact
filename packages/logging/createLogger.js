const LEVEL_TO_CONSOLE = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

const defaultClock = () => Date.now();

const toConsole = (consoleLike, entry, namespace) => {
  if (!consoleLike) return;
  const method = LEVEL_TO_CONSOLE[entry.level] || "log";
  const stamp = entry.ts ? new Date(entry.ts).toISOString() : "";
  const scope = namespace ? `[${namespace}] ` : "";
  const message = `${stamp ? `[${stamp}] ` : ""}[${entry.level}] ${scope}${entry.event || ""} ${entry.message || ""}`.trim();
  if (typeof consoleLike[method] === "function") {
    consoleLike[method](message, entry);
  } else if (typeof consoleLike.log === "function") {
    consoleLike.log(message, entry);
  }
};

const appendToBuffer = (logsTopic, bufferSize, entry) => {
  if (!logsTopic || typeof logsTopic.get !== "function") return;
  const current = Array.isArray(logsTopic.get()) ? logsTopic.get() : [];
  const next = current.concat(entry);
  if (next.length > bufferSize) {
    const dropCount = next.length - bufferSize;
    logsTopic.set(next.slice(dropCount));
    return;
  }
  logsTopic.set(next);
};

const normalizeInput = ({ level, input, clock, namespace }) => {
  const base = typeof input === "string" ? { message: input } : input || {};
  const ts = typeof base.ts === "number" ? base.ts : clock();
  const error =
    base.error instanceof Error
      ? { message: base.error.message, stack: base.error.stack }
      : base.error;

  return {
    ts,
    level,
    namespace,
    event: base.event || base.code || "log",
    message: base.message || "",
    context: base.context,
    detail: base.detail ?? base.details ?? base.data,
    error,
  };
};

export const createLogger = ({
  logsTopic,
  bufferSize = 200,
  console: consoleLike = console,
  clock = defaultClock,
  namespace,
} = {}) => {
  const write = (level, input) => {
    const entry = normalizeInput({ level, input, clock, namespace });
    toConsole(consoleLike, entry, namespace);
    appendToBuffer(logsTopic, bufferSize, entry);
    return entry;
  };

  return {
    debug: (input) => write("debug", input),
    info: (input) => write("info", input),
    warn: (input) => write("warn", input),
    error: (input) => write("error", input),
    log: (input) => write("info", input),
  };
};
