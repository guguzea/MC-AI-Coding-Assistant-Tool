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

- 共 **53** 个 MCP 工具：`src/index.ts` **36** + `src/wave/register.ts` **17**
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

重启 Cursor 后应看到 **`MC-AI-Coding-Assistant-Tool`**，工具数 **53**。可试：`get_server_status`、`diagnose_data_paths`。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | data 根目录（非版本子目录） | `H:/MC_skill/data` |
| `MC_SKILL_COMMUNITY` | 社区知识库根（可选） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE` | `1` 允许 port_project 写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 允许写入的模组根 | `H:/mods/my-mod` |
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
| Wave C 生成 | `generate_model`、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`、`generate_entity_renderer`、`generate_worldgen` |
| Wave C 诊断 | `analyze_log`、`get_migration_guide`、`check_dependencies` |

补充文档：`docs/vanilla-registries.md`、`docs/registry-data-source.md`、`docs/prompts-client-compat.md`。

---

## FAQ

**Q: NeoForge 1.20.1 文档？**  
A: 查询会回退 Forge 1.20.1 视图（`forgeCompatible`），属预期。

**Q: Release 没有 node_modules？**  
A: 在 `mcp-server/` 执行 `npm ci && npm run build`。

**Q: Yarn 查询 OOM？**  
A: 使用预建 `yarn-mappings.sqlite`，勿加载整份 JSON。
