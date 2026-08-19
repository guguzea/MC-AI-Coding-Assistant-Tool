/**
 * 版本感知复扫：只报对本档仍算错误的命中。警告句、porting、version-changes 跳过。
 */
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
function verOf(rel) {
  const m = rel.match(/^(forge|fabric|neoforge|quilt|liteloader|rift|modloader)\/([^/]+)\//);
  return m ? { plat: m[1], ver: m[2] } : { plat: rel.split("/")[0], ver: "" };
}
function cmp(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

const warn = /不要|不是|禁止|编造|没有 `|而非 |那是|后者是|❌|错误[:：]|本档没有|本档无|邻版|未收录|本档用|是 1\.17/;

let hits = 0;
for (const plat of ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"]) {
  const root = path.join("h:/MC_skill", plat);
  for (const f of walk(root).filter(isSrc)) {
    const rel = path.relative("h:/MC_skill", f).replace(/\\/g, "/");
    if (rel.includes("knowledge/version-changes/") || rel.includes("knowledge/porting/")) continue;
    const { plat: p, ver } = verOf(rel);
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => {
      if (warn.test(l)) return;
      const bad = [];
      const isForge = p === "forge";
      const isNeo = p === "neoforge";
      const isFab = p === "fabric" || p === "quilt";

      if (l.includes("AbstractContainerMenuScreen")) bad.push("AbstractContainerMenuScreen");
      if (l.includes("chooseIdealPayloadId")) bad.push("chooseIdealPayloadId");
      if (l.includes("IContainerFactory.of")) bad.push("IContainerFactory.of");
      if (l.includes("SimpleNamedWidget")) bad.push("SimpleNamedWidget");
      if (l.includes("CustomPayloadRegistry")) bad.push("CustomPayloadRegistry");
      if (l.includes("PayloadTypeRegistry.s2c") || l.includes("PayloadTypeRegistry.c2s")) bad.push("PayloadTypeRegistry.s2c/c2s");
      if (l.includes("ServerTicker") || l.includes("getServerTicker")) bad.push("ServerTicker");
      if (l.includes("IForgeContainer.create()")) bad.push("IForgeContainer.create");
      if (l.includes("accessWidener class ")) bad.push("fake-AW-class");
      if (/onTick\(CallbackInfoReturnable/.test(l)) bad.push("tick-CIR");
      if (isFab && l.includes("modImplementation") && ver === "26.1.2" && !l.includes("不要") && !l.includes("取代") && !l.includes("触发词")) {
        bad.push("modImplementation@26.1.2");
      }

      if (isForge && ver === "1.12.2") {
        // IMessage 正牌
      } else if (isForge && l.includes("implements IMessage")) {
        bad.push("implements IMessage");
      }

      if (isForge && cmp(ver, "1.17.0") < 0) {
        if (l.includes("saveAdditional") && !l.includes("不要")) bad.push("saveAdditional");
        if (l.includes("newBlockEntity(")) bad.push("newBlockEntity");
        if (l.includes("EntityRenderersEvent") && !l.includes("没有")) bad.push("EntityRenderersEvent");
      }

      if (isForge && ["1.16.5", "1.17.1", "1.18.2", "1.19.4", "1.20.1", "1.20.4"].includes(ver)) {
        if (l.includes("protected void registerAttributes()")) bad.push("registerAttributes()");
      }

      if (isForge && cmp(ver, "1.20.0") < 0 && l.includes("GuiGraphics") && !l.includes("PoseStack")) {
        bad.push("GuiGraphics");
      }

      if (isForge && cmp(ver, "1.19.0") < 0 && l.includes("NetworkHooks.openScreen")) {
        bad.push("NetworkHooks.openScreen");
      }

      if (isForge && cmp(ver, "1.19.0") < 0 && l.includes("FeatureFlags.DEFAULT_FLAGS")) {
        bad.push("FeatureFlags");
      }

      if (isForge && cmp(ver, "1.19.0") < 0 && l.includes("SoundActions")) {
        bad.push("SoundActions");
      }

      if (isForge && ["1.19.4", "1.20.1", "1.20.4"].includes(ver) && l.includes("fromNamespaceAndPath")) {
        bad.push("fromNamespaceAndPath");
      }

      if (isNeo && ver && cmp(ver, "1.21.0") >= 0 && l.includes("NetworkHooks.openScreen") && !l.includes("不要抄")) {
        bad.push("NetworkHooks.openScreen@1.21+");
      }

      if (isFab && l.includes("protected void registerAttributes()") && cmp(ver, "1.16.0") >= 0) {
        bad.push("registerAttributes@fabric");
      }

      if (bad.length) {
        console.log(`${rel}:${i + 1} [${bad.join(",")}] ${l.trim().slice(0, 120)}`);
        hits++;
      }
    });
  }
}
console.log("true-hits", hits);
