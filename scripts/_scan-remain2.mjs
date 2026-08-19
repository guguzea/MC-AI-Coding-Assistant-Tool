import fs from "node:fs";
import path from "node:path";

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
  const rel = path.relative("h:/MC_skill", f).replace(/\\/g, "/");
  return (
    rel.includes(".cursor") ||
    rel.includes("knowledge") ||
    rel.includes("scaffold") ||
    rel.includes("code-patterns") ||
    rel.endsWith("AGENTS.md")
  );
}
const warn = /不要|不是|禁止|编造|没有 `|而非 |那是|后者是|❌|错误[:：]|本档没有|本档无/;
const needles = [
  "implements IMessage",
  "IMessageHandler",
  "PacketByteBuf",
  "FeatureFlags.DEFAULT_FLAGS",
  "IContainerFactory.of",
  "GuiGraphics",
  "MenuScreens.register",
  "NetworkHooks.openScreen",
  "saveAdditional",
  "ServerTicker",
  "getServerTicker",
  "ForgeRegistries.FLUID_TYPES",
  "ForgeRegistries.Keys.FLUID_TYPES",
  "SoundActions",
  "fromNamespaceAndPath",
  "Registries.CREATIVE_MODE_TAB",
  "SimpleNamedWidget",
  "FabricPacket",
  "chooseIdealPayloadId",
  "CustomPayloadRegistry",
  "PayloadTypeRegistry.s2c",
  "PayloadTypeRegistry.c2s",
];

const roots = [];
for (const plat of ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"]) {
  const d = path.join("h:/MC_skill", plat);
  if (fs.existsSync(d)) roots.push(d);
}

let hits = 0;
for (const root of roots) {
  for (const f of walk(root).filter(isSrc)) {
    const rel = path.relative("h:/MC_skill", f).replace(/\\/g, "/");
    if (/knowledge\/version-changes\/1\.(19|20|21)/.test(rel)) continue;
    const lines = fs.readFileSync(f, "utf8").split(/\n/);
    lines.forEach((l, i) => {
      if (warn.test(l)) return;
      for (const n of needles) {
        if (l.includes(n)) {
          console.log(`${rel}:${i + 1} [${n}] ${l.trim().slice(0, 130)}`);
          hits++;
          break;
        }
      }
    });
  }
}
console.log("hits", hits);
