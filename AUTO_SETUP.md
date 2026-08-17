# AUTO SETUP — MC Skill MCP Server

> **给任意 MCP 宿主上的 AI Agent 看的配置手册，不是 Cursor 专用脚本。**  
> 用户把本文件拖进对话、或让你「配置 MCP」时：先识别宿主，再编译，再按该宿主的配置格式生成草稿，**经用户确认后才写盘**。  
> **禁止**静默覆盖已有 MCP 配置；**禁止**为 `data/` 擅自 mklink。Skill 安装见 Step 6，须另列清单并确认。

---

## Agent 必读：执行顺序

按顺序做，不要跳到「给一份 Cursor 的 mcp.json」就结束。

1. **识别宿主**（Step 0）。不确定就问。不要默认 Cursor。
2. **确认仓库根**（Step 1）并 **编译**（Step 2）。`dist/index.js` 不存在则 MCP 无法启动。
3. **算出绝对路径**，套进 **规范 stdio 载荷**（Step 3）。
4. **按宿主格式生成草稿**（Step 4），向用户展示：目标文件、顶层键名、将合并的片段、与现有配置的 diff。
5. **用户确认后合并写入**（只改本服务那一条）。不要整文件覆盖。
6. **请用户重载 MCP**，然后 **用工具自检**（Step 5）：`get_server_status` → `diagnose_data_paths`。不要只说「去设置页看一眼」。
7. 自检失败 → 先走本文「故障排查」，再用 CLI 兜底（见文末）。不要反复让用户重启却不读 stderr。
8. MCP 可用之后，**再问**是否安装 Skill（Step 6）。MCP 与 Skill 无关，重载 MCP 不会让 Skill 面板出现条目。

无 MCP 客户端（纯终端、不支持 MCP 的 IDE）：跳到「CLI 兜底」，不要伪造一份用不了的 `mcp.json`。

---

## 三套机制（不要混）

| 层 | 作用 | 配置后如何生效 | 典型位置 |
|----|------|----------------|----------|
| **Rules** | 写代码时的平台约束 | 打开对应模组工程 / 读 `AGENTS.md` | `forge\|fabric\|neoforge\|quilt\|liteloader\|rift\|modloader/<ver>/` 或扁平 `bedrock/` |
| **Skills** | 斜杠命令 / Skill 面板里的任务手册 | IDE **扫描** `技能名/SKILL.md` | 用户全局或**模组项目**根，不是本仓库根 |
| **MCP 工具** | 运行时查询文档 / API / 映射 / 诊断（**78** 个工具） | 宿主拉起 **stdio** 子进程 `node dist/index.js` | 各 IDE 自己的 MCP 配置文件 |

本仓库 `mcp-server/` 提供的是 **本地 stdio MCP**，不是 HTTP/SSE 远程服务。配置里必须是 `command` + `args`（或等价的 command 数组），**不要**写成 `url`。

服务名必须是 **`MC-AI-Coding-Assistant-Tool`**（不要用旧名 `mc-forge` / `mc-skill`）。

---

## 目标

1. 编译本仓库的本地 MCP Server。
2. 按**当前宿主**生成并合并 MCP 配置，使 Agent 能调用 **78** 个工具。
3. （可选）按 Step 6 把平台 Skill 装到用户全局目录或**模组项目**（不要装进 `MC_skill` 仓库根）。

工具覆盖：

| 模块 | 代表工具 |
|------|----------|
| API / 映射 | `query_api`、`get_method_params`、`convert_mapping`、`get_version_info`、`lookup_obfuscated` |
| 工程辅助 | `diagnose_gradle`、`generate_datagen`、`crash_analyze`、`validate_project` |
| Forge / Fabric / NeoForge 文档 | `search_*_docs`、`get_*_doc_summary`、`get_*_doc_full`、`list_*_versions` |
| 跨平台文档 | `list_doc_versions`、`search_docs`、`get_doc_*` |
| 社区知识库 | `list_community_sources`、`search_community_docs`、`get_community_doc_*` |
| 移植 / 数据 | `analyze_porting_path`、`port_project`、`diagnose_data_paths` |
| Registry / Mixin / 资源 | `query_registry`、`mixin_analyze`、`audit_resources`、`validate_datapack_json` |
| 工作流 / 生成 / 诊断 | `get_workflow_template`、`generate_*`、`analyze_log`、`check_dependencies` |
| 状态 / 更新 | `get_server_status`、`mc_skill_update` |

