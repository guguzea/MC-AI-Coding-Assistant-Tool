# Community Knowledge

本目录是 **社区实务知识库**，供 MCP 工具 `search_community_docs` / `get_community_doc_*` 使用。

与 `data/` 下的官方 Forge/Fabric/NeoForge 文档库分离：查 API / 注册细节请优先用官方文档工具；本库偏发布、崩溃排查、软依赖、中文社区教程要点。

**Agent 必读规则：** [`AGENT_USAGE.md`](./AGENT_USAGE.md) — 用到本库短文时，若不清楚 / 不会，必须去访问原网站或官方文档，禁止臆造 API。

## 三类内容

| 目录 | 含义 |
|------|------|
| `permitted/` | 作者已许可可入库的社区帖（Markdown 提炼，非原始 HTML） |
| `links/` | 无全文许可：仅标题、摘要、外链 URL |
| `authored/` | 本仓库自写短文（可自由修改） |

索引：`indexes/index-l0.json`（可由 `mcp-server/scripts/build-community-index.mjs` 重建）。

## `authored/` 主题速查

| 主题 | id |
|------|-----|
| 发布 | `authored/publishing` |
| 崩溃日志 | `authored/crash-reports` |
| 软依赖 / CurseMaven | `authored/soft-deps-modlist`、`authored/cursemaven-optional-deps` |
| 主类 / 注册 helper / 创造页签 | `authored/mod-entry-init-structure`、`authored/register-helpers`、`authored/creative-tabs-1.20` |
| 机器 / Menu / BE / Capability | `authored/machine-be-gui-working`、`authored/menu-screen-sync`、`authored/blockentity-persist-ticker`、`authored/itemhandler-capability` |
| 模型 / 本地化 / 开发环境 | `authored/multi-face-block-models`、`authored/localization-lang`、`authored/forge-dev-env-pitfalls` |

## 环境变量

- `MC_SKILL_COMMUNITY`：本目录绝对路径（优先）
- 否则：与 `MC_SKILL_DATA`（`data/`）同级的 `community_knowledge/`
