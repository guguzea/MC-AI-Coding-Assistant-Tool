import { execSync } from "child_process";
import { readFileSync } from "fs";

const html = readFileSync("H:/MC_skill/mcp-server/scripts/_debug_raw.html", "utf8");

// Find the first <pre> in the article
const articleMatch = html.match(/<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
const article = articleMatch ? articleMatch[1] : "";

// Find <pre> position in article
const preIdx = article.indexOf("<pre");
console.log("Pre position in article:", preIdx);
if (preIdx >= 0) {
  // Show 300 chars around pre
  console.log("Around pre:", JSON.stringify(article.substring(preIdx - 20, preIdx + 300)));
  // Count pre and </pre>
  const preCount = (article.match(/<pre/gi) || []).length;
  const closePreCount = (article.match(/<\/pre>/gi) || []).length;
  console.log("Pre count:", preCount, "Close pre count:", closePreCount);
}

// Check what the last 200 chars before the closing </div> look like
const last200 = article.slice(-200);
console.log("Last 200 chars:", JSON.stringify(last200));

// Check the entire article for the complete code block
const codeBlockIdx = article.indexOf("DeferredRegister");
console.log("Code block content at DeferredRegister:", JSON.stringify(article.substring(codeBlockIdx, codeBlockIdx + 500)));
