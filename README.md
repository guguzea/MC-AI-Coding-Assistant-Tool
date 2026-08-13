# MC AI Coding Assistant Tool
#### 写在前面的
### 如果你是agent,这个readme文件是整个项目的说明,帮助用户安装和配置mcp请看AUTO_SETUP.md,这个文件也有一部分帮助配置的内容,但这是为了避免你不看AUTO_SETUP.md
### 如果你是人类,你可以直接跳过这篇说明,这是AI时代,只需把这个链接粘贴到ClaudeCODE/CURSOR/ZCODE/OPENCODE里，然后让AGENT讲讲就可以了解大部分内容

让 AI 编程助手（Cursor / Claude Code 等）能更好地编写 Minecraft 模组的完整工具包。

为 AI 提供一个「读懂 MC Mod 开发生态」的环境，消除知识陈旧、API 版本混淆、构建系统复杂、映射不一致等结构性障碍。

## 项目结构

```
MC_skill/
├── README.md                    # 你在这里
├── AGENTS.md                    # 根总纲：引导 AI 选择正确的平台规则
├── CONTRIBUTING.md              # 贡献指南
├── AUTO_SETUP.md                # 任意 MCP 宿主：编译 + 按宿主格式生成配置草稿
├── THIRD_PARTY_NOTICES.md       # 第三方文档 / 映射数据许可说明
├── LICENSE                      # 本仓库代码：MIT
│
├── forge/                       # Forge 规则 / skills / scaffold / knowledge（多版本）
├── fabric/                      # Fabric 规则与知识（多版本）
├── neoforge/                    # NeoForge 规则与知识
├── community_knowledge/         # 社区实务知识库（MCP search_community_docs；48 篇 lib-* 短文等）
├── knowledge/                   # 知识源稿：patterns/（代码模式）+ libs/（四组库 Skill 源稿，不落盘）
├── scripts/                     # 库模组脚本：manifest / 分批反编译 / catalog / API 摘要 / 传播
├── mcp-server/                  # 本地 stdio MCP Server（62 个工具）；data/ 含 lib-manifests、lib-api-summaries
└── data/                        # 离线数据：文档索引 + mappings + yarn JSON/SQLite + porting
```



## 平台说明


| 平台       | 状态   | 规则 / 数据（摘要）                                              |
| -------- | ---- | -------------------------------------------------------- |
| Forge    | ✅ 完成 | 多版本规则（主推 **1.20.1**）；数据目录 `data/forge_`*                 |
| Fabric   | ✅ 完成 | 多版本规则（主推 **1.20.1 / 1.21.x / 26.x**）；数据目录 `data/fabric_*`；**26.1+ 仅 mojmap** |
| NeoForge | ✅ 完成 | 规则集在 `neoforge/`（主推 **1.20.4+ / 26.x**）；文档数据见 `data/neoforge_*`（主文档默认 **26.1**；primer 可有 26.2） |




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

> 将 `[AUTO_SETUP.md](./AUTO_SETUP.md)` 拖入当前 AI IDE / CLI。Agent 应识别宿主（Cursor / Claude Code / VS Code / Continue / Trae / OpenCode / Codex 等），编译 `mcp-server`，按该宿主格式生成配置草稿，**经你确认后合并**（不会静默覆盖）。  
> 要求 **Node.js >= 22.5**；服务名 `MC-AI-Coding-Assistant-Tool`（stdio，62 个工具）。无 MCP 客户端时用 `node mcp-server/dist/cli.js`。



## 环境变量


| 变量                      | 说明                                     | 示例                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_DATA`         | 数据目录根路径（指向 `data/`，不含版本子目录）            | `H:/MC_skill/data`                |
| `MC_SKILL_COMMUNITY`    | 社区知识库根路径（默认仓库根 `community_knowledge/`） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE`  | `1` 时允许 `port_project` 写盘              | `1`                               |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许的项目根（绝对路径）                         | `H:/mods/my-mod`                  |
| `MC_SKILL_STRICT`       | `1` 时数据无效则 MCP 启动失败                    | `1`                               |
| `MC_SKILL_DEBUG_PATHS`  | `1` 打印路径解析过程                           | `1`                               |
| `MC_SKILL_CACHE`        | 反编译/下载缓存根目录（默认 `%APPDATA%/mc-skill-cache` / `~/.config/mc-skill-cache`） | `H:/mc-skill-cache` |
| `MC_SKILL_SKIP_DOWNLOAD` | `1` 时反编译工具跳过一切下载并诚实失败（CI 语义）       | `1`                               |
| `MCP_TIMEOUT_MS`        | 测试脚本超时毫秒数                              | `30000`                           |




## MCP 工具使用注意

本地 MCP 服务名：`MC-AI-Coding-Assistant-Tool`（**62** 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。仓库 / Release **不含** `node_modules`，需自行 `npm ci && npm run build`（建议再跑 `npm run build:yarn-sqlite`）。

