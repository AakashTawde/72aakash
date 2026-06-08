import { test } from "node:test";
import assert from "node:assert/strict";

import { shouldRespond } from "../src/core/message.js";
import { Memory } from "../src/core/memory.js";
import { buildSystemPrompt } from "../src/core/personality.js";
import { withDefaults, defaultConfig } from "../src/config/schema.js";
import { addressedByName } from "../src/connectors/connector.js";

test("shouldRespond: always answers DMs with text", () => {
  assert.equal(shouldRespond({ connector: "x", chatId: "c", userId: "u", text: "hi", isDirect: true }), true);
});

test("shouldRespond: ignores empty messages", () => {
  assert.equal(shouldRespond({ connector: "x", chatId: "c", userId: "u", text: "   ", isDirect: true }), false);
});

test("shouldRespond: stays quiet in groups unless mentioned", () => {
  const base = { connector: "x", chatId: "c", userId: "u", text: "hello", isDirect: false };
  assert.equal(shouldRespond({ ...base, mentioned: false }), false);
  assert.equal(shouldRespond({ ...base, mentioned: true }), true);
});

test("Memory: trims to the configured window per chat", () => {
  const mem = new Memory(2); // keep 2 pairs = 4 messages
  for (let i = 0; i < 10; i++) {
    mem.append("a", { role: "user", content: `m${i}` });
  }
  const hist = mem.history("a");
  assert.equal(hist.length, 4);
  assert.equal(hist[0]!.content, "m6");
  assert.equal(hist[3]!.content, "m9");
});

test("Memory: conversations are isolated and resettable", () => {
  const mem = new Memory(5);
  mem.append("a", { role: "user", content: "x" });
  mem.append("b", { role: "user", content: "y" });
  assert.equal(mem.history("a").length, 1);
  assert.equal(mem.history("b").length, 1);
  mem.reset("a");
  assert.equal(mem.history("a").length, 0);
  assert.equal(mem.history("b").length, 1);
});

test("buildSystemPrompt: reflects name, sass, and personal facts", () => {
  const prompt = buildSystemPrompt({ name: "Pinchy", sass: "spicy", about: "Lives in Goa." });
  assert.match(prompt, /Pinchy/);
  assert.match(prompt, /lobster/i);
  assert.match(prompt, /Goa/);
});

test("withDefaults: fills missing fields and bumps version", () => {
  const cfg = withDefaults({ persona: { name: "Bob" } } as any);
  assert.equal(cfg.persona.name, "Bob");
  assert.equal(cfg.persona.sass, "balanced"); // default preserved
  assert.equal(cfg.llm.host, defaultConfig().llm.host);
  assert.equal(cfg.connectors.discord.enabled, false);
});

test("addressedByName: detects direct address in group text", () => {
  assert.equal(addressedByName("Clawde, what's the weather?", "Clawde"), true);
  assert.equal(addressedByName("hey @clawde", "Clawde"), true);
  assert.equal(addressedByName("totally unrelated chatter", "Clawde"), false);
});
