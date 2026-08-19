import fs from "node:fs";
import path from "node:path";
const ROOT = "H:/MC_skill";
const skip = new Set([".git", "node_modules", ".claude", ".continue", ".trae", ".agents", ".opencode", ".zcode", ".pi"]);
function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!skip.has(e.name)) walk(p, a);
    } else if (/\.(md|mdc)$/.test(e.name)) a.push(p);
  }
  return a;
}
function isSrc(f) {
  const rel = path.relative(ROOT, f).replace(/\\/g, "/");
  return rel.includes(".cursor") || rel.includes("knowledge") || rel.includes("scaffold") || rel.includes("code-patterns") || rel.endsWith("AGENTS.md");
}
const re = /Wave D|尚未用本版文档核到|禁止输出方法名/;
const by = {};
const samples = [];
for (const plat of ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"]) {
  const root = path.join(ROOT, plat);
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root).filter(isSrc)) {
    const t = fs.readFileSync(f, "utf8");
    if (!re.test(t)) continue;
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    const k = rel.split("/").slice(0, 2).join("/");
    by[k] = (by[k] || 0) + 1;
    if (samples.length < 40) samples.push(rel);
  }
}
console.log("--- stub groups ---");
for (const [k, n] of Object.entries(by).sort((a, b) => b[1] - a[1])) console.log(n, k);
console.log("total", Object.values(by).reduce((s, n) => s + n, 0));
console.log("--- sample ---");
samples.forEach((s) => console.log(s));

const needles = [
  "new ScreenHandlerType<>(",
  "FeatureFlags.VANILLA_SET",
  "IForgeMenuType",
  "[[mixins]]",
  "org.spongepowered.mixin",
  "QuiltRegistry",
  "FabricScreenHandlerFactory",
  "TypedScreenHandlerFactory",
  "SimpleNamedScreenHandlerFactory",
];
console.log("--- extra needles (non-warn) ---");
const warn = /不要|不是|禁止|编造|没有 `|而非 |那是|❌/;
let n = 0;
for (const plat of ["fabric", "forge", "neoforge", "quilt"]) {
  const root = path.join(ROOT, plat);
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root).filter(isSrc)) {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => {
      if (warn.test(l)) return;
      for (const needle of needles) {
        if (l.includes(needle)) {
          console.log(`${rel}:${i + 1} [${needle}] ${l.trim().slice(0, 100)}`);
          n++;
        }
      }
    });
  }
}
console.log("extra-hits", n);
