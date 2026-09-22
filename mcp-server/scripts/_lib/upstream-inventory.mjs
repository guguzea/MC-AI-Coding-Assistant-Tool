/**
 * scripts/_lib/upstream-inventory.mjs
 *
 * 「上游页 → 本仓 raw 文件名」的唯一折叠口径。
 *
 * 为什么要单独一份：assert-upstream-chapters 拿上游清单核缺页时，必须用**抓取器自己那套**
 * 文件名折叠规则算本地名。各脚本各写一份 `replace(/\//g,"_")`，改一处忘另一处，门就会
 * 报出成对的「缺 1 页 + 多 1 页」幻影（2026-09-21 实测踩过：反向解折叠把
 * `items_loot_tables.md` 读成 `items/loot/tables`）。同理禁止反向解。
 */

/** forge：chapter `datastorage/codecs` → `datastorage_codecs.md`（fetch-forge-docs.js） */
export function forgeRawName(chapter) {
  return String(chapter).replace(/\//g, "_") + ".md";
}

/** neoforge：href `datastorage/codecs` → `datastorage_codecs.md`，连字符也下划线化
 *  （fetch-neoforge-docs.js 的 safeIdOf：`-` → `_`） */
export function neoforgeRawName(href) {
  return String(href).replace(/\//g, "_").replace(/-/g, "_") + ".md";
}

/** fabric：gitPath `develop/blocks/first-block.md` → `develop_blocks_first-block.md`
 *  （连字符**保留**，与 neoforge 不同；fetch-fabric-docs.js:312） */
export function fabricRawName(gitPath) {
  return String(gitPath).replace(/\//g, "_").replace(/\.md$/, "") + ".md";
}

/**
 * 上游 fabric 清单的唯一过滤口径：GitHub trees 全量 blob 路径 → 本档该收的 `develop/**.md`。
 * 抓取（loadUrlList）与门的期望值（upstream-tree.json）必须走同一个函数。
 */
export function upstreamDevelopPaths(treePaths, version) {
  const prefix = `versions/${version}/`;
  const out = [];
  for (const p of treePaths ?? []) {
    if (!p.startsWith(prefix) || !p.endsWith(".md")) continue;
    const gitPath = p.slice(prefix.length);
    if (!gitPath.startsWith("develop/")) continue;
    if (/(^|\/)(players|translated)\//.test(gitPath)) continue;
    out.push(gitPath);
  }
  return out.sort();
}