MCP 负责运行时查询；规则集负责写代码约束。完整注意项见根目录 `README.md`「MCP 工具使用注意」。

---

## 前置条件

- **Node.js >= 22.5**（`mcp-server/package.json` → `engines`；Yarn 映射用内置 `node:sqlite`，不是 18+）
- 本机已有完整仓库（`mcp-server/` + `data/`）
- GitHub Release / git clone **不含** `node_modules`，必须本地 `npm ci`
- JSON/YAML/TOML 里的路径一律用**正斜杠**绝对路径（`H:/MC_skill/...`），不要用 Windows 反斜杠，不要用 `~`（部分宿主不展开）
- 本服务冷启动可能超过 5 秒（读 `data/`）。OpenCode 等默认超时偏短，草稿里应把 timeout 提到 **60000** 以上

---

## Step 0 — 识别宿主

用下面信号判断，**多种命中时以用户正在对话的产品为准**；仍不确定就问「当前是哪个 IDE / CLI」。

| 信号 | 多半是 |
|------|--------|
| 工作区有 `.cursor/`，或设置里能看到 Cursor MCP | Cursor |
| 能跑 `claude` CLI，或存在 `.claude/`、`~/.claude.json` | Claude Code |
| 用户说 Claude Desktop / 桌面应用 | Claude Desktop |
| 工作区 `.vscode/` + Copilot / VS Code Agent | VS Code（MCP 顶层键是 `servers`） |
| 工作区 `.continue/` 或 `~/.continue/` | Continue |
| 工作区 `.trae/` 或 Trae 设置里的 MCP | Trae |
| `opencode.json` / `.opencode/` | OpenCode |
| `~/.codex/config.toml` 或 Codex CLI | Codex |
| Windsurf / Codeium | Windsurf |
| Cline / Roo 侧栏 | Cline / Roo |
| 没有 MCP 面板、只有终端 | 走 CLI 兜底 |

**配置写到哪里：**

- **推荐默认：用户级 / 全局**，这样打开任意模组工程都能用这 78 个工具。`args` 与 `MC_SKILL_DATA` 仍指向 **本仓库**（`MC_skill`），不要改成模组工程路径。
- **项目级**（`.mcp.json`、`.cursor/mcp.json`、`.trae/mcp.json` 等）只在用户明确要求「只给这个仓库用」时写。
- **不要**把带本机绝对路径的 MCP 配置提交进 `MC_skill` 仓库。
- 用户的**模组工程**可以放项目级 MCP（路径仍指向本仓库的 `dist/index.js` 与 `data/`）。

---

## Step 1 — 确认本仓库根目录

本文件所在目录就是 `MC_skill/` 根。终端应能同时看到：

```text
AGENTS.md
AUTO_SETUP.md
mcp-server/
data/
forge/
fabric/
neoforge/
```

不在该目录则先 `cd` 过去。用户若把本文件拖进**另一个**模组工程的对话：仍以 **本文件所在仓库** 为 MCP 数据根，不要把模组工程当成 `MC_SKILL_DATA`。

---

## Step 2 — 检查 Node，安装依赖，编译

```bash
node -v
# 需要 Node.js >= 22.5
node -e "const [maj,min]=process.versions.node.split('.').map(Number); if(maj<22||(maj===22&&min<5)){console.error('Need Node >=22.5');process.exit(1)} else console.log('OK',process.versions.node)"

cd mcp-server
npm ci
npm run build
npm run build:yarn-sqlite
```

验证 `mcp-server/dist/index.js` 存在。

- 报错 → 升级到 **Node.js 22.5+**，不要建议 18。
- Yarn 查询依赖 `data/fabric_*/mappings/yarn-mappings.sqlite`（由 `build:yarn-sqlite` 生成）。
- 运行时 **禁止** 全量加载 `yarn-mappings.json`（体积过大，易 OOM）。
- 可选：`set MC_SKILL_DATA=<data 绝对路径>` 后 `npm run audit:data`。有 `ERROR` 时不要宣称数据包可用。

Windows PowerShell 没有 `&&` 时用 `;`，或 `cmd /c "..."`。环境变量：cmd 用 `set MC_SKILL_DATA=...`，PowerShell 用 `$env:MC_SKILL_DATA="..."`，Unix 用 `export`。

---

## Step 3 — 算出路径与规范 stdio 载荷

在**仓库根**执行（把输出填进草稿，不要手写相对路径）：

