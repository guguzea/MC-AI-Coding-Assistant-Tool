/**
 * 语义索引构建器（离线，一次构建、运行时只读）
 *
 * 产出：data/{platform}_{version}/{source}/{version}/semantic/db.sqlite
 * 表：docs / chunks / chunks_fts(FTS5 porter) / chunk_embeddings / meta
 *
 * 用法：
 *   npm run build          # 先构建 dist（embeddings/search 为 TS 模块）
 *   npm run fetch:embedding-model   # 唯一允许远程拉模型的入口 → data/_models/
 *   npm run build:semantic-index -- --all
 *   node scripts/_lib/build-semantic-index.mjs --platform=forge --version=1.20.1
 *   node scripts/_lib/build-semantic-index.mjs --all --no-embed   # 仅 FTS5
 *   node scripts/_lib/build-semantic-index.mjs --all --force      # 忽略已有索引重建
 *
 * 预计耗时：`--all` 全平台嵌入可达数十分钟（视 CPU / 文档量）；已有完整 db 默认跳过可续跑。
 * 缺模型时自动降级 FTS5-only（不 exit 1），与运行时 allowRemoteModels=false 一致。
 *
 * 导出 chunkMarkdown / splitLongText / stripFrontmatter 供 test-semantic.mjs 单测。
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import {
  SEMANTIC_DDL,
  semanticDbPath,
} from "../../dist/docs-platform/semantic/search.js";
import {
  EMBEDDING_DIM,
  EMBEDDING_MODEL,
  getEmbedder,
} from "../../dist/docs-platform/semantic/embeddings.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// scripts/_lib → mcp-server → 仓库根
const REPO_ROOT = join(__dirname, "..", "..", "..");
const DEFAULT_DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");

/** 各平台文档子目录（与 audit-data-consistency.mjs 的 docSubDirs 一致） */
const SOURCES = {
  forge: ["forge-docs"],
  fabric: ["fabric-docs", "fabric-wiki"],
  neoforge: ["neoforge-docs"],
};

export const MAX_CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 100;
const MIN_CONTENT_CHARS = 200;
const BATCH_SIZE = 32;

// ── chunker（纯函数，供单测）──────────────────────────────────────────────────

/** 移除 YAML frontmatter（--- ... ---） */
export function stripFrontmatter(md) {
  const text = md.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) return text;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, "");
}

/** 按句号/换行切分长文本，带 overlap；短文本原样返回 */
export function splitLongText(text, maxChunkSize, overlap) {
  if (text.length <= maxChunkSize) return [text];
  const parts = [];
  let remaining = text;
  while (remaining.length > maxChunkSize) {
    const start = Math.floor(maxChunkSize * 0.5);
    const window = remaining.slice(start, maxChunkSize);
    const m = window.match(/[.!?。！？\n][^.!?。！？\n]*$/);
    let cut = maxChunkSize;
    if (m && m.index !== undefined) cut = start + m.index + 1;
    parts.push(remaining.slice(0, cut));
    remaining = remaining.slice(Math.max(1, cut - overlap));
  }
  if (remaining.trim()) parts.push(remaining);
  return parts;
}

/** 将文本中的 ``` 代码块拆出为独立块 */
function splitCodeBlocks(text) {
  const blocks = [];
  const re = /```[\s\S]*?(?:```|$)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      const plain = text.slice(last, m.index).trim();
      if (plain) blocks.push({ isCode: false, text: plain });
    }
    blocks.push({ isCode: true, text: m[0] });
    last = m.index + m[0].length;
  }
  const rest = text.slice(last).trim();
  if (rest) blocks.push({ isCode: false, text: rest });
  return blocks;
}

/**
 * Markdown → 语义 chunk：
 * - 按 #/##/### 分段（首个 heading 之前为 title，之后为 section）
 * - 代码块独立为 code chunk
 * - 无 heading → 单一 full
 * - 超长段按句切分 + overlap
 */
