import pc from "picocolors";

/**
 * A tiny, dependency-light logger with a lobster flavour. Levels are kept
 * deliberately simple so the assistant feels chatty in the terminal without
 * dragging in a heavyweight logging framework.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

let threshold: number = LEVEL_ORDER.info;

export function setLogLevel(level: LogLevel): void {
  threshold = LEVEL_ORDER[level];
}

function stamp(): string {
  return pc.dim(new Date().toLocaleTimeString());
}

function emit(level: LogLevel, tag: string, color: (s: string) => string, args: unknown[]): void {
  if (LEVEL_ORDER[level] < threshold) return;
  const prefix = `${stamp()} ${color(tag)}`;
  if (level === "error") console.error(prefix, ...args);
  else if (level === "warn") console.warn(prefix, ...args);
  else console.log(prefix, ...args);
}

export const log = {
  debug: (...args: unknown[]) => emit("debug", "·", pc.gray, args),
  info: (...args: unknown[]) => emit("info", "🦞", (s) => s, args),
  ok: (...args: unknown[]) => emit("info", "✓", pc.green, args),
  warn: (...args: unknown[]) => emit("warn", "▲", pc.yellow, args),
  error: (...args: unknown[]) => emit("error", "✗", pc.red, args),
  /** A line scoped to a particular connector, e.g. [discord]. */
  channel: (name: string, ...args: unknown[]) =>
    emit("info", `[${name}]`, pc.cyan, args),
};

export { pc };
