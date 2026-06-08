import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import type { Connector } from "./connector.js";
import type { Assistant } from "../core/assistant.js";
import { log, pc } from "../util/logger.js";
import { quips, pick } from "../core/personality.js";

/**
 * A local REPL so you can chat with Clawde straight from the terminal — handy
 * for testing your model and persona before wiring up the chat apps. This is
 * what `clawde chat` uses.
 */
export class TerminalConnector implements Connector {
  readonly name = "terminal";
  private rl?: ReturnType<typeof createInterface>;

  async start(assistant: Assistant): Promise<void> {
    const chatId = "terminal:local";
    console.log(pc.red("\n🦞  " + pick(quips.boot)));
    console.log(pc.dim("   Type a message. Commands: /reset, /help, or Ctrl+C to leave.\n"));

    const rl = createInterface({ input: stdin, output: stdout });
    this.rl = rl;
    const prompt = () => stdout.write(pc.cyan("you ▸ "));
    prompt();

    rl.on("line", async (line) => {
      const text = line.trim();
      if (!text) return prompt();
      stdout.write(pc.red("🦞 ▸ "));
      try {
        // Built-in commands return immediately and don't stream.
        if (text.toLowerCase() === "/reset" || text.toLowerCase() === "/help") {
          const out = await assistant.handle({
            connector: "terminal", chatId, userId: "you", text, isDirect: true,
          });
          stdout.write((out?.text ?? "") + "\n\n");
        } else {
          await assistant.stream(chatId, text, (tok) => stdout.write(tok));
          stdout.write("\n\n");
        }
      } catch (err) {
        stdout.write("\n");
        log.error((err as Error).message);
      }
      prompt();
    });

    rl.on("close", () => {
      console.log(pc.dim("\nBack to the tank. 🦞"));
      process.exit(0);
    });

    // Keep the promise pending; the REPL owns the process lifetime.
    await new Promise<void>(() => {});
  }

  async stop(): Promise<void> {
    this.rl?.close();
  }
}
