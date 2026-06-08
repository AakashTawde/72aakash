import prompts from "prompts";
import { loadConfig, saveConfig, configPath } from "../config/config.js";
import { OllamaClient } from "../core/llm.js";
import type { ClawdeConfig, SassLevel } from "../config/schema.js";
import { banner } from "../util/banner.js";
import { pc, log } from "../util/logger.js";

const onCancel = () => {
  console.log(pc.dim("\nSetup cancelled — nothing saved. The lobster will wait. 🦞"));
  process.exit(0);
};

/**
 * The guided, interactive setup. Walks you through your local model, Clawde's
 * personality, optional voice, and connecting each chat app — then writes it
 * all to ~/.clawde/config.json. Re-run any time to change things.
 */
export async function runSetup(): Promise<void> {
  console.log(banner());
  console.log(
    pc.dim("  Welcome aboard. Let's get Clawde settled into your tank.\n") +
      pc.dim("  Everything you enter is saved locally and never leaves this machine.\n"),
  );

  const config = loadConfig();

  await setupLlm(config);
  await setupPersona(config);
  await setupVoice(config);
  await setupConnectors(config);

  saveConfig(config);

  console.log("\n" + pc.green("✓ Saved to ") + pc.bold(configPath()));
  printNextSteps(config);
}

async function setupLlm(config: ClawdeConfig): Promise<void> {
  section("🧠  Local brain (Ollama)");
  console.log(
    pc.dim(
      "  Clawde thinks using a model you run locally with Ollama (https://ollama.com).\n" +
        "  Install it, then `ollama pull llama3.1` (or any model you like).\n",
    ),
  );

  const { host } = await prompts(
    {
      type: "text",
      name: "host",
      message: "Ollama server URL",
      initial: config.llm.host,
    },
    { onCancel },
  );
  config.llm.host = host;

  // Probe the server so we can offer the models you actually have installed.
  const probe = new OllamaClient({ ...config.llm, host });
  const ping = await probe.ping();
  let model = config.llm.model;

  if (ping.ok && ping.models.length > 0) {
    log.ok(`Connected. Found ${ping.models.length} model(s).`);
    const res = await prompts(
      {
        type: "select",
        name: "model",
        message: "Which model should Clawde use?",
        choices: [
          ...ping.models.map((m) => ({ title: m, value: m })),
          { title: "✎ type another model name…", value: "__custom__" },
        ],
        initial: Math.max(0, ping.models.indexOf(config.llm.model)),
      },
      { onCancel },
    );
    model = res.model;
    if (model === "__custom__") {
      const r = await prompts({ type: "text", name: "m", message: "Model name", initial: "llama3.1" }, { onCancel });
      model = r.m;
    }
  } else {
    log.warn(
      ping.ok
        ? "Connected, but no models are installed yet."
        : `Couldn't reach Ollama (${ping.error ?? "no response"}). That's OK — we'll set it up anyway.`,
    );
    const r = await prompts(
      { type: "text", name: "m", message: "Model name to use (pull it later with `ollama pull`)", initial: config.llm.model },
      { onCancel },
    );
    model = r.m;
  }
  config.llm.model = model;

  const { temperature } = await prompts(
    {
      type: "number",
      name: "temperature",
      message: "Creativity (temperature, 0.0–1.5)",
      initial: config.llm.temperature,
      float: true,
      min: 0,
      max: 2,
    },
    { onCancel },
  );
  if (typeof temperature === "number") config.llm.temperature = temperature;
}

async function setupPersona(config: ClawdeConfig): Promise<void> {
  section("🦞  Personality");
  const res = await prompts(
    [
      { type: "text", name: "name", message: "What should the assistant call itself?", initial: config.persona.name },
      {
        type: "select",
        name: "sass",
        message: "How quirky should the lobster be?",
        choices: [
          { title: "Gentle — mostly straight-laced, rare puns", value: "gentle" },
          { title: "Balanced — friendly & a little cheeky (recommended)", value: "balanced" },
          { title: "Spicy — full lobster, claws out", value: "spicy" },
        ],
        initial: indexOfSass(config.persona.sass),
      },
      {
        type: "text",
        name: "about",
        message: "Anything Clawde should always know about you? (optional)",
        initial: config.persona.about,
      },
    ],
    { onCancel },
  );
  config.persona.name = res.name || "Clawde";
  config.persona.sass = (res.sass as SassLevel) ?? "balanced";
  config.persona.about = res.about ?? "";
}

async function setupVoice(config: ClawdeConfig): Promise<void> {
  section("🎙️  Voice (optional)");
  console.log(
    pc.dim(
      "  Talk to Clawde with voice notes from your phone. Transcription uses\n" +
        "  whisper.cpp and speech uses piper — both run fully offline.\n",
    ),
  );
  const { enable } = await prompts(
    { type: "confirm", name: "enable", message: "Enable local voice?", initial: config.voice.enabled },
    { onCancel },
  );
  config.voice.enabled = !!enable;
  if (!enable) return;

  const res = await prompts(
    [
      { type: "text", name: "sttBin", message: "Path to whisper.cpp binary (whisper-cli)", initial: config.voice.sttBin },
      { type: "text", name: "sttModel", message: "Path to whisper model (ggml-*.bin)", initial: config.voice.sttModel },
      { type: "text", name: "ttsBin", message: "Path to piper binary", initial: config.voice.ttsBin },
      { type: "text", name: "ttsModel", message: "Path to piper voice (.onnx)", initial: config.voice.ttsModel },
      { type: "confirm", name: "speakReplies", message: "Reply to voice notes with a spoken voice note?", initial: config.voice.speakReplies },
    ],
    { onCancel },
  );
  config.voice.sttBin = res.sttBin ?? "";
  config.voice.sttModel = res.sttModel ?? "";
  config.voice.ttsBin = res.ttsBin ?? "";
  config.voice.ttsModel = res.ttsModel ?? "";
  config.voice.speakReplies = !!res.speakReplies;
}

