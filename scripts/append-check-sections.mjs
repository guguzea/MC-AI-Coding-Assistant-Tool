// 补齐缺失的短文核对节（从 catalog.ts verifiedApi 生成）
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CATALOG = "H:/MC_skill/mcp-server/src/diagnostics/library-catalog.ts";
const AUTH = "H:/MC_skill/community_knowledge/authored";
const text = readFileSync(CATALOG, "utf8");

// 解析条目：id → { keys: ["1.20.1/fabric",...], packagesByKey, entrypointsByKey }
const entries = new Map();
const re = /id: "([^"]+)",([\s\S]*?)(?=\n  \},|\n\];)/g;
let m;
while ((m = re.exec(text)) !== null) {
  const id = m[1];
  const seg = m[2];
  const keys = [];
  const info = new Map();
  const km = seg.match(/"([^"]+\/[^"]+)":\s*\{([\s\S]*?)(?=\n    \})/g) || [];
  for (const k of km) {
    const keyM = k.match(/^"([^"]+\/[^"]+)":\s*\{([\s\S]*)$/);
    if (!keyM) continue;
    const key = keyM[1];
    const body = keyM[2];
    const pkgs = (body.match(/"packages": \[([\s\S]*?)\]/) ?? [])[1] ?? "";
    const eps = (body.match(/"entrypoints": \[([\s\S]*?)\]/) ?? [])[1] ?? "";
    const pkgList = [...new Set(pkgs.match(/"([^"]+)"/g)?.map((x) => x.slice(1, -1)) ?? [])].filter((p) => p !== "licenses");
    const epList = [...new Set(eps.match(/"([^"]+)"/g)?.map((x) => x.slice(1, -1)) ?? [])];
    keys.push(key);
    info.set(key, { pkgs: pkgList, eps: epList });
  }
  entries.set(id, { keys, info });
}

const missing = ["lib-config-legacy", "lib-libgui", "lib-pehkui", "lib-player-ability-lib", "lib-playeranimator", "lib-polymer", "lib-resourceful", "lib-satin", "lib-server-translations", "lib-spruceui-obsidianui", "lib-terrablender", "lib-text-placeholder-api", "lib-trinkets", "lib-yacl"];

let done = 0;
for (const name of missing) {
  const p = join(AUTH, name + ".md");
  if (!existsSync(p)) { console.log("!! 短文缺失:", name); continue; }
  let content = readFileSync(p, "utf8");
  if (content.includes("## 核对")) { console.log("跳过(已有):", name); continue; }
  const e = entries.get("authored/" + name);
  if (!e || e.keys.length === 0) {
    content += "\n## 核对（2026-08 反编译验证）\n\n- ⚠️ 暂未反编译核对（catalog 无 verifiedApi）；细节以官方文档为准。\n";
  } else {
    // 代表键：优先 1.20.1，其次含 "26" 的最新，其次第一个
    const order = [...e.keys].sort((a, b) => {
      const score = (k) => (k.startsWith("1.20.1") ? 0 : k.startsWith("26.") ? 1 : k.startsWith("1.21.") ? 2 : 3);
      return score(a) - score(b);
    });
    const reps = [...new Set(order)].slice(0, 3);
    const lines = reps.map((key) => {
      const info = e.info.get(key) ?? { pkgs: [], eps: [] };
      const pkgTxt = info.pkgs.length ? info.pkgs.map((x) => `\`${x}\``).join("、") : "（无独立包）";
      const epTxt = info.eps.length ? `入口 ${info.eps[0]}` : "无 entrypoint";
      return `  - ${key}：顶层 API 包 ${pkgTxt}，${epTxt}`;
    });
    content += `\n## 核对（2026-08 反编译验证）\n\n- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：\n${lines.join("\n")}\n- 版本/包名详情见 \`mcp-server/src/diagnostics/library-catalog.ts\` 对应条目；细节仍以官方文档为准。\n`;
  }
  writeFileSync(p, content, "utf8");
  done++;
  console.log("已补:", name);
}
console.log("补齐完成:", done, "/", missing.length);