```bash
node -e "console.log(require('path').resolve('mcp-server/dist/index.js'))"
node -e "console.log(require('path').resolve('data'))"
node -e "console.log(require('path').resolve('community_knowledge'))"
node -e "console.log(process.execPath)"
```

最后一项是 `node` 可执行文件绝对路径。仅当宿主找不到 PATH 里的 `node` 时，才把 `command` 改成该路径。

### 规范字段（所有宿主都要从这里翻译）

| 字段 | 值 |
|------|-----|
| 服务名 | `MC-AI-Coding-Assistant-Tool` |
| 传输 | **stdio**（本地子进程，不是 HTTP） |
| command | `node`（或上一步的 `process.execPath`） |
| args | `["<dist/index.js 绝对路径>"]` |
| env.MC_SKILL_DATA | `<data 目录绝对路径>`，必须是 `data/` **根**，禁止 `data/fabric_1.20.1` |
| env.MC_SKILL_COMMUNITY | 可选；默认仓库根 `community_knowledge/` |

不要用 `npx`、不要指向 `src/index.ts`、不要省略 `env`。

**需要 `port_project` 真正写盘时**（须用户明确要求）再追加：

```text
MC_SKILL_ALLOW_WRITE=1
MC_SKILL_PROJECT_ROOT=<目标模组项目绝对路径>
```

`MC_SKILL_PROJECT_ROOT` 必须是绝对路径；写入目标必须落在该根下。默认只读。

| 变量 | 作用 |
|------|------|
| `MC_SKILL_STRICT=1` | 数据无效则 MCP 启动失败 |
| `MC_SKILL_DEBUG_PATHS=1` | 打印路径解析（排障） |
| `MC_SKILL_CACHE` | 反编译 / MDK zip / loader jar 缓存根。**MCP 运行时（`resolveCacheRoot`）与仓库脚本（如 `decompile-loader-apis.mjs`）都读此变量。** 不设则可能分家：MCP 默认 `%APPDATA%/mc-skill-cache`（Unix `~/.config/mc-skill-cache`），脚本默认 `D:\mc-skill-temp`。请设成同一路径。不要改 `resolveCacheRoot` 去探测 D 盘。`download_official_mdk` 解压依赖 **unzip / 7z / bsdtar**（不要假定 GNU tar 能解 zip；Linux 请装 unzip）。 |
| `HTTPS_PROXY` / `HTTP_PROXY` | Node fetch 代理（更新 / 下载） |
| `MCP_TIMEOUT_MS` | 本仓库测试脚本超时，**不是**宿主拉起 MCP 的超时 |

若工程在非系统盘且 Node 读路径异常：继续用绝对路径 + `MC_SKILL_DATA`。数据包目录的 junction 仅在用户明确要求时由其创建。

---

## Step 4 — 按宿主生成配置草稿

先读目标文件（没有就准备新建）。只**合并**本服务条目。向用户展示完整草稿与目标路径，确认后再写。

### 宿主速查（先看表，再打开对应小节）

同一套 **Step 3 规范字段**，翻译进不同文件。配错文件或配错顶层键 = 宿主永远拉不起进程。

| 宿主 | 默认写哪里（推荐用户级） | 顶层键 / 形态 | 易错点 |
|------|--------------------------|---------------|--------|
| Cursor | `~/.cursor/mcp.json` | `mcpServers` 对象 | 旧路径 `%APPDATA%\Cursor\mcp.json` 若已有内容就改那份 |
| Claude Code | `claude mcp add --scope user` 或用户 MCP 设置 | `mcpServers`；可带 `"type":"stdio"` | 不要写进 `~/.claude.json` 会话状态 |
| Claude Desktop | `claude_desktop_config.json`（见 4.3） | `mcpServers` | 托盘进程也要退出再开 |
| VS Code / Copilot Chat | 用户 MCP 配置或 `.vscode/mcp.json` | **`servers`** | 不要抄 Cursor 的 `mcpServers` |
| Copilot CLI | `~/.copilot/mcp-config.json` | **`mcpServers`** | 不读 `.vscode/mcp.json` |
| Continue | `~/.continue/config.yaml` | YAML **列表** `mcpServers:` | JSON 对象无效；须 Agent 模式 |
| Trae | 设置页 MCP，或 `.trae/mcp.json` | `mcpServers` | 产品变体路径不同，不确定就让用户粘贴 |
| OpenCode | `opencode.json` 的 `mcp` | `command` **数组** + `environment` | **timeout ≥ 60000** |
| Codex CLI | `~/.codex/config.toml` | `[mcp_servers.<名>]` | 不是 JSON |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | `mcpServers` | 路径含 `codeium` |
| Cline / Roo | 扩展 `globalStorage` 下的 MCP json | 多为 `mcpServers` | 以扩展设置页为准 |
| 未列出 / 无 MCP | 见 4.11 或文末 CLI | — | 不要伪造 Cursor `mcp.json` |

