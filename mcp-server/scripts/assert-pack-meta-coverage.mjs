#!/usr/bin/env node
// §3.1-2 / §3.5.5c 收口不变式：每个版本档都有 pack.meta.json，且元数据自洽。
// 只读检查，不写盘。口径：pack = <platform>/<version>/ 下有 AGENTS.md 或 .cursor/rules；bedrock 为单档平台目录。
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PLATFORMS = ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader"];
const STATUS_ENUM = new Set(["ready", "draft"]);
const PACK_STATUS_ENUM = new Set(["ready", "draft", "overlay"]);

/** @type {string[]} */
const packDirs = [];
for (const p of PLATFORMS) {
  const base = join(repo, p);
  if (!existsSync(base)) continue;
  for (const v of readdirSync(base)) {
    const dir = join(base, v);
    if (!statSync(dir).isDirectory()) continue;
    const isPack = existsSync(join(dir, "AGENTS.md")) || existsSync(join(dir, ".cursor", "rules"));
    if (isPack) packDirs.push(`${p}/${v}`);
  }
}
if (existsSync(join(repo, "bedrock", "AGENTS.md"))) packDirs.push("bedrock");
packDirs.sort();

const errors = [];
const checkedStatus = { ready: 0, draft: 0 };
/** 计数声明复核（2026-10-30 R2 审计）：gaps.* 的「processed N 篇」「全文实扫 = N 篇」必须与盘上现算相等。 */
const countClaims = { checked: 0, skipped: [] };
function countFiles(dir, ext) {
  if (!existsSync(dir)) return -1;
  let n = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (!ext || ext.test(e.name)) n += 1;
    }
  };
  walk(dir);
  return n;
}

