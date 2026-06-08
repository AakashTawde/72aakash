#!/usr/bin/env node
import { Command } from "commander";
import { banner } from "./util/banner.js";
import { log, pc, setLogLevel } from "./util/logger.js";
import {
  loadConfig,
  configExists,
  configPath,
} from "./config/config.js";
import { runSetup } from "./setup/wizard.js";
import { Assistant } from "./core/assistant.js";
import { OllamaClient } from "./core/llm.js";
import { buildConnectors, connectorStatus } from "./connectors/registry.js";
import { TerminalConnector } from "./connectors/terminal.js";
import type { Connector } from "./connectors/connector.js";

const program = new Command();

program
  .name("clawde")
  .description("🦞 Clawde — your private, local-first lobster AI assistant")
  .version("0.1.0");

program
  .command("setup")
  .description("Guided setup: connect your model, persona, voice and chat apps")
  .action(async () => {
    await runSetup();
  });

program
  .command("chat")
  .description("Talk to Clawde right here in the terminal")
  .action(async () => {
    requireConfig();
    const assistant = new Assistant(loadConfig());
    await new TerminalConnector().start(assistant);
  });

program
  .command("start")
  .description("Go live: connect to every chat app you've enabled")
  .option("--with-terminal", "also open a local terminal chat alongside the connectors")
  .option("-v, --verbose", "verbose logging")
  .action(async (opts: { withTerminal?: boolean; verbose?: boolean }) => {
    if (opts.verbose) setLogLevel("debug");
    requireConfig();
    await startCommand(!!opts.withTerminal);
  });

program
  .command("doctor")
  .description("Check your setup: model reachable, connectors configured, voice ready")
  .action(async () => {
    await doctor();
  });

// Bare `clawde` → friendly banner + hint.
program.action(() => {
  console.log(banner());
  if (!configExists()) {
    console.log(pc.dim("  Looks like a first run. Get started with:\n"));
    console.log("  " + pc.cyan("clawde setup") + "\n");
  } else {
    console.log(pc.dim("  Commands: ") + pc.cyan("setup  chat  start  doctor") + pc.dim("   (clawde --help)\n"));
  }
});

program.parseAsync(process.argv).catch((err) => {
  log.error((err as Error).message);
  process.exit(1);
});

// ── helpers ───────────────────────────────────────────────────────────────

function requireConfig(): void {
  if (!configExists()) {
    log.error("No config found. Run `clawde setup` first. 🦞");
    process.exit(1);
  }
}

async function startCommand(withTerminal: boolean): Promise<void> {
  const config = loadConfig();
  const assistant = new Assistant(config);
  const connectors: Connector[] = buildConnectors(config);

  if (connectors.length === 0 && !withTerminal) {
    log.warn("No chat apps are enabled. Run `clawde setup`, or try `clawde chat`.");
    return;
  }

  console.log(banner());

  // A quick brain check so failures are obvious up front (non-fatal).
  const ping = await assistant.llm.ping();
  if (ping.ok) log.ok(`brain online · model ${config.llm.model}`);
  else log.warn(`Ollama not reachable yet (${ping.error ?? "no response"}) — I'll keep trying when messages arrive.`);

  for (const connector of connectors) {
    try {
      await connector.start(assistant);
    } catch (err) {
      log.error(`[${connector.name}] failed to start: ${(err as Error).message}`);
    }
  }

  if (withTerminal) {
    await new TerminalConnector().start(assistant);
    return;
  }

  if (connectors.length > 0) {
    log.info(`Listening on: ${connectors.map((c) => c.name).join(", ")}. Press Ctrl+C to stop.`);
  }

  const shutdown = async () => {
    log.info("Scuttling off… 🦞");
    await Promise.allSettled(connectors.map((c) => c.stop()));
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  // Keep the process alive for the event-driven connectors.
  await new Promise<void>(() => {});
}

async function doctor(): Promise<void> {
  console.log(banner());

  if (!configExists()) {
    log.warn(`No config yet at ${configPath()}. Run \`clawde setup\`.`);
    return;
  }
  const config = loadConfig();
  log.ok(`config: ${configPath()}`);

  // Model
  const ping = await new OllamaClient(config.llm).ping();
  if (ping.ok) {
    const has = ping.models.includes(config.llm.model);
    log.ok(`ollama: reachable at ${config.llm.host}`);
    if (has) log.ok(`model: ${config.llm.model} installed`);
    else log.warn(`model "${config.llm.model}" not installed — run: ollama pull ${config.llm.model}`);
  } else {
    log.error(`ollama: not reachable at ${config.llm.host} (${ping.error}). Try \`ollama serve\`.`);
  }

  // Voice
  if (config.voice.enabled) {
    const ok = config.voice.sttBin && config.voice.sttModel;
    if (ok) log.ok("voice: configured");
    else log.warn("voice: enabled but binaries/models are missing — re-run `clawde setup`.");
  } else {
    log.info("voice: disabled");
  }

  // Connectors
  console.log("");
  for (const s of connectorStatus(config)) {
    if (!s.enabled) log.info(`${s.name.padEnd(9)} disabled`);
    else if (s.ready) log.ok(`${s.name.padEnd(9)} ready`);
    else log.warn(`${s.name.padEnd(9)} enabled but missing credentials`);
  }
  console.log("\n" + pc.dim("Tip: `clawde chat` to talk locally, `clawde start` to go live.\n"));
}
