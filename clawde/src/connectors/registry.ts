import type { ClawdeConfig } from "../config/schema.js";
import type { Connector } from "./connector.js";
import { DiscordConnector } from "./discord.js";
import { TelegramConnector } from "./telegram.js";
import { SlackConnector } from "./slack.js";
import { WhatsAppConnector } from "./whatsapp.js";

/** Build a connector instance for every integration that's enabled in config. */
export function buildConnectors(config: ClawdeConfig): Connector[] {
  const c = config.connectors;
  const connectors: Connector[] = [];

  if (c.discord.enabled && c.discord.token) {
    connectors.push(new DiscordConnector(c.discord));
  }
  if (c.telegram.enabled && c.telegram.token) {
    connectors.push(new TelegramConnector(c.telegram));
  }
  if (c.slack.enabled && c.slack.botToken && c.slack.appToken) {
    connectors.push(new SlackConnector(c.slack));
  }
  if (c.whatsapp.enabled) {
    connectors.push(new WhatsAppConnector(c.whatsapp));
  }

  return connectors;
}

/** Human-readable summary of which connectors are configured. */
export function connectorStatus(config: ClawdeConfig): Array<{ name: string; enabled: boolean; ready: boolean }> {
  const c = config.connectors;
  return [
    { name: "discord", enabled: c.discord.enabled, ready: !!c.discord.token },
    { name: "telegram", enabled: c.telegram.enabled, ready: !!c.telegram.token },
    { name: "slack", enabled: c.slack.enabled, ready: !!(c.slack.botToken && c.slack.appToken) },
    { name: "whatsapp", enabled: c.whatsapp.enabled, ready: true },
  ];
}
