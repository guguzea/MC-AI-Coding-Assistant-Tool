# AUTO SETUP — MC Skill MCP Server

> **给 AI Agent 看的自动配置脚本。**  
> 当用户把这个文件拖入 Cursor（或其他 AI IDE）时，AI 应该自动执行以下所有步骤，无需用户干预。

---

## 目标

把本仓库的本地 **stdio MCP Server** 编译好，并**生成** Cursor MCP 配置草稿供用户确认后粘贴（不要静默改写用户的 `mcp.json`，不要自动执行 `mklink`）。

完成后用户应能在 Cursor 中看到服务名 **`MC-AI-Coding-Assistant-Tool`**，**62** 个工具可用，覆盖：

| 模块 | 代表工具 |
|------|----------|
| API / 映射 | `query_api`、`get_method_params`、`convert_mapping`、`get_version_info` |
| 工程辅助 | `diagnose_gradle`、`generate_datagen`、`crash_analyze`、`validate_project` |
| Forge 文档 | `list_forge_versions`、`search_forge_docs`、`get_forge_doc_*` |
| Fabric 文档 | `list_fabric_versions`、`search_fabric_docs`、`get_fabric_doc_*` |
| NeoForge 文档 | `list_neoforge_versions`、`search_neoforge_docs`、`get_neoforge_doc_*` |
| 跨平台文档 | `list_doc_versions`、`search_docs`、`get_doc_*` |
| 社区知识库 | `list_community_sources`、`search_community_docs`、`get_community_doc_*` |
| 移植 / 数据 | `analyze_porting_path`、`port_project`、`diagnose_data_paths` |
| Registry / Mixin / 资源 | `query_registry`、`mixin_analyze`、`audit_resources`、`validate_datapack_json` |
| 工作流 / 知识 URI | `get_workflow_template`、`list_knowledge_resources`、`read_knowledge_resource` |
| 生成器 | `generate_model`、`generate_lang`、`generate_network_packet` 等 7 个 `generate_*` |
| 诊断扩展 | `analyze_log`、`get_migration_guide`、`check_dependencies` |
| 服务状态 | `get_server_status` |
| 自我更新 | `mc_skill_update` |

本仓库还包含 `forge/` / `fabric/` / `neoforge/` 规则集、`data/` 离线数据包，以及根目录 `community_knowledge/`（社区实务，与官方文档分离）；MCP 负责运行时查询，规则集负责写代码时的约束与决策流。

---

## 前置条件

- **Node.js >= 22.5**（`mcp-server/package.json` → `engines`；Yarn 映射依赖内置 `node:sqlite`）
- 本机已有完整仓库（含 `mcp-server/` 与 `data/`）
- GitHub Release / 仓库 **不含** `node_modules`，必须本地 `npm ci`
- Windows 路径在 JSON 中使用正斜杠 `/`（如 `H:/MC_skill/...`）

---

## 执行步骤

### Step 1 — 确认项目根目录

本文件所在目录就是项目根目录 `MC_skill/`。

```bash
pwd
```

应能同时看到：

```text
AGENTS.md
AUTO_SETUP.md
mcp-server/
data/
forge/
fabric/
neoforge/
```

如果终端不在该目录，先：

```bash
cd <MC_skill根目录路径>
```

---

### Step 2 — 检查 Node，并安装依赖、编译

```bash
node -v
# 需要 Node.js >= 22.5
node -e "const [maj,min]=process.versions.node.split('.').map(Number); if(maj<22||(maj===22&&min<5)){console.error('Need Node >=22.5');process.exit(1)} else console.log('OK',process.versions.node)"

cd mcp-server
npm ci
npm run build
npm run build:yarn-sqlite
```

验证：

```bash
ls dist/index.js
```

- 报错 → 核对 `engines`，升级到 **Node.js 22.5+**
- Yarn 查询依赖 `data/fabric_*/mappings/yarn-mappings.sqlite`（由 `build:yarn-sqlite` 从 yarn JSON 生成）
- 运行时 **禁止** 全量加载 `yarn-mappings.json`（体积过大，易 OOM）

可选数据体检（有 `ERROR` 时不要对外宣称数据包可用）：

```bash
cd mcp-server
set MC_SKILL_DATA=<data 绝对路径>
npm run audit:data
```

---

### Step 3 — 生成 MCP 配置草稿（供用户确认）

先算出绝对路径（必须在仓库根目录执行）：

```bash
node -e "console.log(require('path').resolve('mcp-server/dist/index.js'))"
node -e "console.log(require('path').resolve('data'))"
```

把下面模板的占位符替换为上述输出，**展示给用户确认后**，再粘贴到用户级配置：

- Windows Cursor：`%APPDATA%\Cursor\mcp.json`
- 或其他：`~/.cursor/mcp.json`

