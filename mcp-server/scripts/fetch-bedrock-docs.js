#!/usr/bin/env node
/**
 * fetch-bedrock-docs.js — Microsoft Learn Creator 页 → data/bedrock_stable/bedrock-docs/stable/
 * 同时写 data/bedrock-docs-status.json（**真探针**滞后信号）。禁止把 Java 资源包文档当 RP。
 *
 * 页清单真源 = 上游 toc.json 的 documents/ 子树（2026-09-21 实测 274 条叶子 / 247 个唯一 href）。
 * 文件顶部的 PAGES 降级为「精选兜底」：它只保证这 20 个 id 的**文件名与标签**稳定（既有语料不能改名），
 * 不再充当期望清单 —— 计数、缺页判据一律以 toc 为准。
 *
 *   node scripts/fetch-bedrock-docs.js [--dry-run] [--force] [--probe] [--retag [--write]] [--reprocess [--write] [--ids=a,b]] [--limit=N] [--parallel=N]
 *
 *   --dry-run   只列计划（拉 toc、算 id、不抓正文、不写盘）
 *   --force     重抓已落盘的页（默认跳过，增量）
 *   --probe     只跑 HEAD 探针：测远端 revision 并回写 stale，不碰语料
 *   --retag     离线：把体裁判据（isReleaseNotesPage / withGenreTags）重放到已落盘的 index-l0.json，
 *               默认 dry-run；加 --write 才落盘，并同步 semantic/db.sqlite 的 docs.tags_json
 *   --reprocess 只重处理**顶部精选页**（PAGES 那 20 个 id，`--ids=` 可缩到子集），不碰 toc 抓来的
 *               其余页：优先读本机 raw HTML 缓存（$MC_SKILL_CACHE/bedrock-raw/），缓存缺失才逐 URL
 *               补抓并把 HTML 存进该缓存（第二次跑即零网络）。默认只列现状、不写盘；加 --write 才落
 *               processed/<id>.md + index-l0.json + fingerprints.json。存在的理由：转换器改版后要把
 *               旧页重过一遍管线，而 --force 会重抓整棵树。
 *
 * 退出码：有任一页抓取/写盘失败，或 toc 取不到 ⇒ 非 0（抓到 0 字节 / 空壳页同样计失败，不静默咽掉）。
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, isAbsolute, resolve } from "path";
import { homedir } from "os";
import { pathToFileURL } from "url";
import { fetchJsonWithUa, fetchWithUa } from "../../scripts/_lib/fetch-with-ua.mjs";
import {
  DATA,
  FINGERPRINTS,
  INDEX_L0,
  LEARN_BASE,
  OUT_DIR,
  PROCESSED_DIR,
  STATUS_PATH,
  TOC_URL,
  VIEW,
  bedrockMdHeader,
  isDirectRun,
  learnPageFingerprint,
  learnToMarkdown,
  mergeIndexL0,
  readJsonSafe,
  sha as sha256,
  shortHash,
  writeJsonWithRetry,
  writeWithRetry,
} from "./_lib/bedrock-corpus.mjs";

export function sha(s) {
  return sha256(s);
}

/** 对所有成功抓取页的 raw HTML 做短哈希，避免只哈希第一页导致漏更新。 */
export function hashRevision(parts) {
  return shortHash(parts);
}

/** 从 @minecraft/server Learn 页抽取稳定模块版本（如 1.14.0）。 */
export function extractScriptApiStable(html) {
  if (!html) return null;
  const near = String(html).match(/@minecraft\/server[\s\S]{0,400}?(\d+\.\d+\.\d+)/i);
  return near?.[1] ?? null;
}

/**
 * 体裁标签（genre tag）——**标签词表的登记处就是这里**，生产者算，不靠手改 JSON。
 *
 * 为什么要机器算：`mergeIndexL0()` 每次重抓都按 id **整条覆写**索引项（含 tags），
 * 手改 `index-l0.json` 下一次抓取就没了。所以「哪一页属什么体裁」必须在生成索引时判定。
 *
 * 消费侧同名常量在 `mcp-server/src/bedrock/index.ts`（`BEDROCK_RELEASE_NOTES_TAG`），
 * 两侧拼写必须一致，改一处必须改两处。
 */
export const RELEASE_NOTES_TAG = "release-notes";

