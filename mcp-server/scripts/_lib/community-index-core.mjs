/**
 * community-index-core.mjs — indexes/index-l0.json 的派生规则（无副作用）。
 * 写盘与 CLI 输出留在 scripts/build-community-index.mjs；
 * test-core 的 [community-index] 门禁 import 这里，保证「正文 → 索引」口径只有一份。
 */
import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join, dirname, relative } from "path";

export function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { meta: {}, body: text };
  const end = text.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: text };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const meta = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      v = v.replace(/^["']|["']$/g, "");
    }
    meta[m[1]] = v;
  }
  return { meta, body };
}

export function firstParagraph(body) {
  const lines = body.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  return (lines[0] || "").replace(/^>\s*/, "").slice(0, 200);
}

export function walkMd(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkMd(p, out);
    else if (
      name.endsWith(".md") &&
      name.toLowerCase() !== "readme.md" &&
      name.toLowerCase() !== "attribution.md" &&
      name.toLowerCase() !== "agent_usage.md"
    ) {
      out.push(p);
    }
  }
  return out;
}

export function sourceKindOf(rel) {
  if (rel.startsWith("permitted" + "/") || rel.startsWith("permitted\\")) return "permitted";
  if (rel.startsWith("links" + "/") || rel.startsWith("links\\")) return "links";
  if (rel.startsWith("authored" + "/") || rel.startsWith("authored\\")) return "authored";
  return "unknown";
}

export function loadNearestMeta(file) {
  let dir = dirname(file);
  for (let i = 0; i < 4; i++) {
    const metaPath = join(dir, "meta.json");
    if (existsSync(metaPath)) {
      try {
        return JSON.parse(readFileSync(metaPath, "utf8"));
      } catch {
        return null;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** 扫描 root 下的知识文件，派生 l0 entries（已按 id 排序）。 */
export function buildEntries(root) {
  const entries = [];
  for (const file of walkMd(root)) {
    const rel = relative(root, file).replace(/\\/g, "/");
    if (rel.startsWith("indexes/")) continue;
    // patterns/ 是代码模式库框架，不进 community 搜索索引（避免 sourceKind=unknown）
    if (rel.startsWith("patterns/")) continue;
    const text = readFileSync(file, "utf8");
    const { meta, body } = parseFrontmatter(text);
    const kind = meta.sourceKind || sourceKindOf(rel);
    if (kind === "unknown") continue;
    const id =
      meta.id ||
      rel
        .replace(/\.md$/, "")
        .replace(/\//g, "/");
    const label = meta.title || id;
    const tags = Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [];
    let summary = meta.summary || firstParagraph(body);
    const guideMeta = kind === "permitted" ? loadNearestMeta(file) : null;
    if (guideMeta?.title && !String(summary).includes(guideMeta.title)) {
      summary = `${summary}（来源教程：${guideMeta.title}）`.slice(0, 280);
    }
    entries.push({
      id,
      label,
      path: rel,
      url: meta.url || guideMeta?.sourceUrl || guideMeta?.url || "",
      tags,
      sourceKind: kind,
      priority: kind === "authored" ? "⭐" : kind === "permitted" ? "🟡" : "🟢",
      summary,
      mcHint: meta.mcHint || "",
    });
  }
  entries.sort((a, b) => a.id.localeCompare(b.id));
  return entries;
}

export function renderIndex(entries) {
  return JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), entries }, null, 2);
}
