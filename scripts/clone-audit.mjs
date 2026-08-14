#!/usr/bin/env node
/**
 * 比较平台/版本目录下 .cursor/rules 与 knowledge 的文本相似度。
 * 规范化空白后 Dice（词级）>70% 标 SUSPECTED_CLONE。
 *
 * 超阈值 = 疑似，须对照该版源码/文档签字。同骨架换类名的误报不算验收失败。
 * 默认退出码 0（不当构建红灯）。--fail-on-suspect 才用非零退出。
 *
 * 用法：
 *   node scripts/clone-audit.mjs
 *   node scripts/clone-audit.mjs --json
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THRESHOLD = 0.7;
const failOnSuspect = process.argv.includes("--fail-on-suspect");
const asJson = process.argv.includes("--json");

const DEFAULT_PAIRS = [
  ["neoforge/1.20.4", "forge/1.20.4"],
  ["neoforge/1.21.1", "neoforge/1.20.4"],
  ["neoforge/1.21.3", "neoforge/1.21.1"],
  ["neoforge/1.21.8", "neoforge/1.21.3"],
  ["neoforge/1.21.11", "neoforge/1.21.8"],
  ["neoforge/26.1", "neoforge/1.21.11"],
  ["liteloader/1.8.9", "liteloader/1.12.2"],
  ["liteloader/1.10.2", "liteloader/1.12.2"],
  ["modloader/1.2.5", "modloader/1.6.4"],
  ["fabric/26.1.2", "fabric/1.21.11"],
];

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walkFiles(full, acc);
    } else if (/\.(mdc|md)$/i.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

function collectRelFiles(baseRel) {
  const base = join(ROOT, baseRel);
  const files = [];
  for (const sub of [".cursor/rules", "knowledge"]) {
    walkFiles(join(base, sub), files);
  }
  const ag = join(base, "AGENTS.md");
  if (existsSync(ag)) files.push(ag);
  return files.map((f) => relative(base, f).replace(/\\/g, "/"));
}

function tokenize(text) {
  const norm = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .toLowerCase();
  return norm.split(/[^a-z0-9_\u4e00-\u9fff]+/).filter((t) => t.length >= 2);
}

function dice(aTokens, bTokens) {
  if (aTokens.length === 0 && bTokens.length === 0) return 1;
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  const a = new Map();
  for (const t of aTokens) a.set(t, (a.get(t) ?? 0) + 1);
  const b = new Map();
  for (const t of bTokens) b.set(t, (b.get(t) ?? 0) + 1);
  let inter = 0;
  for (const [t, c] of a) {
    const d = b.get(t);
    if (d) inter += Math.min(c, d);
  }
  return (2 * inter) / (aTokens.length + bTokens.length);
}

function comparePair(leftRel, rightRel) {
  const leftFiles = collectRelFiles(leftRel);
  const rightSet = new Set(collectRelFiles(rightRel));
  const shared = leftFiles.filter((f) => rightSet.has(f));
  const findings = [];
  for (const rel of shared) {
    const aPath = join(ROOT, leftRel, rel);
    const bPath = join(ROOT, rightRel, rel);
    if (!existsSync(aPath) || !existsSync(bPath)) continue;
    const sim = dice(
      tokenize(readFileSync(aPath, "utf8")),
      tokenize(readFileSync(bPath, "utf8")),
    );
    if (sim > THRESHOLD) {
      findings.push({
        status: "SUSPECTED_CLONE",
        left: `${leftRel}/${rel}`.replace(/\\/g, "/"),
        right: `${rightRel}/${rel}`.replace(/\\/g, "/"),
        similarity: Number(sim.toFixed(4)),
        note: "须对照该版源码/文档签字。同骨架换类名可标误报，不算验收失败。",
      });
    }
  }
  return {
    left: leftRel,
    right: rightRel,
    comparedFiles: shared.length,
    suspected: findings.length,
    findings,
  };
}

const pairs = DEFAULT_PAIRS.filter(([a, b]) => existsSync(join(ROOT, a)) && existsSync(join(ROOT, b)));
const reports = pairs.map(([a, b]) => comparePair(a, b));
const suspectedTotal = reports.reduce((n, r) => n + r.suspected, 0);
const payload = {
  ok: true,
  threshold: THRESHOLD,
  suspectedTotal,
  note: "SUSPECTED_CLONE 不是构建失败。误报（同骨架换类名）须人工签字，不算验收失败。",
  pairs: reports,
};

if (asJson) {
  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
} else {
  console.log(`clone-audit: ${pairs.length} pairs, ${suspectedTotal} suspected (>${THRESHOLD * 100}%)`);
  for (const r of reports) {
    if (!r.findings.length) continue;
    console.log(`\n${r.left} vs ${r.right}`);
    for (const f of r.findings) {
      console.log(`  SUSPECTED_CLONE ${f.similarity}  ${f.left}`);
    }
  }
}

const outDir = join(ROOT, "mcp-server", "data", "loader-api-summaries");
try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "clone-audit-last.json"), JSON.stringify(payload, null, 2), "utf8");
} catch {
  /* optional */
}

if (failOnSuspect && suspectedTotal > 0) process.exit(2);
process.exit(0);
