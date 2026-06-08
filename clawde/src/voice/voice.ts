import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { VoiceConfig } from "../config/schema.js";
import { log } from "../util/logger.js";

/**
 * Fully-local voice I/O.
 *
 * Speech-to-text uses whisper.cpp (a small, fast, offline transcriber) and
 * text-to-speech uses piper (a local neural TTS). Both are invoked as external
 * binaries, so there are no cloud calls and no heavyweight npm dependencies —
 * point Clawde at the binaries during `clawde setup`.
 *
 * If voice is disabled or the binaries aren't configured, every method degrades
 * gracefully (transcribe → "", speak → null) so the assistant keeps working as
 * a text bot.
 */
export class Voice {
  constructor(private cfg: VoiceConfig) {}

  get enabled(): boolean {
    return this.cfg.enabled;
  }

  /** Convert an audio buffer (ogg/opus, wav, mp3…) to text. */
  async transcribe(audio: Buffer): Promise<string> {
    if (!this.cfg.enabled || !this.cfg.sttBin || !this.cfg.sttModel) return "";
    const dir = mkdtempSync(join(tmpdir(), "clawde-stt-"));
    const inFile = join(dir, "in.audio");
    const wavFile = join(dir, "in.wav");
    try {
      writeFileSync(inFile, audio);
      // whisper.cpp wants 16kHz mono PCM wav; transcode with ffmpeg if present.
      await this.toWav(inFile, wavFile).catch(() => {
        // No ffmpeg? Try feeding the original; many builds accept wav directly.
        writeFileSync(wavFile, audio);
      });

      const outBase = join(dir, "out");
      // whisper.cpp: -otxt writes <outBase>.txt
      await run(this.cfg.sttBin, [
        "-m", this.cfg.sttModel,
        "-f", wavFile,
        "-otxt",
        "-of", outBase,
        "-nt", // no timestamps
      ]);
      const txt = outBase + ".txt";
      const text = existsSync(txt) ? readFileSync(txt, "utf8").trim() : "";
      return text;
    } catch (err) {
      log.warn(`Voice transcription failed: ${(err as Error).message}`);
      return "";
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  /** Synthesize speech for `text`, returning a WAV buffer (or null on failure). */
  async speak(text: string): Promise<Buffer | null> {
    if (!this.cfg.enabled || !this.cfg.ttsBin || !this.cfg.ttsModel) return null;
    const dir = mkdtempSync(join(tmpdir(), "clawde-tts-"));
    const outFile = join(dir, "out.wav");
    try {
      // piper reads text on stdin and writes a wav to --output_file.
      await run(
        this.cfg.ttsBin,
        ["--model", this.cfg.ttsModel, "--output_file", outFile],
        text,
      );
      return existsSync(outFile) ? readFileSync(outFile) : null;
    } catch (err) {
      log.warn(`Voice synthesis failed: ${(err as Error).message}`);
      return null;
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  private toWav(input: string, output: string): Promise<void> {
    return run("ffmpeg", ["-y", "-i", input, "-ar", "16000", "-ac", "1", output]);
  }
}

function run(bin: string, args: string[], stdin?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["pipe", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${bin} exited ${code}: ${stderr.slice(0, 300)}`)),
    );
    if (stdin !== undefined) {
      child.stdin.write(stdin);
      child.stdin.end();
    }
  });
}
