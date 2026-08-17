#!/usr/bin/env node
/**
 * 打开 QuiltMC/quilt-standard-libraries 与目标 MC 对应的 branch zipball，
 * 抽取 library 下 src/main/java（排除 mixin / testmod / gametest）签名，
 * 写入 loader-api-summaries。源码不入库。禁止编 QuiltRegistry.register()。
 *
 * 用法：node scripts/fetch-qsl-signatures.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawnSync } from "child_process";
import { redactAbs } from "./_lib/redact-abs.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");
const CACHE = process.env.MC_SKILL_CACHE || "D:\\mc-skill-temp";
const UA = { "User-Agent": "MC-AI-Coding-Assistant-Tool" };
const NOTE =
  "许可证允许引用签名；源码不入库。禁止编 QuiltRegistry.register()。quilt-template-mod 打开到的是 org.quiltmc:qsl 与 QFAPI bundle，不是 fat quilt-standard-libraries 坐标。";

/** 只映射本仓库已有 Quilt 档；branch 必须是 QSL 上真实存在的 ref，禁止借邻版。 */
const TARGETS = [
  { key: "1.21.1-qsl", version: "1.21.1", branch: "1.21" },
  { key: "1.20.4-qsl", version: "1.20.4", branch: "1.20.4" },
  { key: "1.20.1-qsl", version: "1.20.1", branch: "1.20.1" },
  { key: "1.19.4-qsl", version: "1.19.4", branch: "1.19.4" },
  { key: "1.18.2-qsl", version: "1.18.2", branch: "1.18.2" },
];

function walkJava(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const n of names) {
    const full = join(dir, n);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkJava(full, acc);
    else if (n.endsWith(".java")) acc.push(full);
  }
  return acc;
}

function keepMainJava(posix) {
  const n = posix.replace(/\\/g, "/");
  if (!n.includes("/src/main/java/") || !n.endsWith(".java")) return false;
  if (/\/(mixin|mixins|testmod|gametest|test)\//i.test(n)) return false;
  return true;
}

async function downloadZip(url, dest) {
  const tmp = `${dest}.tmp`;
  const r = spawnSync(
    "curl.exe",
    ["-fL", "--retry", "3", "--retry-delay", "2", "--connect-timeout", "30", "-A", "MC-AI-Coding-Assistant-Tool", "-o", tmp, url],
    { windowsHide: true, encoding: "utf8" },
  );
  if (r.status === 0 && existsSync(tmp) && statSync(tmp).size > 1000) {
    return { ok: true, path: tmp, bytes: statSync(tmp).size };
  }
  try {
    const res = await fetch(url, { headers: UA, redirect: "follow" });
    if (!res.ok) return { ok: false, status: res.status, url };
    writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
    return { ok: true, path: tmp, bytes: statSync(tmp).size, status: res.status };
  } catch (e) {
    return { ok: false, error: String(e), url, curlStatus: r.status, curlErr: r.stderr };
  }
}

async function resolveCommit(branch) {
  const url = `https://api.github.com/repos/QuiltMC/quilt-standard-libraries/commits/${encodeURIComponent(branch)}`;
  let last = { ok: false, status: 0, url };
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { ...UA, Accept: "application/vnd.github+json" } });
      if (res.status === 404 || res.status === 422) return { ok: false, status: res.status, url };
      if (!res.ok) {
        last = { ok: false, status: res.status, url };
        await new Promise((r) => setTimeout(r, 400 * attempt));
        continue;
      }
      const json = await res.json();
      if (!json?.sha) return { ok: false, status: res.status, url, note: "no sha" };
      return { ok: true, sha: json.sha, url };
    } catch (e) {
      last = { ok: false, error: String(e), url };
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  return last;
}