**最小可用配置：**

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["<dist/index.js 绝对路径>"],
      "env": {
        "MC_SKILL_DATA": "<data 目录绝对路径>",
        "MC_SKILL_COMMUNITY": "<可选：community_knowledge 绝对路径>"
      }
    }
  }
}
```

注意：

- `MC_SKILL_DATA` 必须指向 **`data/` 根目录**（如 `H:/MC_skill/data`），不要指到 `data/fabric_1.20.1` 这类版本子目录
- `MC_SKILL_COMMUNITY` 可选；未设置时默认使用与 `data/` 同级或仓库根的 `community_knowledge/`
- 若用户已有其他 MCP，只**合并** `mcpServers` 中的本条目，不要整体覆盖文件
- 路径用 `/`，不要用 Windows 反斜杠

**需要 `port_project` 真正写盘时**，在 `env` 中追加：

```json
"MC_SKILL_ALLOW_WRITE": "1",
"MC_SKILL_PROJECT_ROOT": "<目标模组项目绝对路径>"
```

`MC_SKILL_PROJECT_ROOT` 必须是绝对路径；写入目标必须落在该根目录下。默认只读。

**可选调试 / 严格模式：**

| 变量 | 作用 |
|------|------|
| `MC_SKILL_STRICT=1` | 数据无效则 MCP 启动失败 |
| `MC_SKILL_DEBUG_PATHS=1` | 打印路径解析过程 |
| `MCP_TIMEOUT_MS` | 测试脚本超时（毫秒） |

若工程在非 C: 盘且 Node 访问异常：优先用绝对路径 + `MC_SKILL_DATA`；仅在用户明确要求时，才建议其自行用 `mklink /J` 做目录联接（AI 不要擅自执行）。

---

### Step 4 — 告知用户重启 Cursor

配置粘贴完成后，请用户**完全退出并重新打开** Cursor，再在 MCP 面板确认：

1. 出现 `MC-AI-Coding-Assistant-Tool`
2. 工具数量 **62**（`index.ts` 36 + `wave/register.ts` 26）
3. 可试调：`list_doc_versions` 或 `diagnose_data_paths`（应能看到 forge / fabric / neoforge 相关数据）

---

### Step 5 — （可选）跑测试 / 冒烟

```bash
cd mcp-server
set MC_SKILL_DATA=<data 绝对路径>
npm test
```

发布向冒烟（可选）：

```bash
npm run smoke:release
```

也可用 MCP Inspector 手工探活：

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

（Inspector 场景同样需要正确的 `MC_SKILL_DATA` 环境变量。）

---

## 配置完成后：给用户的最短用法

配置成功后，写模组时优先：

1. 先读仓库根 `AGENTS.md`，按平台跳到 `forge|fabric|neoforge/<版本>/AGENTS.md` 与 `.cursor/rules/`
2. 查官方文档：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`
   - **页面 `id` 必须用搜索结果返回的 `id`**，不要用网站 URL 路径
3. 查 API / 映射：`query_api`、`convert_mapping`（Yarn 走 sqlite 点查）
4. 移植评估：`analyze_porting_path`；真正改工程才用 `port_project`（且需写盘开关）

更完整的工具注意项见根目录 `README.md`「MCP 工具使用注意」。

---

## 常见错误

| 现象 | 处理 |
|------|------|
| Node 版本过低 / `node:sqlite` 不可用 | 升级到 Node **22.5+**（不是 18+） |
| 找不到数据 / 映射失败 | 检查 `MC_SKILL_DATA` 是否指向 `data/` 根 |
| Yarn 查询失败或 OOM | 先跑 `npm run build:yarn-sqlite`；禁止加载整份 `yarn-mappings.json` |
| 写盘被拒绝 | 设置 `MC_SKILL_ALLOW_WRITE=1` 与允许的 `MC_SKILL_PROJECT_ROOT` |
| MCP 面板没有本服务 | 确认已重启 Cursor；核对 `args` 绝对路径与 JSON 语法 |
| `dist/index.js` 不存在 | 在 `mcp-server/` 执行 `npm ci && npm run build` |
| 文档搜索为空 | 换已有标签（如 `item` / `mixin`），或用 `class:` / `event:` / `method:` 前缀；确认 `id` 来自搜索结果 |
| NeoForge `1.20.1` 文档 | 会回退到 Forge 1.20.1 文档视图（兼容层），属预期 |

---

## AI 约束（必守）

- 不要静默覆盖用户的 `mcp.json`；只生成草稿并请用户确认
- 不要擅自创建 junction / 符号链接
- 运行时不要全量加载 `yarn-mappings.json`
- 不要把 `MC_SKILL_DATA` 指到版本子目录或 `mcp-server/`
- 未经用户明确要求，不要开启 `MC_SKILL_ALLOW_WRITE`
- 配置用服务名必须是 **`MC-AI-Coding-Assistant-Tool`**（不要写成旧名 `mc-forge` / `mc-skill`）