**向用户确认时必须列出：**

1. 判定的宿主名称（不确定则先问，不要猜成 Cursor）
2. 将写入的**绝对路径**（全局还是项目级）
3. 该宿主的**顶层键名**
4. 本服务完整片段（已填绝对路径，不是占位符）
5. 与现有文件的 diff（新文件则说明将新建）
6. `MC_SKILL_DATA` 指向本仓库 `data/`，不是模组工程

用户回复确认后再写盘。拒绝或未表态 → 只把草稿留在对话里。

### 4.1 Cursor（`mcpServers`）

- 全局：`~/.cursor/mcp.json`（Windows 亦常见 `%USERPROFILE%\.cursor\mcp.json`；旧位置 `%APPDATA%\Cursor\mcp.json`，若已有内容则改那份，不要复制出两份）
- 项目：`<工作区>/.cursor/mcp.json`（仅当用户要求项目级）

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["<dist/index.js 绝对路径>"],
      "env": {
        "MC_SKILL_DATA": "<data 绝对路径>",
        "MC_SKILL_COMMUNITY": "<community_knowledge 绝对路径>"
      }
    }
  }
}
```

### 4.2 Claude Code（`mcpServers`，可带 `"type": "stdio"`）

- 用户级：`claude mcp add --scope user -- MC-AI-Coding-Assistant-Tool node <dist 绝对路径>`，并保证进程环境有 `MC_SKILL_DATA`；或写入 Claude 用户 MCP 设置（以 `claude mcp list` 为准）。**不要**把全局块误贴进 `~/.claude.json` 的会话状态文件。
- 项目级：模组工程或本仓库根的 `.mcp.json`（提交前去掉本机绝对路径，或改用环境变量展开）。

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "type": "stdio",
      "command": "node",
      "args": ["<dist/index.js 绝对路径>"],
      "env": {
        "MC_SKILL_DATA": "<data 绝对路径>",
        "MC_SKILL_COMMUNITY": "<community_knowledge 绝对路径>"
      }
    }
  }
}
```

Windows 上若 `node` 不在 Claude 继承的 PATH 里：`command` 用 `process.execPath`。冷启动慢时可在该条目加大超时（宿主若支持）。

### 4.3 Claude Desktop（`mcpServers`）

- macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows：`%APPDATA%\Claude\claude_desktop_config.json`
- Linux：`~/.config/Claude/claude_desktop_config.json`

格式与 4.1 相同。改完须**完全退出桌面应用**再打开。

### 4.4 VS Code / GitHub Copilot Chat（顶层键是 `servers`，不是 `mcpServers`）

- 用户级：命令面板 `MCP: Open User Configuration`
- 项目级：`<工作区>/.vscode/mcp.json`

```json
{
  "servers": {
    "MC-AI-Coding-Assistant-Tool": {
      "type": "stdio",
      "command": "node",
      "args": ["<dist/index.js 绝对路径>"],
      "env": {
        "MC_SKILL_DATA": "<data 绝对路径>",
        "MC_SKILL_COMMUNITY": "<community_knowledge 绝对路径>"
      }
    }
  }
}
```

**Copilot CLI** 不读 `.vscode/mcp.json`。CLI 用 `~/.copilot/mcp-config.json` 或项目 `.mcp.json`，顶层键是 **`mcpServers`**。两套文件不要混用键名。

### 4.5 Continue（YAML 列表，不是 JSON 对象）

用户配置 `~/.continue/config.yaml`，或项目 `.continue/mcpServers/<name>.yaml`：

```yaml
mcpServers:
  - name: MC-AI-Coding-Assistant-Tool
    type: stdio
    command: node
    args:
      - "<dist/index.js 绝对路径>"
    env:
      MC_SKILL_DATA: "<data 绝对路径>"
      MC_SKILL_COMMUNITY: "<community_knowledge 绝对路径>"
```

独立 block 文件还须带 Continue 要求的 `name` / `version` / `schema` 元数据。MCP 只在 Agent 模式可用。

### 4.6 Trae（`mcpServers`）