**测试**：`cd mcp-server && npm test`（构建 + 全部单测：核心 / 脚本 / 数据审计 / Wave BCD / localize / update / CLI / 反编译 / 深 mixin / MCP 协议）。CI 语义：`MC_SKILL_SKIP_DOWNLOAD=1` 时下载类工具诚实失败。

### 向量 / 语义搜索（T1）

`search_forge_docs` / `search_fabric_docs` / `search_neoforge_docs` / `search_docs` **默认就是混合检索**，不是「只搜 L0 标题」。实现：L0 关键词排行 ∪（FTS5 全文 + MiniLM 向量余弦）再做 **RRF 合并**；命中可带 `matches[]`（chunks 表 top-K：`sectionHeading` / `snippet` / `score`）。返回里 `semantic: true` 表示本轮用上了语义库。

**三档降级**（缺什么就退一档，不报错、不造数据、运行时不远程拉模型 `allowRemoteModels=false`）：

| 档 | 条件 | 行为 |
|----|------|------|
| `hybrid` | 有 `semantic/db.sqlite` 且 embeddings 非空，且 `data/_models/Xenova/all-MiniLM-L6-v2` 就绪 | L0 + 向量 + FTS5，RRF 融合 |
| `fts5-only` | 有语义库但嵌入模型缺失，或 embeddings 表为空 | 全文关键词（FTS5），不再算向量 |
| `l0-only` | 该版本/数据源没有语义库（`semanticSearch` 返回 `null`） | 只匹配 L0 索引字段（`label` / `id` / `url` / `tags`）；结果 `semantic: false`，并带 warning |

全局 `get_server_status.semanticIndex.modeHint` 是**本机总体**档位（有任一 hybrid 树且模型就绪 → `hybrid`）。**单次查询**仍可能是 L0：例如 Forge 1.7.10 没有教程语义库。看该次 JSON 的 `semantic` 与 `warning`，不要只看 modeHint。

构建期缺模型：警告并降级 FTS5-only（不 exit 1）。`diagnose_data_paths.semantic` 报告各文档树旁 db 是否存在。

**数据与模型位置**：语义库在 `data/{platform}_{ver}/{source}/{ver}/semantic/db.sqlite`（跳过 `forge_javadoc`），当前约 **40** 个；嵌入模型在 `data/_models/Xenova/all-MiniLM-L6-v2`（transformers.js，**唯一允许远程拉模型的入口**）。构建：`npm run fetch:embedding-model`；`npm run build:semantic-index -- --all`（可 `--platform` / `--version` / `--source` / `--no-embed` / `--force`；可中断续跑）。产物清单：`data/semantic-index-manifest.json`。

### 文档查询（Forge / Fabric / NeoForge）

1. **页面 ID 必须用搜索结果里的** `id`，不要用网站 URL 路径。
  - 正确：`get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
  - 错误：`id: "items/first-item"`
2. **推荐流程**：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`。
3. 搜索默认 **hybrid**（见上一节）。只有降级到 `l0-only` 时才「只匹配索引字段」。
4. 前缀查询示例：`class:Item`、`event:lifecycle`。
5. NeoForge `1.20.1` 文档查询会回退到 Forge 1.20.1 视图（兼容层），属预期。
6. 若某平台数据包未下载，对应 list/search 会返回 `PLATFORM_DATA_MISSING`（可用 `diagnose_data_paths` 确认）。

### 边界

文档向量搜索 **补不了** Vanilla 方法签名。缺索引时保持 `found:false` / 空结果 + 说明，

| 情况 | 表现 | Agent 应改用 |
|------|------|----------------|
| MC **26.1+** 的 `query_api` / `get_method_params` | 该类 extracted 为 **0 个类**（无 Parchment api-index） | `search_neoforge_docs`（默认 26.1）/ `search_fabric_docs`（先 `list_fabric_versions`，如 26.1.2）；或 `get_minecraft_source` / 反编译。映射层返回 `UNOBFUSCATED_NO_YARN` |
| Forge **1.14.4 / 1.15.2** `api-index.json` | 占位 `{}`，Parchment 约从 1.16.5 才有 | 换 `version=1.16.5+` 查相近 Vanilla 名，或靠文档 / MCP 映射，不要当有完整 javadoc |
| Fabric **26.1.2** | 仅 `fabric-docs`（页数少），**无** `fabric-wiki` | `source` 保持默认 `fabric-docs`；不要把 1.21.x wiki 当 26.1.2 |
| Forge **1.7.10–1.11.2** | 无现代教程树与语义库，搜索落到 Javadoc 类名，`semantic: false` | 当类名索引用；不要期望 Capability 教程全文 |
| `diagnose_gradle` / `validate_project` | **仅 ForgeGradle** | Fabric → `search_fabric_docs`（Loom）；NeoForge → `search_neoforge_docs`（NeoGradle） |
| `get_server_status.updateHint` 显示有更新 | 可能是检查缓存过期 | 以 `mc_skill_update action=check` 为准；git describe 已超前 Release 则不必 apply |



