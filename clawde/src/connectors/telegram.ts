import type { Connector } from "./connector.js";
import type { Assistant } from "../core/assistant.js";
import type { TelegramConfig } from "../config/schema.js";
import { loadOptional } from "../util/optional.js";
import { shouldRespond, type IncomingMessage } from "../core/message.js";
import { log } from "../util/logger.js";

/**
 * Telegram connector (telegraf). Handles both text and voice notes: a voice
 * note is downloaded, transcribed locally, answered, and — if voice replies are
 * on — spoken back as a voice message.
 */
export class TelegramConnector implements Connector {
  readonly name = "telegram";
  private bot: any;

  constructor(private cfg: TelegramConfig) {}

  async start(assistant: Assistant): Promise<void> {
    const { Telegraf } = await loadOptional<any>("telegraf");
    const bot = new Telegraf(this.cfg.token);
    this.bot = bot;

    const me = await bot.telegram.getMe();
    const botName = me.username as string;
    log.channel("telegram", `connected as @${botName}`);

    bot.on("text", async (ctx: any) => {
      await this.respond(ctx, assistant, String(ctx.message.text ?? ""), false, botName);
    });

    bot.on("voice", async (ctx: any) => {
      try {
        const fileId = ctx.message.voice.file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        const res = await fetch(String(link));
        const audio = Buffer.from(await res.arrayBuffer());
        const text = await assistant.transcribe(audio);
        if (!text) {
          await ctx.reply("I couldn't make out that voice note. Is voice set up? 🦞");
          return;
        }
        await this.respond(ctx, assistant, text, true, botName);
      } catch (err) {
        log.error(`[telegram] ${(err as Error).message}`);
      }
    });

    // Long polling — no public webhook URL required, perfect for a home box.
    bot.launch().catch((err: Error) => log.error(`[telegram] ${err.message}`));
  }

  private async respond(
    ctx: any,
    assistant: Assistant,
    rawText: string,
    isVoice: boolean,
    botName: string,
  ): Promise<void> {
    try {
      const chat = ctx.chat ?? {};
      const isDirect = chat.type === "private";
      const text = rawText.replace(new RegExp(`@${botName}`, "ig"), "").trim();
      const mentioned =
        rawText.includes(`@${botName}`) ||
        ctx.message?.reply_to_message?.from?.username === botName;

      const incoming: IncomingMessage = {
        connector: this.name,
        chatId: `telegram:${chat.id}`,
        userId: String(ctx.from?.id ?? "unknown"),
        userName: ctx.from?.first_name,
        text,
        isVoice,
        isDirect,
        mentioned,
      };
      if (!shouldRespond(incoming)) return;

      await ctx.sendChatAction(isVoice ? "record_voice" : "typing").catch(() => {});
      const out = await assistant.handle(incoming);
      if (!out?.text) return;

      if (out.voice) {
        await ctx
          .replyWithVoice({ source: out.voice })
          .catch(async () => {
            await ctx.replyWithAudio({ source: out.voice });
          });
      }
      await ctx.reply(out.text);
    } catch (err) {
      log.error(`[telegram] ${(err as Error).message}`);
    }
  }

  async stop(): Promise<void> {
    this.bot?.stop?.("shutdown");
  }
}
