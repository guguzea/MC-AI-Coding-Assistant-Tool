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
├── mcp-server/                  # 本地 stdio MCP Server（55 个工具）
└── data/                        # 离线数据：文档索引 + mappings + yarn JSON/SQLite + porting
```



## 平台说明


| 平台       | 状态   | 规则 / 数据（摘要）                                              |
| -------- | ---- | -------------------------------------------------------- |
| Forge    | ✅ 完成 | 多版本规则（主推 **1.20.1**）；数据目录 `data/forge_`*                 |
| Fabric   | ✅ 完成 | 多版本规则（主推 **1.20.1 / 1.21.x / 26.x**）；数据目录 `data/fabric_*`；**26.1+ 仅 mojmap** |
| NeoForge | ✅ 完成 | 规则集在 `neoforge/`（主推 **1.20.4+ / 26.x**）；文档数据见 `data/neoforge_*`（默认 **26.2**） |




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


| IDE            | Rules                   | Skills / Commands   | Agent             |
| -------------- | ----------------------- | ------------------- | ----------------- |
| Cursor         | `.cursor/rules/*.mdc`   | `.cursor/skills/`   | `.cursor/agents/` |
| Claude Desktop | `.claude/rules/*.mdc`   | `.claude/commands/` | `.claude/agents/` |
| Continue.dev   | `.continue/rules/*.mdc` | `.continue/skills/` | —                 |
| Trae           | `.trae/rules/*.mdc`     | `.trae/skills/`     | `.trae/agents/`   |
| OpenCode       | `AGENTS.md`             | `.opencode/skills/` | —                 |
| Codex          | `AGENTS.md`             | `.agents/skills/`   | —                 |
| ZCode          | `AGENTS.md`             | `.zcode/skills/`    | —                 |
| Pi             | `.pi/rules/*.md`        | （主靠 AGENTS + rules） | —                 |




## 快速开始

**对 AI（打开一个 MC Mod 项目时）：**

> 按根目录 `AGENTS.md`：根据 `build.gradle` / `mods.toml` / `fabric.mod.json` 判断平台与版本，加载对应规则集。

**对新项目使用脚手架：**

> 使用对应平台版本下的 `scaffold/`（如 `forge/1.20.1/scaffold/`）生成带规则的项目骨架。

**多 IDE 同步：**

> 修改 `.cursor/` 后，在该版本目录运行 `sync-skills.ps1`。

**配置本地 MCP Server：**

> 将 `[AUTO_SETUP.md](./AUTO_SETUP.md)` 拖入 Cursor，让 AI 编译 `mcp-server` 并**生成** `mcp.json` 配置草稿（需你确认后粘贴；不会静默覆盖已有配置）。  
> 要求 **Node.js >= 22.5**；服务名 `MC-AI-Coding-Assistant-Tool`。



## 环境变量


| 变量                      | 说明                                     | 示例                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_DATA`         | 数据目录根路径（指向 `data/`，不含版本子目录）            | `H:/MC_skill/data`                |
| `MC_SKILL_COMMUNITY`    | 社区知识库根路径（默认仓库根 `community_knowledge/`） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE`  | `1` 时允许 `port_project` 写盘              | `1`                               |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许的项目根（绝对路径）                         | `H:/mods/my-mod`                  |
| `MC_SKILL_STRICT`       | `1` 时数据无效则 MCP 启动失败                    | `1`                               |
| `MC_SKILL_DEBUG_PATHS`  | `1` 打印路径解析过程                           | `1`                               |
| `MCP_TIMEOUT_MS`        | 测试脚本超时毫秒数                              | `30000`                           |




## MCP 工具使用注意

本地 MCP 服务名：`MC-AI-Coding-Assistant-Tool`（**55** 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。仓库 / Release **不含** `node_modules`，需自行 `npm ci && npm run build`（建议再跑 `npm run build:yarn-sqlite`）。

### 文档查询（Forge / Fabric / NeoForge）

1. **页面 ID 必须用搜索结果里的** `id`，不要用网站 URL 路径。
  - 正确：`get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
  - 错误：`id: "items/first-item"`
2. **推荐流程**：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`。
3. **L0 搜索只匹配索引字段**（`label` / `id` / `url` / `标签`），不是全文检索。
4. 前缀查询示例：`class:Item`、`event:lifecycle`。
5. NeoForge `1.20.1` 文档查询会回退到 Forge 1.20.1 视图（兼容层），属预期。
6. 若某平台数据包未下载，对应 list/search 会返回 `PLATFORM_DATA_MISSING`（可用 `diagnose_data_paths` 确认）。



### 映射转换（`convert_mapping` + Yarn）

1. 走预建 `yarn-mappings.sqlite`**（schema v3，含 fields）惰性点查**，运行时**禁止**全量加载 `yarn-mappings.json`。
2. **支持矩阵（摘要）**：


| 版本区间                 | 数据源 / era             | 类互转 | 方法互转                               | 字段互转                 | 备注                             |
| -------------------- | --------------------- | --- | ---------------------------------- | -------------------- | ------------------------------ |
| 1.16+（有 Fabric tiny） | `yarn-tiny`           | ✅   | ✅ 需 `ownerClass`；重载建议 `descriptor` | ✅ `memberKind=field` | `to=mojang` = Tiny official 短名 |
| 1.13 Forge           | `tsrg` + MCP CSV      | ✅   | ✅ 可带 `ownerClass`                  | ✅ + `fields.csv`     | `joined.tsrg` + CSV            |
| 1.7–1.12 Forge       | `forge-srg` + MCP CSV | ✅   | ✅ 可带 `ownerClass`                  | ✅ + `fields.csv`     | `joined.srg` + CSV             |
| 1.14–1.15            | `mcp-csv`（partial）    | ❌   | 仅全局 `searge↔named`                 | 仅全局 `field_*`        | **勿传** `ownerClass`            |


1. `mcp↔parchment` 为同名层（identity）；参数名用 `get_method_params`。
2. **字段查询**：传 `memberKind: "field"`（或 `"auto"` 时按名称风格推断），建议带 `ownerClass`；1.14–1.15 仅全局 `field_`*/`searge↔named`。schema 仍为 v2 时返回 `SCHEMA_FIELDS_UNAVAILABLE`（需重建 sqlite）。CLI：`mc-skill convert --kind field ...`。
3. 失败默认 `found:false`、`converted:null`；过渡参数 `allow_fallback` 可回传原名并设 `fallbackUsed`（禁止假成功）。
4. 构建：`cd mcp-server && npm run build:yarn-sqlite`（本地 temp 写入后复制，避免盘符 I/O 问题）。



