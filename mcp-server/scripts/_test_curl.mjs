const { execSync } = require("child_process");
const url = process.argv[2] || "https://docs.neoforged.net/docs/concepts/registries/";
const cmd = `curl -s -L -A "Mozilla/5.0" "${url}"`;
const raw = execSync(cmd, { timeout: 30000, maxBuffer: 10 * 1024 * 1024 });
const html = raw.toString("utf8");
console.log("Length:", html.length);
console.log("Has pre:", html.includes("<pre"));
console.log("Has </pre>:", html.includes("</pre>"));
if (html.length < 10000) console.log("TRUNCATED!");