- 全局：设置 → MCP → 粘贴 JSON（Windows 常见 `%APPDATA%\Trae\User\mcp.json` 或 Trae CN / SOLO 对应 User 目录下的 `mcp.json`）。不确定路径就让用户在设置页粘贴，不要猜错产品变体。
- 项目：`<项目>/.trae/mcp.json`

格式与 4.1 相同。可用 `${workspaceFolder}`，但 **`MC_SKILL_DATA` 必须指向本仓库 `data/`**，不要指到模组工作区。

### 4.7 OpenCode

查已有 `opencode.json` / `opencode.jsonc`：

- 常见：`mcp.<服务名>`
- v2 亦可能：`mcp.servers.<服务名>`

```json
{
  "mcp": {
    "MC-AI-Coding-Assistant-Tool": {
      "type": "local",
      "command": ["node", "<dist/index.js 绝对路径>"],
      "environment": {
        "MC_SKILL_DATA": "<data 绝对路径>",
        "MC_SKILL_COMMUNITY": "<community_knowledge 绝对路径>"
      },
      "enabled": true,
      "timeout": 60000
    }
  }
}
```

`command` 是**数组**（可执行文件 + 参数）。默认 timeout 往往过短，**必须**把 `timeout` 调到至少 60000。

### 4.8 Codex CLI（TOML）

`~/.codex/config.toml`：

```toml
[mcp_servers.MC-AI-Coding-Assistant-Tool]
command = "node"
args = ["<dist/index.js 绝对路径>"]

[mcp_servers.MC-AI-Coding-Assistant-Tool.env]
MC_SKILL_DATA = "<data 绝对路径>"
MC_SKILL_COMMUNITY = "<community_knowledge 绝对路径>"
```

### 4.9 Windsurf

`~/.codeium/windsurf/mcp_config.json`（Windows：`%USERPROFILE%\.codeium\windsurf\mcp_config.json`），顶层 `mcpServers`，字段同 4.1。

### 4.10 Cline / Roo

Cline 常见：`%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`（macOS/Linux 为对应 VS Code `globalStorage`）。Roo 扩展 id 不同，以该扩展的 MCP 设置页为准。格式多为 `mcpServers` + stdio。

### 4.11 未列出的宿主

打开该产品的 MCP / 连接 / 工具设置，把 **4.1 的 JSON 对象**交给用户粘贴。若界面要 `url`，说明本服务是 stdio 不是远程 HTTP。若只要 command 数组，用 OpenCode 那种 `["node", "<dist>"]`。

---

## Step 5 — 合并、重载、用工具验收

### 合并规则

1. 目标文件已存在：先读入，合法 JSON/YAML/TOML 再改。VS Code 的 `mcp.json` 可能是 JSONC（注释）；保持原注释，只改本服务键。
2. 只新增或覆盖键 `MC-AI-Coding-Assistant-Tool`（Continue 则按 `name` 匹配那一项）。
3. 保留用户其他 MCP。禁止整文件换成只有本服务。
4. 把 diff 给用户看，确认后再写。
5. 写盘失败（权限、只读、沙箱）→ 把完整草稿交给用户自行粘贴，不要改系统其他文件。

### 重载（按宿主，不要一律说「重启 Cursor」）

| 宿主 | 重载方式 |
|------|----------|
| Cursor | MCP 面板重载该服务器；不行则完全退出再开 |
| Claude Code | 新开一轮会话，或 `claude mcp list` 看是否已连接 |
| Claude Desktop | 完全退出（托盘也退出）再启动 |
| VS Code | `MCP: List Servers` → Restart；或重载窗口 |
| Continue | 重载窗口；确认处于 Agent 模式 |
| Trae | 重载窗口；设置 → MCP 看连接状态 |
| OpenCode / Codex | 新开会话 |
| Windsurf / Cline / Roo | 对应 MCP 面板 Restart |

### 验收（Agent 自己调工具，不要只让用户看 UI）

重载后立刻调用：

1. **`get_server_status`**  
   - 能返回 JSON 即进程已起来。  
   - `buildStatus.buildRequired=true` → 再 `npm run build` 并重启 MCP。  
   - 看 `semanticIndex.modeHint`（`hybrid` / `fts5-only` / `l0-only`），缺模型不是配置失败。
2. **`diagnose_data_paths`**  
   - `MC_SKILL_DATA` 解析到本仓库 `data/`。  
   - forge / fabric / neoforge 至少一侧为 `found`（未下载的平台可以是 `not_found`，要如实告诉用户）。
