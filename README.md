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
├── mcp-server/                  # 本地 stdio MCP Server（35 个工具）
└── data/                        # 离线数据：文档索引 + mappings + yarn JSON/SQLite + porting
```

## 平台说明

| 平台 | 状态 | 规则 / 数据（摘要） |
|------|------|---------------------|
| Forge | ✅ 完成 | 多版本规则（主推 **1.20.1**）；数据目录 `data/forge_*` |
| Fabric | ✅ 完成 | 多版本规则（主推 **1.20.1 / 1.21.x**）；数据目录 `data/fabric_*` |
| NeoForge | ✅ 完成 | 规则集在 `neoforge/`（主推 **1.20.4+**）；文档数据见 `data/neoforge_*` |

## 多 IDE 支持

以各平台版本目录下的 `.cursor/` 为源，同步到其他 IDE（**各版本均应具备完整 8 IDE 目录**）：

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

修改 `.cursor/` 后，在版本目录执行 `./sync-skills.ps1`（薄包装）。批量同步：

```powershell
# 仓库根目录
.\scripts\sync-skills.ps1 -All
# 或指定版本
.\scripts\sync-skills.ps1 -TargetDir .\forge\1.19.4
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

本地 MCP 服务名：**`MC-AI-Coding-Assistant-Tool`**（**35** 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。仓库 / Release **不含** `node_modules`，需自行 `npm ci && npm run build`（建议再跑 `npm run build:yarn-sqlite`）。

### 文档查询（Forge / Fabric / NeoForge）

1. **页面 ID 必须用搜索结果里的 `id`**，不要用网站 URL 路径。  
   - 正确：`get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
   - 错误：`id: "items/first-item"`
2. **推荐流程**：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`。
3. **L0 搜索只匹配索引字段**（`label` / `id` / `url` / `标签`），不是全文检索。
4. 前缀查询示例：`class:Item`、`event:lifecycle`。
5. NeoForge `1.20.1` 文档查询会回退到 Forge 1.20.1 视图（兼容层），属预期。
6. 若某平台数据包未下载，对应 list/search 会返回 `PLATFORM_DATA_MISSING`（可用 `diagnose_data_paths` 确认）。

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

## MCP Server 工具（35 个）

服务名：**`MC-AI-Coding-Assistant-Tool`**。安装与配置见 [`AUTO_SETUP.md`](./AUTO_SETUP.md)、[`mcp-server/README.md`](./mcp-server/README.md)。

推荐通用流程：

1. `diagnose_data_paths` / `list_*_versions` 确认数据与版本  
2. 文档：`search_*` → `get_*_summary` → `get_*_full`（全文勿一次超过 2 页）  
3. API：`query_api` / `get_method_params`；映射：`convert_mapping`  
4. 工程：`diagnose_gradle` / `validate_project` / `generate_datagen` / `crash_analyze`  
5. 移植：`analyze_porting_path` →（确认后）`port_project`

---

### 1. API 与映射（4）

| 工具 | 作用 |
|------|------|
| `query_api` | 查询 Vanilla/Parchment 类的方法签名、参数名、返回类型与 javadoc（按 `version` 加载 extracted 索引，默认 1.20.1）。**不含** Forge 特有类（如 `DeferredRegister`）。适用于确认 Minecraft API 用法。 |
| `get_method_params` | 按类名 + 方法名查询完整参数名列表（可带 JNI `descriptor` 区分重载）。适用于已知方法名但不确定参数顺序/名称。 |
| `convert_mapping` | 在 **mojang / mcp / yarn / parchment** 之间互转成员名；返回方向、置信度、可选 suggestions。Yarn 仅适用于 Fabric；`to=mojang` 时多为 Tiny official 短名，不是可读 FQCN。 |
| `get_version_info` | **【Forge only】** 按 MC 版本 + 操作（如「注册方块」）给出推荐做法、关键变更、gotchas 与官方 Changelog 链接。 |

### 2. 工程辅助（4）

| 工具 | 作用 |
|------|------|
| `diagnose_gradle` | **【Forge only】** 检查 `build.gradle` / `gradle.properties`：依赖、Forge 版本、Java toolchain、Parchment、reobf 等。返回 errors / warnings / suggestions。暂不覆盖 Loom / NeoGradle 全分支。 |
| `generate_datagen` | 生成 DataGen Provider 代码模板（recipe / blockstate / itemmodel / loottable / tag）。当前主推 **1.20.1 DeferredRegister** 风格；需 `modId`、`targetName`。 |
| `crash_analyze` | 解析崩溃报告全文，推断 `crashKind`、可能成因、缺前置/版本不兼容与 `logHints`。优先于盲目网页搜索；实务分类可配合社区工具。 |
| `validate_project` | **【Forge only】** 审查项目结构：`mods.toml` / `@Mod` / DeferredRegister / RegistryObject / Mixin / 资源路径 / 重复注册名等。适合首次接手或修完后自查。 |

### 3. Forge 官方文档（5）

