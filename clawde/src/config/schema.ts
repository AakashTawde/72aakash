/**
 * Configuration shapes for Clawde. Everything lives locally on your machine
 * (see {@link configPath}); nothing is sent anywhere. Secrets may either be
 * written here or supplied through environment variables — env always wins.
 */

export type SassLevel = "gentle" | "balanced" | "spicy";

export interface LlmConfig {
  /** Base URL of your local Ollama server. */
  host: string;
  /** Model tag to use, e.g. "llama3.1", "qwen2.5", "mistral". */
  model: string;
  /** Sampling temperature. Higher = more playful. */
  temperature: number;
  /** Hard cap on tokens generated per reply (0 = let the model decide). */
  numPredict: number;
}

export interface PersonaConfig {
  /** What the assistant calls itself. */
  name: string;
  /** How cheeky the lobster is. */
  sass: SassLevel;
  /** Drop in extra instructions / facts about you. */
  about: string;
}

export interface VoiceConfig {
  enabled: boolean;
  /** Path to a whisper.cpp `whisper-cli`/`main` binary for speech-to-text. */
  sttBin: string;
  /** Path to a whisper.cpp model file (ggml-*.bin). */
  sttModel: string;
  /** Path to a `piper` binary for text-to-speech. */
  ttsBin: string;
  /** Path to a piper voice model (.onnx). */
  ttsModel: string;
  /** Reply to voice notes with a spoken voice note back. */
  speakReplies: boolean;
}

export interface DiscordConfig {
  enabled: boolean;
  token: string;
}

export interface TelegramConfig {
  enabled: boolean;
  token: string;
}

export interface SlackConfig {
  enabled: boolean;
  /** xoxb- bot token. */
  botToken: string;
  /** xapp- app-level token (Socket Mode). */
  appToken: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  /** Only react when your own number sends a message ("self-chat" mode). */
  selfOnly: boolean;
}

export interface ConnectorsConfig {
  discord: DiscordConfig;
  telegram: TelegramConfig;
  slack: SlackConfig;
  whatsapp: WhatsAppConfig;
}

export interface ClawdeConfig {
  version: number;
  llm: LlmConfig;
  persona: PersonaConfig;
  voice: VoiceConfig;
  connectors: ConnectorsConfig;
  /** How many past turns to keep in working memory per conversation. */
  memoryTurns: number;
}

export const CONFIG_VERSION = 1;

export function defaultConfig(): ClawdeConfig {
  return {
    version: CONFIG_VERSION,
    llm: {
      host: "http://127.0.0.1:11434",
      model: "llama3.1",
      temperature: 0.8,
      numPredict: 0,
    },
    persona: {
      name: "Clawde",
      sass: "balanced",
      about: "",
    },
    voice: {
      enabled: false,
      sttBin: "",
      sttModel: "",
      ttsBin: "",
      ttsModel: "",
      speakReplies: true,
    },
    connectors: {
      discord: { enabled: false, token: "" },
      telegram: { enabled: false, token: "" },
      slack: { enabled: false, botToken: "", appToken: "" },
      whatsapp: { enabled: false, selfOnly: true },
    },
    memoryTurns: 12,
  };
}

/** Merge a partial (possibly older) config over the defaults. */
export function withDefaults(partial: Partial<ClawdeConfig> | undefined): ClawdeConfig {
  const base = defaultConfig();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    llm: { ...base.llm, ...(partial.llm ?? {}) },
    persona: { ...base.persona, ...(partial.persona ?? {}) },
    voice: { ...base.voice, ...(partial.voice ?? {}) },
    connectors: {
      discord: { ...base.connectors.discord, ...(partial.connectors?.discord ?? {}) },
      telegram: { ...base.connectors.telegram, ...(partial.connectors?.telegram ?? {}) },
      slack: { ...base.connectors.slack, ...(partial.connectors?.slack ?? {}) },
      whatsapp: { ...base.connectors.whatsapp, ...(partial.connectors?.whatsapp ?? {}) },
    },
    version: CONFIG_VERSION,
  };
}
