import fs from "node:fs";
import path from "node:path";
const ROOT = "H:/MC_skill";
const skip = new Set([".git","node_modules",".claude",".continue",".trae",".agents",".opencode",".zcode",".pi"]);
function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!skip.has(e.name)) walk(p, a); }
    else if (/\.(md|mdc)$/.test(e.name)) a.push(p);
  }
  return a;
}
function isSrc(f) {
  const rel = path.relative(ROOT, f).replace(/\\/g, "/");
  return rel.includes(".cursor") || rel.includes("knowledge") || rel.includes("scaffold") || rel.includes("code-patterns") || rel.endsWith("AGENTS.md");
}
console.log("--- new Identifier in 1.21.x ---");
for (const v of ["1.21.1", "1.21.3", "1.21.11"]) {
  for (const f of walk(path.join(ROOT, "fabric", v)).filter(isSrc)) {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    fs.readFileSync(f, "utf8").split("\n").forEach((l, i) => {
      if (l.includes("new Identifier(")) console.log(rel + ":" + (i + 1) + " " + l.trim().slice(0, 120));
    });
  }
}
console.log("--- 0.7.+ non-warn ---");
for (const plat of ["fabric", "forge", "neoforge"]) {
  for (const f of walk(path.join(ROOT, plat)).filter(isSrc)) {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    fs.readFileSync(f, "utf8").split("\n").forEach((l, i) => {
      if (l.includes("0.7.+") && !/没有|不要写|禁止|不是/.test(l)) {
        console.log(rel + ":" + (i + 1) + " " + l.trim().slice(0, 140));
      }
    });
  }
}
console.log("--- ScreenHandlerType single-arg 1.19+ ---");
for (const v of ["1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.3", "1.21.11"]) {
  for (const f of walk(path.join(ROOT, "fabric", v)).filter(isSrc)) {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    fs.readFileSync(f, "utf8").split("\n").forEach((l, i) => {
      if (l.includes("new ScreenHandlerType<>(MyScreenHandler::new)") && !l.includes("VANILLA_FEATURES")) {
        console.log(rel + ":" + (i + 1));
      }
    });
  }
}