Agent **不得**把「工具返回空 / found:false / warning」解释成「游戏或文档里不存在」，也不得用错平台的工具硬查。对照：

| 误判 | 实际边界 |
|------|----------|
| `query_api` 能查 `DeferredRegister` / Fabric API | **不能**。只含 Vanilla Parchment extracted（约 1.16.5–1.20.4）。平台 API → 对应 `search_*_docs` |
| `query_api` `found:false` = 类不存在 | 索引没有该类。26.1+ 收录 **0** 类；1.14.4/1.15.2 是空 `{}`。改文档搜索或 `get_minecraft_source` |
| `get_method_params` 覆盖所有 MC 版本 | 与 `query_api` 同一数据源，边界相同 |
| `get_version_info` 适用于 Fabric/NeoForge | **仅 Forge** |
| `diagnose_gradle` 能修 Loom / NeoGradle | **仅 ForgeGradle**；检测到 loom/neogradle 会警告并建议改文档工具 |
| `validate_project` 能校验 `fabric.mod.json` | **仅 Forge** mods.toml / DeferredRegister |
| `query_registry` 能查模组注册名 | 只查原版 `minecraft:` 资源 ID |
| 文档搜索为空 = 数据包坏了 | 可能是 L0 降级、标签不对、或该版无 wiki。看 `semantic` / `warning` |
| 用网站 URL 当 `get_*_doc_full` 的 `id` | **必须**用搜索结果里的 `id` |
| `search_community_docs` 可当官方 API | **不能**。`links` 条目不抓网页正文 |
| `port_project` 会改用户工程 | 默认 **dryRun**；真写需 `confirmed` + `MC_SKILL_ALLOW_WRITE` + 路径在 `MC_SKILL_PROJECT_ROOT` 内 |
| `analyze_porting_path` 对任意文件夹都有移植路径 | 非模组目录 → `NOT_A_MOD_PROJECT` |
| `generate_*` / `generate_datagen` 会写文件 | **只返回文本骨架**。datagen 路径主要是 Forge 1.20.1 与 NeoForge 1.21.x |
| `localize_mod` 会自动译成中文 | **无机器翻译**，只标 `needsTranslation` |
| `check_dependencies` = 完整 Gradle 解析 | 启发式 + library-catalog，会漏未收录库 |
| `mixin_analyze deep:true` 会下载 MC jar | **不会**。未缓存 → `CACHE_MISS`，先 `get_minecraft_source` |
| `search_mod_code` 能搜任意 jar | 须先 `decompile_mod_jar`（或已有反编译目录），否则 `NOT_FOUND` |
| `analyze_mod_jar` 会给出方法体 | 只解析元数据（toml/json/mixin 列表），不反编译 |
| `convert_mapping` / `lookup_obfuscated` 用于 26.1 | 返回 `UNOBFUSCATED_NO_YARN`（已去混淆） |
| `validate_datapack_json` 覆盖所有 pack_format | 精简 schema，偏 **1.20.1 / 1.21.1** |
| `get_*_doc_full` 一次拉很多页 | **最多 2 页**，避免上下文溢出 |
| `updateHint.available` = 必须更新 | 缓存可能过期；先 `mc_skill_update check` |
| 缺 26.2 / 26.1.2 wiki 就复制邻版 | **禁止克隆冒充** |

写模组时的选用顺序：平台规则（`AGENTS.md`）→ `search_*_docs`（平台 API）→ `query_api`（仅有索引的 Vanilla）→ 反编译（确实要源码）。不要反过来用 `query_api` 猜 Forge 事件名。



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
2. **obfuscated / intermediary 层**（T5）：`obfuscated` = Tiny official 混淆短名（`er`），`intermediary` = `method_6032` 类；`yarn/mcp→obfuscated` 与 `to=mojang` 同值，`obfuscated/intermediary→yarn/mcp` 支持**无 ownerClass 全局反查**（崩溃日志单 token）。`to=mojang` 保持旧行为，notes 提示改用 `to=obfuscated`。**26.1+ 无混淆层**：obfuscated/intermediary 请求返回 `UNOBFUSCATED_NO_YARN`（仅 1.14–1.21.11 可用）。
3. **字段查询**：传 `memberKind: "field"`（或 `"auto"` 时按名称风格推断），建议带 `ownerClass`；1.14–1.15 仅全局 `field_`*/`searge↔named`。schema 仍为 v2 时返回 `SCHEMA_FIELDS_UNAVAILABLE`（需重建 sqlite）。CLI：`mc-skill convert --kind field ...`。
4. 失败默认 `found:false`、`converted:null`；过渡参数 `allow_fallback` 可回传原名并设 `fallbackUsed`（禁止假成功）。
5. 构建：`cd mcp-server && npm run build:yarn-sqlite`（本地 temp 写入后复制，避免盘符 I/O 问题）。



### 工作流模板与知识资源（Prompts / Resources + 工具兜底）

