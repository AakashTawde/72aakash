import pc from "picocolors";

/** A little lobster ASCII banner shown by the wizard and `clawde` with no args. */
export function banner(): string {
  const art = [
    "      (\\/)   (\\/)",
    "       \\ \\___/ /",
    "        \\_   _/      ",
    "  ,_____/ (_) \\_____,   ",
    "   \\_______________/    ",
    "      C L A W D E       ",
  ].join("\n");
  return "\n" + pc.red(art) + "\n" + pc.dim("   your private, local-first lobster 🦞") + "\n";
}
