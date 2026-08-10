# MC MCP Server

本地 **stdio** MCP Server，供 Cursor 等 AI 助手查询 Minecraft 模组开发资料（Forge / Fabric / NeoForge）。

**要求：Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。

仓库与 GitHub Release **均不含 `node_modules`**，需本地编译：

```bash
cd mcp-server
node -v   # 需 v22.5+
npm ci
npm run build
```

## 能力概览

- 共 **55** 个 MCP 工具：`src/index.ts` **36** + `src/wave/register.ts` **19**
- 依赖仓库根 `data/`（API extracted、parchment/mcp、**yarn-mappings.sqlite**、文档索引、porting 等）
- 官方文档三级：L0 搜索 → L1 摘要 → L2/L2+ 全文
- **禁止**运行时全量加载 `yarn-mappings.json`（>1.5GB，易 OOM）

完整分类说明见根目录 [README.md](../README.md)「MCP Server 工具」。

---

## 快速配置

### 1. 安装与编译

```bash
node -v
node -e "const [maj,min]=process.versions.node.split('.').map(Number); if(maj<22||(maj===22&&min<5)){console.error('Need Node >=22.5');process.exit(1)} else console.log('OK',process.versions.node)"

cd mcp-server
npm ci
npm run build
# 有 data 且需 Yarn 查询：npm run build:yarn-sqlite
# Vanilla Registry：npm run build:vanilla-registries -- --version=1.20.1
```

### 2. Cursor MCP 配置

使用 **绝对路径**，`MC_SKILL_DATA` 指向仓库 `data/`：

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["H:/MC_skill/mcp-server/dist/index.js"],
      "env": {
        "MC_SKILL_DATA": "H:/MC_skill/data"
      }
    }
  }
}
```

`port_project` 真写盘时追加：

```json
"env": {
  "MC_SKILL_DATA": "H:/MC_skill/data",
  "MC_SKILL_ALLOW_WRITE": "1",
  "MC_SKILL_PROJECT_ROOT": "H:/path/to/your/mod"
}
```

`MC_SKILL_PROJECT_ROOT` 须为绝对路径；写盘目标须在项目根内（`realpathSync.native`，含 Windows Junction）。

### 3. 验收

重启 Cursor 后应看到 **`MC-AI-Coding-Assistant-Tool`**，工具数 **55**。可试：`get_server_status`、`diagnose_data_paths`。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | data 根目录（非版本子目录） | `H:/MC_skill/data` |
| `MC_SKILL_COMMUNITY` | 社区知识库根（可选） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE` | `1` 允许 `port_project` / `mc_skill_update` 写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 允许写入的根（更新工具须为 **MC_skill 仓库根**） | `H:/MC_skill` |
| `MC_SKILL_UPDATE_REPO` | GitHub `owner/repo`（默认本仓库） | `guguzea/MC-AI-Coding-Assistant-Tool` |
| `MC_SKILL_UPDATE_REMOTE` | 强制 git remote 名；空则扫描匹配 URL | `origin` |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | `get_server_status` updateHint 缓存 TTL | `3600` |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | data zip 下载超时 | `600000` |
| `MC_SKILL_GITHUB_TOKEN` / `GITHUB_TOKEN` | 可选，提高 API 限额 | |
| `MC_SKILL_STRICT` | `1` 数据无效则启动失败 | `1` |
| `MC_SKILL_DEBUG_PATHS` | `1` 打印路径解析 | `1` |

### 5. 开发

```bash
npm run build
npm test
node test-wave-bcd.mjs
node dist/index.js
```

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 工具索引（按模块）

