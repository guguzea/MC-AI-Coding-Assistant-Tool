import { execSync } from "child_process";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchPage(url, retries = 3) {
  const delays = [500, 1000, 2000];
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const cmd = "curl -s -L -A \"" + USER_AGENT + "\" -w \"\\n__HTTP_CODE__:%{http_code}__\" \"" + url + "\"";
      const raw = execSync(cmd, { timeout: 45000, maxBuffer: 10 * 1024 * 1024 });
      const full = raw.toString("utf8");
      const statusMatch = full.match(/__HTTP_CODE__:(\d+)__/);
      const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
      const html = full.replace(/__HTTP_CODE__:\d+__\n?$/, "");
      if (html.length < 5000 && attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: status >= 200 && status < 400, status, html, url };
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: false, status: 0, html: null, url, error: err.message };
    }
  }
}

const url = "https://docs.neoforged.net/docs/concepts/registries/";
console.log("Fetching:", url);
const result = await fetchPage(url);
console.log("Status:", result.status, "Length:", result.html ? result.html.length : "null");
console.log("Has </pre>:", result.html ? result.html.includes("</pre>") : false);
if (result.html && result.html.length < 10000) {
  console.log("FIRST 200:", result.html.substring(0, 200));
}
