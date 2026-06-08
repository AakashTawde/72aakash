export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Lightweight per-conversation memory. Each chat (DM, channel, group) gets its
 * own rolling window of recent turns so Clawde stays coherent without unbounded
 * growth. This is intentionally in-memory: it's private, fast, and disappears
 * when you stop the process. `/reset` clears a single conversation.
 */
export class Memory {
  private store = new Map<string, ChatTurn[]>();

  constructor(private readonly maxTurns: number) {}

  history(chatId: string): ChatTurn[] {
    return this.store.get(chatId) ?? [];
  }

  append(chatId: string, turn: ChatTurn): void {
    const turns = this.store.get(chatId) ?? [];
    turns.push(turn);
    // Keep the last `maxTurns` *pairs* → maxTurns * 2 messages.
    const cap = Math.max(2, this.maxTurns * 2);
    if (turns.length > cap) turns.splice(0, turns.length - cap);
    this.store.set(chatId, turns);
  }

  reset(chatId: string): void {
    this.store.delete(chatId);
  }

  resetAll(): void {
    this.store.clear();
  }
}