export function chunkMarkdown(
  md,
  { maxChunkSize = MAX_CHUNK_SIZE, overlap = CHUNK_OVERLAP } = {},
) {
  const text = stripFrontmatter(md).trim();
  if (!text) return [];

  const lines = text.split("\n");
  const segments = [];
  let buffer = [];
  let hasHeading = false;
  for (const line of lines) {
    if (/^#{1,3}\s+\S/.test(line)) {
      if (buffer.length > 0) {
        // 首个 flush 的段（含文档标题与引言）为 title，其余为 section
        segments.push({
          type: hasHeading && segments.length > 0 ? "section" : "title",
          text: buffer.join("\n").trim(),
        });
      }
      buffer = [line];
      hasHeading = true;
    } else {
      buffer.push(line);
    }
  }
  if (buffer.length > 0) {
    segments.push({ type: hasHeading ? "section" : "title", text: buffer.join("\n").trim() });
  }

  const out = [];
  for (const seg of segments) {
    for (const block of splitCodeBlocks(seg.text)) {
      const type = block.isCode ? "code" : hasHeading ? seg.type : "full";
      for (const part of splitLongText(block.text, maxChunkSize, overlap)) {
        const trimmed = part.trim();
        if (trimmed) out.push({ type, text: trimmed });
      }
    }
  }
  return out;
}

// ── 构建流程 ──────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { all: false, embed: true, force: false };
  for (const a of argv) {
    if (a === "--all") args.all = true;
    else if (a === "--no-embed") args.embed = false;
    else if (a === "--force") args.force = true;
    else if (a.startsWith("--platform=")) args.platform = a.slice("--platform=".length);
    else if (a.startsWith("--version=")) args.version = a.slice("--version=".length);
    else if (a.startsWith("--source=")) args.source = a.slice("--source=".length);
    else if (a.startsWith("--data-root=")) args.dataRoot = a.slice("--data-root=".length);
  }
  return args;
}

function listPlatformVersionDirs(dataRoot, platform) {
  if (!existsSync(dataRoot)) return [];
  return readdirSync(dataRoot)
    .filter((d) => d.startsWith(`${platform}_`) && statSync(join(dataRoot, d)).isDirectory())
    .map((d) => d.slice(platform.length + 1));
}

function resolveTargets(args, dataRoot) {
  const out = [];
  if (args.all) {
    for (const platform of Object.keys(SOURCES)) {
      for (const version of listPlatformVersionDirs(dataRoot, platform)) {
        for (const source of SOURCES[platform]) out.push({ platform, version, source });
      }
    }
    return out;
  }
  const platform = args.platform;
  const version = args.version;
  if (!platform || !version) {
    throw new Error("需要 --platform 与 --version（或 --all）");
  }
  const sources = args.source ? [args.source] : (SOURCES[platform] ?? []);
  for (const source of sources) out.push({ platform, version, source });
  return out;
}