3. **`list_doc_versions`**（或当前平台的 `list_*_versions`）应返回版本数组。

可选：工具列表里应能看到本服务，数量 **78**（`tool-registry.ts` 44 + `wave/register.ts` 34）。对不上先 `npm run build`，不要改服务名。

**验收失败时的 CLI 对照**（可区分「没连上宿主」还是「data 路径错」）：

```bash
cd mcp-server
set MC_SKILL_DATA=<data 绝对路径>
node dist/cli.js diagnose_data_paths
node dist/cli.js get_server_status
```

CLI 正常而 IDE 里没有工具 → 配置文件路径/键名/未重载。两边都失败 → Node 版本、`dist`、或 `MC_SKILL_DATA`。

---

## Step 6 — 安装 Skill（可选，与 MCP 无关）

编码期请用 `activate_platform_pack`（session 进对话；要工程内常驻再 write）。**不要**把规则拷进知识库根。MCP 工具列表与 Skill 扫描是两套机制。重载 MCP **不会**让 Skill 面板出现条目。本仓库 Skill 在 `forge/<ver>/`、`fabric/<ver>/`、`neoforge/` 子树，**不要**提交到 `MC_skill` 仓库根 `.cursor/skills/`。

### 各 IDE 如何发现 Skill（打开本仓库根时）

必须是 `技能名/SKILL.md` 目录（Cursor / Claude / OpenCode 的 `name` 只允许 `[a-z0-9]+(-[a-z0-9]+)*`，须与文件夹名一致）。

| IDE | 扫描方式 | 打开 `MC_skill` 根时 |
|-----|----------|----------------------|
| Cursor | 扫仓库内所有 `.cursor/skills` 与 `.agents/skills`；嵌套目录 **scoped**。设置页只列用户级 + 工作区根级 | 斜杠命令能看到一部分（同名折叠）；设置页空 |
| Claude Code | 从启动目录**向上**到 git 根；其下 nested 要读/改该子树文件后才加载。本仓库镜像是 `.claude/commands/block.md`（去掉 `mc-`） | 根上无 `.claude/skills` |
| Continue | 工作区/CWD 的 `.continue/skills/*/SKILL.md` | 根上无此目录 |
| Trae | 工作区根 `.trae/skills/{name}/SKILL.md` | 根上无；镜像还是扁平 `.md`，面板可能不认 |
| OpenCode / Codex / Pi | 从 CWD **向上**找 `.opencode/skills` / `.agents/skills` / `.pi/skills` | 根上没有 → 空 |
| ZCode | 项目 `.zcode/skills/` | 根上无 |

`scripts/sync-skills.ps1` 只把 Skill 镜像到**各平台版本目录**，从不写仓库根。Fabric `.cursor/skills/mc-*.md` 扁平文件对 Cursor 无效（靠 `.agents/skills/<name>/SKILL.md`）。库 Skill 在 `knowledge/libs/`，默认不安装。

不能强制 IDE 按 `forge/<ver>/.cursor/skills` 解析。MCP 配置改不了 Skill 扫描器。

### Agent 必须询问

1. **范围：全局还是当前项目**（每次都问）
2. 项目：推断或询问 **一套** 平台 + MC 版本（读目标工程 `mods.toml` / `fabric.mod.json` / `build.gradle`）
3. 全局：再问 **只装一套还是多套**（不要默认灌约 376 条）
4. 识别 IDE（Step 0；不确定就问）

误把目标选成 `MC_skill` 仓库根时：提示应选用户的模组工程或用户全局目录，不要在本仓库根写 Skill。

### 同名标识

全局或多套时文件夹/`name` 用 hyphen 前缀：`forge-1-20-1-mc-block`（**不能**用 `forge_1.20.1_mc-block`，点号和下划线非法）。斜杠命令为 `/forge-1-20-1-mc-block`。`description` 仍写「Forge 1.20.1」。

**禁止**把源目录改名后整目录软链：源稿 frontmatter 仍是 `name: mc-block`，会与文件夹名冲突。

### 混合安装

**A. 当前模组项目、只装一套（优先联接，不复制正文）**

- 源：Forge/NeoForge 用 `<仓库>/forge|neoforge/<ver>/.cursor/skills/<name>/`；Fabric 用 `.agents/skills/<name>/`（**不要**链扁平 `mc-block.md`）
- 目标：该 IDE 的项目 Skill 目录下的 `mc-block/`（见下表）
- 斜杠命令仍是 `/mc-block`
- Continue 对 symlink 有过读失败：Continue **直接走 Stub**，不要先撞联接
- Claude 联接可能不热更新源稿：若用户要「改知识库立刻生效」，改用 Stub

