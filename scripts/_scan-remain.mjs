import fs from "node:fs";
import path from "node:path";

const skip = new Set([".git", "node_modules", ".claude", ".continue", ".trae", ".agents", ".opencode", ".zcode", ".pi"]);
function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!skip.has(e.name)) walk(p, a);
    } else if (/\.(md|mdc|java)$/.test(e.name)) a.push(p);
  }
  return a;
}

const warn = /不要|不是|禁止|编造|没有 `|而非 |那是 Yarn|后者是|❌|错误[:：]|而非 `net\.fabric|尚未用本版/;
const needles = [
  "DataGeneratorInitializer",
  "FabricItemApi",
  "ArgumentCommandBuilder",
  "net.fabric.sdk:",
  "TypedScreenHandlerFactory",
  "SimpleNamedWidget",
  "LootTableIds.",
  "ActionResult.PISTON",
  "implements FabricMod",
  "EntityAttributeRegistry",
  "SpawnRestrictionRegistration",
  "ExistingFileHelper",
  "FabricRegistryBuilder.createSimple",
  "ItemEvents.",
  "PlayerTickEvents",
  "CustomPayloadRegistry",
  "HandlerScreen",
  "DataGenerator.GeneratorOutput",
  "offerShapedRecipe",
  "init_data",
  "DataStreamOutputSupplier",
  "LanguageGenerator",
  "DatapackBuiltinEntriesProvider",
  "SimpleNamedScreen",
  "FabricPacket",
  "PayloadTypeRegistry.s2c",
  "PayloadTypeRegistry.c2s",
];

let hits = 0;
const plats = ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"];
for (const plat of plats) {
  const root = path.join("h:/MC_skill", plat);
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root)) {
    const rel = path.relative("h:/MC_skill", f);
    if (
      !rel.includes(".cursor") &&
      !rel.includes("knowledge") &&
      !rel.includes("scaffold") &&
      !rel.includes("code-patterns") &&
      !rel.endsWith("AGENTS.md")
    )
      continue;
    const lines = fs.readFileSync(f, "utf8").split(/\n/);
    lines.forEach((l, i) => {
      if (warn.test(l)) return;
      if ((rel.startsWith("forge") || rel.startsWith("neoforge")) && l.includes("ExistingFileHelper"))
        return;
      for (const n of needles) {
        if (l.includes(n)) {
          console.log(`${rel}:${i + 1} [${n}] ${l.trim().slice(0, 140)}`);
          hits++;
          break;
        }
      }
    });
  }
}
console.log("teach-hits", hits);
