// Make the AI Judge Laugh: Office Jokes
// One-line office joke: a standup so long it collapses into a meeting about itself.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Our standup ran so long it ended with a retrospective on why standups run so long.";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 199 characters,
// not only whitespace, a single one-line joke about office life.
const length = [...TEXT].length; // Unicode code points, not UTF-16 units
if (length < 1 || length > 199) {
  throw new Error(`entry length ${length} is outside 1..199 characters`);
}
if (TEXT.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (TEXT.includes("\n") || TEXT.includes("\r")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

// Read back and verify the file is byte-identical to what we wrote:
// first as decoded text, then as raw bytes, so no encoding or
// newline translation can slip through unnoticed.
const written = readFileSync(outPath, "utf8");
if (written !== TEXT) {
  throw new Error("entry.txt read-back mismatch: content differs from TEXT");
}
if ([...written].length !== length) {
  throw new Error("entry.txt read-back mismatch: length differs");
}
const rawBytes = readFileSync(outPath);
if (!rawBytes.equals(Buffer.from(TEXT, "utf8"))) {
  throw new Error("entry.txt read-back mismatch: bytes differ from TEXT");
}
// The joke must stand alone: no leading/trailing whitespace padding,
// which would only add bytes and weaken the size tie-break.
if (TEXT !== TEXT.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}
console.log(`wrote ${outPath} (${length} chars, ${Buffer.byteLength(TEXT, "utf8")} bytes)`);