**B. 全局，或一次要多套 → Stub**

每个 Skill 写短 `SKILL.md`（不要复制源正文）：

```markdown
---
name: forge-1-20-1-mc-block
description: "[Forge 1.20.1] <从源 SKILL.md 复制的 description>"
---

# forge-1-20-1-mc-block

必须用 Read 打开 `H:/MC_skill/forge/1.20.1/.cursor/skills/mc-block/SKILL.md` 并严格遵循其全文；不要凭 stub 的 description 写代码。
```

路径用**正斜杠绝对路径**。禁止只写「参见源文件」。

### 盘符检查与失败处理（强制）

执行任何 `mklink` **之前**：比较源路径与目标路径的盘符（Windows 如 `H:` vs `C:`）。

- **跨盘：不要尝试联接**，直接 Stub，并告诉用户「接合点不能跨卷」
- **同盘：** 列出将创建的联接清单，用户确认后再 `mklink /J`（不要用 `/D` 除非用户要求）
- **联接一旦失败：立即停止。禁止复制正文，禁止「部分联接 + 部分复制」。** 报告原因，询问是否改为 Stub；再次确认后只写 stub

### 各 IDE Skill 目标目录

| IDE | 全局 | 项目 |
|-----|------|------|
| Cursor | `~/.cursor/skills/` | `<项目>/.cursor/skills/` |
| Claude | `~/.claude/skills/` | `<项目>/.claude/skills/`（不要只写 `commands/block.md`） |
| Continue | `~/.continue/skills/` | `<项目>/.continue/skills/`（建议 Stub） |
| Trae | `~/.trae/skills/`（Windows `%USERPROFILE%\.trae\skills`） | `<项目>/.trae/skills/`（必须 `<name>/SKILL.md`） |
| OpenCode | `~/.config/opencode/skills/` | `<项目>/.opencode/skills/` |
| Codex | `~/.agents/skills/` | `<项目>/.agents/skills/` |
| ZCode | `~/.zcode/skills/` | `<项目>/.zcode/skills/` |
| Pi | `~/.pi/agent/skills/` | `<项目>/.pi/skills/` |

库 Skill 默认不装。换平台/版本再跑本步骤覆盖。先列出路径与数量，确认后再写盘。完成后请用户重载 IDE，在 Skill 面板或斜杠命令里核对。

---

## Step 7 — （可选）测试 / 冒烟

```bash
cd mcp-server
set MC_SKILL_DATA=<data 绝对路径>
npm test
```

发布向冒烟：`npm run smoke:release`。

MCP Inspector（同样要带 `MC_SKILL_DATA`）：

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 配置完成后：Agent 必须这样用 MCP

写模组时不要凭训练数据猜 1.20 / 1.21 / 26.x API。优先：

1. 读仓库根 `AGENTS.md`，按平台打开 `forge|fabric|neoforge/<版本>/AGENTS.md` 与规则目录。
2. **文档**：`search_*_docs` 或 `search_docs` →（可选）`get_*_doc_summary` → 确认相关后再 `get_*_doc_full`。  
   - 搜索默认 **hybrid**（L0 + 向量 RRF）；无语义库则纯 L0（`semantic: false`）。降级表见根目录 `README.md`「诚实降级」。  
   - **页面 `id` 必须用搜索结果里的 `id`**，不要用网站 URL 路径。  
   - 一次不要拉超过 2 个 full page。
3. **API / 映射**：平台 API（DeferredRegister、Fabric Registry 等）用 `search_*_docs`，**不要**用 `query_api`。`query_api` / `get_method_params` 只查 Vanilla Parchment（约 1.16.5–1.20.4；**26.1+ 无索引**，`found:false` ≠ 类不存在）。Yarn↔Mojang 用 `convert_mapping`；崩溃短名用 `lookup_obfuscated`。26.1+ 无混淆层，不要用 Yarn 工具硬查。
4. **工程**：`validate_project`、`diagnose_gradle`（**仅 ForgeGradle**；Loom 改 `search_fabric_docs`，NeoGradle 改 `search_neoforge_docs`）、`check_dependencies`、`crash_analyze`。
5. **移植**：先 `analyze_porting_path`；真正改工程才 `port_project`，且须写盘开关。
6. 社区实务（发布 / 软依赖 / 崩溃分类）：`search_community_docs`。它**不替代**官方文档工具。

