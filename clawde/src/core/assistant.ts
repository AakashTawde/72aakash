import type { ClawdeConfig } from "../config/schema.js";
import { OllamaClient, LlmUnavailableError, type ChatMessage } from "./llm.js";
import { Memory } from "./memory.js";
import { buildSystemPrompt, quips, pick } from "./personality.js";
import type { IncomingMessage, OutgoingMessage } from "./message.js";
import { Voice } from "../voice/voice.js";
import { log } from "../util/logger.js";

/**
 * The brain. Connectors hand it an {@link IncomingMessage}; it consults the
 * personality + memory + local model and hands back an {@link OutgoingMessage}.
 * It has no knowledge of any particular chat platform — that's the connectors'
 * job — which keeps it easy to test and to extend.
 */
export class Assistant {
  readonly llm: OllamaClient;
  private readonly memory: Memory;
  private readonly voice: Voice;

  constructor(private readonly config: ClawdeConfig) {
    this.llm = new OllamaClient(config.llm);
    this.memory = new Memory(config.memoryTurns);
    this.voice = new Voice(config.voice);
  }

  /** Handle one inbound message and produce a reply (or null to stay silent). */
  async handle(msg: IncomingMessage): Promise<OutgoingMessage | null> {
    const text = msg.text.trim();

    // Built-in slash commands work the same on every platform.
    const command = this.tryCommand(text, msg.chatId);
    if (command !== null) {
      return this.maybeSpeak(msg, { text: command });
    }

    this.memory.append(msg.chatId, { role: "user", content: text });

    const messages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(this.config.persona) },
      ...this.memory.history(msg.chatId).map((t) => ({ role: t.role, content: t.content })),
    ];

    let reply: string;
    try {
      reply = await this.llm.chat(messages);
    } catch (err) {
      if (err instanceof LlmUnavailableError) {
        log.warn(err.message);
        // Don't poison memory with a failed turn.
        this.memory.reset(msg.chatId);
        return { text: pick(quips.llmDown) };
      }
      throw err;
    }

    if (!reply) reply = "…I lost my train of thought in the current. Try again? 🦞";
    this.memory.append(msg.chatId, { role: "assistant", content: reply });

    return this.maybeSpeak(msg, { text: reply });
  }

  /** Stream a reply to a callback — used by the local terminal REPL. */
  async stream(
    chatId: string,
    text: string,
    onToken: (t: string) => void,
  ): Promise<string> {
    this.memory.append(chatId, { role: "user", content: text.trim() });
    const messages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(this.config.persona) },
      ...this.memory.history(chatId).map((t) => ({ role: t.role, content: t.content })),
    ];
    const reply = await this.llm.chat(messages, { onToken });
    this.memory.append(chatId, { role: "assistant", content: reply });
    return reply;
  }

  /** Transcribe an audio buffer to text (returns "" if voice is off/unavailable). */
  async transcribe(audio: Buffer): Promise<string> {
    return this.voice.transcribe(audio);
  }

  private async maybeSpeak(
    msg: IncomingMessage,
    out: OutgoingMessage,
  ): Promise<OutgoingMessage> {
    if (msg.isVoice && this.config.voice.enabled && this.config.voice.speakReplies) {
      const audio = await this.voice.speak(out.text);
      if (audio) out.voice = audio;
    }
    return out;
  }

  /** Returns reply text for a built-in command, or null if it wasn't one. */
  private tryCommand(text: string, chatId: string): string | null {
    const lower = text.toLowerCase();
    if (lower === "/reset" || lower === "/clear" || lower === "/forget") {
      this.memory.reset(chatId);
      return quips.reset;
    }
    if (lower === "/help" || lower === "/start") {
      return quips.help;
    }
    return null;
  }
}
