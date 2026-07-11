import { readFileSync } from "fs";

const html = readFileSync("H:/MC_skill/mcp-server/scripts/_debug_raw.html", "utf8");

// Find the theme-doc-markdown div
const startMatch = html.match(/<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>/i);
if (!startMatch) { console.log("NOT FOUND"); process.exit(0); }
const startIdx = startMatch.index;
const startTag = startMatch[0];
console.log("Start tag:", startTag);
console.log("Start index:", startIdx);

// Trace depth from start
let depth = 1;
let i = startIdx + startTag.length;
let step = 0;
const MAX_STEPS = 1000;

console.log("\nTracing depth from start...");
while (i < html.length && depth > 0 && step < MAX_STEPS) {
  step++;
  const remaining = html.length - i;
  if (html.slice(i, i + 5) === "<div>") {
    depth++;
    i += 5;
    if (depth <= 3) console.log("  depth", depth, "OPEN (pos", i, "):", html.slice(i - 10, i + 20));
  } else if (html.slice(i, i + 6) === "</div>") {
    if (depth <= 3) console.log("  depth", depth, "CLOSE (pos", i, ")");
    depth--;
    i += 6;
  } else {
    i++;
  }
}

if (depth === 0) {
  console.log("\nArticle ends at position:", i - 6);
  console.log("Article length:", i - 6 - startIdx - startTag.length);
  console.log("Last 100 chars:", JSON.stringify(html.slice(i - 6 - 100, i - 6)));
} else {
  console.log("\nDid not find closing div after", MAX_STEPS, "steps. depth=", depth);
}