### 工作流模板与知识资源（Prompts / Resources + 工具兜底）

Cursor 主路径是 **tools**；协议层仍注册 Prompt/Resource，工具兜底保证同款正文可读：


| 能力   | 工具                         | 说明                                                                                                   |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| 工作流  | `get_workflow_template`    | 模板名：`mc-new-block` / `mc-new-entity` / `mc-new-gui` / `mc-crash-triage` / `mc-port-mod` / `mc-build-mod` / `mc-ingame-iterate` / `mc-localize-mod`（与 Prompt 同名） |
| 知识列表 | `list_knowledge_resources` | 列出 `mcskill://` URI                                                                                  |
| 知识读取 | `read_knowledge_resource`  | 按 URI 读正文                                                                                            |


常用 URI：`mcskill://patterns/README`（→ `community_knowledge/patterns/README.md`）、`mcskill://schema/sqlite`、`mcskill://matrix/mixin-support`、`mcskill://version-changes/1.21`、`mcskill://antipatterns/registry`、`mcskill://workflow/<模板名>`、`mcskill://community/<authored-id>`。兼容说明见 `[mcp-server/docs/prompts-client-compat.md](./mcp-server/docs/prompts-client-compat.md)`。

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

第三方文档与映射的许可说明见 `[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)`。

## 目录约定

- 平台按 `平台/版本/` 分目录（如 `forge/1.20.1/`、`fabric/1.20.1/`）
- 规则文件在 `.cursor/rules/`，编号 `00`~`10`
- 每个规则含 **约束** 与 **Decision Flow**



## 规则文件说明


