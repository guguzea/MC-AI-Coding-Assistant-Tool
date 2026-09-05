#!/usr/bin/env node
/**
 * 打开 QuiltMC/quilt-standard-libraries 与目标 MC 对应的 branch zipball，
 * 抽取 library 下 src/main/java（排除 mixin / testmod / gametest）签名，
 * 写入 loader-api-summaries。源码不入库。禁止编 QuiltRegistry.register()。
 *
 * 用法：node scripts/fetch-qsl-signatures.mjs            # dry-run：只打 DRYRUN <rel>
 *       node scripts/fetch-qsl-signatures.mjs --write    # 确认后才写 mcp-server/data/
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawnSync } from "child_process";
import os from "os";
import { emit, scratchMkdirAll, scratchRemove, scratchWriteText } from "./_lib/write-guard.mjs";
import { redactAbs } from "./_lib/redact-abs.mjs";
import { downloadWithFallback, failureNote, fetchJsonWithUa, FETCH_FAILURE } from "./_lib/fetch-with-ua.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");
const CACHE = process.env.MC_SKILL_CACHE || join(os.tmpdir(), "mc-skill-cache");
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
  const got = await downloadWithFallback({ url, dest: tmp, timeoutMs: 120_000, minBytes: 1000 });
  if (!got.ok) {
    scratchRemove(tmp);
    return {
      ok: false,
      status: got.status || 0,
      failureClass: got.failureClass,
      tls: got.tls,
      reason: got.reason || failureNote(got),
      note: failureNote(got),
      url,
      via: got.via,
    };
  }
  return { ok: true, path: tmp, bytes: got.bytes, status: got.status, via: got.via };
}

async function resolveCommit(branch) {
  const url = `https://api.github.com/repos/QuiltMC/quilt-standard-libraries/commits/${encodeURIComponent(branch)}`;
  let last = { ok: false, status: 0, failureClass: "UNKNOWN", url };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetchJsonWithUa(url, {
      headers: { Accept: "application/vnd.github+json", ...UA },
      timeoutMs: 30_000,
    });
    if (res.ok) {
      if (!res.json?.sha) {
        return { ok: false, status: res.status, failureClass: FETCH_FAILURE.UNKNOWN, url, note: "no sha" };
      }
      return { ok: true, sha: res.json.sha, url };
    }
    if (res.status === 404 || res.status === 422) {
      return { ok: false, status: res.status, failureClass: FETCH_FAILURE.NOT_FOUND, url };
    }
    // TLS/证书失败重试无意义，且必须保持 TLS 归类（禁止落到「分支不存在」）
    if (res.tls) return { ok: false, status: 0, failureClass: res.failureClass, tls: true, reason: res.reason, url };
    last = { ok: false, status: res.status, failureClass: res.failureClass, reason: res.reason, url };
    await new Promise((r) => setTimeout(r, 400 * attempt));
  }
  return last;
}

async function extractOne(target, extractCompilationUnit, repoSafeSourcePath, dedupeLoaderClasses) {
  const commit = await resolveCommit(target.branch);
  if (!commit.ok) {
    const cls = commit.failureClass || "UNKNOWN";
    return {
      key: target.key,
      failureClass: cls,
      skipped: `QSL branch ${target.branch} commit ${failureNote(commit) || cls}（${cls === FETCH_FAILURE.NOT_FOUND ? `分支 ${target.branch} 不存在` : "非资源不存在，禁止记成缺档"}），禁止借邻版`,
    };
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
  scratchMkdirAll(work);
  const zipPath = join(work, "repo.zip");
  const got = await downloadZip(zipUrl, zipPath);
  if (!got.ok) {
    return { key: target.key, failureClass: got.failureClass, skipped: `zipball 下载失败 ${got.note || ""}`.trim(), detail: got };
  }
  const unpack = join(work, "unpacked");
  scratchRemove(unpack);
  scratchMkdirAll(unpack);
  const tar = spawnSync("tar", ["-xf", got.path, "-C", unpack], { windowsHide: true, encoding: "utf8" });
  try {
    scratchRemove(got.path);
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
    fetchedAt: new Date().toISOString(),
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
  const wrote = emit(join(OUT, `${target.key}.json`), JSON.stringify(summary, null, 2) + "\n");
  return {
    key: target.key,
    ok: true,
    sha: commit.sha,
    classCount: next.length,
    javaFileCount: javaFiles.length,
    parseErrorCount: parseErrors.length,
    ...(wrote ? {} : { dryRun: true }),
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
  scratchMkdirAll(join(CACHE, "loader-api-summaries"));
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
  scratchWriteText(
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
