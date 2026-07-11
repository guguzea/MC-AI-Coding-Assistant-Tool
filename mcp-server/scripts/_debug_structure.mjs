import { readFileSync } from "fs";

const html = readFileSync("H:/MC_skill/mcp-server/scripts/_debug_raw.html", "utf8");

const articleStartIdx = html.indexOf("class=\"theme-doc-markdown markdown\"");
console.log("Article start:", articleStartIdx);

const markers = [
  ["</article>", html.indexOf("</article>")],
  ['class="docMainContainer"', html.indexOf("class=\"docMainContainer\"")],
  ['class="tocCollapsible"', html.indexOf("class=\"tocCollapsible\"")],
];

for (const [name, idx] of markers) {
  if (idx >= 0 && idx > articleStartIdx) {
    console.log(name + " at:", idx, "(offset:", idx - articleStartIdx, ")");
    console.log("  Context:", JSON.stringify(html.slice(Math.max(0, idx - 30), idx + 50)));
  }
}

const docMainEnd = html.indexOf("</div>", html.indexOf("class=\"docMainContainer\""));
const tocStart = html.indexOf("tocCollapsible", docMainEnd);
console.log("\ndocMainContainer ends at:", docMainEnd);
console.log("tocCollapsible starts at:", tocStart);
console.log("Article end guess:", tocStart > 0 ? tocStart : docMainEnd);
console.log("Expected article length:", (tocStart > 0 ? tocStart : docMainEnd) - articleStartIdx - 38);