| 文件                     | 主题      | 说明                           |
| ---------------------- | ------- | ---------------------------- |
| `00-project-setup.mdc` | 项目结构    | Java / Gradle / 版本号          |
| `01-registry.mdc`      | 注册系统    | 按版本选择注册方式                    |
| `02-block.mdc`         | 方块      | 方块 / 方块实体 / 流体               |
| `03-item.mdc`          | 物品      | 物品 / 工具 / 盔甲 / 食物            |
| `04-entity.mdc`        | 实体      | EntityType / Renderer / Goal |
| `05-events.mdc`        | 事件      | 按场景选事件类                      |
| `06-networking.mdc`    | 网络      | 同步需求 → 包类型                   |
| `07-datagen.mdc`       | DataGen | Provider 选择                  |
| `08-client-server.mdc` | 端分离     | 代码放哪侧                        |
| `09-anti-patterns.mdc` | 反模式     | 症状与正确方案                      |
| `10-gui.mdc`           | GUI     | Menu / Screen / Container    |




## Agent Skills（**38** 个 Forge 唯一名 + 平台扩展，多 IDE 镜像）

路径示例：`forge/1.20.1/.agents/skills/<name>/`（另有 `.cursor` / `.continue` / `.opencode` / `.zcode` 等宿主镜像）。Wave D 新增 skill 已用 `scripts/propagate-wave-d-skills.mjs` 同步到各平台/版本，再经 `scripts/sync-skills.ps1 -All` 镜像到各 IDE。

| 平台/版本 | 数量 | 结构 | 说明 |
|-----------|------|------|------|
| `forge/1.20.1` 及多数 Forge 版本 | **38** | 目录（每 skill 一目录） | 15 核心 + 23 Wave D |
| `forge/1.15.2` | **39** | 目录 | 上表 + `mc-events` |
| `fabric/*`（10 个版本） | **41** | `.md` 文件 | 18 基础（含 `mc-fabric-api` / `mc-kotlin` / `mc-cloth-config`）+ 23 Wave D |
| `neoforge` | **39** | 目录 | 16 基础（含 `mc-events`）+ 23 Wave D |

| 分类           | Skills                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 核心           | `mc-registry`、`mc-block`、`mc-item`、`mc-blockentity`、`mc-entity`、`mc-mixin`、`mc-networking`、`mc-datagen`、`mc-capability`、`mc-gui` |
| 内容           | `mc-fluid`、`mc-particle`、`mc-sound`、`mc-recipe`、`mc-enchantment`、`mc-potion`、`mc-effect`、`mc-command`、`mc-villager`、`mc-ai`      |
| 渲染 / 模型      | `mc-renderer`、`mc-model`、`mc-geckolib`                                                                                           |
| 世界 / 数据包     | `mc-worldgen`、`mc-structure`、`mc-advancement`、`mc-loottable`、`mc-datapack`、`mc-resourcepack`、`mc-dimension`、`mc-weather`         |
| 配置 / 测试 / 能源 | `mc-config`、`mc-gametest`、`mc-energy`、`mc-multiblock`                                                                            |
| 兼容 / 文档库     | `mc-compat-jei`、`mc-curios`、`mc-patchouli`                                                                                       |

Fabric 另含 `mc-fabric-api`、`mc-kotlin`、`mc-cloth-config`；NeoForge / Forge 1.15.2 另含 `mc-events`。代码模式示范见 `community_knowledge/patterns/`（也可经 `mcskill://patterns/README` 读取）。

## MCP Server 工具（55 个）

服务名：`MC-AI-Coding-Assistant-Tool`。安装与配置见 `[AUTO_SETUP.md](./AUTO_SETUP.md)`、`[mcp-server/README.md](./mcp-server/README.md)`。

推荐通用流程：

1. `diagnose_data_paths` / `list_*_versions` / `get_server_status` 确认数据与版本
2. 文档：`search_*` → `get_*_summary` → `get_*_full`（全文勿一次超过 2 页）
3. API：`query_api` / `get_method_params`；映射：`convert_mapping`（类/方法/`memberKind=field`）
4. 工作流 / 知识：`get_workflow_template` / `list_knowledge_resources` → `read_knowledge_resource`
5. 工程：`diagnose_gradle` / `validate_project` / `generate_datagen` / `crash_analyze`
6. 移植：`analyze_porting_path` →（确认后）`port_project`

---



### 1. API 与映射 / 状态（5）


