import type { Connector } from "./connector.js";
import type { Assistant } from "../core/assistant.js";
import type { DiscordConfig } from "../config/schema.js";
import { loadOptional } from "../util/optional.js";
import { shouldRespond, type IncomingMessage } from "../core/message.js";
import { log } from "../util/logger.js";

/**
 * Discord connector (discord.js). Replies in DMs always, and in servers only
 * when Clawde is @-mentioned, so it won't talk over every channel.
 */
export class DiscordConnector implements Connector {
  readonly name = "discord";
  private client: any;

  constructor(private cfg: DiscordConfig) {}

  async start(assistant: Assistant): Promise<void> {
    const { Client, GatewayIntentBits, Partials, Events } = await loadOptional<any>(
      "discord.js",
    );

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel], // needed to receive DMs
    });
    this.client = client;

    client.once(Events.ClientReady, (c: any) => {
      log.channel("discord", `connected as ${c.user.tag}`);
    });

    client.on(Events.MessageCreate, async (message: any) => {
      try {
        if (message.author?.bot) return;
        if (message.author?.id === client.user?.id) return;

        const isDirect = !message.guild;
        const mentioned = message.mentions?.has?.(client.user) ?? false;
        // Strip the <@id> mention token so the model sees clean text.
        const text = String(message.content ?? "")
          .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
          .trim();

        const incoming: IncomingMessage = {
          connector: this.name,
          chatId: `discord:${message.channelId}`,
          userId: message.author.id,
          userName: message.author.username,
          text,
          isDirect,
          mentioned,
        };
        if (!shouldRespond(incoming)) return;

        await message.channel.sendTyping().catch(() => {});
        const out = await assistant.handle(incoming);
        if (out?.text) {
          // Discord hard-limits messages to 2000 chars.
          for (const chunk of chunkText(out.text, 1900)) {
            await message.reply(chunk);
          }
        }
      } catch (err) {
        log.error(`[discord] ${(err as Error).message}`);
      }
    });

    await client.login(this.cfg.token);
  }

  async stop(): Promise<void> {
    await this.client?.destroy?.();
  }
}

function chunkText(text: string, size: number): string[] {
  if (text.length <= size) return [text];
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}
