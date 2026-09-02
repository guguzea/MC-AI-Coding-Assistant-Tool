#!/usr/bin/env node
/**
 * 把各版 quilt/.../knowledge/common/qsl-verified.md 并进
 * data/quilt_<ver>/quilt-docs/<ver>/processed + index-l0.json。
 * 不覆盖已有 qsl-qfapi / quilt-mod-json / qsl-readme。
 * 不重建语义向量（Quilt 已有 embeddings）。
 * 默认 dry-run：目标经 write-guard 打印 DRYRUN，加 --write 才落仓库 data/。
 */
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { emit, emitCopy, logDryRunBanner, wantWrite } from "./_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
if (!wantWrite()) logDryRunBanner("index-qsl-verified");

const VERSIONS = [
  "1.18.2",
  "1.19.4",
  "1.20.1",
  "1.20.4",
  "1.21.1",
  "1.21.3",
  "1.21.4",
  "1.21.8",
  "1.21.10",
  "1.21.11",
];

for (const ver of VERSIONS) {
  const src = join(ROOT, "quilt", ver, "knowledge", "common", "qsl-verified.md");
  const verDir = join(ROOT, "data", `quilt_${ver}`, "quilt-docs", ver);
  const dest = join(verDir, "processed", "qsl-verified.md");
  const indexPath = join(verDir, "index-l0.json");
  if (!existsSync(src) || !existsSync(indexPath)) {
    console.warn(`skip ${ver}: missing src or index`);
    continue;
  }
  const copied = emitCopy(dest, src);
  let index;
  try {
    index = JSON.parse(readFileSync(indexPath, "utf8"));
  } catch (e) {
    console.warn(`skip ${ver}: index JSON 无法解析 (${e.message})`);
    continue;
  }
  if (!Array.isArray(index)) {
    console.warn(`skip ${ver}: index-l0 不是数组`);
    continue;
  }
  const id = `${ver}/qsl-verified`;
  if (index.some((e) => e.id === id)) {
    console.log(`${ver}: ${copied ? "processed 已写" : "processed 待写"}，L0 已有 ${id}`);
    continue;
  }
  index.push({
    id,
    version: ver,
    label: "QSL 已核实表（差异层）",
    url: `https://github.com/QuiltMC/quilt-standard-libraries`,
    tags: ["quilt", "qsl", "registry"],
    priority: "⭐",
    sectionCount: 1,
    source: "quilt-docs",
    fetchedAt: new Date().toISOString(),
  });
  const written = emit(indexPath, JSON.stringify(index, null, 2) + "\n");
  console.log(`${ver}: ${written ? "已写入" : "预览"} ${id}（${index.length} 页）`);
}