| 工具                  | 作用                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query_api`         | 查询 Vanilla/Parchment 类的方法签名、参数名、返回类型与 javadoc（按 `version` 加载 extracted 索引，默认 1.20.1）。**不含** Forge 特有类（如 `DeferredRegister`）。适用于确认 Minecraft API 用法。               |
| `get_method_params` | 按类名 + 方法名查询完整参数名列表（可带 JNI `descriptor` 区分重载）。适用于已知方法名但不确定参数顺序/名称。                                                                                                 |
| `convert_mapping`   | 在 **mojang / mcp / yarn / parchment** 间互转类/方法/**字段**（SQLite **v3**）。`memberKind=field`；`to=mojang` 为 Tiny official 短名；失败默认 `converted:null`（可选 `allow_fallback`）。 |
| `get_server_status` | API 索引预热状态、`diagnose_data_paths` 摘要、descriptor 自检与 **updateHint**；可选 `warmup` 先加载指定版本。                                                                                           |
| `get_version_info`  | **【Forge only】** 按 MC 版本 + 操作（如「注册方块」）给出推荐做法、关键变更、gotchas 与官方 Changelog 链接。                                                                                       |




### 2. 工程辅助（4）


| 工具                 | 作用                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_gradle`  | **【Forge only】** 检查 `build.gradle` / `gradle.properties`：依赖、Forge 版本、Java toolchain、Parchment、reobf 等。返回 errors / warnings / suggestions。暂不覆盖 Loom / NeoGradle 全分支。    |
| `generate_datagen` | 生成 DataGen Provider 模板：Forge **1.20.1**（recipe/blockstate/itemmodel/loottable/tag）与 NeoForge **1.21.x** 完整路径；另含 advancement / particle / sound。需 `modId`、`targetName`。 |
| `crash_analyze`    | 解析崩溃报告全文，推断 `crashKind`、可能成因、缺前置/版本不兼容与 `logHints`。优先于盲目网页搜索；实务分类可配合社区工具。                                                                                              |
| `validate_project` | **【Forge only】** 审查项目结构：`mods.toml` / `@Mod` / DeferredRegister / RegistryObject / Mixin / 资源路径 / 重复注册名等。适合首次接手或修完后自查。                                                 |




### 3. Forge 官方文档（5）


| 工具                      | 作用                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `list_forge_versions`   | 列出本地已加载的 Forge 文档版本。无数据时返回 `PLATFORM_DATA_MISSING`。                                                   |
| `search_forge_docs`     | L0 索引搜索（label/id/url/tags）。支持 `class:` / `event:` / `method:` 前缀与 `|` OR、去停用词、标签过滤。返回页面 `id` 供后续工具使用。 |
| `get_forge_doc_summary` | 取单页 L1 摘要：首段 + 各章节标题/短摘要，用于判断是否值得读全文。                                                                 |
| `get_forge_doc_full`    | 取单页 L2/L2+ 全文；默认 `highlight_key=true` 突出 🔴🟠🟢 关键段。**不要一次加载超过 2 个全文页。**                              |
| `get_forge_doc_related` | 根据路径骨架、标签与章节关键词返回相关页面列表。                                                                              |




### 4. Fabric 官方文档（5）


| 工具                       | 作用                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `list_fabric_versions`   | 列出本地 Fabric 文档版本（`fabric-docs` / `fabric-wiki` 有索引即计入）。无数据 → `PLATFORM_DATA_MISSING`。 |
| `search_fabric_docs`     | 搜索 Fabric 文档；可选 `source`：`fabric-docs`（默认）/ `fabric-wiki` / `all`。wiki 偏入门教程。         |
| `get_fabric_doc_summary` | Fabric 页 L1 摘要（可指定 source）。                                                           |
| `get_fabric_doc_full`    | Fabric 页全文 + 关键段高亮（可指定 source）。                                                       |
| `get_fabric_doc_related` | Fabric 相关页推荐。                                                                         |




### 5. NeoForge 官方文档（5）


| 工具                         | 作用                                                                    |
| -------------------------- | --------------------------------------------------------------------- |
| `list_neoforge_versions`   | 列出本地 NeoForge 文档版本；默认推荐 **26.2**；**1.20.1** 可回退使用 Forge 1.20.1 数据。 |
| `search_neoforge_docs`     | NeoForge L0 搜索（DeferredRegister、Data Components、Payload 等）；结果可带相关性评分。 |
| `get_neoforge_doc_summary` | NeoForge 页 L1 摘要。                                                     |
| `get_neoforge_doc_full`    | NeoForge 页全文 + 关键段高亮。                                                 |
| `get_neoforge_doc_related` | NeoForge 相关页推荐。                                                       |




