#!/usr/bin/env node
/**
 * 把各版 quilt/.../knowledge/common/qsl-verified.md 并进
 * data/quilt_<ver>/quilt-docs/<ver>/processed + index-l0.json。
 * 不覆盖已有 qsl-qfapi / quilt-mod-json / qsl-readme。
 * 不重建语义向量（Quilt 已有 embeddings）。
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
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
  copyFileSync(src, dest);
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  const id = `${ver}/qsl-verified`;
  if (index.some((e) => e.id === id)) {
    console.log(`${ver}: processed copied, L0 already has ${id}`);
    continue;
  }
  index.push({
    id,
    version: ver,
    label: "QSL 已核实表（差异层）",
    url: "qsl-verified",
    tags: ["quilt", "qsl", "registry"],
    priority: "⭐",
    sectionCount: 1,
    source: "quilt-docs",
    fetchedAt: new Date().toISOString(),
  });
  writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n", "utf8");
  console.log(`${ver}: added ${id} (${index.length} pages)`);
}
