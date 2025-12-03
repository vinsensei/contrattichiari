import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "project-snapshot.md");

// Config
const INCLUDE_DIRS = ["src/app", "src/components", "src/lib"];
const IMPORTANT_FILES = [
  "package.json",
  "next.config.js",
  "eslint.config.mjs",
  ".env.example",
];
const MAX_BYTES_PER_FILE = 60_000; // ~60 KB per file

function walk(dir) {
  let res = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) res = res.concat(walk(p));
    else res.push(p);
  }
  return res;
}

function maskSecrets(text) {
  return text
    .replace(/(api[_-]?key\s*=\s*)(.+)/gi, "$1***")
    .replace(/(OPENAI_API_KEY|SUPABASE_[A-Z_]+|NEXT_PUBLIC_[A-Z_]+)\s*=\s*.*/g, "$1=***");
}

function safeRead(p) {
  try {
    let buf = fs.readFileSync(p);
    if (buf.length > MAX_BYTES_PER_FILE) {
      buf = buf.subarray(0, MAX_BYTES_PER_FILE);
    }
    return maskSecrets(buf.toString("utf8"));
  } catch {
    return "";
  }
}

function listApiRoutes() {
  const apiDir = path.join(ROOT, "src/app/api");
  if (!fs.existsSync(apiDir)) return [];
  return walk(apiDir)
    .filter(f => f.endsWith("route.js") || f.endsWith("route.ts"))
    .map(f => f.replace(ROOT + path.sep, ""));
}

function tree(dir) {
  const rel = dir.replace(ROOT + path.sep, "");
  const files = walk(dir).map(f => f.replace(ROOT + path.sep, ""));
  return ["```", rel, ...files.map(f => "- " + f), "```"].join("\n");
}

function main() {
  let out = [];
  out.push("# Project Snapshot\n");

  // Tree
  for (const d of INCLUDE_DIRS) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) {
      out.push(`## Tree: ${d}\n`);
      out.push(tree(abs));
      out.push("");
    }
  }

  // Important top-level files
  out.push("## Important files\n");
  for (const f of IMPORTANT_FILES) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      out.push(`### ${f}\n`);
      out.push("```");
      out.push(safeRead(p));
      out.push("```\n");
    }
  }

  // API routes (content)
  out.push("## API Routes (content excerpt)\n");
  for (const route of listApiRoutes()) {
    out.push(`### ${route}\n`);
    out.push("```");
    out.push(safeRead(path.join(ROOT, route)));
    out.push("```\n");
  }

  // Components & key pages (first N files)
  const pages = walk(path.join(ROOT, "src/app"))
    .filter(f => /\.(page|layout)\.(jsx?|tsx?)$/.test(f))
    .slice(0, 50);
  if (pages.length) {
    out.push("## Pages & Layouts (excerpt)\n");
    for (const p of pages) {
      out.push(`### ${p.replace(ROOT + path.sep, "")}\n`);
      out.push("```");
      out.push(safeRead(p));
      out.push("```\n");
    }
  }

  fs.writeFileSync(OUT, out.join("\n"), "utf8");
  console.log(`Snapshot scritto in ${OUT}`);
}

main();