#!/usr/bin/env node
/**
 * snapshot-sha256.mjs
 * 一次性为 data/<scope>/ 下的指定文件生成 SHA256 清单，存放在 agent-tools/audit-snapshots/。
 * 不写入 data/ 目录，不修改任何 git 跟踪文件。
 *
 * 用法：
 *   node scripts/snapshot-sha256.mjs --scope=fabric_1.21.1:fabric-docs:1.21.1:raw
 *   node scripts/snapshot-sha256.mjs --scope=fabric_1.21.3:fabric-docs:1.21.3:raw --scope=fabric_1.21.3:fabric-wiki:1.21.3:raw
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");
const DATA = join(REPO, "data");
const OUT_DIR = join(REPO, "agent-tools", "audit-snapshots");

const args = process.argv.slice(2);
const scopes = args.filter(a => a.startsWith("--scope=")).map(a => a.slice("--scope=".length));

if (!scopes.length) {
  console.error("用法: --scope=<platform_version>:<subdir>:<mcVer>:[raw|processed|indexes|all]");
  process.exit(2);
}

mkdirSync(OUT_DIR, { recursive: true });

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

function walk(dir) {
  const out = [];
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function pick(scope, rootDir, target) {
  const files = walk(rootDir);
  const norm = (p) => p.replace(/\\/g, "/");
  const root = norm(rootDir);
  if (target === "all") return files;
  if (target === "raw") return files.filter(f => norm(f).includes(`${root}/raw/`));
  if (target === "processed") return files.filter(f => norm(f).includes(`${root}/processed/`));
  if (target === "indexes") return files.filter(f => /index-l\d+\.json$/.test(f));
  return files.filter(f => f.endsWith(target));
}

for (const s of scopes) {
  const parts = s.split(":");
  const [platVer, subdir, mcVer, target = "all"] = parts;
  if (!platVer || !subdir || !mcVer) {
    console.error(`跳过非法 scope: ${s}`);
    continue;
  }
  const scopeRoot = join(DATA, platVer, subdir, mcVer);
  if (!statSync(scopeRoot, { throwIfNoEntry: false })) {
    console.error(`跳过不存在的目录: ${scopeRoot}`);
    continue;
  }
  const files = pick(s, scopeRoot, target);
  const lines = [];
  let totalBytes = 0;
  for (const f of files) {
    const buf = readFileSync(f);
    const h = sha(buf);
    const rel = f.replace(REPO + "\\", "").replace(REPO + "/", "");
    lines.push(`${h}  ${rel}`);
    totalBytes += buf.length;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = `${platVer}__${subdir}__${mcVer}__${target}__${stamp}.sha256.txt`;
  const outPath = join(OUT_DIR, safeName);
  const header = [
    `# Snapshot`,
    `# generated: ${new Date().toISOString()}`,
    `# scope: ${s}`,
    `# root: ${scopeRoot}`,
    `# fileCount: ${files.length}`,
    `# totalBytes: ${totalBytes}`,
    ``,
  ];
  writeFileSync(outPath, header.concat(lines).join("\n"), "utf8");
  console.log(`[snapshot] ${s} -> ${outPath} (${files.length} files, ${totalBytes} bytes)`);
}