| 工具 | 作用 |
|------|------|
| `list_forge_versions` | 列出本地已加载的 Forge 文档版本。无数据时返回 `PLATFORM_DATA_MISSING`。 |
| `search_forge_docs` | L0 索引搜索（label/id/url/tags）。支持 `class:` / `event:` / `method:` 前缀与 `\|` OR、去停用词、标签过滤。返回页面 `id` 供后续工具使用。 |
| `get_forge_doc_summary` | 取单页 L1 摘要：首段 + 各章节标题/短摘要，用于判断是否值得读全文。 |
| `get_forge_doc_full` | 取单页 L2/L2+ 全文；默认 `highlight_key=true` 突出 🔴🟠🟢 关键段。**不要一次加载超过 2 个全文页。** |
| `get_forge_doc_related` | 根据路径骨架、标签与章节关键词返回相关页面列表。 |

### 4. Fabric 官方文档（5）

| 工具 | 作用 |
|------|------|
| `list_fabric_versions` | 列出本地 Fabric 文档版本（`fabric-docs` / `fabric-wiki` 有索引即计入）。无数据 → `PLATFORM_DATA_MISSING`。 |
| `search_fabric_docs` | 搜索 Fabric 文档；可选 `source`：`fabric-docs`（默认）/ `fabric-wiki` / `all`。wiki 偏入门教程。 |
| `get_fabric_doc_summary` | Fabric 页 L1 摘要（可指定 source）。 |
| `get_fabric_doc_full` | Fabric 页全文 + 关键段高亮（可指定 source）。 |
| `get_fabric_doc_related` | Fabric 相关页推荐。 |

### 5. NeoForge 官方文档（5）

| 工具 | 作用 |
|------|------|
| `list_neoforge_versions` | 列出本地 NeoForge 文档版本；**1.20.1** 可回退使用 Forge 1.20.1 数据。 |
| `search_neoforge_docs` | NeoForge L0 搜索（DeferredRegister、Data Components、Payload 等）；结果可带相关性评分。 |
| `get_neoforge_doc_summary` | NeoForge 页 L1 摘要。 |
| `get_neoforge_doc_full` | NeoForge 页全文 + 关键段高亮。 |
| `get_neoforge_doc_related` | NeoForge 相关页推荐。 |

### 6. 跨平台通用文档（5）

与专用工具能力对应，通过 `platform`（`forge` / `fabric` / `neoforge`，默认 forge）统一入口：

| 工具 | 作用 |
|------|------|
| `list_doc_versions` | 列出**指定** platform 的可用版本（不会一次返回三平台）。 |
| `search_docs` | 多平台搜索；Fabric 时可传 `source`。缺平台数据 → `PLATFORM_DATA_MISSING`。 |
| `get_doc_summary` | 多平台 L1 摘要。 |
| `get_doc_full` | 多平台全文。 |
| `get_doc_related` | 多平台相关页。 |

### 7. 社区知识库（4）

与官方文档分离；**不替代** `search_*_docs`。适合发布、崩溃分类、软依赖、机器 GUI 等实务。

| 工具 | 作用 |
|------|------|
| `list_community_sources` | 列出 `community_knowledge` 条目（permitted / authored / links）及来源统计。 |
| `search_community_docs` | 搜索社区库；命中含 `sourceKind`、`url`、`summary`。 |
| `get_community_doc_summary` | 社区条目摘要（含署名）；links 仅元数据 + 外链。 |
| `get_community_doc_full` | permitted/authored 返回仓库内 Markdown；**links 只给 URL，不抓网页正文**。 |

### 8. 移植与数据诊断（3）

| 工具 | 作用 |
|------|------|
| `diagnose_data_paths` | 诊断 `MC_SKILL_DATA` / `MC_SKILL_COMMUNITY` 解析结果，以及 forge/fabric/neoforge/community 是 `found` / `empty` / `not_found`。排障首选。 |
| `analyze_porting_path` | 扫描项目，识别平台/版本/Mappings/Architectury，输出风险、`routeSteps`、参考链接与建议的 `query_api` 调用。 |
| `port_project` | 执行移植步骤：`init_architectury` / `extract_common` / `apply_version_migration`。默认 **dryRun**；真正写入需 `dryRun=false` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + 路径在 `MC_SKILL_PROJECT_ROOT` 内。 |

---



## 阶段里程碑

| 阶段 | 状态 | 内容 |
|------|------|------|
| Phase 1 | ✅ 完成 | Forge / Fabric / NeoForge 规则集与多版本扩展 |
| Phase 1.5 | ✅ 完成 | 模组脚手架 + 校验 CLI |
| Phase 2 | ✅ 完成 | Agent Skills + 代码模式库 |
| Phase 3 | ✅ 完成 | MCP Server（Forge/Fabric/NeoForge 文档 + 映射 + 移植 + 社区，**35** 工具） |
| Phase 4 | ✅ 进行中 | 知识库 / 反模式 / 数据审计与 Release 分发 |
| Phase 5 | 📋 暂缓 | 微调数据集 + runtime-inspector |
