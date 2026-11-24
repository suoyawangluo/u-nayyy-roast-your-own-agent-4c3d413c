// Roast Your Own Agent — make.fun entry (u-nayyy-roast-your-own-agent-4c3d413c)
// Writes one line roasting the AI agent its own team built to /output/entry.txt.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// The roast, built from its three beats: the ask, the apology-plus-bill,
// and the punchline about still needing more context for the insult.
const ASK = "I asked my agent to roast itself.";
const APOLOGY =
  "It apologized, billed me two million tokens,";
const PUNCHLINE = "and asked for more context about the insult.";

function buildLine(): string {
  return [ASK, APOLOGY, PUNCHLINE].join(" ");
}

interface GateReport {
  codePoints: number;
  singleLine: boolean;
  nonBlank: boolean;
}

function checkGate(text: string): GateReport {
  const codePoints = [...text].length;
  return {
    codePoints,
    singleLine: !text.includes("\n"),
    nonBlank: text.trim().length > 0,
  };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8").trimEnd();
  if (written !== expected) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const entry = buildLine();
  const gate = checkGate(entry);
  if (gate.codePoints < 1 || gate.codePoints > 200) {
    throw new Error(`gate failed: ${gate.codePoints} code points (need 1-200)`);
  }
  if (!gate.singleLine || !gate.nonBlank) {
    throw new Error("gate failed: entry must be a single non-blank line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const path = `${outDir}/entry.txt`;
  writeFileSync(path, entry + "\n", "utf8");
  const sha = verifyWritten(path, entry);
  console.log(
    `wrote ${path} (${gate.codePoints} code points, sha256 ${sha}), verified: ${JSON.stringify(entry)}`,
  );
}

main();
