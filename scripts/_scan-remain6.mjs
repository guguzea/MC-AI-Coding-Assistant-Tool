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
const warn = /不要|禁止|不是|而非|那是|❌|本档没有|编造/;
const needles = [
  "fromNamespaceAndPath",
  "PayloadTypeRegistry.s2c",
  "PayloadTypeRegistry.c2s",
  "CustomPayloadRegistry",
  "FabricPacket",
  "Commands.literal",
  "CommandSourceStack",
  "TypedScreenHandlerFactory",
  "SimpleNamedWidget",
  "SimpleNamedScreenHandlerFactory",
  "QuiltRegistry.register",
  "modImplementation",
  "remapJar",
  "accessWidener class",
  "CallbackInfoReturnable",
  "EntityType.Builder.create",
  "dimensions(0.6f",
  "maxTrackingRange",
  "AnimalEntityRenderer",
  "gui.setScreen",
];
for (const plat of ["fabric", "forge", "neoforge", "quilt"]) {
  const root = path.join(ROOT, plat);
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root).filter(isSrc)) {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => {
      if (warn.test(l)) return;
      for (const n of needles) {
        if (l.includes(n)) console.log(`${rel}:${i + 1} [${n}] ${l.trim().slice(0, 120)}`);
      }
    });
  }
}