async function extractOne(target, extractCompilationUnit, repoSafeSourcePath, dedupeLoaderClasses) {
  const commit = await resolveCommit(target.branch);
  if (!commit.ok) {
    return { key: target.key, skipped: `QSL branch ${target.branch} commit HTTP ${commit.status || commit.error}，禁止借邻版` };
  }
  const existingPath = join(OUT, `${target.key}.json`);
  if (existsSync(existingPath)) {
    try {
      const prev = JSON.parse(readFileSync(existingPath, "utf8"));
      if (prev.ref === commit.sha && (prev.classCount || 0) >= 80 && Array.isArray(prev.classes) && prev.classes.length >= 80) {
        return { key: target.key, ok: true, skipped: "idempotent thick summary", classCount: prev.classCount, sha: commit.sha };
      }
    } catch {
      /* rewrite */
    }
  }
  const zipUrl = `https://github.com/QuiltMC/quilt-standard-libraries/archive/${commit.sha}.zip`;
  const work = join(CACHE, "qsl-src", target.key);
  mkdirSync(work, { recursive: true });
  const zipPath = join(work, "repo.zip");
  const got = await downloadZip(zipUrl, zipPath);
  if (!got.ok) {
    return { key: target.key, skipped: "zipball 下载失败", detail: got };
  }
  const unpack = join(work, "unpacked");
  rmSync(unpack, { recursive: true, force: true });
  mkdirSync(unpack, { recursive: true });
  const tar = spawnSync("tar", ["-xf", got.path, "-C", unpack], { windowsHide: true, encoding: "utf8" });
  try {
    if (existsSync(got.path)) rmSync(got.path, { force: true });
  } catch {
    /* ignore */
  }
  if (tar.status !== 0) {
    return { key: target.key, skipped: "zip 解压失败", detail: tar.stderr || tar.stdout };
  }
  const javaFiles = walkJava(unpack).filter((f) => keepMainJava(f.replace(/\\/g, "/")));
  const classes = [];
  const parseErrors = [];
  for (const jf of javaFiles) {
    let recs;
    try {
      recs = extractCompilationUnit(readFileSync(jf, "utf8"), jf.replace(/\\/g, "/"));
    } catch (e) {
      parseErrors.push({ file: repoSafeSourcePath(jf) ?? jf, error: String(e) });
      continue;
    }
    for (const rec of recs) {
      if (rec.parseError) parseErrors.push({ file: rec.file, fqcn: rec.fqcn, parseError: rec.parseError });
      classes.push({
        ...rec,
        file: repoSafeSourcePath(jf) ?? rec.file,
        sourcePath: repoSafeSourcePath(jf) ?? rec.file,
      });
    }
  }
  const next = dedupeLoaderClasses(classes);
  const fqcnIndex = [...new Set(next.map((c) => c.fqcn).filter(Boolean))].sort();
  const summary = {
    file: target.key,
    mappingsVersion: `qsl-git-${target.branch}-${commit.sha.slice(0, 12)}`,
    mappingsSource: "github QuiltMC/quilt-standard-libraries",
    mapping: "mojmap",
    version: target.version,
    source: "qsl-github-java",
    fetchedAt: "2026-08-17",
    repo: "https://github.com/QuiltMC/quilt-standard-libraries",
    ref: commit.sha,
    branch: target.branch,
    classCount: next.length,
    fqcnIndexCount: fqcnIndex.length,
    fqcnIndex,
    javaFileCount: javaFiles.length,
    parseErrorCount: parseErrors.length,
    classes: next,
    note: NOTE,
  };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${target.key}.json`), JSON.stringify(summary, null, 2) + "\n", "utf8");
  return {
    key: target.key,
    ok: true,
    sha: commit.sha,
    classCount: next.length,
    javaFileCount: javaFiles.length,
    parseErrorCount: parseErrors.length,
  };
}

async function main() {
  const distExtract = join(ROOT, "mcp-server", "dist", "loader-api", "extract.js");
  const distStore = join(ROOT, "mcp-server", "dist", "loader-api", "store.js");
  if (!existsSync(distExtract) || !existsSync(distStore)) {
    console.error("need mcp-server dist: cd mcp-server && npm run build");
    process.exit(1);
  }
  const { extractCompilationUnit, repoSafeSourcePath } = await import(pathToFileURL(distExtract).href);
  const { dedupeLoaderClasses } = await import(pathToFileURL(distStore).href);
  mkdirSync(OUT, { recursive: true });
  mkdirSync(join(CACHE, "loader-api-summaries"), { recursive: true });
  const log = [];
  for (const t of TARGETS) {
    try {
      const row = await extractOne(t, extractCompilationUnit, repoSafeSourcePath, dedupeLoaderClasses);
      log.push(row);
      console.log(JSON.stringify(row));
    } catch (e) {
      log.push({ key: t.key, skipped: String(e) });
      console.error(t.key, e);
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  writeFileSync(
    join(CACHE, "loader-api-summaries", "fetch-qsl-last.json"),
    JSON.stringify({ cache: "$MC_SKILL_CACHE", log: redactAbs(log, { cache: CACHE, repo: ROOT }) }, null, 2),
  );
  const ok = log.filter((x) => x.ok).length;
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
