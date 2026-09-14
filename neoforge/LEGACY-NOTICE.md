# ⚠️ LEGACY — 此目录为遗留共享树，禁止当现行版本档激活

## 历史遗留 Archived：结构保留供回退与参考，MCP 检索面已隔离（2026-09-13 · S32）

登记处是单一事实源 `mcp-server/src/platform-pack/legacy-archive.ts` 的 `LEGACY_ARCHIVED_DIRS`；
本段描述**代码实际行为**。被挡的三棵树：`neoforge/code-patterns` · `neoforge/knowledge` ·
`neoforge/scaffold`。`neoforge/<精确版本>/` 版本档不受影响。**不删**：W6 裁定是标 Archived 保留结构。

- `read_knowledge_resource`：任何指向这三棵树的 URI（`mcskill://code-patterns/neoforge/<文件>.md`
  与 `mcskill://neoforge/<树>/…` 两种形态）在进入正文读取前就被拒，`text` 只回归档解释。
  返回标记 `found:false` + `archived:true`；**不抛异常、不置 `isError`、不带 `error.code`**，
  CLI 退出码仍为 0（带内否定，契约见 `src/utils/actionable.ts` §A-27）。
- `list_knowledge_resources`：条目**仍然列出**（保留可发现性，不搞隐身），但带 `archived:true`，
  且 `description` 换成归档解释，不再是「实读 …」这种暗示正文可取的措辞。
- `listPacks` / `activate_platform_pack action=list`：三棵树各登记为一条 trap，`path` 指向本文件，
  trap 条目带 `archived:true`；它们本来也进不了 `packs`（`isVersionDirName` 不认这类目录名）。
- `search_docs platform=neoforge`：**构造性隔离** —— NeoForge 文档 store 只读
  `data/neoforge_<ver>/neoforge-docs/<ver>/`，从来没读过这三棵树，因此不存在正文泄漏面。
  拿目录名当 `version` 传得到的是既有的「NeoForge 无独立 <name> 主文档树」告警 + `total:0`，
  **不是**归档专属标记（未新增标记）。
- 这三棵树**不计入** pack 覆盖统计（`scripts/assert-pack-meta-coverage.mjs` 的 58 档判据是
  「目录内有 `AGENTS.md` 或 `.cursor/rules`」，三棵树两者都没有）。
- 以上四条由 `mcp-server/scripts/assert-legacy-isolation.mjs` 钉住，抽掉 trap 即红。

> 2026-08 审计标注（B-1）：本目录是「单一 1.20.4 包」时代的遗物（约 3885 个文件），保留仅作历史参考。

- **现行架构**：各版本档位于 `neoforge/<version>/`（1.20.1 / 1.20.4 / … / 26.1），每档自带 `AGENTS.md` + `.cursor/rules` + knowledge + scaffold。
- **禁止**把本目录顶层 `.cursor/rules`、`.cursor/skills`、`knowledge/`、`code-patterns/`、`scaffold/` 当任何版本的规则源读取；工具侧已在 `mcp-server/src/platform-pack/catalog.ts` 将其注册为 trap（识别为分发说明，不激活）。更正（2026-09-13）：这句在 S32 之前不成立。当时 `listPacks` 里唯一的 trap 是 `neoforge/AGENTS.md`（分发说明），三棵树**没有**任何 trap 登记，且 `neoforge/code-patterns/*.md` 的正文经 `read_knowledge_resource` 实测仍返回 `found:true`（真缺陷，非伪报）。自 S32 起三棵树才各自登记为 `archived:true` 的 trap，正文隔离见上表。
- `sync-skills.ps1`、顶层 AGENTS.md / CLAUDE.md 均为旧单包时代产物，不再维护。
- 本目录无代码消费方；如需彻底清理，须同步调整 catalog.ts 的仓库根识别逻辑后再删。更正（2026-09-13）：「无代码消费方」不成立 —— `mcp-server/src/prompts/index.ts` 的 `scanCodePatterns()` 一直在扫 `neoforge/code-patterns/` 并把它喂给 `mcskill://` 知识 URI 层（`list_knowledge_resources` / `read_knowledge_resource` 两个面），S32 的改前实测就是那条通道返回了 1.20.4 正文。现该消费者保留扫描但按 `legacyArchiveMatchRel()` 标 Archived 并带内拒答正文；`knowledge/` 与 `scaffold/` 侧确无读取消费者（`session.ts` 只读 `neoforge/<精确版本>/knowledge/common`，`isKnowledgePackScaffold()` 只用于把知识库 scaffold 与用户工程区分开）。