| 模块 | 工具 |
|------|------|
| API / 映射 / 状态 | `query_api`、`get_method_params`、`convert_mapping`、`get_server_status`、`get_version_info` |
| 工程 | `diagnose_gradle`、`generate_datagen`、`crash_analyze`、`validate_project` |
| Forge 文档 | `list_forge_versions`、`search_forge_docs`、`get_forge_doc_*` |
| Fabric 文档 | `list_fabric_versions`、`search_fabric_docs`、`get_fabric_doc_*` |
| NeoForge 文档 | `list_neoforge_versions`、`search_neoforge_docs`、`get_neoforge_doc_*`（`1.20.1` 可回退 Forge） |
| 跨平台文档 | `list_doc_versions`、`search_docs`、`get_doc_*` |
| 社区 | `list_community_sources`、`search_community_docs`、`get_community_doc_*` |
| 移植 / 数据 | `analyze_porting_path`、`port_project`、`diagnose_data_paths` |
| Wave B | `query_registry`、`mixin_analyze`、`audit_resources`、`validate_datapack_json`、`get_workflow_template`、`list_knowledge_resources`、`read_knowledge_resource` |
| Wave C 生成 | `generate_model`、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`、`generate_entity_renderer`、`generate_worldgen`、`localize_mod` |
| Wave C 诊断 | `analyze_log`、`get_migration_guide`、`check_dependencies` |
| 自我更新 | `mc_skill_update` |

补充文档：`docs/vanilla-registries.md`、`docs/registry-data-source.md`、`docs/prompts-client-compat.md`、`docs/mc-skill-update.md`。

### 字段映射（`convert_mapping`）

- SQLite **schema v3** 含 `fields` / `searge_fields`；查询时设 `memberKind: "field"`（建议 `ownerClass`）。
- v2 库读字段 → `SCHEMA_FIELDS_UNAVAILABLE`（重建：`npm run build:yarn-sqlite`）。
- CLI：`npx mc-skill convert --kind field ...`（见 `src/cli.ts`）。

### 工作流 / 知识曝露（Prompts + Resources + 工具兜底）

| 入口 | 说明 |
|------|------|
| MCP Prompt | `mc-new-block` / `mc-new-entity` / `mc-new-gui` / `mc-crash-triage` / `mc-port-mod` / `mc-build-mod` / `mc-ingame-iterate` / `mc-localize-mod` |
| 工具兜底 | `get_workflow_template`（同名正文） |
| MCP Resource | `mcskill://…`（见 `listKnowledgeResources`） |
| 工具兜底 | `list_knowledge_resources` → `read_knowledge_resource` |

`mcskill://patterns/README` 读取 **`community_knowledge/patterns/README.md`**（`MC_SKILL_COMMUNITY`）。客户端兼容表见 `docs/prompts-client-compat.md`。

**资源 URI 列表**（`list_knowledge_resources` 可列出全部）：

| URI | 内容 |
|-----|------|
| `mcskill://matrix/mixin-support` | mixin_analyze 支持矩阵 |
| `mcskill://schema/sqlite` | yarn-mappings.sqlite v2/v3 字段说明 |
| `mcskill://version-changes/1.21` | 1.21 变更专章（知识库） |
| `mcskill://antipatterns/registry` | 注册反模式短文 |
| `mcskill://patterns/README` | 代码模式库索引（community_knowledge/patterns/） |
| `mcskill://workflow/<模板名>` | 与 Prompt 同名的工作流正文（8 个；含构建、真机循环与模组汉化） |

**客户端兼容结论**：Cursor 等仅 tools 客户端主走 `get_workflow_template` / `list_knowledge_resources` / `read_knowledge_resource` 兜底；Claude Desktop 等支持 prompts/resources 的客户端可直接使用注册的 Prompt 与 Resource。

---

## FAQ

**Q: NeoForge 1.20.1 文档？**  
A: 查询会回退 Forge 1.20.1 视图（`forgeCompatible`），属预期。

**Q: Release 没有 node_modules？**  
A: 在 `mcp-server/` 执行 `npm ci && npm run build`。

**Q: Yarn 查询 OOM？**  
A: 使用预建 `yarn-mappings.sqlite`，勿加载整份 JSON。
