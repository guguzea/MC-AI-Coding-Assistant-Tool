#!/usr/bin/env node
/**
 * Gate：api-index 的类名必须与本档实钉的 Forge `official` 通道一致。
 *
 * 为什么这是「一旦坏了整条数据链就静默出错」的一环：`extracted/api-index.json` 是 `query_api`
 * / `convert_mapping` 回答「这个版本里类叫什么」的唯一上游。1.16.5 的 Forge `official` 通道
 * **不应用 Mojang 类名**（ForgeGradle issue #795：为与 1.16 其它版本保持二进制兼容，只映射字段/方法名），
 * 所以本档可编译的类名是 SRG 名 `net.minecraft.world.World` / `net.minecraft.entity.Entity` /
 * `net.minecraft.data.loot.BlockLootTables`，而 Mojang 侧 client.txt 给的是
 * `net.minecraft.world.level.Level` / `net.minecraft.world.entity.Entity` / `net.minecraft.data.loot.BlockLoot`。
 * 两者混用（2026-09-14 前的实态）时，任何「按索引核 1.16.5」都会得出反的结论：审计据此判
 * `ItemLootEntry` 不存在、判 `BlockLoot#addTables` 成立，而 javap 实测恰好相反。
 *
 * 断言（只查登记在 CHANNEL_KEEPS_SRG_CLASSES 的档）：
 *  A1 索引存在且可解析；类数为钉值（生成物变化必须签字）。
 *  A2 **禁用面**：不得出现 Mojang 专属路径（`world/level/`、`world/entity/`）+ 具名 Mojang 专属类。
 *  A3 **必存面**：javap 实测存在的 SRG 锚点必须都在。
 *  A4 通道映射制品在位（`mappings/obf_to_srg.tsrg`）——回映射的输入面，缺了说明管线退化了。
 *  A5 **成员分布地板**：单类不得吞掉全部成员。旧 SRG 档（1.7.10–1.12.2）曾因 joined.srg 分段
 *     排布 + 用「最近的 CL: 行」定 owner，把全文件成员并进最后一个类（非空类恒为 1）；
 *     该缺陷在 A1–A4 全绿，故补本条。地板用比例阈值（非等值钉），合法增长不假红。
 *
 * 投毒（3 记，见 temp 对拍脚本）：注入 `world/level/Level` / 把 `BlockLootTables` 换成 `BlockLoot` /
 * 删掉一个锚点 —— 三者都必须红（投毒只换一个索引 ⇒ `testIndexPack` 档才参与）。
 *
 * 用法：
 *   node scripts/assert-index-channel-layout.mjs
 *   MC_SKILL_INDEX_LAYOUT_TEST_INDEX=<改过的 api-index.json>   # 投毒对拍用（只换索引，其余不变）
 *   MC_SKILL_INDEX_LAYOUT_TEST_ROOT=<假根>                     # 换根（缺文件会红）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");

/** 实钉通道「只映射字段/方法名、不映射类名」的档（依据：FG #795 + 本仓 javap 实测）。 */
const CHANNEL_KEEPS_SRG_CLASSES = {
  "forge/1.16.5": {
    classes: 3922,
    /// Mojang 专属包路径（SRG 类名里不可能出现的段）
    forbiddenPrefixes: ["net/minecraft/world/level/", "net/minecraft/world/entity/"],
    /// Mojang 专属类全名（1.17+ 形态；本档判据不得依赖它们）
    forbiddenNames: [
      "net/minecraft/data/loot/BlockLoot",
      "net/minecraft/world/level/storage/loot/entries/LootItem",
      "net/minecraft/world/level/block/state/BlockBehaviour",
    ],
    /// javap 实测存在于 `forge-1.16.5-36.2.34_mapped_official_1.16.5.jar` 的锚点
    requiredNames: [
      "net/minecraft/world/World",
      "net/minecraft/entity/Entity",
      "net/minecraft/block/material/Material",
      "net/minecraft/data/loot/BlockLootTables",
      "net/minecraft/loot/ItemLootEntry",
    ],
    /// 回映射输入制品
    mappingInput: "mappings/obf_to_srg.tsrg",
    /// 投毒对拍只换一个索引（见 test-scripts.mjs §A5/§idx）⇒ 只有该档在 TEST_INDEX 下参与
    testIndexPack: true,
  },
};

/** 旧 SRG 档（1.7.10–1.12.2）：映射输入是 joined.srg，成员按 owner 归属；值 = 类数钉（CL 名去重数）。 */
const LEGACY_SRG_PACKS = {
  "1.7.10": 1836,
  "1.8.9": 2541,
  "1.9.4": 2941,
  "1.10.2": 2980,
  "1.11.2": 3122,
  "1.12.2": 3344,
};
for (const [v, n] of Object.entries(LEGACY_SRG_PACKS)) {
  CHANNEL_KEEPS_SRG_CLASSES[`forge/${v}`] = {
    classes: n,
    forbiddenPrefixes: [],
    forbiddenNames: [],
    requiredNames: [],
    mappingInput: "mappings/joined.srg",
    membersFloor: { minNonEmptyRatio: 0.9, maxTopClassShare: 0.05 },
  };
}

