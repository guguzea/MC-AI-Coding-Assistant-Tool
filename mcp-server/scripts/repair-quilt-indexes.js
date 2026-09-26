#!/usr/bin/env node
/**
 * repair-quilt-indexes.js — 把 processed/*.md 中缺失于 index-l0 的页补回 L0/L1/L2。
 * 用于 fetch 部分失败导致索引被覆盖、正文仍留在磁盘的情况。
 *
 * G4 清尾（2026-09-25）起兼做 sha256 补齐/纠偏：已存在条目的 `sha256` 必须等于
 * `sha(processed/<stem>.md 内容)`（口径同 fetch-quilt-docs.js:157/:264 对新建条目写 sha 的口径；
 * 真缺口 = 6 档 qsl-verified 条目全缺，同档其它 17 条目都有）。`--audit` 现在同时判
 * 「processed↔index 双向差」与「sha256 缺口」，任一非空即 rc=1。
 * fetchedAt **不修**：qsl-verified 无「> 抓取时间」行，其 fetchedAt 语义 = 派生件建立时间（历史真值）。
 *
 *   node scripts/repair-quilt-indexes.js [--version=1.21.11|all] [--dry-run]
 *   node scripts/repair-quilt-indexes.js --audit
 */
import { createHash } from "crypto";
import { closeSync, existsSync, fsyncSync, openSync, readdirSync, readFileSync, renameSync, unlinkSync, writeSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DATA = join(ROOT, "data");

const PAGE_META = {
  "qsl-qfapi": {
    label: "QSL and Quilted Fabric API",
    url: "https://wiki.quiltmc.org/en/concepts/qsl-qfapi",
    tags: ["qsl", "qfapi", "registry"],
  },
  "quilt-mod-json": {
    label: "quilt.mod.json",
    url: "https://raw.githubusercontent.com/QuiltMC/rfcs/main/specification/0002-quilt.mod.json.md",
    tags: ["loader", "metadata"],
  },
  "qsl-readme": {
    label: "Quilt Standard Libraries README",
    url: null,
    tags: ["qsl"],
  },
  "qsl-verified": {
    label: "QSL 已核实表（差异层）",
    url: "qsl-verified",
    tags: ["quilt", "qsl", "registry"],
  },
};

function qslReadmeUrl(mcVersion) {
  const [maj, min] = mcVersion.split(".");
  return `https://raw.githubusercontent.com/QuiltMC/quilt-standard-libraries/${maj}.${min}/README.md`;
}

function sha(s) {
  return createHash("sha256").update(s).digest("hex");
}

function firstParagraph(md) {
  const body = String(md ?? "")
    .replace(/^>.*$/gm, "")
    .replace(/^#+ .*$/gm, "");
  const para = body
    .split(/\n\n+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .find((s) => s.length > 40);
  return (para ?? body.replace(/\s+/g, " ").trim()).slice(0, 200);
}

function fetchedAtFromMd(md) {
  const m = String(md).match(/> 抓取时间：([^\n]+)/);
  return m ? m[1].trim() : new Date().toISOString();
}

function metaForStem(ver, stem) {
  const base = PAGE_META[stem];
  if (!base) return null;
  let url = base.url;
  if (stem === "qsl-readme") url = qslReadmeUrl(ver);
  return { ...base, url };
}

function atomicWriteJson(dest, data) {
  const tmp = `${dest}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  const fd = openSync(tmp, "w");
  try {
    writeSync(fd, payload, null, "utf8");
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  if (process.platform === "win32" && existsSync(dest)) {
    unlinkSync(dest);
  }
  renameSync(tmp, dest);
}

function writeIndexes(outDir, index) {
  const l1 = [];
  const l2 = [];
  for (const e of index) {
    const stem = String(e.id).split("/").pop();
    const processedFile = `processed/${stem}.md`;
    let content = "";
    try {
      content = readFileSync(join(outDir, processedFile), "utf8");
    } catch {
      /* processed 可能尚未写入 */
    }
    l1.push({
      id: e.id,
      version: e.version,
      label: e.label,
      url: e.url,
      tags: e.tags,
      firstParagraph: firstParagraph(content),
      sections: [],
      source: e.source,
      ...(e.sha256 ? { sha256: e.sha256 } : {}),
    });
    l2.push({
      id: e.id,
      version: e.version,
      label: e.label,
      url: e.url,
      tags: e.tags,
      sections: [],
      hasCodeBlocks: content.includes("```"),
      codeBlockCount: Math.floor((content.match(/```/g) || []).length / 2),
      keySections: 0,
      file: `${stem}.md`,
      processedFile,
      source: e.source,
      ...(e.fetchedAt ? { fetchedAt: e.fetchedAt } : {}),
      ...(e.sha256 ? { sha256: e.sha256 } : {}),
    });
  }
  atomicWriteJson(join(outDir, "index-l0.json"), index);
  atomicWriteJson(join(outDir, "index-l1.json"), l1);
  atomicWriteJson(join(outDir, "index-l2.json"), l2);
}

function repairVersion(ver, dry) {
  const outDir = join(DATA, `quilt_${ver}`, "quilt-docs", ver);
  const processedDir = join(outDir, "processed");
  const l0Path = join(outDir, "index-l0.json");
  if (!existsSync(processedDir) || !existsSync(l0Path)) {
    console.warn(`skip ${ver}: missing processed or index-l0`);
    return { ver, added: [], ok: false };
  }

  const index = JSON.parse(readFileSync(l0Path, "utf8"));
  const indexed = new Set(index.map((e) => e.id.split("/").pop()));
  const stems = readdirSync(processedDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  const added = [];
  for (const stem of stems) {
    if (indexed.has(stem)) continue;
    const meta = metaForStem(ver, stem);
    if (!meta) {
      console.warn(`${ver}: unknown processed/${stem}.md — not in PAGE_META, skipped`);
      continue;
    }
    const content = readFileSync(join(processedDir, `${stem}.md`), "utf8");
    index.push({
      id: `${ver}/${stem}`,
      version: ver,
      label: meta.label,
      url: meta.url,
      tags: meta.tags,
      priority: "⭐",
      sectionCount: 1,
      source: "quilt-docs",
      fetchedAt: fetchedAtFromMd(content),
      sha256: sha(content),
    });
    added.push(stem);
  }

  // G4 清尾（2026-09-25）：已存在条目的 sha256 补齐/纠偏（口径见文件头）。
  const backfilled = [];
  for (const e of index) {
    const stem = String(e.id).split("/").pop();
    const p = join(processedDir, `${stem}.md`);
    if (!existsSync(p)) continue;
    const want = sha(readFileSync(p, "utf8"));
    if (e.sha256 !== want) {
      backfilled.push(e.sha256 ? `${stem}(纠偏)` : stem);
      e.sha256 = want;
    }
  }

  if (added.length === 0 && backfilled.length === 0) {
    console.log(`${ver}: OK (no missing index entries, sha256 全对)`);
    return { ver, added, backfilled, ok: true };
  }

  if (added.length > 0) {
    index.sort((a, b) => {
      const order = ["qsl-qfapi", "quilt-mod-json", "qsl-readme", "qsl-verified"];
      const ai = order.indexOf(a.id.split("/").pop());
      const bi = order.indexOf(b.id.split("/").pop());
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }

  if (!dry) {
    writeIndexes(outDir, index);
    console.log(
      `${ver}: repaired index (+${added.join(", ") || "无新增"}；sha 补 ${backfilled.length} 条: ${backfilled.join(", ") || "-"}) → ${index.length} pages`,
    );
  } else {
    console.log(`${ver}: would add [${added.join(", ")}]；sha 补 ${backfilled.length} 条: ${backfilled.join(", ")}`);
  }
  return { ver, added, backfilled, ok: true };
}

function auditVersion(ver) {
  const outDir = join(DATA, `quilt_${ver}`, "quilt-docs", ver);
  const processedDir = join(outDir, "processed");
  const l0Path = join(outDir, "index-l0.json");
  if (!existsSync(processedDir) || !existsSync(l0Path)) return { ver, missing: [], orphan: [], shaBad: [] };
  const index = JSON.parse(readFileSync(l0Path, "utf8"));
  const indexed = new Set(index.map((e) => e.id.split("/").pop()));
  const stems = readdirSync(processedDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  // sha256 缺口/漂移（G4 清尾口径：条目 sha256 必须 == sha(processed 内容)）
  const shaBad = [];
  for (const e of index) {
    const stem = String(e.id).split("/").pop();
    const p = join(processedDir, `${stem}.md`);
    if (!existsSync(p)) continue;
    if (e.sha256 !== sha(readFileSync(p, "utf8"))) shaBad.push(stem);
  }
  return {
    ver,
    missing: stems.filter((s) => !indexed.has(s)),
    orphan: [...indexed].filter((s) => !stems.includes(s)),
    shaBad,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const dry = argv.includes("--dry-run");
  const auditOnly = argv.includes("--audit");
  const verArg = argv.find((a) => a.startsWith("--version"));
  const version = verArg ? verArg.split("=")[1] || argv[argv.indexOf(verArg) + 1] : "all";
  const versions =
    version === "all" ? ["1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.11"] : [version];

  if (auditOnly) {
    let bad = false;
    for (const ver of versions) {
      const r = auditVersion(ver);
      if (r.missing.length || r.orphan.length || r.shaBad.length) {
        bad = true;
        console.log(
          `${ver}: missing-from-l0=[${r.missing.join(", ")}] l0-without-processed=[${r.orphan.join(", ")}] sha256-缺口=[${r.shaBad.join(", ")}]`,
        );
      } else {
        console.log(`${ver}: OK (processed↔index 双向齐、sha256 全对)`);
      }
    }
    process.exit(bad ? 1 : 0);
  }

  for (const ver of versions) {
    repairVersion(ver, dry);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
