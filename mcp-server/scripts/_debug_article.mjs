import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const url = "https://docs.neoforged.net/docs/concepts/registries/";
const cmd = "curl -s -L -A \"" + USER_AGENT + "\" \"" + url + "\"";
const raw = execSync(cmd, { timeout: 30000, maxBuffer: 10 * 1024 * 1024 });
const html = raw.toString("utf8");

// Write raw HTML for analysis
writeFileSync("H:/MC_skill/mcp-server/scripts/_debug_raw.html", html, "utf8");
console.log("HTML length:", html.length);

// Test article extraction
const articleMatch = html.match(/<article[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
console.log("Article match:", articleMatch ? articleMatch[1].length : "NULL");

// Test div extraction
const divMatch = html.match(/<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
console.log("Div matches:", divMatch ? divMatch.length : "NULL");
if (divMatch && divMatch.length > 0) {
  console.log("First div match length:", divMatch[0].length);
  // Check for </pre>
  console.log("Has </pre> in first div:", divMatch[0].includes("</pre>"));
  writeFileSync("H:/MC_skill/mcp-server/scripts/_debug_article.txt", divMatch ? divMatch[0] : "NOT FOUND", "utf8");
}
