# MC AI Coding Assistant Tool

让 AI 编程助手（Cursor / Claude Code 等）能更好地编写 Minecraft 模组的完整工具包。

为 AI 提供一个「读懂 MC Mod 开发生态」的环境，消除知识陈旧、API 版本混淆、构建系统复杂、映射不一致等结构性障碍。

## 项目结构

```
MC_skill/
├── README.md                    # 你在这里
├── AGENTS.md                    # 根总纲：引导 AI 选择正确的平台规则
├── CONTRIBUTING.md              # 贡献指南
├── AUTO_SETUP.md                # AI 自动配置 MCP Server（生成配置草稿）
├── THIRD_PARTY_NOTICES.md       # 第三方文档 / 映射数据许可说明
├── LICENSE                      # 本仓库代码：MIT
│
├── forge/                       # Forge 规则 / skills / scaffold / knowledge（多版本）
├── fabric/                      # Fabric 规则与知识（多版本）
├── neoforge/                    # NeoForge 规则与知识
├── community_knowledge/         # 社区实务知识库（MCP search_community_docs）
├── mcp-server/                  # 本地 stdio MCP Server（约 35 个工具）
└── data/                        # 离线数据：文档索引 + mappings + yarn JSON/SQLite + porting
```

## 平台说明

| 平台 | 状态 | 规则 / 数据（摘要） |
|------|------|---------------------|
| Forge | ✅ 完成 | 多版本规则（主推 **1.20.1**）；数据目录 `data/forge_*` |
| Fabric | ✅ 完成 | 多版本规则（主推 **1.20.1 / 1.21.x**）；数据目录 `data/fabric_*` |
| NeoForge | ✅ 完成 | 规则集在 `neoforge/`（主推 **1.20.4+**）；文档数据见 `data/neoforge_*` |

## 多 IDE 支持

以各平台版本目录下的 `.cursor/` 为源，用 `sync-skills.ps1` 同步到其他 IDE：

```
平台/版本/
├── .cursor/     → Cursor AI（源）
├── .claude/     → Claude Desktop
├── .continue/   → Continue.dev
├── .trae/       → Trae AI
├── .opencode/   → OpenCode（skills；规则读 AGENTS.md）
├── .agents/     → Codex（skills；规则读 AGENTS.md）
├── .zcode/      → ZCode（skills；规则读 AGENTS.md）
└── .pi/         → Pi（rules/*.md）
```

| IDE | Rules | Skills / Commands | Agent |
|-----|-------|-------------------|-------|
| Cursor | `.cursor/rules/*.mdc` | `.cursor/skills/` | `.cursor/agents/` |
| Claude Desktop | `.claude/rules/*.mdc` | `.claude/commands/` | `.claude/agents/` |
| Continue.dev | `.continue/rules/*.mdc` | `.continue/skills/` | — |
| Trae | `.trae/rules/*.mdc` | `.trae/skills/` | `.trae/agents/` |
| OpenCode | `AGENTS.md` | `.opencode/skills/` | — |
| Codex | `AGENTS.md` | `.agents/skills/` | — |
| ZCode | `AGENTS.md` | `.zcode/skills/` | — |
| Pi | `.pi/rules/*.md` | （主靠 AGENTS + rules） | — |

## 快速开始

**对 AI（打开一个 MC Mod 项目时）：**

> 按根目录 `AGENTS.md`：根据 `build.gradle` / `mods.toml` / `fabric.mod.json` 判断平台与版本，加载对应规则集。

**对新项目使用脚手架：**

> 使用对应平台版本下的 `scaffold/`（如 `forge/1.20.1/scaffold/`）生成带规则的项目骨架。

**多 IDE 同步：**

> 修改 `.cursor/` 后，在该版本目录运行 `sync-skills.ps1`。

**配置本地 MCP Server：**

> 将 [`AUTO_SETUP.md`](./AUTO_SETUP.md) 拖入 Cursor，让 AI 编译 `mcp-server` 并**生成** `mcp.json` 配置草稿（需你确认后粘贴；不会静默覆盖已有配置）。  
> 要求 **Node.js >= 22.5**；服务名 **`MC-AI-Coding-Assistant-Tool`**。

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | 数据目录根路径（指向 `data/`，不含版本子目录） | `H:/MC_skill/data` |
| `MC_SKILL_COMMUNITY` | 社区知识库根路径（默认仓库根 `community_knowledge/`） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE` | `1` 时允许 `port_project` 写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许的项目根（绝对路径） | `H:/mods/my-mod` |
| `MC_SKILL_STRICT` | `1` 时数据无效则 MCP 启动失败 | `1` |
| `MC_SKILL_DEBUG_PATHS` | `1` 打印路径解析过程 | `1` |
| `MCP_TIMEOUT_MS` | 测试脚本超时毫秒数 | `30000` |

## MCP 工具使用注意

本地 MCP 服务名：**`MC-AI-Coding-Assistant-Tool`**（约 **31** 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。仓库 / Release **不含** `node_modules`，需自行 `npm ci && npm run build`（建议再跑 `npm run build:yarn-sqlite`）。

### 文档查询（Forge / Fabric / NeoForge）

1. **页面 ID 必须用搜索结果里的 `id`**，不要用网站 URL 路径。  
   - 正确：`get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
   - 错误：`id: "items/first-item"`