function discoverDocs(dataRoot, target) {
  const versionDir = join(dataRoot, `${target.platform}_${target.version}`, target.source, target.version);
  const processedDir = join(versionDir, "processed");
  const l0Path = join(versionDir, "index-l0.json");
  if (!existsSync(processedDir) || !existsSync(l0Path)) return null;

  const l0 = JSON.parse(readFileSync(l0Path, "utf8"));
  const l0ById = new Map();
  for (const e of l0) {
    const id = String(e.id ?? "");
    if (!id) continue;
    l0ById.set(id, e);
    l0ById.set(id.replace(/\//g, "_"), e); // neoforge: gettingstarted/modfiles ↔ gettingstarted_modfiles
    const stem = id.split("/").pop();
    if (stem) l0ById.set(stem, e);
  }

  const files = readdirSync(processedDir).filter((f) => f.endsWith(".md")).sort();
  const docs = [];
  const skipped = [];
  for (const f of files) {
    const stem = f.slice(0, -3);
    const entry = l0ById.get(stem);
    if (!entry) {
      skipped.push(f);
      continue;
    }
    docs.push({
      stem,
      id: String(entry.id),
      label: String(entry.label ?? entry.id ?? stem),
      url: String(entry.url ?? ""),
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      priority: String(entry.priority ?? "🟢"),
      sectionCount: Number(entry.sectionCount ?? 0),
    });
  }
  return { processedDir, docs, skipped, l0Count: l0.length };
}

function collectChunks(processedDir, docs) {
  const rows = [];
  for (const d of docs) {
    const md = readFileSync(join(processedDir, `${d.stem}.md`), "utf8");
    const chunks = chunkMarkdown(md);
    const filtered = chunks.filter((c) => c.text.length >= MIN_CONTENT_CHARS);
    const effective = filtered.length > 0 ? filtered : chunks.slice(0, 1);
    effective.forEach((c, i) => {
      rows.push({
        docId: d.id,
        chunkId: createHash("sha1").update(`${d.id}:${i}`).digest("hex"),
        chunkType: c.type,
        chunkOrder: i,
        text: c.text,
      });
    });
  }
  return rows;
}

async function buildIndex(dbPath, docs, chunks, embedder) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const tmpPath = `${dbPath}.tmp-${process.pid}`;
  const db = new DatabaseSync(tmpPath);
  db.exec(SEMANTIC_DDL);

  const insDoc = db.prepare(
    "INSERT INTO docs (doc_id, label, url, tags_json, priority, section_count) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const insChunk = db.prepare(
    "INSERT INTO chunks (chunk_id, doc_id, chunk_type, chunk_order, text) VALUES (?, ?, ?, ?, ?)",
  );
  const insFts = db.prepare("INSERT INTO chunks_fts (chunk_id, text) VALUES (?, ?)");
  const insEmb = db.prepare(
    "INSERT INTO chunk_embeddings (chunk_id, doc_id, embedding) VALUES (?, ?, ?)",
  );
  const insMeta = db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)");

  db.exec("BEGIN");
  for (const d of docs) {
    insDoc.run(d.id, d.label, d.url || null, JSON.stringify(d.tags), d.priority, d.sectionCount);
  }
  for (const c of chunks) {
    insChunk.run(c.chunkId, c.docId, c.chunkType, c.chunkOrder, c.text);
    insFts.run(c.chunkId, c.text);
  }
  db.exec("COMMIT");

  let embedded = 0;
  if (embedder && chunks.length > 0) {
    const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batchIdx = Math.floor(i / BATCH_SIZE) + 1;
      if (batchIdx === 1 || batchIdx % 5 === 0 || batchIdx === totalBatches) {
        console.log(`  … embedding batch ${batchIdx}/${totalBatches} (${i}/${chunks.length} chunks)`);
      }
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const vecs = await embedder.embed(batch.map((c) => c.text));
      db.exec("BEGIN");
      for (let j = 0; j < batch.length; j++) {
        const v = vecs[j];
        if (!v || v.length !== EMBEDDING_DIM) continue;
        const buf = Buffer.from(v.buffer, v.byteOffset, v.byteLength);
        if (buf.length !== EMBEDDING_DIM * 4) continue;
        insEmb.run(batch[j].chunkId, batch[j].docId, buf);
        embedded++;
      }
      db.exec("COMMIT");
    }
  }

  db.exec("BEGIN");
  insMeta.run("schemaVersion", "1");
  insMeta.run("model", EMBEDDING_MODEL);
  insMeta.run("dim", String(EMBEDDING_DIM));
  insMeta.run("docs", String(docs.length));
  insMeta.run("chunks", String(chunks.length));
  insMeta.run("embedded", String(embedded));
  insMeta.run("built_at", new Date().toISOString());
  db.exec("COMMIT");

  db.close();
  if (existsSync(dbPath)) rmSync(dbPath);
  renameSync(tmpPath, dbPath);
  return { docs: docs.length, chunks: chunks.length, embedded };
}

