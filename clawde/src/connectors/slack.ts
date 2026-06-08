import type { Connector } from "./connector.js";
import type { Assistant } from "../core/assistant.js";
import type { SlackConfig } from "../config/schema.js";
import { loadOptional } from "../util/optional.js";
import { shouldRespond, type IncomingMessage } from "../core/message.js";
import { log } from "../util/logger.js";

/**
 * Slack connector (@slack/bolt in Socket Mode). Socket Mode keeps an outbound
 * websocket to Slack, so you don't need to expose a public webhook URL from
 * your home machine. Replies in DMs and when @-mentioned in channels.
 */
export class SlackConnector implements Connector {
  readonly name = "slack";
  private app: any;

  constructor(private cfg: SlackConfig) {}

  async start(assistant: Assistant): Promise<void> {
    const bolt = await loadOptional<any>("@slack/bolt");
    const App = bolt.App;

    const app = new App({
      token: this.cfg.botToken,
      appToken: this.cfg.appToken,
      socketMode: true,
    });
    this.app = app;

    // Direct messages to the bot.
    app.message(async ({ message, say, client }: any) => {
      try {
        if (message.subtype || message.bot_id) return; // ignore edits/bot echoes
        if (message.channel_type !== "im") return; // channel @-mentions handled below
        await this.reply(assistant, message, say, client, true);
      } catch (err) {
        log.error(`[slack] ${(err as Error).message}`);
      }
    });

    // @-mentions in channels.
    app.event("app_mention", async ({ event, say, client }: any) => {
      try {
        await this.reply(assistant, event, say, client, false, true);
      } catch (err) {
        log.error(`[slack] ${(err as Error).message}`);
      }
    });

    await app.start();
    log.channel("slack", "connected (socket mode)");
  }

  private async reply(
    assistant: Assistant,
    event: any,
    say: any,
    client: any,
    isDirect: boolean,
    mentioned = false,
  ): Promise<void> {
    const text = String(event.text ?? "").replace(/<@[^>]+>/g, "").trim();
    const incoming: IncomingMessage = {
      connector: this.name,
      chatId: `slack:${event.channel}`,
      userId: event.user ?? "unknown",
      text,
      isDirect,
      mentioned: isDirect ? true : mentioned,
    };
    if (!shouldRespond(incoming)) return;

    const out = await assistant.handle(incoming);
    if (out?.text) {
      await say({ text: out.text, thread_ts: event.thread_ts });
    }
  }

  async stop(): Promise<void> {
    await this.app?.stop?.();
  }
}