for (const rel of packDirs) {
  const metaPath = join(repo, rel, "pack.meta.json");
  if (!existsSync(metaPath)) {
    errors.push(`${rel}: 缺 pack.meta.json`);
    continue;
  }
  let meta;
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch (e) {
    errors.push(`${rel}: pack.meta.json 解析失败 ${e.message}`);
    continue;
  }
  const { platform, status } = meta ?? {};
  if (!STATUS_ENUM.has(status)) {
    errors.push(`${rel}: status=${JSON.stringify(status)} 不在 ${[...STATUS_ENUM].join("/")}（catalog.ts 只把 draft 当拒载，其他值静默按 ready 加载）`);
  } else {
    checkedStatus[status] += 1;
  }
  const packStatus = meta["pack-status"];
  if (packStatus !== undefined && !PACK_STATUS_ENUM.has(packStatus)) {
    errors.push(`${rel}: pack-status=${JSON.stringify(packStatus)} 不在 ${[...PACK_STATUS_ENUM].join("/")}（overlay 仅限 thin overlay 档）`);
  }
  if (packStatus === "overlay") {
    const target = typeof meta.overlayOf === "string" ? meta.overlayOf : "";
    if (!target) {
      errors.push(`${rel}: pack-status=overlay 但缺 overlayOf`);
    } else if (!existsSync(join(repo, target, "pack.meta.json"))) {
      errors.push(`${rel}: overlayOf=${target} 指向的档不存在或无 pack.meta.json`);
    }
  }
  // catalog.ts 先读 status 再读 pack-status：二者都写 draft 才算拒载，反向矛盾会让「以为拒载」的档实际加载。
  if (packStatus === "draft" && status === "ready") {
    errors.push(`${rel}: pack-status=draft 而 status=ready → 实际按 ready 加载，与拒载意图相反`);
  }
  // 平台 / 版本必须与目录名一致：从邻档克隆 meta 是本仓已发生过的错误形态。
  const [dirPlatform, dirVersion] = rel === "bedrock" ? ["bedrock", undefined] : rel.split("/");
  if (platform !== undefined && platform !== dirPlatform) {
    errors.push(`${rel}: platform=${JSON.stringify(platform)} 与目录 ${dirPlatform} 不一致`);
  }
  if (dirVersion !== undefined && meta.minecraftVersion !== undefined && String(meta.minecraftVersion) !== dirVersion) {
    errors.push(`${rel}: minecraftVersion=${JSON.stringify(meta.minecraftVersion)} 与目录 ${dirVersion} 不一致`);
  }

  // ── 计数声明复核（2026-10-30 R2 审计）────────────────────────────────────
  // 为什么要在 meta 自述里复核数字：这些数字是「薄档 / 非薄档」判定的**唯一依据**，而它们
  // 原先无人对账 —— 语料补抓或 knowledge 增篇后句子照旧，读者拿旧数字做决定。两条形状：
  //   · 「knowledge/ 全文实扫 = N 篇」      ⇒ 数 <pack>/knowledge/**/*.md
  //   · 「processed N 篇，实测：<path>」    ⇒ 数 <path> 递归文件（句子自己给了路径就用它；
  //     没给就按 data/<platform>_<ver>/<platform>-docs/<ver>/processed 推导）
  // 数据根不在盘时**不假装核过**：记进 countClaims.skipped 并在汇总行点名（不是静默放行）。
  for (const [field, val] of Object.entries(meta.gaps ?? {})) {
    if (typeof val !== "string") continue;
    for (const m of val.matchAll(/全文实扫\s*=\s*(\d+)\s*篇/g)) {
      const got = countFiles(join(repo, rel, "knowledge"), /\.md$/);
      if (got < 0) {
        countClaims.skipped.push(`${rel} gaps.${field} 声称 knowledge 全文实扫 ${m[1]} 篇，但 ${rel}/knowledge 不在盘`);
        continue;
      }
      countClaims.checked += 1;
      if (got !== Number(m[1])) {
        errors.push(`${rel}: gaps.${field} 称「knowledge/ 全文实扫 = ${m[1]} 篇」，盘上实为 ${got} 篇（.md 递归计数）`);
      }
    }
    for (const m of val.matchAll(/processed\s*(\d+)\s*篇/g)) {
      const explicit = /data\/[A-Za-z0-9_.\-/]+\/processed\b/.exec(val);
      const dir = explicit
        ? join(repo, explicit[0])
        : dirVersion !== undefined
          ? join(repo, "data", `${dirPlatform}_${dirVersion}`, `${dirPlatform}-docs`, dirVersion, "processed")
          : null;
      const got = dir ? countFiles(dir, null) : -1;
      if (!dir || got < 0) {
        countClaims.skipped.push(`${rel} gaps.${field} 声称 processed ${m[1]} 篇，但推导路径不在盘（${dir ? dir.slice(repo.length + 1) : "无法推导"}）`);
        continue;
      }
      countClaims.checked += 1;
      if (got !== Number(m[1])) {
        errors.push(`${rel}: gaps.${field} 称「processed ${m[1]} 篇」，盘上实为 ${got} 个文件（${dir.slice(repo.length + 1)}）`);
      }
    }
  }
}

// 2026-10-23：58 → 59（新增 rift/1.13 原生档；依据：Rift 原生线目标版本是 1.13，
// 件内 profile.json 的 inheritsFrom=1.13，而 1.13.1/1.13.2 只有社区分支、无原生件）
const EXPECTED_PACKS = 59;
if (packDirs.length !== EXPECTED_PACKS) {
  errors.push(`pack 档数 ${packDirs.length} ≠ 基线 ${EXPECTED_PACKS}（新增/删除版本档必须同步本基线并注明依据）`);
}

if (errors.length) {
  console.error(`assert-pack-meta-coverage: FAILED (${errors.length} 项)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(
  `assert-pack-meta-coverage: ok (${packDirs.length} 档全覆盖 · ready=${checkedStatus.ready} draft=${checkedStatus.draft} · status/platform/minecraftVersion 与目录名一致 · ` +
    `计数声明复核 ${countClaims.checked} 条${countClaims.skipped.length ? ` / 未复核 ${countClaims.skipped.length} 条` : ""})`
);
if (countClaims.skipped.length) {
  for (const s of countClaims.skipped) console.log("  [未复核] " + s);
}