Cursor 主路径是 **tools**；协议层仍注册 Prompt/Resource，工具兜底保证同款正文可读：


| 能力   | 工具                         | 说明                                                                                                   |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| 工作流  | `get_workflow_template`    | 模板名：`mc-new-block` / `mc-new-entity` / `mc-new-gui` / `mc-crash-triage` / `mc-port-mod` / `mc-build-mod` / `mc-ingame-iterate` / `mc-localize-mod` / `mc-decompile-mod`（与 Prompt 同名） |
| 知识列表 | `list_knowledge_resources` | 列出 `mcskill://` URI                                                                                  |
| 知识读取 | `read_knowledge_resource`  | 按 URI 读正文                                                                                            |


常用 URI：`mcskill://patterns/README`（→ `community_knowledge/patterns/README.md`）、`mcskill://schema/sqlite`、`mcskill://matrix/mixin-support`、`mcskill://version-changes/1.21`、`mcskill://antipatterns/registry`、`mcskill://workflow/<模板名>`、`mcskill://community/<authored-id>`。兼容说明见 `[mcp-server/docs/prompts-client-compat.md](./mcp-server/docs/prompts-client-compat.md)`。

**补充文档**（`mcp-server/docs/`）：`mixin-support.md`（字节码校验支持矩阵）、`vanilla-registries.md` / `registry-data-source.md`（Registry 数据源）、`mc-skill-update.md`（自更新机制）、`prompts-client-compat.md`（Prompt/Resource 客户端兼容）。

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




## Agent Skills（**34** 个 Forge 唯一名 + 平台扩展，多 IDE 镜像）

路径示例：`forge/1.20.1/.agents/skills/<name>/`（另有 `.cursor` / `.continue` / `.opencode` / `.zcode` 等宿主镜像）。Wave D 新增 skill 已用 `scripts/propagate-wave-d-skills.mjs` 同步到各平台/版本，再经 `scripts/sync-skills.ps1 -All` 镜像到各 IDE。

> 库模组 Skill（`mc-config` / `mc-geckolib` / `mc-curios` / `mc-patchouli` 等）**不落盘**：源稿在根目录 `knowledge/libs/<group>/mc-<name>/SKILL.md`（`all-platforms` / `fabric-only` / `neo-only` / `forge-only` 四组），按 AGENTS.md「库模组 Skill」解析规则使用；`propagate-wave-d-skills.mjs` 与平台 `.cursor/skills` **不再包含库项**。当前库源稿：all-platforms 20 + fabric-only 9 + forge-only 2 + neo-only 2（Curios/KFF 镜像）= **33 份** / **31 唯一 skillId**（以 `knowledge/libs` 实际源稿为准）。

| 平台/版本 | 数量 | 结构 | 说明 |
|-----------|------|------|------|
| `forge/1.20.1` 及多数 Forge 版本 | **34** | 目录（每 skill 一目录） | 15 核心 + 19 Wave D |
| `forge/1.15.2` | **35** | 目录 | 上表 + `mc-events` |
| `fabric/*`（10 个版本） | **37** | `.md` 文件 | 18 基础（含 `mc-fabric-api` / `mc-kotlin` / `mc-cloth-config`）+ 19 Wave D |
| `neoforge` | **35** | 目录 | 16 基础（含 `mc-events`）+ 19 Wave D |

| 分类           | Skills                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 核心           | `mc-registry`、`mc-block`、`mc-item`、`mc-blockentity`、`mc-entity`、`mc-mixin`、`mc-networking`、`mc-datagen`、`mc-capability`、`mc-gui` |
| 内容           | `mc-fluid`、`mc-particle`、`mc-sound`、`mc-recipe`、`mc-enchantment`、`mc-potion`、`mc-effect`、`mc-command`、`mc-villager`、`mc-ai`      |
| 渲染 / 模型      | `mc-renderer`、`mc-model`                                                                                                           |
| 世界 / 数据包     | `mc-worldgen`、`mc-structure`、`mc-advancement`、`mc-loottable`、`mc-datapack`、`mc-resourcepack`、`mc-dimension`、`mc-weather`         |
| 配置 / 测试 / 能源 | `mc-gametest`、`mc-energy`、`mc-multiblock`                                                                                          |
| 兼容 / 文档库     | 平台自有 `mc-compat-jei`；库类（`mc-config` / `mc-yacl` / `mc-geckolib` / `mc-architectury` / `mc-terrablender` / `mc-playeranimator` / `mc-pehkui` / `mc-kubejs` / `mc-balm` / `mc-modern-ui` / `mc-patchouli` / `mc-owo` / `mc-curios` / `mc-kotlin-for-forge` / `mc-trinkets` / `mc-cca` / `mc-polymer` / `mc-text-placeholder` / `mc-satin` / `mc-fabric-language-kotlin` / `mc-libgui` / `mc-lib-catalog` / `mc-author-shared-libs` / `mc-resourceful-lib` / `mc-moonlight-lib` / `mc-caelus` / `mc-spruceui` / `mc-player-ability-lib` / `mc-server-translations` / `mc-impersonate` = **30 个库 Skill** → `knowledge/libs` 源稿） |

