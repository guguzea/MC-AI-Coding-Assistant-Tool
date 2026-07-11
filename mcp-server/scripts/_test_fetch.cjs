import { execSync } from "child_process";
import { writeFileSync } from "fs";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const url = process.argv[2] || "https://docs.neoforged.net/docs/concepts/registries/";

const cmd = `curl -s -L -A "${USER_AGENT}" -w "\\n__HTTP_CODE__:%{http_code}__" "${url}"`;
console.log("Running:", cmd.substring(0, 100) + "...");

try {
  const raw = execSync(cmd, { timeout: 45000, maxBuffer: 10 * 1024 * 1024 });
  const full = raw.toString("utf8");
  const statusMatch = full.match(/__HTTP_CODE__:(\d+)__/);
  const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
  const html = full.replace(/__HTTP_CODE__:\d+__\n?$/, "");

  console.log("Status:", status);
  console.log("Length:", html.length);
  console.log("Has <pre>:", html.includes("<pre"));
  console.log("Has </pre>:", html.includes("</pre>"));

  writeFileSync("H:/MC_skill/mcp-server/scripts/_test_curl_output.txt", html, "utf8");
  console.log("Written to _test_curl_output.txt");
} catch (err) {
  console.error("Error:", err.message);
}