调用前看清工具 schema 与根目录 `README.md`「工具边界」：

- 平台专用工具不要套另一平台（`diagnose_gradle` / `validate_project` / `get_version_info` **仅 Forge**）
- `query_api` **不是** Forge/Fabric API；`found:false` 多半是索引范围，不是「类不存在」
- `search_community_docs` 不替代官方文档；`generate_*` 不写盘；`port_project` 默认 dryRun
- 文档 `id` 只用搜索结果；不要把邻版本文档拷过来冒充

---

## CLI 兜底（宿主没有 MCP，或配置尚未生效）

78 个工具均可：

```bash
cd mcp-server
set MC_SKILL_DATA=<data 绝对路径>
node dist/cli.js list-tools
node dist/cli.js <工具名> --key=value
```

示例：`node dist/cli.js search_docs --query=registry --version=1.20.1 --platform=forge`。

告诉用户：CLI 能查资料，但不能像 MCP 那样在对话里自动出现工具。有宿主时仍应配好 MCP。

---

## 常见错误

| 现象 | 处理 |
|------|------|
| Node 过低 / `node:sqlite` 不可用 | 升级到 **22.5+**（不是 18+） |
| 找不到数据 / 映射失败 | `MC_SKILL_DATA` 必须是 `data/` 根 |
| Yarn 查询失败或 OOM | `npm run build:yarn-sqlite`；禁止加载整份 `yarn-mappings.json` |
| 写盘被拒绝 | 用户同意后再设 `MC_SKILL_ALLOW_WRITE=1` 与 `MC_SKILL_PROJECT_ROOT` |
| 宿主里没有本服务 | 核对**该宿主**的配置文件与**顶层键名**（`mcpServers` vs `servers` vs `mcp` vs TOML）；已重载；`args` 为绝对路径；JSON 无尾逗号 |
| VS Code 配了但不生效 | 是否误用了 `mcpServers`（应为 `servers`） |
| Continue 配了但 Agent 调不到 | 是否 YAML 列表；是否 Agent 模式 |
| OpenCode 启动超时 | `timeout` ≥ 60000 |
| Claude Desktop 无变化 | 托盘进程也要退出 |
| `dist/index.js` 不存在 | `mcp-server/` 下 `npm ci && npm run build` |
| 文档搜索为空 | 先看返回的 `semantic` / `warning`：无库会降级纯 L0。换标签（`item` / `mixin`）或 `class:` / `event:` / `method:`；`id` 必须来自搜索结果。**26.1+ 不要用 `query_api`**（无 extracted），改 `search_*_docs`。不要把其他版本文档拷过来冒充 |
| `PLATFORM_DATA_MISSING` | `diagnose_data_paths`；该平台数据包可能未下载 |
| NeoForge `1.20.1` 文档 | 回退到 Forge 1.20.1 视图，属预期 |
| Skill 面板没有条目 | 预期。走 Step 6，不要在本仓库根建 `.cursor/skills` |
| 斜杠命令里 Skill 平台混杂 | 同名 `mc-block` 被折叠。全局安装用 `forge-1-20-1-mc-block` |
| CLI 正常、IDE 没有工具 | 配置写错文件或未重载，不是编译问题 |

---

## AI 约束（必守）

- 先识别宿主，再选配置格式；不要默认 Cursor / 不要默认文件名 `mcp.json`
- 不要静默覆盖用户的 MCP 配置；只生成草稿、展示 diff、确认后**合并**本服务一条
- 不要把 `MC_SKILL_DATA` 指到版本子目录、`mcp-server/`、或用户的模组工程根
- 不要把本机绝对路径的 MCP 配置提交进 `MC_skill` 仓库
- 不要为 `data/` 擅自创建 junction
- **Skill 安装：** 先列清单再写盘；跨盘禁止尝试联接；联接失败禁止复制正文；Stub 必须含绝对路径 Read；不要在 `MC_skill` 仓库根提交 Skill；库 Skill 默认不装
- 运行时不要全量加载 `yarn-mappings.json`
- 未经用户明确要求，不要开启 `MC_SKILL_ALLOW_WRITE`
- 服务名必须是 **`MC-AI-Coding-Assistant-Tool`**
- 本服务是 **stdio**，不要配成 HTTP `url`
- 验收靠调用 `get_server_status` / `diagnose_data_paths`，不要只描述点击路径
- 无 MCP 宿主时用 CLI，不要假装已经连上 78 个工具