Fabric 另含 `mc-fabric-api`、`mc-kotlin`、`mc-cloth-config`；NeoForge / Forge 1.15.2 另含 `mc-events`。代码模式示范见 `community_knowledge/patterns/`（也可经 `mcskill://patterns/README` 读取）。

## MCP Server 工具（62 个）

服务名：`MC-AI-Coding-Assistant-Tool`。安装与配置见 `[AUTO_SETUP.md](./AUTO_SETUP.md)`、`[mcp-server/README.md](./mcp-server/README.md)`。

推荐通用流程：

1. `diagnose_data_paths` / `list_*_versions` / `get_server_status` 确认数据与版本
2. 文档：`search_*` → `get_*_summary` → `get_*_full`（全文勿一次超过 2 页；`id` 必须来自搜索结果）
3. **平台 API** 用 `search_*_docs`；**Vanilla 签名**才用 `query_api` / `get_method_params`（26.1+ 无索引）
4. 映射：`convert_mapping` / `lookup_obfuscated`（26.1+ 无混淆层）
5. 工程：`diagnose_gradle` / `validate_project` / `generate_datagen` / `crash_analyze`注:Forge 才用 `diagnose_gradle` / `validate_project`；Fabric/Neo 改对应文档工具
6. 移植：`analyze_porting_path` →（确认后）`port_project`（默认 dryRun）
7. 工作流 / 知识：`get_workflow_template` / `list_knowledge_resources` → `read_knowledge_resource`

工具限制与误判对照见上文「工具边界」。

---



### 1. API 与映射 / 状态（6）


