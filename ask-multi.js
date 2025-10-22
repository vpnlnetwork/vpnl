import fs from "fs";
import path from "path";
import readline from "node:readline";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- config you can tweak ---
const ALLOWED_EXT = new Set([
  ".sol",".ts",".tsx",".js",".jsx",".json",".md",".yml",".yaml",".graphql",".txt"
]);
const IGNORE_DIRS = new Set([
  "node_modules",".git","artifacts","cache","out","dist","build",".next",
  ".vercel",".turbo",".idea",".vscode","typechain-types","demo/node_modules"
]);
const PER_FILE_CHAR_LIMIT = 12000;     // truncate long files
const TOTAL_BUNDLE_CHAR_LIMIT = 100000; // cap total sent to the API
// --------------------------------

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

function isDir(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }
function isFile(p) { try { return fs.statSync(p).isFile(); } catch { return false; } }

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    // skip ignored directories
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      yield* walk(path.join(dir, e.name));
    } else if (e.isFile()) {
      yield path.join(dir, e.name);
    }
  }
}

function collectPaths(input) {
  const pieces = input.split(",").map(s => s.trim()).filter(Boolean);
  const files = [];
  for (const p of pieces) {
    if (isFile(p)) files.push(p);
    else if (isDir(p)) for (const f of walk(p)) files.push(f);
    else console.warn(`⚠️  Not found: ${p}`);
  }
  // filter by extension
  return files.filter(f => ALLOWED_EXT.has(path.extname(f).toLowerCase()));
}

function loadBundle(filePaths) {
  let total = 0;
  let used = [];
  let skipped = [];

  const chunks = [];
  for (const f of filePaths) {
    if (!fs.existsSync(f)) { skipped.push([f,"missing"]); continue; }
    let text = fs.readFileSync(f, "utf8");
    let truncated = false;
    if (text.length > PER_FILE_CHAR_LIMIT) {
      text = text.slice(0, PER_FILE_CHAR_LIMIT) + "\n…[truncated]\n";
      truncated = true;
    }
    const header = `\n===== FILE: ${f} =====\n`;
    const block = header + text;

    if (total + block.length > TOTAL_BUNDLE_CHAR_LIMIT) {
      skipped.push([f,"bundle limit"]);
      continue;
    }
    total += block.length;
    chunks.push(block);
    used.push([f, truncated]);
  }

  return { payload: chunks.join("\n"), used, skipped, total };
}

async function main() {
  console.log("🔎 Ask Claude About MULTIPLE Files\n");
  const target = await ask("Path(s) to analyze (folder or comma-separated list): ");
  const question = await ask("Your question for Claude: ");
  rl.close();

  const files = collectPaths(target);
  if (files.length === 0) {
    console.error("❌ No matching files found for your input (or all filtered by extension).");
    process.exit(1);
  }

  // Prefer a stable ordering for reproducibility
  files.sort((a,b) => a.localeCompare(b));
  const { payload, used, skipped, total } = loadBundle(files);

  console.log(`\n📦 Included ${used.length} file(s), payload ~${total.toLocaleString()} chars`);
  for (const [f, trunc] of used) {
    console.log(`  • ${f}${trunc ? "  (truncated)" : ""}`);
  }
  if (skipped.length) {
    console.log(`\n⚠️ Skipped ${skipped.length} file(s):`);
    for (const [f, reason] of skipped) console.log(`  – ${f} (${reason})`);
  }

  const messages = [
    {
      role: "user",
      content:
`You are an expert reviewer. Analyze the following project files and answer the question.

Guidelines:
- Be concise and specific.
- If relevant, reference file names in your answer.
- If you see security or design risks, call them out clearly.
- If you need more files, list exactly which ones.

=== QUESTION ===
${question}

=== PROJECT BUNDLE BEGIN ===
${payload}
=== PROJECT BUNDLE END ===`
    }
  ];

  const res = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1800,
    messages
  });

  const answer = res.content?.[0]?.text?.trim() ?? "[no reply]";
  console.log("\n🧠 Claude's Analysis:\n");
  console.log(answer);
}

main().catch(err => {
  console.error("\nError:", err?.message || err);
  process.exit(1);
});