### 6. 跨平台通用文档（5）

与专用工具能力对应，通过 `platform`（`forge` / `fabric` / `neoforge`，默认 forge）统一入口：


| 工具                  | 作用                                                         |
| ------------------- | ---------------------------------------------------------- |
| `list_doc_versions` | 列出**指定** platform 的可用版本（不会一次返回三平台）。                        |
| `search_docs`       | 多平台搜索；Fabric 时可传 `source`。缺平台数据 → `PLATFORM_DATA_MISSING`。 |
| `get_doc_summary`   | 多平台 L1 摘要。                                                 |
| `get_doc_full`      | 多平台全文。                                                     |
| `get_doc_related`   | 多平台相关页。                                                    |




### 7. 社区知识库（4）

与官方文档分离；**不替代** `search_*_docs`。适合发布、崩溃分类、软依赖、机器 GUI 等实务。


| 工具                          | 作用                                                              |
| --------------------------- | --------------------------------------------------------------- |
| `list_community_sources`    | 列出 `community_knowledge` 条目（permitted / authored / links）及来源统计。 |
| `search_community_docs`     | 搜索社区库；命中含 `sourceKind`、`url`、`summary`。                         |
| `get_community_doc_summary` | 社区条目摘要（含署名）；links 仅元数据 + 外链。                                    |
| `get_community_doc_full`    | permitted/authored 返回仓库内 Markdown；**links 只给 URL，不抓网页正文**。      |




### 8. 移植与数据诊断（3）


| 工具                     | 作用                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_data_paths`  | 诊断 `MC_SKILL_DATA` / `MC_SKILL_COMMUNITY` 解析结果，以及 forge/fabric/neoforge/community 是 `found` / `empty` / `not_found`。排障首选。                                                                   |
| `analyze_porting_path` | 扫描项目，识别平台/版本/Mappings/Architectury，输出风险、`routeSteps`、参考链接与建议的 `query_api` 调用。                                                                                                               |
| `port_project`         | 执行移植步骤：`init_architectury` / `extract_common` / `apply_version_migration`。默认 **dryRun**；真正写入需 `dryRun=false` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + 路径在 `MC_SKILL_PROJECT_ROOT` 内。 |




### 9. Registry / Mixin / 资源（7）


| 工具                                                     | 作用                                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `query_registry`                                       | 查询 Vanilla 资源 ID（`nameLayer: registry_id`）；类/方法名用 `convert_mapping`。 |
| `mixin_analyze`                                        | 解析 mixins.json 与 @Mixin 注入目标（多映射层；高风险，见 supportMatrix）。              |
| `audit_resources`                                      | 静态检查模型纹理引用、孤儿纹理、modId 命名等。                                           |
| `validate_datapack_json`                               | recipe / loot_table / advancement / tag 精简 JSON 校验。                  |
| `get_workflow_template`                                | 工作流全文（`mc-new-block` 等 8 个；与 MCP Prompt 同名；Cursor tools 兜底）。         |
| `list_knowledge_resources` / `read_knowledge_resource` | 列出/读取 `mcskill://`（含 patterns、schema、workflow、community 等）。          |




### 10. 代码生成模板（7）

