import type { LlmConfig } from "../config/schema.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  /** Called with each token as it streams in (for the terminal REPL). */
  onToken?: (token: string) => void;
  signal?: AbortSignal;
}

export class LlmUnavailableError extends Error {}

/**
 * A minimal client for a local Ollama server. We talk to the HTTP API directly
 * with the built-in fetch — no SDK, no telemetry, nothing leaves the box.
 */
export class OllamaClient {
  constructor(private cfg: LlmConfig) {}

  get model(): string {
    return this.cfg.model;
  }

  /** Verify the server is reachable and report the installed models. */
  async ping(): Promise<{ ok: boolean; models: string[]; error?: string }> {
    try {
      const res = await fetch(`${this.cfg.host}/api/tags`, { method: "GET" });
      if (!res.ok) return { ok: false, models: [], error: `HTTP ${res.status}` };
      const data = (await res.json()) as { models?: Array<{ name: string }> };
      const models = (data.models ?? []).map((m) => m.name);
      return { ok: true, models };
    } catch (err) {
      return { ok: false, models: [], error: (err as Error).message };
    }
  }

  /**
   * Send a chat completion request. Streams the response so the terminal can
   * print tokens live; returns the full assembled text.
   */
  async chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
    let res: Response;
    try {
      res = await fetch(`${this.cfg.host}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: opts.signal,
        body: JSON.stringify({
          model: this.cfg.model,
          messages,
          stream: true,
          options: {
            temperature: this.cfg.temperature,
            ...(this.cfg.numPredict > 0 ? { num_predict: this.cfg.numPredict } : {}),
          },
        }),
      });
    } catch (err) {
      throw new LlmUnavailableError(
        `Cannot reach Ollama at ${this.cfg.host}: ${(err as Error).message}`,
      );
    }

    if (res.status === 404) {
      throw new LlmUnavailableError(
        `Model "${this.cfg.model}" isn't installed. Pull it with:  ollama pull ${this.cfg.model}`,
      );
    }
    if (!res.ok || !res.body) {
      throw new LlmUnavailableError(`Ollama returned HTTP ${res.status}.`);
    }

    return await this.consumeStream(res.body, opts.onToken);
  }

  private async consumeStream(
    body: ReadableStream<Uint8Array>,
    onToken?: (t: string) => void,
  ): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";

    // Ollama streams newline-delimited JSON objects.
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        try {
          const obj = JSON.parse(line) as {
            message?: { content?: string };
            error?: string;
          };
          if (obj.error) throw new LlmUnavailableError(obj.error);
          const tok = obj.message?.content;
          if (tok) {
            full += tok;
            onToken?.(tok);
          }
        } catch (err) {
          if (err instanceof LlmUnavailableError) throw err;
          // Ignore partial/non-JSON lines.
        }
      }
    }
    return full.trim();
  }
}