| 工具                  | 作用                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query_api`         | 查询 Vanilla/Parchment 类的方法签名、参数名、返回类型与 javadoc（按 `version` 加载 extracted 索引，默认 1.20.1）。**不含** Forge 特有类。覆盖约 **1.16.5–1.20.4**；**26.1+ 无索引**（见上文「诚实降级」）。适用于确认 Minecraft API 用法。   |
| `get_method_params` | 按类名 + 方法名查询完整参数名列表（可带 JNI `descriptor` 区分重载）。适用于已知方法名但不确定参数顺序/名称。                                                                                                 |
| `convert_mapping`   | 在 **mojang / mcp / yarn / parchment / obfuscated / intermediary** 间互转类/方法/**字段**（SQLite **v3**）。`memberKind=field`；`to=mojang` 为 Tiny official 短名（同 obfuscated 层）；失败默认 `converted:null`（可选 `allow_fallback`）。 |
| `lookup_obfuscated` | 崩溃日志反混淆：单 token（`method_6032` / `er` / `func_110143_aJ` / `field_100013_f`）反查 → yarn 可读名 + ownerClass + descriptor。方法→字段→类；多命中 AMBIGUOUS；26.1+ 返回 `UNOBFUSCATED_NO_YARN`。 |
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
| `search_forge_docs`     | **hybrid** 搜索（L0 + 语义 RRF；无库则纯 L0）。支持 `class:` / `event:` / `method:` 前缀与 `|` OR、去停用词、标签过滤。返回页面 `id` 供后续工具使用。 |
| `get_forge_doc_summary` | 取单页 L1 摘要：首段 + 各章节标题/短摘要，用于判断是否值得读全文。                                                                 |
| `get_forge_doc_full`    | 取单页 L2/L2+ 全文；默认 `highlight_key=true` 突出 🔴🟠🟢 关键段。**不要一次加载超过 2 个全文页。**                              |
| `get_forge_doc_related` | 根据路径骨架、标签与章节关键词返回相关页面列表。                                                                              |




### 4. Fabric 官方文档（5）


| 工具                       | 作用                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `list_fabric_versions`   | 列出本地 Fabric 文档版本（`fabric-docs` / `fabric-wiki` 有索引即计入）。无数据 → `PLATFORM_DATA_MISSING`。 |
| `search_fabric_docs`     | **hybrid** 搜索；可选 `source`：`fabric-docs`（默认）/ `fabric-wiki` / `all`。wiki 偏入门；**26.1.2 无 wiki**。 |
| `get_fabric_doc_summary` | Fabric 页 L1 摘要（可指定 source）。                                                           |
| `get_fabric_doc_full`    | Fabric 页全文 + 关键段高亮（可指定 source）。                                                       |
| `get_fabric_doc_related` | Fabric 相关页推荐。                                                                         |




### 5. NeoForge 官方文档（5）


| 工具                         | 作用                                                                    |
| -------------------------- | --------------------------------------------------------------------- |
| `list_neoforge_versions`   | 列出本地 NeoForge 文档版本；主文档默认 **26.1**（官方 26.2 主树未发布前不克隆冒充）；**1.20.1** 可回退 Forge 数据。 |
| `search_neoforge_docs`     | **hybrid** 搜索（DeferredRegister、Data Components、Payload 等）；无语义库则纯 L0。默认文档版本 **26.1**。 |
| `get_neoforge_doc_summary` | NeoForge 页 L1 摘要。                                                     |
| `get_neoforge_doc_full`    | NeoForge 页全文 + 关键段高亮。                                                 |
| `get_neoforge_doc_related` | NeoForge 相关页推荐。                                                       |




### 6. 跨平台通用文档（5）

与专用工具能力对应，通过 `platform`（`forge` / `fabric` / `neoforge`，默认 forge）统一入口：


| 工具                  | 作用                                                         |
| ------------------- | ---------------------------------------------------------- |
| `list_doc_versions` | 列出**指定** platform 的可用版本（不会一次返回三平台）。                        |
| `search_docs`       | 多平台 **hybrid** 搜索；Fabric 时可传 `source`。无语义库 → 纯 L0；缺平台数据 → `PLATFORM_DATA_MISSING`。 |
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


### 7.5 库模组知识体系（短文 + Skill + 数据链）

三层结构，覆盖「库模组是什么 → 怎么用 → 数据从哪来」：

**① 社区短文**（`community_knowledge/authored/`，经 `search_community_docs` 检索）

- **48 篇 `lib-*.md`**，按功能分类：配置（Cloth/YACL/Fzzy/owo/MidnightLib…）、动画（GeckoLib/playerAnimator/Satin）、跨加载器（Architectury/Balm/Resourceful/Moonlight）、饰品（Curios/Trinkets/Caelus）、世界生成（TerraBlender）、GUI（LibGui/ObsidianUI/Modern UI）、数据附加（CCA/PAL）、服务端网络文本（Polymer/Text Placeholder/Server Translations/Impersonate/Pehkui）、脚本语言（KubeJS/Kotlin…）、配方（JEI/EMI/REI）、全家桶（Collective/Bookshelf/MaLiLib 等 15 篇）
- 总目录 `library-catalog-2026`（全览导航）、陷阱专篇 `lib-traps-2026`（8 条选型陷阱）、配方集成 `library-integration` / `library-integration-jei-emi`
- 每篇含「**核对（2026-08 反编译验证）**」小节：已反编译核对的 MC 版本 × loader 的顶层 API 包/入口，细节以官方为准

**② 库 Skill 源稿**（`knowledge/libs/`，按 AGENTS.md「库模组 Skill」解析使用，**不落盘**平台目录）

- 四组：`all-platforms` 20 / `fabric-only` 9 / `forge-only` 2 / `neo-only` 2（Curios、KFF 与 forge-only 镜像）= **33 份** `mc-*/SKILL.md`（**31** 唯一 skillId）
- 解析规则：platform → 组映射（forge→forge-only+all-platforms；fabric/quilt→fabric-only+all-platforms；neoforge→neo-only+all-platforms）+ frontmatter `platforms`/`minecraftVersions` 二次过滤

**③ 数据链**（短文 frontmatter → 脚本生成 → MCP 消费）

```
authored/lib-*.md frontmatter
  → build-library-catalog-from-authored.mjs → library-catalog.ts（45 库 / 1880 verifiedApi 键 / supportedVersions / officialUrls）
  → build-lib-manifest.mjs（Modrinth API）→ lib-manifests/all.json（45 库 / 2867 版本条目）
  → batch-decompile.mjs（分批反编译，源码按需生成到 $MC_SKILL_CACHE，不入库）
  → merge-verified-api.mjs → 回填 verifiedApi
  → build-api-summaries.mjs → lib-api-summaries/（44 库 API 摘要）
  → check_dependencies 消费 catalog + manifest（库识别 / supportedVersions / 版本摘要）
```

相关脚本均在 `scripts/`；数据位置见「反编译数据产物」一节。




### 8. 移植与数据诊断（3）


| 工具                     | 作用                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_data_paths`  | 诊断 `MC_SKILL_DATA` / `MC_SKILL_COMMUNITY` 解析结果，以及 forge/fabric/neoforge/community 是 `found` / `empty` / `not_found`。排障首选。                                                                   |
| `analyze_porting_path` | 扫描项目，识别平台/版本/Mappings/Architectury，输出风险、`routeSteps`、参考链接与建议的 `query_api` 调用。                                                                                                               |
| `port_project`         | 执行移植步骤：`init_architectury` / `extract_common` / `apply_version_migration`。默认 **dryRun**；真正写入需 `dryRun=false` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + 路径在 `MC_SKILL_PROJECT_ROOT` 内。 |




### 9. Registry / Mixin / 资源（9）