`generate_model`、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`、`generate_entity_renderer`、`generate_worldgen`（骨架代码/JSON，非写盘）。

`localize_mod`：自有模组 `diff`/`draft_zh`，或第三方 jar `extract`/`pack_draft`；无机器翻译，标 `needsTranslation`；无 `en_us` 时可回退其它语言作源。

### 11. 日志与依赖诊断（3）


| 工具                    | 作用                                      |
| --------------------- | --------------------------------------- |
| `analyze_log`         | 解析游戏/崩溃日志片段（可复用 `crash_analyze` 分类）。    |
| `get_migration_guide` | 内置版本迁移路线摘要。                             |
| `check_dependencies`  | 根据 `build.gradle` / `mods.toml` 提示依赖问题。 |

### 12. 自我更新（1）

| 工具 | 作用 |
|------|------|
| `mc_skill_update` | 检查 / 应用本仓库 **tooling + data** 更新（GitHub Release）。`action=check\|apply`；`scope=tooling\|data\|all`；默认 `channel=stable`（忽略预发布）。`apply` 默认 dryRun；真写需 `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT`=**本仓库根**。返回 `filesToOverwrite` / `diskSpace` / `restartRequired`。CLI：`mc-skill update check\|apply`。详见 [`mcp-server/docs/mc-skill-update.md`](./mcp-server/docs/mc-skill-update.md)。 |

`get_server_status` 附带 `updateHint`（上次 check 缓存，默认 TTL 1h）与 `pendingRestart`。

另：`registerPrompt` / `registerResource`（工作流与知识 URI）供支持 prompts/resources 的客户端使用；详见 `mcp-server/docs/prompts-client-compat.md`。
### 工作流模板（MCP Prompts）

8 个工作流模板通过 `registerPrompt` 注册（支持 prompts 的客户端可用）；Cursor 等仅 tools 客户端用 `get_workflow_template` 工具获取同款全文。


| 模板名               | 标题      | 流程要点                                                                                                              |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `mc-new-block`    | 新方块工作流  | DeferredRegister 注册 → BlockItem → 模型（generate_model）→ lang（generate_lang）→ loot（generate_datagen）→ 可选 tags/recipe |
| `mc-new-entity`   | 新实体工作流  | EntityType + 属性 → SpawnPlacement/生物蛋 → 渲染器（generate_entity_renderer）→ loot/音效                                     |
| `mc-new-gui`      | GUI 工作流 | MenuType + AbstractContainerMenu → Screen 注册 → SimpleChannel 同步槽位                                                 |
| `mc-crash-triage` | 崩溃分诊    | analyze_log/crash_analyze → search_community_docs → validate_project + mixin_analyze → diagnose_gradle            |
| `mc-port-mod`     | 移植模组    | analyze_porting_path → 确认目标 → port_project dryRun → get_migration_guide                                           |
| `mc-build-mod`    | 模组构建流程  | validate_project / diagnose_gradle → gradlew build → 确认 build/libs jar → 失败则分析日志；可接真机循环                          |
| `mc-ingame-iterate` | 真机测试与修复循环 | 索取启动器与路径（官方/HMCL/PCL2 版本隔离）→ 装 jar → 复现 → 修 → 再测；可选兼容性测试。路径约定见模板正文与 [HMCL 隔离文档](https://docs.hmcl.net/launcher/isolation.html) |
| `mc-localize-mod` | 模组汉化 | 判定 own/third_party → `localize_mod` diff/draft 或 extract/pack_draft → Agent 填中文 → 自检；见 `authored/localization-lang` |


### 知识暴露（MCP Resources）

通过 `registerResource` 注册 `mcskill://` URI（支持 resources 的客户端）；`list_knowledge_resources` / `read_knowledge_resource` 工具兜底。


| URI                                     | 内容                                                         |
| --------------------------------------- | ---------------------------------------------------------- |
| `mcskill://matrix/mixin-support`        | mixin_analyze 支持矩阵（SRG/Yarn/Mojang/readable/descriptor 形态） |
| `mcskill://schema/sqlite`               | yarn-mappings.sqlite v2/v3 字段说明                            |
| `mcskill://version-changes/1.21`        | 1.21 变更专章（知识库）                                             |
| `mcskill://antipatterns/registry`       | 注册反模式短文                                                    |
| `mcskill://patterns/README`             | 代码模式库索引（community_knowledge/patterns/）                     |
| `mcskill://workflow/mc-new-block` 等 8 个 | 与 Prompt 同名的工作流正文                                          |


---



## 阶段里程碑


| 阶段        | 状态    | 内容                                                    |
| --------- | ----- | ----------------------------------------------------- |
| Phase 1   | ✅ 完成  | Forge / Fabric / NeoForge 规则集与多版本扩展                   |
| Phase 1.5 | ✅ 完成  | 模组脚手架 + 校验 CLI                                        |
| Phase 2   | ✅ 完成  | Agent Skills + 代码模式库                                  |
| Phase 3   | ✅ 完成  | MCP Server（文档 + 映射 + 移植 + 社区 + Wave B/C 扩展，**55** 工具） |
| Phase 4   | ✅ 进行中 | 知识库 / 反模式 / 数据审计与 Release 分发                          |
| Phase 5   | 📋 暂缓 | 微调数据集 + runtime-inspector                             |