2. **推荐流程**：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`。
3. **L0 搜索只匹配索引字段**（`label` / `id` / `url` / `tags`），不是全文检索。
4. 前缀查询示例：`class:Item`、`event:lifecycle`。
5. NeoForge `1.20.1` 文档查询会回退到 Forge 1.20.1 视图（兼容层），属预期。

### 映射转换（`convert_mapping` + Yarn）

1. Yarn 走预建 **`yarn-mappings.sqlite` 惰性点查**，运行时**禁止**全量加载 `yarn-mappings.json`。
2. 类名可用 Yarn 路径、简单类名或混淆短名；不确定时看返回的 `notes` / 候选。

### 移植分析（`analyze_porting_path`）

平台识别综合源码与构建/元数据（`build.gradle`、`mods.toml`、`fabric.mod.json` 等）。空目录仍为 `platform: unknown`。

### 写操作（`port_project`）

默认只读。真正写盘需要同时设置 `MC_SKILL_ALLOW_WRITE=1` 与 `MC_SKILL_PROJECT_ROOT=<允许写入的项目根>`，且目标路径必须落在该根目录下。

## 数据复现与分发

`data/` 中的索引和文本由 `mcp-server/scripts/` 生成。大型 `*.jar` / `*.zip` 默认被 `.gitignore` 排除（`data/**` 有例外保留规则），不要假定 Git 一定含全部二进制。

- 只从脚本声明的官方来源重建数据。
- 运行 `cd mcp-server && npm run audit:data`；任何 `ERROR` 表示数据包不宜发布。
- 完整数据包可通过 GitHub Release 的 `mc-skill-data-full-*.zip` + `SHA256SUMS-*.txt` + `data-manifest.json` 分发。
- 本地原始包丢失时应重新 fetch，不要跨版本复制改名。

第三方文档与映射的许可说明见 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)。

## 目录约定

- 平台按 `平台/版本/` 分目录（如 `forge/1.20.1/`、`fabric/1.20.1/`）
- 规则文件在 `.cursor/rules/`，编号 `00`~`10`
- 每个规则含 **约束** 与 **Decision Flow**

## 规则文件说明

| 文件 | 主题 | 说明 |
|------|------|------|
| `00-project-setup.mdc` | 项目结构 | Java / Gradle / 版本号 |
| `01-registry.mdc` | 注册系统 | 按版本选择注册方式 |
| `02-block.mdc` | 方块 | 方块 / 方块实体 / 流体 |
| `03-item.mdc` | 物品 | 物品 / 工具 / 盔甲 / 食物 |
| `04-entity.mdc` | 实体 | EntityType / Renderer / Goal |
| `05-events.mdc` | 事件 | 按场景选事件类 |
| `06-networking.mdc` | 网络 | 同步需求 → 包类型 |
| `07-datagen.mdc` | DataGen | Provider 选择 |
| `08-client-server.mdc` | 端分离 | 代码放哪侧 |
| `09-anti-patterns.mdc` | 反模式 | 症状与正确方案 |
| `10-gui.mdc` | GUI | Menu / Screen / Container |

## Agent Skills（示例：Forge 1.20.1 共 15 个）

| Skill | 主题 |
|-------|------|
| `mc-registry/` | 注册 |
| `mc-block/` | 方块 |
| `mc-item/` | 物品 |
| `mc-blockentity/` | 方块实体 |
| `mc-entity/` | 实体 |
| `mc-mixin/` | Mixin |
| `mc-networking/` | 网络 |
| `mc-datagen/` | DataGen |
| `mc-capability/` | Capability |
| `mc-compat-jei/` | JEI |
| `mc-fluid/` | 流体 |
| `mc-gui/` | GUI |
| `mc-particle/` | 粒子 |
| `mc-sound/` | 音效 |
| `mc-recipe/` | 配方 |

Fabric 版本在此基础上可能额外包含 Fabric API / Kotlin / Cloth Config 等平台专有 Skill。

## MCP Server 工具（约 31 个）

| 模块 | 代表工具 |
|------|----------|
| API / 映射 | `query_api`、`get_method_params`、`convert_mapping`、`get_version_info` |
| 工程辅助 | `diagnose_gradle`、`generate_datagen`、`crash_analyze`、`validate_project` |
| Forge 文档 | `list_forge_versions`、`search_forge_docs`、`get_forge_doc_*` |
| Fabric 文档 | `list_fabric_versions`、`search_fabric_docs`、`get_fabric_doc_*` |
| NeoForge 文档 | `list_neoforge_versions`、`search_neoforge_docs`、`get_neoforge_doc_*` |
| 跨平台文档 | `list_doc_versions`、`search_docs`、`get_doc_*` |
| 移植 / 数据 | `analyze_porting_path`、`port_project`、`diagnose_data_paths` |

详细安装步骤见 [`AUTO_SETUP.md`](./AUTO_SETUP.md) 与 [`mcp-server/README.md`](./mcp-server/README.md)。

## 阶段里程碑

| 阶段 | 状态 | 内容 |
|------|------|------|
| Phase 1 | ✅ 完成 | Forge / Fabric / NeoForge 规则集与多版本扩展 |
| Phase 1.5 | ✅ 完成 | 模组脚手架 + 校验 CLI |
| Phase 2 | ✅ 完成 | Agent Skills + 代码模式库 |
| Phase 3 | ✅ 完成 | MCP Server（Forge/Fabric/NeoForge 文档 + 映射 + 移植工具，约 31 工具） |
| Phase 4 | ✅ 进行中 | 知识库 / 反模式 / 数据审计与 Release 分发 |
| Phase 5 | 📋 暂缓 | 微调数据集 + runtime-inspector |
