import type { Assistant } from "../core/assistant.js";

/**
 * A connector bridges one chat platform to the assistant. It translates
 * platform events into {@link IncomingMessage}s, asks the assistant for a
 * reply, and renders the {@link OutgoingMessage} back onto the platform.
 */
export interface Connector {
  readonly name: string;
  /** Connect and begin listening. Resolves once the connection is live. */
  start(assistant: Assistant): Promise<void>;
  /** Disconnect cleanly. */
  stop(): Promise<void>;
}

/** True if `text` looks like it's addressing the bot by name (for group chats). */
export function addressedByName(text: string, name: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n) return false;
  const t = text.toLowerCase();
  return t.startsWith(n) || t.includes(`@${n}`) || new RegExp(`\\b${escapeRe(n)}\\b`).test(t);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