| 工具                                                     | 作用                                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `query_registry`                                       | 查询 Vanilla 资源 ID（`nameLayer: registry_id`）；类/方法名用 `convert_mapping`。 |
| `mixin_analyze`                                        | 解析 mixins.json 与 @Mixin 注入目标（多映射层；高风险，见 supportMatrix）。`deep:true` 时基于已缓存 remapped 客户端 jar 做字节码级校验（目标类/选择器/@At 调用点）；jar 未缓存 → CACHE_MISS 引导（不自动下载）。 |
| `validate_at`                                          | 字节码级校验 Forge/NeoForge `*_at.cfg`：类/成员存在性（继承链/record/内部类）、映射层不匹配建议、跨文件冲突。 |
| `validate_aw`                                          | 字节码级校验 Fabric `.accesswidener`：header/namespace、条目类型、存在性、transitive、跨文件冲突。 |
| `audit_resources`                                      | 静态检查模型纹理引用、孤儿纹理、modId 命名等。                                           |
| `validate_datapack_json`                               | recipe / loot_table / advancement / tag 精简 JSON 校验。                  |
| `get_workflow_template`                                | 工作流全文（`mc-new-block` 等 9 个；与 MCP Prompt 同名；Cursor tools 兜底）。         |
| `list_knowledge_resources` / `read_knowledge_resource` | 列出/读取 `mcskill://`（含 patterns、schema、workflow、community 等）。          |

字节码级校验（`mixin_analyze deep` / `validate_at` / `validate_aw`）依赖 T2 缓存管线：
jar 未缓存时返回 `CACHE_MISS` 引导（先调 `get_minecraft_source`），**绝不自动大下载**。
详见 `mcp-server/docs/mixin-support.md`。




### 10. 代码生成模板（7）

