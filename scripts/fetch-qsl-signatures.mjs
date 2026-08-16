#!/usr/bin/env node
/**
 * 打开 QuiltMC/quilt-standard-libraries 与目标 MC 对应的 branch 上一个 commit，
 * 只读 library/ 下 registry / lifecycle 的 .java 签名，写入 loader-api-summaries。
 * 不把 QSL 源码 vendor 进仓。禁止编 QuiltRegistry.register()。
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");
const UA = { "User-Agent": "MC-AI-Coding-Assistant-Tool" };
const BRANCH = "1.21";
const FILES = [
  "library/core/registry/src/main/java/org/quiltmc/qsl/registry/api/event/RegistryEvents.java",
  "library/core/registry/src/main/java/org/quiltmc/qsl/registry/api/event/RegistryMonitor.java",
  "library/core/lifecycle_events/src/main/java/org/quiltmc/qsl/lifecycle/api/event/ServerLifecycleEvents.java",
  "library/core/lifecycle_events/src/main/java/org/quiltmc/qsl/lifecycle/api/client/event/ClientLifecycleEvents.java",
];

function extract(javaText, path) {
  const stripped = javaText.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
  const pkg = stripped.match(/^\s*package\s+([a-zA-Z0-9_.]+)\s*;/m)?.[1] ?? "";
  const classMatch = stripped.match(/\b(?:class|interface|enum|record)\s+([A-Za-z_][A-Za-z0-9_]*)/);
  if (!classMatch) return null;
  const methods = [];
  const re = /^\s+(?:static\s+)?(?:default\s+)?(?:[\w.<>,?\[\]]+)\s+([a-z][a-zA-Z0-9_]*)\s*\(/gm;
  let m;
  while ((m = re.exec(stripped)) && methods.length < 30) {
    if (m[1] !== classMatch[1]) methods.push(m[1]);
  }
  return {
    fqcn: pkg ? `${pkg}.${classMatch[1]}` : classMatch[1],
    simpleName: classMatch[1],
    methods: [...new Set(methods)],
    sourcePath: path,
  };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const commitRes = await fetch(
    `https://api.github.com/repos/QuiltMC/quilt-standard-libraries/commits/${BRANCH}`,
    { headers: { ...UA, Accept: "application/vnd.github+json" } },
  );
  if (!commitRes.ok) {
    writeFileSync(
      join(OUT, "1.21.1-qsl.json"),
      JSON.stringify(
        {
          file: "1.21.1-qsl",
          mappingsVersion: "qsl-source-unverified",
          invalid: true,
          note: `无法打开 QSL ${BRANCH} commit（HTTP ${commitRes.status}）。禁止编 QuiltRegistry.register()`,
        },
        null,
        2,
      ),
    );
    console.error("QSL commit HTTP", commitRes.status);
    process.exit(0);
  }
  const commit = await commitRes.json();
  const sha = commit.sha;
  const classes = [];
  const missing = [];
  for (const path of FILES) {
    const url = `https://raw.githubusercontent.com/QuiltMC/quilt-standard-libraries/${sha}/${path}`;
    const r = await fetch(url, { headers: UA });
    if (!r.ok) {
      missing.push({ path, status: r.status, url });
      continue;
    }
    const rec = extract(await r.text(), path);
    if (rec) classes.push({ ...rec, url });
  }
  const summary = {
    file: "1.21.1-qsl",
    mappingsVersion: `qsl-git-${BRANCH}-${sha.slice(0, 12)}`,
    mappingsSource: "github QuiltMC/quilt-standard-libraries",
    mapping: "mojmap",
    version: "1.21.1",
    source: "qsl-github-java",
    fetchedAt: "2026-08-16",
    repo: "https://github.com/QuiltMC/quilt-standard-libraries",
    ref: sha,
    branch: BRANCH,
    classCount: classes.length,
    classes,
    missing,
    note: "许可证允许引用签名；源码不入库。禁止编 QuiltRegistry.register()。quilt-template-mod 打开到的是 org.quiltmc:qsl 与 QFAPI bundle，不是 fat quilt-standard-libraries 坐标。",
  };
  writeFileSync(join(OUT, "1.21.1-qsl.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ ok: true, sha, classCount: classes.length, missing }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
