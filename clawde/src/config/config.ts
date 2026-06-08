import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync, existsSync, chmodSync } from "node:fs";
import { config as loadDotenv } from "dotenv";
import { type ClawdeConfig, withDefaults } from "./schema.js";

loadDotenv();

/** The directory where all local state lives: ~/.clawde (override with CLAWDE_HOME). */
export function configDir(): string {
  return process.env.CLAWDE_HOME || join(homedir(), ".clawde");
}

export function configPath(): string {
  return join(configDir(), "config.json");
}

/** A place for connector session data (e.g. the WhatsApp auth state). */
export function statePath(...parts: string[]): string {
  return join(configDir(), "state", ...parts);
}

export function ensureDirs(): void {
  mkdirSync(configDir(), { recursive: true });
  mkdirSync(statePath(), { recursive: true });
}

export function configExists(): boolean {
  return existsSync(configPath());
}

export function loadConfig(): ClawdeConfig {
  let raw: Partial<ClawdeConfig> | undefined;
  if (configExists()) {
    try {
      raw = JSON.parse(readFileSync(configPath(), "utf8"));
    } catch (err) {
      throw new Error(`Could not read config at ${configPath()}: ${(err as Error).message}`);
    }
  }
  return applyEnvOverrides(withDefaults(raw));
}

export function saveConfig(config: ClawdeConfig): void {
  ensureDirs();
  const path = configPath();
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n", "utf8");
  // Config can contain bot tokens — keep it readable only by the owner.
  try {
    chmodSync(path, 0o600);
  } catch {
    /* best effort; non-POSIX filesystems may not support this */
  }
}

/**
 * Environment variables override file values, so you can keep secrets out of
 * the config file entirely (e.g. in a password manager / .env) if you prefer.
 */
function applyEnvOverrides(config: ClawdeConfig): ClawdeConfig {
  const env = process.env;
  if (env.OLLAMA_HOST) config.llm.host = env.OLLAMA_HOST;
  if (env.CLAWDE_MODEL) config.llm.model = env.CLAWDE_MODEL;
  if (env.DISCORD_TOKEN) config.connectors.discord.token = env.DISCORD_TOKEN;
  if (env.TELEGRAM_TOKEN) config.connectors.telegram.token = env.TELEGRAM_TOKEN;
  if (env.SLACK_BOT_TOKEN) config.connectors.slack.botToken = env.SLACK_BOT_TOKEN;
  if (env.SLACK_APP_TOKEN) config.connectors.slack.appToken = env.SLACK_APP_TOKEN;
  return config;
}
