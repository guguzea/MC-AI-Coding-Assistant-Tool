# Fabric 建档面（根纲「检查 Fabric」的详细内容）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第一步 · 2. 检查 Fabric」的**详细内容落点**。
> 判档与决策仍以根纲那句话为准；这里存逐档读数、docs 正文覆盖史与空洞档行为。

**Fabric 建档面（实测 `ls -d fabric/*/` 对 `ls -d data/fabric_*/` 对 `list_fabric_versions`，2026-09-05；2026-10-31 补 26.2 规则树）：**

- **规则树 15 档**（每档 11 条 `00–10`）= **语料 15 档** = `list_fabric_versions` 15 档，三者一致：`1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.20.4` / `1.21.1` / `1.21.3` / `1.21.4` / `1.21.8` / `1.21.10` / `1.21.11` / `26.1.2` / **`26.2`**。⇒ Fabric 不存在「有树无语料 / 有语料无树」的半档。
  - ⚠️ **「语料 15 档」只说明 15 个 `data/fabric_<ver>` 目录都在，不说明都有 docs 正文。** 有 `fabric-docs` 正文的是 **8 档**：`1.20.4` / `1.21.1` / `1.21.4` / `1.21.8` / `1.21.10` / `1.21.11` / `26.1.2` / **`26.2`**；另 **7 档**（`1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.21.3`）**上游从来没有这些版本的 docs 树**。⇒ 这 7 档「没有 docs 正文」是**上游没有**，不是抓取漏：**禁止**承诺补抓，也**禁止**拿邻版正文顶替。用户问「1.18.2 的 Fabric 官方文档正文」只能答「本仓没有该版 docs 正文，可读物的是该档规则树 + `fabric-wiki` 7 页」。页数、上游 commit 史与 `failures.json` 记账见 `CORPUS_PROVENANCE.md` §2。
- **`26.2` 三件事都建了，但语料来自 latest 面而不是 `versions/26.2`**（2026-10-31 实测）：上游站点 `/develop/...`（**无版本前缀**）的页面标题已是「… 26.2」，而 `versions/26.2` 至今 **404** —— 上游把「最新版」放在仓库根 `develop/`，`versions/<v>/` 只在某版**不再是 latest** 时才建目录。因此 `fetch-fabric-docs.js` 的 `versions/<v>/` 口径**结构性永远落后一代**。
  - 取数脚本：`mcp-server/scripts/provision-fabric-latest.mjs --version=26.2 --sha=<commit> --from-clone=<dir> --write`（**必须 pin commit sha**，禁止跟 main HEAD）。
  - 基线：commit `238533d819fcb5ec9405acb58fb0ac7655df63b1`（2026-10-29），105 页 + `reference/latest` 443 文本件 + 2 个根级引用件。
  - 自证：`upstream-tree.json`（`source=github_trees`、`layout=latest-unprefixed`、`commitSha`、105 页清单）与 `reference.provenance.json`。
  - 规则树：`fabric/26.2/`（11 条 `00–10` + `knowledge/common/verified-api-26.2.md` + `scaffold`）；`activate_platform_pack platform=fabric minecraftVersion=26.2` → `ok:true` + `ruleIds` + `verifiedApi`。
  - 工具链实测：Java 25 / Gradle 9.8.1 / Loom **1.18.2**（稳定版，官方模板是 1.19-SNAPSHOT）/ loader **0.20.1** / fabric-api **0.161.0+26.2**；scaffold 的 `gradlew build` 与带 fabric-api 的探针工程都是 `BUILD SUCCESSFUL`（2026-10-31）。
- **空洞（既无树也无语料）**：`1.21.2` / `1.21.5` / `1.21.6` / `1.21.7` / `1.21.9` 等。实测 `activate_platform_pack action=session platform=fabric minecraftVersion=1.21.2` → `PACK_NOT_FOUND`（message 附带「同系列已建档：1.21.1, 1.21.3, 1.21.4, 1.21.8, 1.21.10, 1.21.11」，那是**候选提示不是自动折叠授权**）；`search_fabric_docs version=1.21.2` → `VERSION_NOT_FOUND` 且**不 fallback**。
- 遇到空洞档：把工具的候选清单念给用户选，**禁止**自行拿邻版树顶上或为填版本号克隆一棵新树。`26.1` / `26.1.1` 是另一回事——走 `knowledgeVersion` 折到 `26.1.2`，不是空洞；`26.2` 是精确档，**没有** `26.2.x` 补丁档，工程写 `26.2.1` 一律拒。
