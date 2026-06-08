# 🦞 Clawde

**Your private, local-first lobster AI assistant.**

Clawde runs entirely on **your own devices**. It thinks with a local model (via
[Ollama](https://ollama.com)), so your conversations never leave your machine —
no cloud, no API keys, no one reading over your shoulder. It's always on, fast,
and a little bit cheeky.

The whole point is to talk to it from the apps you already use:

- 💬 **WhatsApp** · **Discord** · **Telegram** · **Slack** — message Clawde like a person
- 🎙️ **Voice** — send a voice note from your phone (iPhone or Android); Clawde
  transcribes it locally and can talk back with a spoken reply
- 🧠 **Local model** via Ollama — private, offline, yours
- 🛠️ **Guided setup** — one command (`clawde setup`) walks you through connecting
  every account
- 🦞 **Personality** — a quirky lobster with a tunable sass dial

> Everything is local by design. Config and session data live in `~/.clawde/`
> and never go anywhere else.

---

## Quick start

### 1. Prerequisites

- **Node.js 20+**
- **[Ollama](https://ollama.com)** for the local brain:
  ```bash
  # install Ollama (see ollama.com), then pull a model:
  ollama pull llama3.1
  ```

### 2. Install Clawde

```bash
cd clawde
npm install
npm run build
npm link        # optional: makes the `clawde` command available everywhere
```

(If you skip `npm link`, just use `node dist/cli.js <command>` instead of `clawde <command>`.)

### 3. Set it up

```bash
clawde setup
```

This guided wizard walks you through:

1. **Your local model** — points Clawde at Ollama and lets you pick from the
   models you've installed (it probes the server live).
2. **Personality** — name, sass level (gentle → balanced → spicy), and anything
   you'd like Clawde to always know about you.
3. **Voice** (optional) — point it at local whisper.cpp + piper binaries.
4. **Chat apps** — connect Telegram, Discord, Slack, and/or WhatsApp, each with
   step-by-step instructions for getting the tokens.

### 4. Try it locally, then go live

```bash
clawde doctor     # health check: model reachable? connectors ready?
clawde chat       # talk to Clawde right here in your terminal
clawde start      # go live on every chat app you enabled
```

---

## Commands

| Command | What it does |
| --- | --- |
| `clawde setup` | Guided, interactive configuration |
| `clawde chat` | Local terminal REPL — stream a conversation with your model |
| `clawde start` | Connect to all enabled chat apps and start replying |
| `clawde start --with-terminal` | Go live *and* keep a local terminal chat open |
| `clawde doctor` | Check model reachability, connector credentials, and voice setup |

---

## Connecting each chat app

The setup wizard prints these instructions interactively, but here's the gist.

### Telegram (easiest)
1. Message **@BotFather**, send `/newbot`, follow the prompts.
2. Paste the HTTP API token into `clawde setup`.
3. Message your new bot. Done.

### Discord
1. <https://discord.com/developers/applications> → **New Application**.
2. **Bot** → reset/copy the token; enable the **Message Content Intent**.
3. **OAuth2 → URL Generator** → scope `bot` → invite it to your server.
4. Clawde replies in DMs, and in servers when you **@mention** it.

### Slack
1. <https://api.slack.com/apps> → **Create New App** (from scratch).
2. **Socket Mode** → enable → create an App-Level token (`xapp-`) with
   `connections:write`. (Socket Mode means **no public URL needed** — perfect
   for running at home.)
3. **OAuth & Permissions** → bot scopes: `app_mentions:read`, `chat:write`,
   `im:history`, `im:read`, `im:write`.
4. **Event Subscriptions** → subscribe to `message.im` and `app_mention`.
5. Install to the workspace; copy the Bot token (`xoxb-`).

### WhatsApp
WhatsApp links via **QR code**, just like WhatsApp Web — no business API, no
Chromium. The first time you run `clawde start`, scan the QR from
**WhatsApp → Linked devices**. Two modes:

- **Your own number** *(safest, default)* — Clawde only answers your
  **"Message Yourself"** chat, so it never replies to your contacts.
- **A dedicated spare number** — log in with a second number and DM it like any
  contact.

Session auth is cached under `~/.clawde/state/whatsapp` so you only scan once.

---

## Voice 🎙️

Voice is **fully local** and optional. It uses two small offline tools:

- **Speech-to-text:** [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
- **Text-to-speech:** [piper](https://github.com/rhasspy/piper)

Install those, grab a model file for each, and point `clawde setup` at the
binaries. Then, from your phone:

1. Send a **voice note** to Clawde on Telegram or WhatsApp.
2. Clawde transcribes it locally, answers, and (if you enabled spoken replies)
   sends a **voice note back**.

That's a private, on-your-phone voice assistant — on both iPhone and Android —
without any of your audio touching the cloud. (Tip: install `ffmpeg` so Clawde
can transcode voice notes to the format whisper.cpp expects.)

---

## How it works

```
   chat apps                       the brain (no platform knowledge)
 ┌───────────┐   IncomingMessage   ┌───────────────────────────────┐
 │ WhatsApp  │ ───────────────────▶│  Assistant                    │
 │ Discord   │                     │   • lobster personality       │
 │ Telegram  │◀─────────────────── │   • per-chat rolling memory   │
 │ Slack     │   OutgoingMessage   │   • Ollama (local model)      │
 │ terminal  │                     │   • local voice (whisper/piper)│
 └───────────┘                     └───────────────────────────────┘
```

- **Connectors** (`src/connectors/`) translate each platform's events into a
  common `IncomingMessage` and render replies back. Their SDKs are declared as
  **optional dependencies** and lazy-loaded, so the core builds and runs even if
  you've only set up one integration.
- **The Assistant** (`src/core/`) owns the personality, the rolling per-chat
  memory, the Ollama client, and voice — and knows nothing about any specific
  chat app, which keeps it simple and testable.
- **Config** lives in `~/.clawde/config.json` (mode `600`). Secrets can also be
  supplied via environment variables, which always win — see `.env.example`.

### Project layout

```
src/
  cli.ts                 # `clawde` entry point (setup / chat / start / doctor)
  core/                  # assistant, llm (Ollama), memory, personality, message
  connectors/            # discord, telegram, slack, whatsapp, terminal, registry
  voice/                 # local STT (whisper.cpp) + TTS (piper)
  setup/                 # the guided wizard
  config/                # schema + local config loader
  util/                  # logger, banner, optional-dependency loader
test/                    # unit tests for the pure logic
```

---

## Development

```bash
npm run dev -- chat      # run from TypeScript without building (tsx)
npm run build            # compile to dist/
npm test                 # run the unit tests (node --test)
npm run doctor           # health check
```

Adding a new chat platform is a matter of implementing the small `Connector`
interface in `src/connectors/connector.ts` and registering it in
`registry.ts` — the brain doesn't change.

---

## Privacy

- Your messages are processed by a model **you** run locally via Ollama.
- Memory is in-process and ephemeral; `/reset` clears a conversation.
- The only network calls Clawde makes are to **your** Ollama server and to the
  chat platforms you explicitly connect (so they can deliver your messages).
- Bot tokens are stored locally in a `600`-permission file, or in env vars.

Built-in chat commands (work on every platform): `/help`, `/reset`.

---

## License

MIT — see [LICENSE](./LICENSE). 🦞
