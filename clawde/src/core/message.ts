/** Platform-agnostic message shapes that flow between connectors and the brain. */

export interface IncomingMessage {
  /** Which connector this came from: "discord" | "telegram" | "slack" | "whatsapp" | "terminal". */
  connector: string;
  /** Stable id for the conversation/thread (used as the memory key). */
  chatId: string;
  /** Stable id for the sender. */
  userId: string;
  /** Friendly display name, if known. */
  userName?: string;
  /** The user's text. If the message was a voice note, this is the transcript. */
  text: string;
  /** True if the original message was audio that we transcribed. */
  isVoice?: boolean;
  /** True for 1:1 DMs; false for group/channel messages. */
  isDirect?: boolean;
  /** True if Clawde was @-mentioned or directly addressed (matters in groups). */
  mentioned?: boolean;
}

export interface OutgoingMessage {
  /** The text reply. */
  text: string;
  /** Optional spoken reply (e.g. an OGG/WAV buffer) for voice-capable channels. */
  voice?: Buffer;
}

/**
 * Decide whether Clawde should answer a given message.
 * In DMs it always replies; in groups it only chimes in when addressed,
 * so it doesn't spam every channel it's added to.
 */
export function shouldRespond(msg: IncomingMessage): boolean {
  if (!msg.text || msg.text.trim().length === 0) return false;
  if (msg.isDirect) return true;
  return msg.mentioned === true;
}
