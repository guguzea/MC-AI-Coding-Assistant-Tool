/**
 * S32 · NeoForge LEGACY 共享归档树的**单一事实源**。
 *
 * `neoforge/{code-patterns,knowledge,scaffold}` 是 NeoForge 早期只有 1.20.4 一档时留下的
 * **跨版本共享树**：正文写死了 1.20.4 的 API（`Item.Properties#tab(CreativeModeTab)` 在
 * 1.20.5+ 已不存在），却会被当成「NeoForge 通用知识」返回。W6 的裁定是**标 Archived、不删**：
 * 结构保留供回退与人工参考，但 MCP 的检索面一律不再把这三棵树的正文当可用知识吐出去。
 *
 * 归档命中一律走**带内（in-band）结果**：`found:false` + `archived:true` + 指向
 * `neoforge/LEGACY-NOTICE.md` 的 hint。不抛异常、不置 `isError`（合同见
 * `src/utils/actionable.ts` §A-27：handler 正常产出了自己声明的结果对象 ⇒ 带内否定）。
 * 本模块因此**不新增任何 `ok:false` 字面量**，`actionable.ts` 散文里的计数口径不受影响。
 *
 * 门：`scripts/assert-legacy-isolation.mjs`（由 `test-scripts.mjs` §S18/S19 真跑块 spawnSync）。
 */

/** 归档声明正文所在处（仓库根相对，posix 分隔）。 */
export const LEGACY_NOTICE_REL = "neoforge/LEGACY-NOTICE.md";

/**
 * 三棵 LEGACY 共享树（仓库根相对、posix 分隔、无尾斜杠）。
 * 只列目录本身：`neoforge/<精确版本>/...` 的版本档不受影响。
 */
export const LEGACY_ARCHIVED_DIRS = [
  "neoforge/code-patterns",
  "neoforge/knowledge",
  "neoforge/scaffold",
] as const;

export type LegacyArchivedDir = (typeof LEGACY_ARCHIVED_DIRS)[number];

/** 归一化任意分隔符 / `.\` 前缀 / 重复斜杠 → 仓库根相对 posix 路径。 */
function normalizeRel(input: string): string {
  return String(input ?? "")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+/, "")
    .toLowerCase();
}

/**
 * 该仓库根相对路径（或 URI 尾段）是否落在 LEGACY 归档树内？
 * 命中返回所属归档目录，否则 null。目录自身（`neoforge/knowledge`）也算命中。
 */
export function legacyArchiveMatchRel(rel: string): LegacyArchivedDir | null {
  const n = normalizeRel(rel);
  if (!n) return null;
  for (const dir of LEGACY_ARCHIVED_DIRS) {
    if (n === dir || n.startsWith(`${dir}/`)) return dir;
  }
  return null;
}

/** 给 catalog 的 trap 登记表用：归档目录的「平台 + 目录名」拆分。 */
export const LEGACY_ARCHIVED_PACKS: ReadonlyArray<{ platform: "neoforge"; dirName: string; rel: LegacyArchivedDir }> =
  LEGACY_ARCHIVED_DIRS.map((rel) => ({
    platform: "neoforge" as const,
    dirName: rel.split("/")[1] ?? rel,
    rel,
  }));

/**
 * 带内归档说明（三个检索面共用同一段文字，保证 NOTICE 与代码逐字一致的锚点只有一处）。
 * `rel` 为命中的归档路径；缺省则给通用版。
 */
export function legacyArchivedNote(rel?: string): string {
  const where = rel ? `${rel} 已标 Archived（LEGACY）` : "NeoForge LEGACY 共享树已标 Archived";
  return (
    `${where}：结构保留在盘上供回退与人工参考，但 MCP 检索面不再把它的正文当可用知识返回。` +
    `原因：这三棵树是 NeoForge 仅有 1.20.4 一档时的跨版本共享正文，写死了 1.20.4 的 API，` +
    `对 1.20.5+ 与 26.x 是错的。改用 activate_platform_pack action=session（platform=neoforge + ` +
    `精确 minecraftVersion，见 list_neoforge_versions）读版本档；` +
    `平台 API 检索用 search_neoforge_docs / search_docs({platform:"neoforge"})。详见 ${LEGACY_NOTICE_REL}。`
  );
}