function indexLooksComplete(dbPath, requireEmbed = false) {
  if (!existsSync(dbPath)) return false;
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    const row = db.prepare("SELECT value FROM meta WHERE key = 'chunks'").get();
    const emb = db.prepare("SELECT value FROM meta WHERE key = 'embedded'").get();
    db.close();
    if (!row?.value) return false;
    if (requireEmbed && !(Number(emb?.value ?? 0) > 0)) return false;
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dataRoot = args.dataRoot ?? DEFAULT_DATA_ROOT;
  if (!existsSync(dataRoot)) {
    console.error(`data root 不存在: ${dataRoot}`);
    process.exit(1);
  }
  const targets = resolveTargets(args, dataRoot);
  if (targets.length === 0) {
    console.error("没有匹配的目标");
    process.exit(1);
  }

  console.log(
    `语义索引构建：${targets.length} 个目标；embed=${args.embed}；force=${args.force}` +
      `（全平台嵌入可能需数十分钟；缺模型请先 npm run fetch:embedding-model）`,
  );

  let embedder = null;
  let embedMode = "fts5-only";
  if (args.embed) {
    console.log(`加载嵌入模型 ${EMBEDDING_MODEL}（缓存 ${join(dataRoot, "_models")}）…`);
    try {
      embedder = await getEmbedder(dataRoot);
      embedMode = "hybrid";
    } catch (e) {
      console.warn(
        `[warn] 嵌入模型加载失败，降级为本构建 FTS5-only：${e?.message ?? e}\n` +
          `        请运行: npm run fetch:embedding-model`,
      );
      embedder = null;
      embedMode = "fts5-only";
    }
  }

  const summary = { embedded: 0, fts5Only: 0, skipped: 0, failed: 0 };
  let i = 0;
  for (const t of targets) {
    i++;
    const label = `${t.platform} ${t.version} ${t.source}`;
    try {
      const discovered = discoverDocs(dataRoot, t);
      if (!discovered) {
        console.log(`[skip ${i}/${targets.length}] ${label}（无 processed/l0）`);
        summary.skipped++;
        continue;
      }
      const dbPath = semanticDbPath(dataRoot, t.platform, t.version, t.source);
      if (!args.force && indexLooksComplete(dbPath, Boolean(embedder))) {
        console.log(`[skip ${i}/${targets.length}] ${label}（已有完整索引；--force 可重建）`);
        summary.skipped++;
        continue;
      }
      console.log(`[build ${i}/${targets.length}] ${label}（${discovered.docs.length} docs）…`);
      const chunks = collectChunks(discovered.processedDir, discovered.docs);
      const stats = await buildIndex(dbPath, discovered.docs, chunks, embedder);
      const mode = stats.embedded > 0 ? "embedded" : "fts5-only";
      if (mode === "embedded") summary.embedded++;
      else summary.fts5Only++;
      console.log(
        `[ok ${i}/${targets.length}] ${label}: ${stats.docs} docs / ${stats.chunks} chunks / ${stats.embedded} embedded (${mode}) → ${dbPath}`,
      );
    } catch (e) {
      summary.failed++;
      console.error(`[FAIL ${i}/${targets.length}] ${label}: ${e.message}`);
    }
  }

  // 写简短 manifest
  try {
    const manifestPath = join(dataRoot, "semantic-index-manifest.json");
    const entries = [];
    for (const t of targets) {
      const dbPath = semanticDbPath(dataRoot, t.platform, t.version, t.source);
      if (!existsSync(dbPath)) continue;
      let meta = {};
      try {
        const db = new DatabaseSync(dbPath, { readOnly: true });
        for (const row of db.prepare("SELECT key, value FROM meta").all()) {
          meta[row.key] = row.value;
        }
        db.close();
      } catch {
        /* ignore */
      }
      entries.push({
        platform: t.platform,
        version: t.version,
        source: t.source,
        path: dbPath.replace(/\\/g, "/"),
        chunks: Number(meta.chunks ?? 0),
        embedded: Number(meta.embedded ?? 0),
        built_at: meta.built_at ?? null,
        model: meta.model ?? null,
        schemaVersion: meta.schemaVersion ?? null,
        sha256: createHash("sha256").update(readFileSync(dbPath)).digest("hex"),
      });
    }
    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      manifestPath,
      JSON.stringify({ built_at: new Date().toISOString(), embedMode, entries }, null, 2),
      "utf8",
    );
    console.log(`[manifest] ${manifestPath} (${entries.length} entries)`);
  } catch (e) {
    console.warn(`[warn] 写 semantic-index-manifest.json 失败: ${e.message}`);
  }

  console.log(
    `[summary] embedMode=${embedMode} embedded=${summary.embedded} fts5-only=${summary.fts5Only} skipped=${summary.skipped} failed=${summary.failed}`,
  );
  if (summary.failed > 0) process.exit(1);
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url).replace(/\\/g, "/").endsWith(
    process.argv[1].replace(/\\/g, "/").replace(/^.*[\\/]scripts/, "scripts"),
  );
// Windows / 直接 node 调用：比较 basename
if (
  process.argv[1] &&
  (fileURLToPath(import.meta.url) === process.argv[1] ||
    fileURLToPath(import.meta.url).endsWith("build-semantic-index.mjs"))
) {
  const invoked = process.argv[1].replace(/\\/g, "/");
  if (invoked.endsWith("build-semantic-index.mjs")) {
    main().catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}
