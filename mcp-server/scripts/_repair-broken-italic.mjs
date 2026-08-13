import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { repairBrokenItalicMarkup } from "./_lib/pipeline-helpers.mjs";

const data = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data");
let files = 0;
let changed = 0;

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      walk(p);
    } else if (name.endsWith(".md") && (p.includes("forge-docs") || p.includes("fabric-wiki"))) {
      files++;
      const raw = readFileSync(p, "utf8");
      let next = repairBrokenItalicMarkup(raw);
      next = next.replace(/enable_\$\{1\}_numbers/g, "enable_line_numbers");
      if (next !== raw) {
        writeFileSync(p, next, "utf8");
        changed++;
      }
    }
  }
}

walk(data);
console.log(JSON.stringify({ files, changed }));
