import { execSync } from "child_process";
import { readFileSync } from "fs";

const html = readFileSync("H:/MC_skill/mcp-server/scripts/_debug_raw.html", "utf8");

// Check where the code block lives in the full HTML
const preIdx = html.indexOf("<pre tabindex");
console.log("Pre in full HTML at:", preIdx);

// Find the closing </pre>
const closePreIdx = html.indexOf("</pre>");
console.log("Close pre at:", closePreIdx);

// What div contains the pre block?
// Find the containing div's class
const beforePre = html.substring(0, preIdx);
const lastDiv = beforePre.lastIndexOf("<div");
const lastDivMatch = beforePre.substring(lastDiv - 1, lastDiv + 500);
console.log("Container div:", JSON.stringify(lastDivMatch.slice(0, 300)));

// Find the containing article or main content div
const beforePre2 = beforePre.slice(-500);
console.log("500 chars before pre:", JSON.stringify(beforePre2));

// Check if theme-doc-markdown contains the pre
const articleMatch = html.match(/<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
const article = articleMatch ? articleMatch[1] : "";
console.log("\nArticle length:", article.length);
console.log("Article has pre:", article.includes("<pre"));
console.log("Article end:", JSON.stringify(article.slice(-100)));

// Look for where in the full HTML the code block lives relative to theme-doc-markdown
const articleEndIdx = html.indexOf("</div>", html.indexOf("theme-doc-markdown"));
console.log("\ntheme-doc-markdown closes at:", articleEndIdx);
console.log("pre tag is at:", preIdx);
console.log("pre comes AFTER article:", preIdx > articleEndIdx);