`generate_model`、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`、`generate_entity_renderer`、`generate_worldgen`（骨架代码/JSON，非写盘）。

`localize_mod`：自有模组 `diff`/`draft_zh`，或第三方 jar `extract`/`pack_draft`；无机器翻译，标 `needsTranslation`；无 `en_us` 时可回退其它语言作源。

### 11. 日志与依赖诊断（3）


| 工具                    | 作用                                      |
| --------------------- | --------------------------------------- |
| `analyze_log`         | 解析游戏/崩溃日志片段（可复用 `crash_analyze` 分类）。    |
| `get_migration_guide` | 内置版本迁移路线摘要。                             |
| `check_dependencies`  | 根据 `build.gradle` / `mods.toml` / `fabric.mod.json` 提示依赖问题：loader 判定（fabric/forge/neoforge）、库模组识别（catalog 接线）、冲突/陷阱检测。返回 `detectedLibraries`（含 `supportedVersions` 反编译验证版本窗口与 `manifestSummary` 版本/加载器摘要，数据来自 `library-catalog.ts` + `data/lib-manifests/all.json`）。 |

### 12. 自我更新（1）

| 工具 | 作用 |
|------|------|
| `mc_skill_update` | 检查 / 应用本仓库 **tooling + data** 更新（GitHub Release）。`action=check\|apply`；`scope=tooling\|data\|all`；默认 `channel=stable`（忽略预发布）。`apply` 默认 dryRun；真写需 `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT`=**本仓库根**。返回 `filesToOverwrite` / `diskSpace` / `restartRequired`。CLI：`mc-skill update --action check\|apply`（旧位置参数 `check\|apply` 仍兼容，stderr 有迁移提示）。详见 [`mcp-server/docs/mc-skill-update.md`](./mcp-server/docs/mc-skill-update.md)。 |

`get_server_status` 附带 `buildStatus`（src 比 dist 新时 `buildRequired=true`，提示重新 `npm run build`）、`updateHint`（上次 check 缓存，默认 TTL 1h）与 `pendingRestart`。

### 13. 反编译与模组源码（4）— T2 Wave C

**默认零下载**：不预热、不预取；仅显式调用时按需下载到 `$MC_SKILL_CACHE`（默认 `%APPDATA%/mc-skill-cache` / `~/.config/mc-skill-cache`），**绝不写项目目录**。`MC_SKILL_SKIP_DOWNLOAD=1`（CI）时下载类工具诚实失败并给出指引。**Java 17+ 前置**（VineFlower / tiny-remapper）：缺失时返回 `TOOLCHAIN_MISSING` + Adoptium 安装指引，进程不崩溃。

| 工具 | 作用 |
|------|------|
| `get_minecraft_source` | 按需下载+重映射+反编译真实 MC 源码，返回类源码片段（支持行区间 / `force` 重编译）。首次 3–10 分钟，同版本缓存命中 <1s。 |
| `analyze_mod_jar` | 纯 Node 解析本地 mod jar：fabric.mod.json / mods.toml / neoforge.mods.toml、mixins.json 引用、entrypoints、依赖、AW/AT。无 Java、零下载。 |
| `decompile_mod_jar` | VineFlower 按需反编译本地 jar → `$MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/`，返回源码树摘要；可选 remap（需匹配 MC 版本）。 |
| `search_mod_code` | 对已反编译源码做行级 grep（子串/正则），返回 file:line 命中；入口：`decompiledDir` 或已反编译过的 `jarPath`。 |

**版本支持矩阵**（与 26.x 现状对齐）：

| 版本区间 | Yarn | Mojmap | 说明 |
|---|---|---|---|
| 1.14 – 1.21.11 | ✅ | ✅ | 两步 remap（official→intermediary→named） |
| 26.1+ | ❌（已停更） | ✅ | 去混淆，免 remap |

**与 `query_api` 的分工**：`query_api` / `get_method_params` 查 **1.16.5–1.20.4 Vanilla** 签名（快、离线）；**不含** Forge/Fabric API，**26.1+ 无索引**。以上 4 工具仅在确实需要完整源码/反编译时使用（下载量大）。各工具 description 均带 ⚠️ 提示。各工具 description 带边界说明。

**已入库的反编译数据产物**（供 `check_dependencies` 等消费，clone 后即用）：

| 数据 | 位置 | 内容 |
|---|---|---|
| `library-catalog.ts` | `mcp-server/src/diagnostics/` | 45 库 / **1880 个 verifiedApi 键**（`gameVersion/loader → packages/entrypoints`）+ `supportedVersions` 版本窗口 + `officialUrls` |
| `lib-api-summaries/*.json` | `mcp-server/data/` | 44 库 / 12,225 个 public 类 / 49,040 方法签名摘要（轻量 javadoc，约 4MB） |
| `lib-manifests/all.json` | `mcp-server/data/` | 45 库 / 2867 版本条目（版本号/URL/hash/loader 矩阵，Modrinth API 生成） |

反编译源码本体（28 万 .java）**不入库**（按需生成至 `$MC_SKILL_CACHE`）；`search_mod_code` 在源码缺失时返回 `NOT_FOUND` + 指引先调 `decompile_mod_jar`。相关脚本：`scripts/build-lib-manifest.mjs`（manifest）、`scripts/build-api-summaries.mjs`（API 摘要）、`scripts/batch-decompile.mjs`（分批反编译）、`scripts/merge-verified-api.mjs`（回填 catalog）。

另：`registerPrompt` / `registerResource`（工作流与知识 URI）供支持 prompts/resources 的客户端使用；详见 `mcp-server/docs/prompts-client-compat.md`。
### 工作流模板（MCP Prompts）

9 个工作流模板通过 `registerPrompt` 注册（支持 prompts 的客户端可用）；Cursor 等仅 tools 客户端用 `get_workflow_template` 工具获取同款全文。


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
| `mc-decompile-mod` | 模组反编译研究 | 定位 jar → `analyze_mod_jar` → `decompile_mod_jar` / `get_minecraft_source` → `search_mod_code` → 定位目标类 → 修改建议 → 衔接 `mc-build-mod` / `mc-ingame-iterate` |


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


### 独立 CLI（`mc-skill`，62 工具全可用）

flags-only（`--key value` / `--key=value` / 裸 `--key`→true），输出统一 JSON 包装 `{success, tool, result|error}`，退出码 0=成功 / 1=工具错误 / 2=用法错误：

```bash
node dist/cli.js status --version 1.20.1            # 服务器状态（含 buildStatus）
node dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F'
node dist/cli.js update --action check
node dist/cli.js list-tools                          # 全部 62 个工具的 schema
```

**通用 dispatch（v0.2+）**：除上述命令外，**任意 MCP 工具名可直接调用**（handler 自动收集，缺参时返回 zod 校验提示）：

```bash
node dist/cli.js search_docs --platform forge --query DeferredRegister --version 1.20.1
node dist/cli.js check_dependencies --buildGradle "..." --fabricModJson "{...}"
node dist/cli.js analyze_mod_jar --jarPath <path>
node dist/cli.js get_community_doc_summary --id authored/lib-curios
```

旧位置参数形式（`query <className>` / `convert ... <memberName>` 等）仍兼容；PowerShell 括号场景用单引号包裹（如 `'--descriptor=()F'`）。


---



## 阶段里程碑


| 阶段        | 状态    | 内容                                                    |
| --------- | ----- | ----------------------------------------------------- |
| Phase 1   | ✅ 完成  | Forge / Fabric / NeoForge 规则集与多版本扩展                   |
| Phase 1.5 | ✅ 完成  | 模组脚手架 + 校验 CLI                                        |
| Phase 2   | ✅ 完成  | Agent Skills + 代码模式库                                  |
| Phase 3   | ✅ 完成  | MCP Server（文档 + 映射 + 移植 + 社区 + Wave B/C/D 扩展，**62** 工具） |
| Phase 4   | ✅ 完成  | 知识库 / 反模式 / 数据审计与 Release 分发 |
| Phase 4.5 | ✅ 完成  | **库模组全覆盖**：48 篇短文 + 31 库 Skill（knowledge/libs）+ check_dependencies 增强 + 全量反编译（1515 jar → 1880 verifiedApi 键）+ API 摘要 + manifest + 通用 CLI dispatch |
| Phase 5   | 📋 暂缓 | 微调数据集 + runtime-inspector                             |


