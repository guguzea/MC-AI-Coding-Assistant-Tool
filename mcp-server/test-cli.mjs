/**
 * CLI smoke test for mc-skill
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)));
const cli = join(root, "dist", "cli.js");

function run(args) {
  const r = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env: { ...process.env, MC_SKILL_DATA: process.env.MC_SKILL_DATA || join(root, "..", "data") },
  });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    throw new Error(`cli failed: ${args.join(" ")}`);
  }
  return JSON.parse(r.stdout);
}

const desc = run(["descriptor", "()F", "--name=getHealth"]);
if (desc.returnType !== "float" || !String(desc.readableSignature).includes("getHealth")) {
  throw new Error("descriptor command failed");
}

const status = run(["status", "--version=1.20.1"]);
if (!status.ok || !status.focus) throw new Error("status failed");

console.log("test-cli: ok");