/**
 * 1.13.2 / 1.14.4 / 1.15.2：同属 MCP 层，但映射容器是 MCPConfig **joined.tsrg**（旧式 TSRG）而不是 joined.srg。
 * 钉值 = 各档 api-index.json 的类数；成员地板与旧 SRG 档同阈值——这三档正是「CSV-only 通道只能吐空
 * api-index / 成员无 owner」的受害面，地板能挡住同类退化再次发生。
 */
const TSRG_SRG_PACKS = {
  "1.13.2": 4027,
  "1.14.4": 4976,
  "1.15.2": 5137,
};
for (const [v, n] of Object.entries(TSRG_SRG_PACKS)) {
  CHANNEL_KEEPS_SRG_CLASSES[`forge/${v}`] = {
    classes: n,
    forbiddenPrefixes: [],
    forbiddenNames: [],
    requiredNames: [],
    mappingInput: "mappings/joined.tsrg",
    membersFloor: { minNonEmptyRatio: 0.9, maxTopClassShare: 0.05 },
  };
}

const TEST_ROOT = process.env.MC_SKILL_INDEX_LAYOUT_TEST_ROOT;
const TEST_INDEX = process.env.MC_SKILL_INDEX_LAYOUT_TEST_INDEX;
// 可选：把 TEST_INDEX 绑到指定档（如 forge/1.12.2）。留空 = 只跑 testIndexPack 档（1.16.5）。
const TEST_INDEX_PACK = process.env.MC_SKILL_INDEX_LAYOUT_TEST_INDEX_PACK;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const failures = [];

for (const [pack, spec] of Object.entries(CHANNEL_KEEPS_SRG_CLASSES)) {
  if (TEST_INDEX && (TEST_INDEX_PACK ? pack !== TEST_INDEX_PACK : !spec.testIndexPack)) continue; // 投毒只换一个索引 ⇒ 只跑它对应的档
  const before = failures.length;
  const idxPath = TEST_INDEX
    ? path.resolve(TEST_INDEX)
    : path.join(ROOT, "data", `forge_${pack.split("/")[1]}`, "extracted", "api-index.json");
  const rel = path.relative(ROOT, idxPath).replace(/\\/g, "/");
  if (!fs.existsSync(idxPath)) {
    failures.push(`${pack}: 索引不存在 ${rel}`);
    continue;
  }
  let idxObj;
  try {
    idxObj = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  } catch (e) {
    failures.push(`${pack}: 索引不可解析 ${rel}（${e.message}）`);
    continue;
  }
  const names = Object.keys(idxObj);
  // A1 类数钉值
  if (names.length !== spec.classes) {
    failures.push(`${pack}: 类数 ${names.length} ≠ 钉值 ${spec.classes}（${rel}）—— 生成物变了要签字`);
  }
  const set = new Set(names);
  // A2 禁用面
  for (const pre of spec.forbiddenPrefixes) {
    const hit = names.filter((n) => n.startsWith(pre));
    if (hit.length) {
      failures.push(`${pack}: 出现 Mojang 专属路径 ${pre}（${hit.length} 键，如 ${hit[0]}）—— 本档通道不认这些类名`);
    }
  }
  for (const bad of spec.forbiddenNames) {
    if (set.has(bad)) failures.push(`${pack}: 出现 Mojang 专属类 ${bad} —— 本档可编译名是 SRG 名`);
  }
  // A3 必存面
  for (const need of spec.requiredNames) {
    if (!set.has(need)) failures.push(`${pack}: 缺 javap 实测锚点 ${need}（${rel}）`);
  }
  // A4 回映射输入制品
  if (!TEST_INDEX) {
    const mp = path.join(ROOT, "data", `forge_${pack.split("/")[1]}`, spec.mappingInput);
    if (!fs.existsSync(mp)) failures.push(`${pack}: 缺通道回映射输入 ${spec.mappingInput}（管线退化）`);
  }
  // A5 成员分布地板（比例阈值，避免合法增长假红）
  if (spec.membersFloor) {
    const counts = names.map((n) => (idxObj[n].methods?.length ?? 0) + (idxObj[n].fields?.length ?? 0));
    const totalMembers = counts.reduce((a, b) => a + b, 0);
    const nonEmpty = counts.filter((c) => c > 0).length;
    const ratio = names.length ? nonEmpty / names.length : 0;
    const maxShare = totalMembers ? Math.max(...counts) / totalMembers : 0;
    if (ratio < spec.membersFloor.minNonEmptyRatio) {
      failures.push(`${pack}: 非空类占比 ${ratio.toFixed(3)} < 地板 ${spec.membersFloor.minNonEmptyRatio}（成员错挂：全文件成员并进最后一个类）`);
    }
    if (maxShare > spec.membersFloor.maxTopClassShare) {
      failures.push(`${pack}: 单类成员占比 ${maxShare.toFixed(3)} > 上限 ${spec.membersFloor.maxTopClassShare}（成员错挂：单类吞掉全部成员）`);
    }
  }
  if (failures.length === before) {
    console.log(`  ${pack}: ${names.length} 类 · 禁用面前缀 ${spec.forbiddenPrefixes.length} 项 0 命中 · 锚点 ${spec.requiredNames.length}/${spec.requiredNames.length} 在场 · 回映射制品在位`);
  }
}

if (failures.length) {
  console.error(`assert-index-channel-layout: ${failures.length} 项不通过`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("  assert-index-channel-layout: ok");