async function setupConnectors(config: ClawdeConfig): Promise<void> {
  section("💬  Chat apps");
  console.log(pc.dim("  Connect the apps you want to message Clawde from. Skip any for now.\n"));

  // Telegram — easiest, so we offer it first.
  await connectTelegram(config);
  await connectDiscord(config);
  await connectSlack(config);
  await connectWhatsApp(config);
}

async function connectTelegram(config: ClawdeConfig): Promise<void> {
  const { go } = await prompts({ type: "confirm", name: "go", message: "Connect Telegram?", initial: config.connectors.telegram.enabled }, { onCancel });
  if (!go) {
    config.connectors.telegram.enabled = false;
    return;
  }
  console.log(
    pc.dim(
      "  1. Open Telegram and message @BotFather\n" +
        "  2. Send /newbot and follow the prompts\n" +
        "  3. Copy the HTTP API token it gives you\n",
    ),
  );
  const { token } = await prompts({ type: "password", name: "token", message: "Telegram bot token", initial: config.connectors.telegram.token }, { onCancel });
  config.connectors.telegram.token = token ?? "";
  config.connectors.telegram.enabled = !!config.connectors.telegram.token;
}

async function connectDiscord(config: ClawdeConfig): Promise<void> {
  const { go } = await prompts({ type: "confirm", name: "go", message: "Connect Discord?", initial: config.connectors.discord.enabled }, { onCancel });
  if (!go) {
    config.connectors.discord.enabled = false;
    return;
  }
  console.log(
    pc.dim(
      "  1. Go to https://discord.com/developers/applications → New Application\n" +
        "  2. Bot → Reset Token → copy it\n" +
        "  3. Enable the 'Message Content Intent' under Bot settings\n" +
        "  4. OAuth2 → URL Generator → scopes: bot → invite it to your server\n",
    ),
  );
  const { token } = await prompts({ type: "password", name: "token", message: "Discord bot token", initial: config.connectors.discord.token }, { onCancel });
  config.connectors.discord.token = token ?? "";
  config.connectors.discord.enabled = !!config.connectors.discord.token;
}

async function connectSlack(config: ClawdeConfig): Promise<void> {
  const { go } = await prompts({ type: "confirm", name: "go", message: "Connect Slack?", initial: config.connectors.slack.enabled }, { onCancel });
  if (!go) {
    config.connectors.slack.enabled = false;
    return;
  }
  console.log(
    pc.dim(
      "  1. https://api.slack.com/apps → Create New App (from scratch)\n" +
        "  2. Socket Mode → enable → create an App-Level token (xapp-) with connections:write\n" +
        "  3. OAuth & Permissions → add bot scopes: app_mentions:read, chat:write, im:history, im:read, im:write\n" +
        "  4. Event Subscriptions → subscribe to: message.im, app_mention\n" +
        "  5. Install to workspace → copy the Bot token (xoxb-)\n",
    ),
  );
  const res = await prompts(
    [
      { type: "password", name: "botToken", message: "Slack bot token (xoxb-)", initial: config.connectors.slack.botToken },
      { type: "password", name: "appToken", message: "Slack app token (xapp-)", initial: config.connectors.slack.appToken },
    ],
    { onCancel },
  );
  config.connectors.slack.botToken = res.botToken ?? "";
  config.connectors.slack.appToken = res.appToken ?? "";
  config.connectors.slack.enabled = !!(config.connectors.slack.botToken && config.connectors.slack.appToken);
}

async function connectWhatsApp(config: ClawdeConfig): Promise<void> {
  const { go } = await prompts({ type: "confirm", name: "go", message: "Connect WhatsApp?", initial: config.connectors.whatsapp.enabled }, { onCancel });
  if (!go) {
    config.connectors.whatsapp.enabled = false;
    return;
  }
  console.log(
    pc.dim(
      "  WhatsApp links via QR code (like WhatsApp Web). You'll scan it the first\n" +
        "  time you run `clawde start`.\n",
    ),
  );
  const { mode } = await prompts(
    {
      type: "select",
      name: "mode",
      message: "How do you want to use WhatsApp?",
      choices: [
        { title: "My own number — only my 'Message Yourself' chat (safest)", value: true },
        { title: "A dedicated spare number — DM it like a contact", value: false },
      ],
      initial: config.connectors.whatsapp.selfOnly ? 0 : 1,
    },
    { onCancel },
  );
  config.connectors.whatsapp.selfOnly = !!mode;
  config.connectors.whatsapp.enabled = true;
}

function printNextSteps(config: ClawdeConfig): void {
  const enabled = Object.entries(config.connectors)
    .filter(([, v]) => (v as { enabled: boolean }).enabled)
    .map(([k]) => k);

  console.log("\n" + pc.bold("Next steps:"));
  console.log("  • " + pc.cyan("clawde doctor") + pc.dim("   check everything is wired up"));
  console.log("  • " + pc.cyan("clawde chat") + pc.dim("     talk to Clawde right here in the terminal"));
  console.log("  • " + pc.cyan("clawde start") + pc.dim("    go live on " + (enabled.length ? enabled.join(", ") : "your chat apps")));
  console.log("\n" + pc.red("🦞  All set. See you in the deep.") + "\n");
}

function section(title: string): void {
  console.log("\n" + pc.bold(pc.red("── ")) + pc.bold(title) + "\n");
}

function indexOfSass(s: SassLevel): number {
  return ["gentle", "balanced", "spicy"].indexOf(s);
}
