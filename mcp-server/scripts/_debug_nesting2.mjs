import { readFileSync } from "fs";

const html = readFileSync("H:/MC_skill/mcp-server/scripts/_debug_raw.html", "utf8");

// Strip nav/sidebar/footer etc. like the real function
let text = html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
  .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
  .replace(/<div[^>]*class="[^"]*navbar[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
  .replace(/<aside[^>]*class="[^"]*theme-doc-sidebar[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, "")
  .replace(/<nav[^>]*class="[^"]*breadcrumbs[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
  .replace(/<span[^>]*class="[^"]*theme-doc-version-badge[^"]*"[^>]*>[^<]*<\/span>/gi, "")
  .replace(/<div[^>]*class="[^"]*theme-doc-toc[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
  .replace(/<nav[^>]*class="[^"]*pagination-nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
  .replace(/<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>[\s\S]*?<\/button>/gi, "")
  .replace(/<a[^>]*class="[^"]*skipToContent[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
  .replace(/<header[^>]*>/gi, "").replace(/<\/header>/gi, "");

// Nesting-aware article extraction
const outerMatch = text.match(/(<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>)([\s\S]*)/i);
if (!outerMatch) {
  console.log("No theme-doc-markdown found");
  process.exit(0);
}

const inner = outerMatch[2];
console.log("Inner length:", inner.length, "chars");

let depth = 1;
let end = 0;
let pos = 0;
let divCount = 0;

while (pos < inner.length) {
  const rest = inner.slice(pos);
  if (rest.startsWith("<div")) {
    divCount++;
    depth++;
    const closeBracket = inner.indexOf(">", pos);
    pos = closeBracket + 1;
  } else if (rest.startsWith("</div>")) {
    depth--;
    if (depth === 0) { end = pos; break; }
    pos += 6;
  } else {
    pos++;
  }
}

if (end > 0) {
  const article = inner.slice(0, end);
  console.log("Article extracted:", article.length, "chars");
  console.log("Divs encountered:", divCount);
  console.log("Has </pre>:", article.includes("</pre>"));
  console.log("Has DeferredRegister:", article.includes("DeferredRegister"));
  console.log("First 200:", article.substring(0, 200));
  console.log("Last 200:", article.substring(article.length - 200));
} else {
  console.log("No closing </div> found. depth:", depth, "divCount:", divCount);
}