/**
 * 「版本更新说明 / release notes」体裁判据（两条都要成立，逐字可从数据本身核对）：
 *  1. 路径段 = `documents/update<数字段>`（`update1.21.30` / `update1.20`），Learn 侧这一族页面
 *     的 URL 尾段就是引擎版本号，没有第二种用法；
 *  2. 标题措辞 = `… Update Summary`（Learn 对该族的固定页标题模板）。
 *
 * 刻意**不**用「标题含 version / change / update 之一」这种宽判据：那会误伤
 * `entity-versioning`、`basegameversioning`、`scripting/versioning`、`practices/latestplatformversion`、
 * `skinpack`(Change Your Look…)、`worldheightchange`(World Height Changes…) —— 这些是教程/参考页，
 * 实测本树共 6 条同形干扰项，逐条核过。
 *
 * @param idOrPath 索引 id（`stable/documents/update1.21.30`）或计划里的裸路径（`documents/update1.21.30`）
 * @param label 页面标题
 */
export function isReleaseNotesPage(idOrPath, label) {
  const path = String(idOrPath ?? "").replace(/^stable\//, "");
  const tail = path.split("/").pop() ?? "";
  const pathOk = /^update\d+(?:\.\d+)*$/i.test(tail);
  const labelOk = /\bupdate\s+summary\b/i.test(String(label ?? ""));
  return pathOk && labelOk;
}

/** 把体裁标签并进页 tags（去重、不改既有标签顺序 —— 既有 tag 是检索口径，不得重排）。 */
export function withGenreTags(tags, idOrPath, label) {
  const list = Array.isArray(tags) ? [...tags] : [];
  if (isReleaseNotesPage(idOrPath, label) && !list.includes(RELEASE_NOTES_TAG)) {
    list.push(RELEASE_NOTES_TAG);
  }
  return list;
}

/**
 * 精选兜底页：只为**保住既有 20 个文件名与标签**（旧语料 id 不得改名）。
 * 页清单真源是 toc —— 这里被 toc 覆盖到的条目会在 documentsPlan() 里让位（同 href 去重）。
 */
export const PAGES = [
  { id: "pack-manifest", label: "Pack manifest", url: "reference/content/addonsreference/packmanifest", tags: ["manifest", "pack"] },
  { id: "experimental-features-toggle", label: "Experimental Features Toggle", url: "documents/experimentalfeaturestoggle", tags: ["experiments", "beta"] },
  { id: "script-server", label: "@minecraft/server", url: "scriptapi/minecraft/server/minecraft-server", tags: ["script", "server"] },
  { id: "script-api-intro", label: "Script API introduction", url: "documents/scripting/introduction", tags: ["script"] },
  { id: "getting-started", label: "Getting Started with Minecraft Add-Ons", url: "documents/gettingstarted", tags: ["pack", "intro"] },
  { id: "resource-pack", label: "Introduction to Resource Packs", url: "documents/resourcepack", tags: ["resourcepack", "rp"] },
  { id: "behavior-pack", label: "Introduction to Behavior Packs", url: "documents/behaviorpack", tags: ["behaviorpack", "bp"] },
  { id: "entity-behavior-intro", label: "Entity Behavior Introduction", url: "documents/entitybehaviorintroduction", tags: ["entity", "bp"] },
  { id: "entity-components", label: "Entity Components", url: "reference/content/entityreference/examples/componentlist", tags: ["entity", "components"] },
  { id: "custom-block", label: "Create a Custom Die Block", url: "documents/customblock", tags: ["block", "bp", "rp"] },
  { id: "block-components", label: "Block Components", url: "reference/content/blockreference/examples/blockcomponents/blockcomponentslist", tags: ["block", "components"] },
  { id: "custom-items", label: "How to Add Custom Items", url: "documents/addcustomitems", tags: ["item", "bp"] },
  { id: "item-components", label: "Item Components", url: "reference/content/itemreference/examples/itemcomponentlist", tags: ["item", "components"] },
  { id: "molang-intro", label: "An Introduction to Molang", url: "documents/molang/introduction", tags: ["molang"] },
  { id: "molang-syntax", label: "Molang Syntax Guide", url: "documents/molang/syntax-guide", tags: ["molang"] },
  { id: "features-intro", label: "Introduction to Features", url: "reference/content/featuresreference/examples/featuresintroduction", tags: ["worldgen", "features"] },
  { id: "biomes", label: "Biomes", url: "reference/content/biomesreference/examples/componentlist", tags: ["worldgen", "biome"] },
  { id: "world-after-events", label: "WorldAfterEvents", url: "scriptapi/minecraft/server/worldafterevents", tags: ["script", "events"] },
  { id: "system-after-events", label: "SystemAfterEvents", url: "scriptapi/minecraft/server/systemafterevents", tags: ["script", "events"] },
  { id: "script-server-ui", label: "@minecraft/server-ui", url: "scriptapi/minecraft/server-ui/minecraft-server-ui", tags: ["script", "ui"] },
].map((p) => ({ ...p, url: `${LEARN_BASE}${p.url}?view=${VIEW}` }));

/** toc.json 的树键是 children（不是 items）；实测 metadata.count_of_node_with_href = 2814。 */
export function collectTocLeaves(toc) {
  const leaves = [];
  const walk = (arr, crumbs) => {
    for (const n of arr || []) {
      const title = n.toc_title || "";
      const path = crumbs.length ? `${crumbs.join(" > ")} > ${title}` : title;
      if (n.href) leaves.push({ href: n.href.replace(/^\.\//, ""), title, crumbs: path });
      if (Array.isArray(n.children)) walk(n.children, [title]);
      else if (Array.isArray(n.items)) walk(n.items, [title]);
    }
  };
  walk(toc?.items ?? [], []);
  return leaves;
}

/** documents/ 子树 → 抓取计划。同 href 在 toc 里重复出现（实测 27 个键重复），按 href 去重。 */
export function documentsPlan(leaves) {
  const curatedByPath = new Map(
    PAGES.map((p) => [new URL(p.url).pathname.replace(/^\/en-us\/minecraft\/creator\//, ""), p]),
  );
  const seen = new Set();
  const plan = [];
  for (const leaf of leaves) {
    const clean = leaf.href.split("?")[0].replace(/\/$/, "");
    if (!/^documents\//i.test(clean)) continue;
    if (seen.has(clean)) continue;
    seen.add(clean);
    const curated = curatedByPath.get(clean);
    if (curated) {
      // 精选页保留旧文件名与标签，同时把 toc 的权威标题带上（不改 id，只改 label 来源）
      plan.push({ id: curated.id, label: curated.label, url: curated.url, tags: curated.tags, source: "curated", tocTitle: leaf.title });
      continue;
    }
    const slug = clean.replace(/^documents\//i, "").toLowerCase();
    const crumb = leaf.crumbs.split(" > ").filter(Boolean).slice(1, 3);
    const tags = withGenreTags(
      [...new Set(["documents", ...crumb.map((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")).filter((t) => t && t.length > 2)])],
      `documents/${slug}`,
      leaf.title,
    );
    plan.push({
      id: `documents/${slug}`,
      label: leaf.title || slug,
      url: `${LEARN_BASE}${clean}?view=${VIEW}`,
      tags,
      source: "toc",
    });
  }
  // 精选兜底页一律保证在计划里：toc 没有该 href 时（改名 / 下架 / 只挂 reference 树）由这里补回。
  // 少了这一步，「兜底」会在 toc 缺项时静默丢页 —— 正是要防的形态。
  for (const p of PAGES) {
    if (plan.some((e) => e.id === p.id)) continue;
    plan.push({ ...p, source: "curated" });
  }
  return plan;
}

/**
 * HEAD 探针的 canary：固定 8 页，跨不同子树。
 * 注意分工：canary 是**探针定义**（"远端现在长什么样"用这 8 页的 gitcommit 聚合），
 * 不是页清单真源 —— 真源仍是 toc，二者不得混为一谈。
 */
export const CANARY = [
  "documents/gettingstarted",
  "documents/behaviorpack",
  "documents/resourcepack",
  "documents/customblock",
  "documents/molang/introduction",
  "documents/experimentalfeaturestoggle",
  "reference/content/addonsreference/packmanifest",
  "reference/content/entityreference/examples/componentlist",
];
export const CANARY_URLS = CANARY.map((c) => `${LEARN_BASE}${c}?view=${VIEW}`);

/** 用 fingerprints.json（本地语料生成时抓到的指纹）算 localRevision。 */
export function localRevisionFrom(fp, fetchedOrder = CANARY_URLS) {
  const parts = [];
  let judged = 0;
  for (const url of fetchedOrder) {
    const rec = fp?.[url];
    if (!rec?.commit && !rec?.updatedAt) continue;
    judged++;
    parts.push(`${url}#${rec.commit ?? ""}@${rec.updatedAt ?? ""}`);
  }
  return { revision: judged === fetchedOrder.length ? shortHash(parts) : null, judged, total: fetchedOrder.length };
}

/** 实测远端：逐 canary 页取 gitcommit sha + updated_at。任一页取不到 ⇒ 整次探针失败（不得半算）。 */
async function probeRemote({ timeoutMs = 60_000 } = {}) {
  const fps = {};
  const failures = [];
  for (const url of CANARY_URLS) {
    const r = await fetchWithUa(url, { timeoutMs });
    if (!r.ok) {
      failures.push({ url, failureClass: r.failureClass ?? "UNKNOWN", status: r.status ?? 0, reason: String(r.reason ?? "").slice(0, 200) });
      continue;
    }
    const fp = learnPageFingerprint(r.text);
    if (!fp.commit && !fp.updatedAt) {
      failures.push({ url, failureClass: "NO_FINGERPRINT", status: r.status ?? 200, reason: "页内无 gitcommit / updated_at meta" });
      continue;
    }
    fps[url] = fp;
  }
  const parts = CANARY_URLS.map((u) => `${u}#${fps[u]?.commit ?? ""}@${fps[u]?.updatedAt ?? ""}`);
  const complete = failures.length === 0;
  return { revision: complete ? shortHash(parts) : null, fingerprints: fps, failures, complete };
}

/**
 * 空壳判据分两级（与 scripts/fetch-forge-docs.js 的 `OK SHORT` 口径对齐）：
 *   · 正文 < SHELL_BODY_CHARS ⇒ 真·空壳，计失败并让退出码非 0（静默咽掉失败是原罪）；
 *   · 正文 < MIN_BODY_CHARS   ⇒ 上游确有短页（如 rtxpbrtutorial 实测 346 字符），照样落盘，只打 `OK SHORT`。
 * 旧版把两级揉成一级，会把合法短页永远挡在门外、还报成抓取失败。
 */
export const MIN_BODY_CHARS = 400;
export const SHELL_BODY_CHARS = 120;

async function pool(items, size, worker) {
  const out = [];
  let i = 0;
  const runners = Array.from({ length: Math.max(1, size) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return out;
}

/**
 * `--reprocess` 腿的 raw HTML 缓存目录 —— 与 `mcp-server/src/utils/path.ts` 的
 * `resolveCacheRoot()` 同一优先级（MC_SKILL_CACHE → %APPDATA%/mc-skill-cache →
 * ~/.config/mc-skill-cache），**绝不落在仓库 data/ 下**：data/ 是上游逐字语料，
 * 抓取中间产物进去就等于污染真源。
 */
export function reprocessRawDir() {
  const env = process.env.MC_SKILL_CACHE;
  let root;
  if (env) root = isAbsolute(env) ? env : resolve(env);
  else if (process.platform === "win32") root = process.env.APPDATA ? join(process.env.APPDATA, "mc-skill-cache") : join(homedir(), "mc-skill-cache");
  else root = join(homedir(), ".config", "mc-skill-cache");
  return join(root, "bedrock-raw");
}

async function main() {
  const dry = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const probeOnly = process.argv.includes("--probe");
  const retagOnly = process.argv.includes("--retag");
  const reprocessOnly = process.argv.includes("--reprocess");
  const writeRetag = process.argv.includes("--write");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const parArg = process.argv.find((a) => a.startsWith("--parallel="));
  const limit = limitArg ? Number.parseInt(limitArg.slice(8), 10) : Infinity;
  const parallel = parArg ? Math.min(8, Math.max(1, Number.parseInt(parArg.slice(10), 10))) : 4;
  const ver = "stable";

  // ── 探针腿：只测远端、只回写 status ────────────────────────────────────────────
  if (probeOnly) {
    const fpDisk = readJsonSafe(FINGERPRINTS) ?? {};
    const loc = localRevisionFrom(fpDisk);
    const rem = await probeRemote();
    const prev = readJsonSafe(STATUS_PATH) ?? {};
    const stale = loc.revision === null || rem.revision === null ? "unknown" : loc.revision !== rem.revision;
    const status = {
      ...prev,
      localRevision: loc.revision,
      remoteRevision: rem.revision,
      stale,
      checkedAt: new Date().toISOString(),
      staleBasis: "canary 页 <meta name=gitcommit> 的上游 commit sha + updated_at 聚合短哈希；local 取自 fingerprints.json",
      probe: {
        canaryPages: CANARY_URLS.length,
        localJudged: loc.judged,
        remoteJudged: CANARY_URLS.length - rem.failures.length,
        ok: rem.complete && loc.revision !== null,
        failures: rem.failures,
      },
    };
    if (!dry) {
      await writeJsonWithRetry(STATUS_PATH, status);
      console.log(`probe: local=${loc.revision} remote=${rem.revision} stale=${stale}（canary ${CANARY_URLS.length}，失败 ${rem.failures.length}）`);
    } else {
      console.log(JSON.stringify({ probe: status.probe, local: loc.revision, remote: rem.revision, stale }, null, 2));
    }
    // 探针失败必须可区分，且不得让调用方以为「一切正常」
    process.exitCode = rem.complete && loc.revision !== null ? 0 : 1;
    if (process.exitCode) console.error(`PROBE FAIL：远端或本地指纹取不全（失败 ${rem.failures.length} 条），stale 记为 ${stale} 而非 false`);
    return;
  }

  // ── 体裁标签腿：离线按同一套判据给已落盘索引补/校 tag，不抓正文 ────────────────
  // 存在的理由：判据是**生产者**的函数，索引却是上一次抓取写下的。改了判据不想重抓全文时，
  // 用这条腿把同一个函数应用到既有 index-l0 上 —— 与 documentsPlan 走的是同一份代码，
  // 所以「现在打上的标签」和「下次重抓算出的标签」不可能分叉。默认 dry-run，`--write` 才落盘。
  if (retagOnly) {
    const disk = readJsonSafe(INDEX_L0);
    if (!Array.isArray(disk)) {
      console.error(`RETAG FAIL：${INDEX_L0} 读不到或不是数组，拒绝在坏索引上写标签。`);
      process.exitCode = 1;
      return;
    }
    const changed = [];
    const next = disk.map((e) => {
      const tags = withGenreTags(e?.tags, e?.id, e?.label);
      if (tags.length === (e?.tags?.length ?? 0) && tags.every((t, i) => t === e.tags[i])) return e;
      changed.push({ id: e.id, from: [...(e.tags ?? [])].join(","), to: tags.join(",") });
      return { ...e, tags };
    });
    const totalRN = next.filter((e) => (e.tags ?? []).includes(RELEASE_NOTES_TAG)).length;
    console.log(
      `retag ${writeRetag ? "WRITE" : "DRY-RUN"}：index-l0 ${next.length} 条，` +
        `本次判为 release-notes 共 ${totalRN} 条，需要改动的 ${changed.length} 条`,
    );
    for (const c of changed.slice(0, 40)) console.log(`  ~ ${c.id}: [${c.from}] -> [${c.to}]`);
    if (!writeRetag) {
      console.log("（未写盘；加 --write 才落 index-l0.json + 同步 semantic/db.sqlite 的 docs.tags_json）");
      return;
    }
    await writeJsonWithRetry(INDEX_L0, next);
    let sqliteUpdated = 0;
    let sqliteNote = "";
    const dbPath = join(OUT_DIR, "semantic", "db.sqlite");
    if (existsSync(dbPath)) {
      try {
        const { DatabaseSync } = await import("node:sqlite");
        const db = new DatabaseSync(dbPath);
        const upd = db.prepare("UPDATE docs SET tags_json = ? WHERE doc_id = ?");
        for (const e of next) {
          const row = db.prepare("SELECT tags_json FROM docs WHERE doc_id = ?").get(e.id);
          if (!row) continue;
          const want = JSON.stringify(e.tags ?? []);
          if (row.tags_json === want) continue;
          upd.run(want, e.id);
          sqliteUpdated++;
        }
        db.close();
        sqliteNote = `semantic/db.sqlite 同步 ${sqliteUpdated} 行 docs.tags_json`;
      } catch (e) {
        sqliteNote = `semantic/db.sqlite **未**同步（${e?.message ?? e}）；` +
          `语义通道的 tags 会滞后于索引，检索降权已改为以 index-l0 的 tags 为准，不受影响`;
      }
    } else {
      sqliteNote = "无 semantic/db.sqlite，跳过语义侧同步";
    }
    console.log(`retag 完成：index-l0 写入 ${next.length} 条（改动 ${changed.length}）；${sqliteNote}`);
    return;
  }

  // ── 重处理腿：同一份 raw HTML 再过一遍转换管线，不重抓、不动其余页 ─────────────
  // 存在的理由：`--force` 的语义是「整棵树重抓」，代价是 250+ 页网络写盘；而转换器改版后
  // 真正想验证的是**同一份 HTML 重新过管线**的结果。本腿把 HTML 缓到
  // `resolveCacheRoot()/bedrock-raw/<id>.html`（**绝不写 data/**，与 `ingest_loader_api`
  // 只写 overlay 同一口径），于是第二次 `--reprocess` 是零网络的。缓存缺失才逐 URL 补抓，
  // 抓到的 HTML 当场入缓存。默认 dry-run，`--write` 才落盘（与 --retag 同规矩）。
  if (reprocessOnly) {
    const idsArg = process.argv.find((a) => a.startsWith("--ids="));
    const want = idsArg ? idsArg.slice("--ids=".length).split(",").map((s) => s.trim()).filter(Boolean) : null;
    const targets = PAGES.filter((p) => !want || want.includes(p.id));
    if (!targets.length) {
      console.error(`REPROCESS FAIL：--ids 一个都没命中。可选 id：${PAGES.map((p) => p.id).join(", ")}`);
      process.exitCode = 1;
      return;
    }
    const rawDir = reprocessRawDir();
    const cached = targets.filter((p) => existsSync(join(rawDir, `${p.id}.html`)));
    console.log(
      `reprocess ${writeRetag ? "WRITE" : "DRY-RUN"}：目标 ${targets.length} 页 · 本地 HTML 缓存命中 ${cached.length} / ` +
        `需补抓 ${targets.length - cached.length}（缓存目录 ${rawDir}）`,
    );
    for (const p of targets) {
      const f = join(PROCESSED_DIR, `${p.id}.md`);
      const cur = existsSync(f) ? readFileSync(f, "utf8") : "";
      console.log(
        `  ${p.id}: ${cur ? `${cur.length} B` : "缺失"} ` +
          `抓取时间 ${(cur.match(/抓取时间：(\S+)/) ?? [])[1] ?? "-"}`,
      );
    }
    if (!writeRetag) {
      console.log("（未写盘；加 --write 才落 processed/*.md + index-l0.json + fingerprints.json）");
      return;
    }
    mkdirSync(rawDir, { recursive: true });
    mkdirSync(PROCESSED_DIR, { recursive: true });
    const fpDisk = readJsonSafe(FINGERPRINTS) ?? {};
    const index = [];
    const failures = [];
    let fromCache = 0;
    let refetched = 0;
    for (const p of targets) {
      const cacheFile = join(rawDir, `${p.id}.html`);
      let html = null;
      if (existsSync(cacheFile)) {
        html = readFileSync(cacheFile, "utf8");
        fromCache++;
      } else {
        const r = await fetchWithUa(p.url, { timeoutMs: 60_000 });
        if (!r.ok || !r.text) {
          failures.push({ id: p.id, url: p.url, failureClass: r.failureClass ?? "UNKNOWN", status: r.status ?? 0, reason: String(r.reason ?? "无正文").slice(0, 200) });
          continue;
        }
        html = r.text;
        try {
          writeFileSync(cacheFile, html);
        } catch (e) {
          console.log(`  ! HTML 缓存写入失败（不影响语料）：${e?.code ?? ""} ${e?.message ?? e}`.slice(0, 160));
        }
        refetched++;
      }
      if (html.length < 1000) {
        failures.push({ id: p.id, url: p.url, failureClass: "TOO_SMALL", status: 200, reason: `HTML 仅 ${html.length} 字节` });
        continue;
      }
      const body = learnToMarkdown(html, p.url);
      if (body.length < SHELL_BODY_CHARS) {
        failures.push({ id: p.id, url: p.url, failureClass: "EMPTY_SHELL", status: 200, reason: `正文仅 ${body.length} 字符（< ${SHELL_BODY_CHARS}）` });
        continue;
      }
      const md = `${bedrockMdHeader(p.url)}${body.slice(0, 200_000)}\n`;
      try {
        await writeWithRetry(join(PROCESSED_DIR, `${p.id}.md`), md);
      } catch (e) {
        failures.push({ id: p.id, url: p.url, failureClass: "WRITE_FAIL", status: 0, reason: `${e.code ?? ""} ${e.message}`.slice(0, 200) });
        continue;
      }
      fpDisk[p.url] = learnPageFingerprint(html);
      index.push({
        id: `${ver}/${p.id}`,
        version: ver,
        label: p.label,
        url: p.url,
        tags: withGenreTags(p.tags, p.id, p.label),
        priority: "⭐",
        // P-2（2026-09-25）：S14-T3 的口径推广到本腿，此前硬编码 1 把整棵树刷成直方 {"1":258}。
        // 口径与 fetch-bedrock-script-api.mjs:376 一致 = 页面 `^## ` 一级章节数。
        sectionCount: [...md.matchAll(/^## /gm)].length,
        source: "bedrock-docs",
        origin: p.source ?? "curated",
        fetchedAt: new Date().toISOString(),
        sha256: sha256(md),
      });
      console.log(`  ok ${p.id} ${md.length} B`);
    }
    if (index.length) {
      await writeJsonWithRetry(INDEX_L0, mergeIndexL0(index));
      await writeJsonWithRetry(FINGERPRINTS, fpDisk);
    }
    console.log(
      `reprocess 完成：重写 ${index.length}/${targets.length} 页（HTML 来自缓存 ${fromCache} / 补抓 ${refetched}）· 失败 ${failures.length}`,
    );
    for (const x of failures.slice(0, 20)) console.log(`  FAIL ${x.id} ${x.failureClass} ${x.reason}`);
    process.exitCode = failures.length ? 1 : 0;
    return;
  }

  // ── 枚举腿：toc 真源 ─────────────────────────────────────────────────────────
  const toc = await fetchJsonWithUa(TOC_URL, { timeoutMs: 90_000 });
  if (!toc.ok) {
    console.error(`TOC FAIL：${toc.failureClass ?? "UNKNOWN"} HTTP ${toc.status ?? 0} —— ${String(toc.reason ?? "").slice(0, 300)}`);
    console.error("页清单真源取不到 ⇒ 直接失败退出，绝不回退到硬编码 PAGES 假装抓全了。");
    process.exitCode = 1;
    return;
  }
  const leaves = collectTocLeaves(toc.json);
  const docLeaves = leaves.filter((l) => /^documents\//i.test(l.href.replace(/^\.\//, "")));
  let plan = documentsPlan(leaves);
  const planned = plan.length;
  if (Number.isFinite(limit)) plan = plan.slice(0, limit);

  console.log(
    `toc: ${leaves.length} 叶子（toc 自报 count_of_node_with_href=${toc.json?.metadata?.count_of_node_with_href ?? "?"}），` +
      `documents/ 族 ${docLeaves.length} 叶子 → 去重后 ${plan.filter((p) => /^documents\//.test(p.id) || p.source === "curated").length}/${planned} 页计划` +
      `（curated ${plan.filter((p) => p.source === "curated").length}）`,
  );

  if (dry) {
    const skip = plan.filter((p) => existsSync(join(PROCESSED_DIR, `${p.id}.md`))).length;
    console.log(JSON.stringify({
      dryRun: true,
      outDir: OUT_DIR,
      planned: plan.length,
      alreadyOnDisk: force ? 0 : skip,
      toFetch: force ? plan.length : plan.length - skip,
      firstTen: plan.slice(0, 10).map((p) => `${p.id}  <-  ${p.url}`),
      lastTen: plan.slice(-10).map((p) => p.id),
    }, null, 2));
    return;
  }

  mkdirSync(PROCESSED_DIR, { recursive: true });
  const index = [];
  const fpDisk = readJsonSafe(FINGERPRINTS) ?? {};
  let fetched = 0;
  let reused = 0;
  let failed = 0;
  const failures = [];
  const shortPages = [];
  let scriptServerHtml = null;

  const results = await pool(plan, parallel, async (page) => {
    const file = join(PROCESSED_DIR, `${page.id}.md`);
    if (!force && existsSync(file) && readFileSync(file, "utf8").trim().length >= SHELL_BODY_CHARS) {
      // 增量：已有页不重抓，但指纹必须有，否则 localRevision 算不全
      if (!fpDisk[page.url]) {
        const r = await fetchWithUa(page.url, { timeoutMs: 60_000 });
        if (r.ok) fpDisk[page.url] = learnPageFingerprint(r.text);
      }
      reused++;
      return { kind: "reused", page, file };
    }
    const r = await fetchWithUa(page.url, { timeoutMs: 60_000 });
    if (!r.ok) {
      failures.push({ id: page.id, url: page.url, failureClass: r.failureClass ?? "UNKNOWN", status: r.status ?? 0, reason: String(r.reason ?? "").slice(0, 200) });
      failed++;
      return { kind: "fetchfail", page };
    }
    const html = r.text ?? "";
    if (html.length < 1000) {
      failures.push({ id: page.id, url: page.url, failureClass: "TOO_SMALL", status: r.status ?? 200, reason: `HTML 仅 ${html.length} 字节` });
      failed++;
      return { kind: "shell", page };
    }
    const body = learnToMarkdown(html, page.url);
    if (body.length < SHELL_BODY_CHARS) {
      failures.push({ id: page.id, url: page.url, failureClass: "EMPTY_SHELL", status: r.status ?? 200, reason: `正文仅 ${body.length} 字符（< ${SHELL_BODY_CHARS}，真·空壳）` });
      failed++;
      return { kind: "shell", page };
    }
    if (body.length < MIN_BODY_CHARS) shortPages.push(`${page.id}(${body.length})`);
    const md = `${bedrockMdHeader(page.url)}${body.slice(0, 200_000)}\n`;
    try {
      await writeWithRetry(file, md);
    } catch (e) {
      failures.push({ id: page.id, url: page.url, failureClass: "WRITE_FAIL", status: 0, reason: `${e.code ?? ""} ${e.message}`.slice(0, 200) });
      failed++;
      return { kind: "writefail", page };
    }
    fpDisk[page.url] = learnPageFingerprint(html);
    if (page.id === "script-server") scriptServerHtml = html;
    fetched++;
    return { kind: "ok", page, file, md, bytes: md.length };
  });

  for (const res of results) {
    if (!res || res.kind === "fetchfail" || res.kind === "shell" || res.kind === "writefail") continue;
    const p = res.page;
    // P-2（2026-09-25）：正文只读一次，sectionCount 与 sha256 共用。reused 腿没有 res.md，读盘上正文；
    // sectionCount 口径与 fetch-bedrock-script-api.mjs:376 一致 = `^## ` 一级章节数，此前硬编码 1。
    const mdText = res.md ?? (existsSync(res.file) ? readFileSync(res.file, "utf8") : "");
    index.push({
      id: `${ver}/${p.id}`,
      version: ver,
      label: p.label,
      url: p.url,
      // 体裁标签在**这里再算一次**（幂等）：documentsPlan 的 curated 分支与「toc 缺项时补回兜底页」
      // 分支都绕过了上面那处，索引写盘前的这个收口才是两类分支共同的必经通道。
      tags: withGenreTags(p.tags, p.id, p.label),
      priority: "⭐",
      sectionCount: [...mdText.matchAll(/^## /gm)].length,
      source: "bedrock-docs",
      origin: p.source,
      fetchedAt: new Date().toISOString(),
      sha256: sha256(mdText),
    });
    console.log(`${res.kind === "ok" ? "ok" : "reuse"} ${p.id}`);
  }

  // 保住其它来源的既有索引条目（scriptapi 语料等），只 upsert 本次这批
  const merged = mergeIndexL0(index);
  await writeJsonWithRetry(INDEX_L0, merged);
  await writeJsonWithRetry(FINGERPRINTS, fpDisk);

  const prev = readJsonSafe(STATUS_PATH) ?? {};
  const loc = localRevisionFrom(fpDisk);
  const rem = await probeRemote();
  const stale = loc.revision === null || rem.revision === null ? "unknown" : loc.revision !== rem.revision;
  const extracted = scriptServerHtml ? extractScriptApiStable(scriptServerHtml) : null;
  const fetchedAt = new Date().toISOString();
  const status = {
    localRevision: loc.revision,
    remoteRevision: rem.revision,
    scriptApiStable: extracted ?? prev.scriptApiStable ?? "1.11.0",
    scriptApiBeta: prev.scriptApiBeta ?? "beta",
    fetchedAt,
    stale,
    checkedAt: fetchedAt,
    staleBasis: loc.revision === null
      ? "localRevision 取不到：fingerprints.json 里 canary 指纹不全，跑一次 --force 或 --probe 补齐"
      : "canary 页 <meta name=gitcommit> 的上游 commit sha + updated_at 聚合短哈希；local 取自 fingerprints.json，remote 由本次探针实测",
    probe: {
      canaryPages: CANARY_URLS.length,
      localJudged: loc.judged,
      remoteJudged: CANARY_URLS.length - rem.failures.length,
      ok: rem.complete && loc.revision !== null,
      failures: rem.failures.slice(0, 20),
    },
    corpus: {
      tocLeaves: leaves.length,
      documentsLeaves: docLeaves.length,
      planned,
      written: plan.length - failed - reused,
      reused,
      failed,
      shortPages: shortPages.length,
      indexEntries: merged.length,
    },
  };
  await writeJsonWithRetry(STATUS_PATH, status);
  console.log(
    `wrote ${OUT_DIR}：抓 ${fetched} 页 / 复用 ${reused} 页 / 失败 ${failed} 页；index-l0 共 ${merged.length} 条（合并前 ${plan.length} 计划）` +
      (shortPages.length ? `\nOK SHORT ${shortPages.length} 页（上游合法短页，已落盘）：${shortPages.slice(0, 8).join(", ")}` : "") +
      `\nstatus: local=${loc.revision} remote=${rem.revision} stale=${stale}`,
  );
  if (failures.length) {
    console.error(`FAILURES ${failures.length} 条（前 10）：`);
    for (const f of failures.slice(0, 10)) console.error(`  - ${f.id}: ${f.failureClass} ${f.reason}`);
    process.exitCode = 1;
  }
}

if (isDirectRun(import.meta.url) || pathToFileURL(process.argv[1] ?? "").href === import.meta.url) {
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}
