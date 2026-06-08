import type { Connector } from "./connector.js";
import type { Assistant } from "../core/assistant.js";
import type { WhatsAppConfig } from "../config/schema.js";
import { loadOptional } from "../util/optional.js";
import { statePath, ensureDirs } from "../config/config.js";
import { type IncomingMessage } from "../core/message.js";
import { log, pc } from "../util/logger.js";

/**
 * WhatsApp connector (Baileys). Pairs by scanning a QR code the first time —
 * no Chromium, no business API, nothing leaves your machine. Auth state is
 * cached under ~/.clawde/state/whatsapp so you only scan once.
 *
 * Two modes (see config):
 *  - selfOnly (default): only your own "Message Yourself" chat is answered, so
 *    you can run Clawde on your existing number safely.
 *  - dedicated number: log in with a spare number and DM it like any contact.
 */
export class WhatsAppConnector implements Connector {
  readonly name = "whatsapp";
  private sock: any;
  private stopping = false;

  constructor(private cfg: WhatsAppConfig) {}

  async start(assistant: Assistant): Promise<void> {
    ensureDirs();
    const baileys = await loadOptional<any>("@whiskeysockets/baileys");
    const makeWASocket = baileys.default ?? baileys.makeWASocket;
    const { useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = baileys;

    const { state, saveCreds } = await useMultiFileAuthState(statePath("whatsapp"));
    const sock = makeWASocket({ auth: state, logger: await makeLogger(), printQRInTerminal: false });
    this.sock = sock;

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (u: any) => {
      const { connection, lastDisconnect, qr } = u;
      if (qr) await renderQr(qr);
      if (connection === "open") log.channel("whatsapp", "connected");
      if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = code === DisconnectReason?.loggedOut;
        if (!this.stopping && !loggedOut) {
          log.channel("whatsapp", "connection dropped, reconnecting…");
          this.start(assistant).catch((e) => log.error(`[whatsapp] ${e.message}`));
        } else if (loggedOut) {
          log.channel("whatsapp", "logged out — delete ~/.clawde/state/whatsapp to re-pair");
        }
      }
    });

    sock.ev.on("messages.upsert", async (upsert: any) => {
      if (upsert.type !== "notify") return;
      for (const m of upsert.messages ?? []) {
        try {
          await this.handleMessage(assistant, sock, downloadMediaMessage, m);
        } catch (err) {
          log.error(`[whatsapp] ${(err as Error).message}`);
        }
      }
    });
  }

  private async handleMessage(
    assistant: Assistant,
    sock: any,
    downloadMediaMessage: any,
    m: any,
  ): Promise<void> {
    if (!m.message) return;
    const jid: string = m.key.remoteJid ?? "";
    if (jid === "status@broadcast") return;
    const isGroup = jid.endsWith("@g.us");
    if (isGroup) return; // keep it to 1:1 chats for now
    const fromMe: boolean = !!m.key.fromMe;

    const myJid = baseNumber(sock.user?.id ?? "");
    const isSelfChat = baseNumber(jid) === myJid;

    // Routing rules per mode.
    if (this.cfg.selfOnly) {
      if (!isSelfChat) return; // only the note-to-self chat
    } else {
      if (fromMe) return; // dedicated-number mode ignores our own outgoing text
    }

    // Extract text or a voice note.
    const content = m.message;
    let text =
      content.conversation ??
      content.extendedTextMessage?.text ??
      content.imageMessage?.caption ??
      "";
    let isVoice = false;

    const audio = content.audioMessage;
    if (!text && audio) {
      const buf: Buffer = await downloadMediaMessage(m, "buffer", {});
      text = await assistant.transcribe(buf);
      isVoice = true;
      if (!text) {
        await sock.sendMessage(jid, {
          text: "I couldn't make out that voice note. Is voice set up? 🦞",
        });
        return;
      }
    }

    text = String(text).trim();
    if (!text) return;

    const incoming: IncomingMessage = {
      connector: this.name,
      chatId: `whatsapp:${jid}`,
      userId: baseNumber(m.key.participant ?? jid),
      userName: m.pushName,
      text,
      isVoice,
      isDirect: true,
      mentioned: true,
    };

    await sock.sendPresenceUpdate("composing", jid).catch(() => {});
    const out = await assistant.handle(incoming);
    if (!out?.text) return;

    if (out.voice) {
      await sock
        .sendMessage(jid, { audio: out.voice, ptt: true, mimetype: "audio/ogg; codecs=opus" })
        .catch(async () => {
          await sock.sendMessage(jid, { audio: out.voice, mimetype: "audio/wav" });
        });
    }
    await sock.sendMessage(jid, { text: out.text });
  }

  async stop(): Promise<void> {
    this.stopping = true;
    try {
      await this.sock?.logout?.();
    } catch {
      /* ignore */
    }
  }
}

function baseNumber(jid: string): string {
  // "12345:6@s.whatsapp.net" → "12345"
  return jid.split("@")[0]?.split(":")[0] ?? "";
}

async function renderQr(qr: string): Promise<void> {
  try {
    const qrcode = await loadOptional<any>("qrcode-terminal");
    console.log("\n" + pc.red("🦞  Scan this with WhatsApp ▸ Linked devices:") + "\n");
    (qrcode.default ?? qrcode).generate(qr, { small: true });
  } catch {
    console.log("\nWhatsApp pairing code (paste into a QR generator):\n" + qr + "\n");
  }
}

/** Baileys wants a pino-style logger; provide one if pino is installed, else a no-op. */
async function makeLogger(): Promise<any> {
  try {
    const pino = await loadOptional<any>("pino");
    return (pino.default ?? pino)({ level: "silent" });
  } catch {
    const noop = () => {};
    const logger: any = { level: "silent", trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop };
    logger.child = () => logger;
    return logger;
  }
}
