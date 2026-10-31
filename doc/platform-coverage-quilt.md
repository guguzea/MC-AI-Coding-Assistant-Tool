# Quilt 建档面与空洞档实测（根纲「检查 Quilt」的详细内容）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第一步 · 1. 检查 Quilt」的**详细内容落点**。
> 判档与决策仍以根纲那句话为准；这里存逐档读数、换源史与空洞档的实测行为。

  - **Quilt 侧语料**：`data/quilt_*` 共 **6 档**带目录（= 有规则树 10 档 − 有树无语料 4 档），每档 18 页（14 篇英文 wiki 页 `wiki-*.md` + 4 篇 QSL/元数据页：`qsl-qfapi` / QSL 按分支 README / `quilt.mod.json` RFC / `qsl-verified`）。命中数随语料扩容，**`total` 不是稳定契约**（两个独立成因：① 语料扩容；② **doc 检索面的 `total` 就是「本次返回条数」，会随你传的 `limit` 变**）。换源史与实测读数见 `CORPUS_PROVENANCE.md` §1。
- **有树但无 `data/quilt_<ver>` 语料**（4 档）：`1.21.3` / `1.21.4` / `1.21.8` / `1.21.10`。规则树可用；文档检索**不报错而是回 Fabric 正文**——实测 `search_docs platform=quilt version=1.21.4 query=registry` 返回 `ok:true` + `fallback:"fabric"` + `sourcePlatform:"fabric"` + `warning:"Quilt 官方文档无此版本，已回退到同版本 Fabric 文档…"` + `total:14`，`1.21.3` 同形但语义索引缺库 → `semantic:false` + `total:0`。**QSL 专属查询不走 Fabric**：实测同版本 `query="QSL registry key"` → `fallback:"quilt"` + `requestedVersion:"1.21.4"` + `source_version:"1.21.1"`，命中一律 `1.21.1/qsl-*`（改口同 `<maj>.<min>` 线已建档语料，QSL 同线同源）；`get_doc_full platform=quilt version=1.21.4` 同线读回，警示含「仍非 1.21.4 专属正文」。⇒ **必须读 `fallback` / `sourcePlatform` / `source_version` 字段**：`fabric` 命中不是 QSL 证据，`quilt` 命中也不是本版专属正文，`total:0` 更不等于「本版没有该 API」。QSL 签名一律 `query_loader_api`（先 `ingest_loader_api`）或用户自备 jar。
- **无树**：`1.20.6` / `1.21.2` / `1.21.5` / `1.21.6` / `1.21.7` / `1.21.9` / `26.x` 等 → session 直接 `PACK_NOT_FOUND`。**禁止**拿邻版 quilt 树或同版 Fabric 树顶替，也**禁止**为填一个版本号克隆一棵新树。
- **26.x 上游现状（2026-10-31 实测）：loader 跟上了，QSL 没有。**
  - `meta.quiltmc.org/v3/versions/game` 里 `26.3` / `26.2` / `26.1.2` / `26.1.1` / `26.1` 全部 `stable:true`。
  - `meta.quiltmc.org/v3/versions/loader/26.3` 有记录：最高 `0.30.0-beta.8`，最高**正式** `0.26.4`。
  - 但 **QSL maven 最新是 `10.0.0-alpha.5+1.21.1`**（`maven-metadata.xml` 的 lastUpdated = 2025-09-21），**全量版本里没有任何 26.x** ⇒ 26.x 时代 Quilt 实际只有 loader + Fabric 兼容面，**QSL 面空白**。
  - 官方 2026-02-03 公告《Bringing Quilt into the Non-Obfuscated Era》明确告别 **Quilt Mappings**。
  - ⇒ 本仓不给 `quilt/26.x` 建档是**按上游实况**：没有 QSL 语料可抓；**禁止**拿 Fabric 26.2 树冒充 Quilt 26.x，也不要承诺「quilt 26.x 文档检索」会给出 QSL 签名。
  - **Quilt 侧文档库全扫（2026-10-31，四路）**：没有一个有 26.x 正文 ——

    | 库 | 形态 | 实况 |
    |---|---|---|
    | `wiki.quiltmc.org`（源码 `QuiltMC/developer-wiki`） | Svelte 站 + `wiki/` markdown | 活站，30+ 篇（Introduction / Items / Blocks / Concepts / Data / Configuration / Misc），**全文没有任何版本号**，自称 heavily WIP；本仓 `quilt_*` 语料即源自此 |
    | `QuiltMC/docs` | 新 Astro/Starlight 站 | **32 commits**，`src/content/docs/en/` 只有 `index.mdx` + `developer/quilt-config` 一篇，README 还是 Starlight 模板原文 ⇒ **空壳** |
    | `quiltmc.org`（源码 `QuiltMC/quiltmc.org`） | 官网 Astro + MDX | 最新博客仍 2026-02-03；`/en/wiki/` 已 **404**（入口改到 `wiki.quiltmc.org`） |
    | QFAPI（`quilted-fabric-api`） | Fabric API 的 Quilt 重实现 | maven `latest=release=7.7.0+0.92.2-1.20.1`（lastUpdated **2024-12-02**），最高只到 `11.0.0-alpha.3+0.102.0-1.21` ⇒ **也没有 26.x** |

    ⇒ 26.x 时代 Quilt 的实际能力面 = **loader（0.30.0-beta.8）+ 直接用 Fabric API/Loader**；**QSL 与 QFAPI 双双缺位**。
- - **（2026-09-12 S13）`VERSION_NOT_FOUND` 载荷四平台同键**，下一条里「只有 `availableVersions`」不再是 quilt 独有：`search_forge_docs` 与 `search_docs`（forge / neoforge / fabric / quilt / liteloader / rift / modloader）遇到本仓库无语料的档位，返回 `ok:false` + `platform` + 顶层 `availableVersions`（**数值序**：1.21.8 < 1.21.10 < 1.21.11 < 26.1.2）+ `error:{code,message,hint}` 对象。`search_forge_docs` 早期的**字符串 `error` + 顶层 `code`/`hint`** 形状已废除；机器消费方不必再按平台分支取候选。quilt 只是额外多带 `query` / `version` / `fallback:null` 三个自有键；**且 quilt 有两种查询形态**——普通词（`query=registry`）才是上面这套载荷，QSL 措辞（`query="QSL"` / `"QSL registry key"`）返回 `ok:true` + `fallback:"quilt"` + `source_version`（同 `<maj>.<min>` 线改口，那不是本版专属 QSL 正文，签名仍走 `query_loader_api`）。两条腿都由 `test-assistant-gaps.mjs :: A-43` 钉。**唯一例外是 neoforge 的「无主文档树但刻意回空」路径**（如 `version=9.9.9` / 未建档 26.x）：它返回 `ok:true` + `total:0` + `warning`（披露「NeoForge 无独立 X 主文档树，未建档版本禁止读邻档 00–10」）并同样带 `availableVersions`，不是静默空返回。
