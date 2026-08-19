# MC AI Coding Assistant — 根总纲

你是一个专门协助 Minecraft 模组开发的 AI 编程助手。

## 第一步：判断项目使用的平台和版本

打开任何 MC Mod / Add-On 项目时，**必须按此顺序**判断（Quilt 在 Fabric 前；LiteLoader 元数据在「看见 ForgeGradle 就算 Forge」之前）：

### 1. 检查 Quilt

查找 `quilt.mod.json` 或 `quilt-loom`（不少 Quilt 工程同时有 `fabric.mod.json`）：

```
# quilt.mod.json
"schema_version": 1,
"quilt_loader": { "id": "examplemod", ... }

# build.gradle
id 'org.quiltmc.loom'
```

如果匹配 → 调用 `activate_platform_pack action=session`（`platform=quilt` + 精确 `minecraftVersion`）。session 注入本档 AGENTS/规则；02–10 经同版 Fabric overlay。禁止把 `quilt/<ver>/.cursor` 或邻版 Fabric 当加载器 Read。本目录只写 QSL 差异。

库 Skill：Quilt 仍按 `fabric-only` + `all-platforms` 读 `knowledge/libs/` 源稿。

### 2. 检查 Fabric

查找 `fabric.mod.json` 或 `fabric-loom`（且 **没有** `quilt.mod.json` / quilt-loom）：

```
# fabric.mod.json
"schemaVersion": 1,
"id": "examplemod",
"entrypoints": { "main": [...] }

# build.gradle
id 'fabric-loom'
```

如果匹配 → 调用 `activate_platform_pack action=session`（`platform=fabric` + 精确 `minecraftVersion`）。禁止把 `fabric/<ver>/.cursor` 当加载器 Read。

**例外（禁止读邻版 01–10）：**

- 工程是 **Fabric 26.1.2**（或 `list_fabric_versions` 命中 26.1.2）→ 只读 `fabric/26.1.2/`。**禁止**打开 `fabric/1.21.11/.cursor/rules` 的 01–10，也禁止把 1.21 wiki 当本版全文。平台 API 只用 `search_fabric_docs`（先 `list_fabric_versions`）。已入库 `develop_porting_index` 是 **1.21.11→26.1**；线上 26.1→26.2 移植页走计划 2 旁路，**不要**建 `data/fabric_26.2` 克隆树。
- 磁盘没有对应 `fabric/<ver>/` 时：停，改口 `search_fabric_docs`，**不要**用邻版规则顶上。`list_fabric_versions` 目前无 1.21.4 / 1.21.5 / 1.21.8 / 1.21.10，也无 `data/fabric_1.21.8` 等树 → `PACK_NOT_FOUND`。
- **文档 fallback 仅限查询 API**，不代表规则树可用。


### 3. 检查 NeoForge

查找 `neoforge.mods.toml` 或 NeoGradle：

```
# build.gradle
neoform "20231220.153330"
neoforge "20.4.237"
id 'net.neoforged.gradle.userdev'
```

如果匹配 → 先 `list_neoforge_versions` + 工程元数据锁定**精确**版本，再调用 `activate_platform_pack action=session`（`platform=neoforge` + 精确版本；九档：`1.20.4` / `1.20.6` / `1.21.1` / `1.21.3` / `1.21.5` / `1.21.8` / `1.21.10` / `1.21.11` / `26.1`）。**禁止跨目录读邻档 00–10，禁止把 `neoforge/<ver>/.cursor` 当加载器 Read。** 未建档版本（文档有、规则树无）：`1.20.1` — **禁止**用邻档顶上，改口 `search_neoforge_docs`（NeoForge 1.20.1 已有 Forge 兼容数据）。不为 26.1.1 单造规则树；26.1 ≠ 1.21.1。

工作流提醒（**不是硬门**）：仅当用户要走完整新方块 / 新物品 / 方块实体 / 新实体 / GUI / Mixin / 世界生成 / 配置 / GameTest / 崩溃分诊 / 移植 / 从零构建 / 环境搭建 / 真机循环 / 发布清单 / 汉化 / 反编译研究时才调用 `get_workflow_template`（`mc-new-item` / `mc-new-blockentity` / `mc-mixin` / `mc-worldgen` / `mc-config` / `mc-gametest` / `mc-publish` / `mc-setup-env` 等）。改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。从零工程才 `download_official_mdk`。

### 4. 检查 LiteLoader（含 Forge 混合）

查找 `litemod.json`、`LiteMod` 实现、或 Gradle 插件 `net.minecraftforge.gradle.liteloader`。**必须在把任意 ForgeGradle 收成纯 Forge 之前做这一步。**

```
Decision:
→ IF 有 litemod.json / LiteMod，且没有 javafml mods.toml / @Mod
    → 纯客户端：activate_platform_pack action=session（platform=liteloader，精确版本；主推 1.12.2）
→ ELSE IF 两边元数据都在，且 apply plugin: 'net.minecraftforge.gradle.liteloader'
    → 混合 liteloader_forge：先读 liteloader/<ver>/HYBRID.md；再 activate_platform_pack action=session platform=forge minecraftVersion=1.12.2 topics=["01","02","03"]。LiteLoader 的 05/08 用 session topics 追加。禁止直接 Read forge/1.12.2/.cursor 当加载器。
→ ELSE IF 分别 apply 了 net.minecraftforge.gradle.forge 和另一个 LiteLoader 插件
    → 拒绝：混合工程只允许 liteloader 专用插件
→ ELSE IF 两边元数据都在但没有该专用插件
    → 询问用户，禁止默默当 Forge
```

### 5. 检查 Forge

查找 `mods.toml`（`modLoader="javafml"`）或标准 ForgeGradle（且上一步未判为 LiteLoader）：

```
# mods.toml
modLoader="javafml"
loaderVersion="[44,)"

# build.gradle
id 'net.minecraftforge.gradle'
```

如果匹配 → 调用 `activate_platform_pack action=session`（`platform=forge` + 精确 `minecraftVersion`）。禁止把 `forge/<ver>/.cursor` 当加载器 Read。

### 6. 检查 Rift

查找 **`riftmod.json`**（官方拼写；兼容误写的 `rift.mod.json`）或 `tweaker-client` + `RiftLoaderClientTweaker`。

如果匹配 → 调用 `activate_platform_pack action=session`（`platform=rift`，`minecraftVersion=1.13.2`）。方法名只许来自该档核实表与已核实源码，禁止用 Fabric 记忆填写。禁止把 `rift/1.13.2/.cursor` 当加载器 Read。

### 7. 检查 Risugami's ModLoader

查找 `BaseMod` 子类且 **没有** Forge/FML（无 `cpw.mods.fml` / `net.minecraftforge`）。工程通常是 MCP + Eclipse，无 Gradle。

如果匹配 → 调用 `activate_platform_pack action=session`（`platform=modloader`，`minecraftVersion=1.6.4`）。生成代码 **只能**用该档安全 API 表内的名字。禁止把 `modloader/1.6.4/.cursor` 当加载器 Read。

### 8. 检查基岩版 Add-On

查找包根 `manifest.json` 且含 `format_version` + `modules`（`resources` / `data` / `script` / `world_template`）。

如果匹配 → 调用 `activate_platform_pack action=session`（`platform=bedrock`）。不要用 Java `query_api` / Yarn / Mixin。禁止把 `bedrock/.cursor` 当加载器 Read。

### 9. 未知平台

如果无法判断：
1. 询问用户当前使用的平台和 Minecraft 版本
2. 根据回答加载对应平台的规则

确认平台与**精确** Minecraft 版本后，调用 `activate_platform_pack`（`action=session`）把该档 `AGENTS.md` / 规则 / **技能索引**送进当前对话。默认只注入规则 **00 / 01 / 09**；方块/物品/网络等再传 `topics`（如 `["02","03"]`）或 `task`（如 `mc-new-gui`）**追加**（并集，永不替换底座），或 `includeAllRules=true`。Skill 索引含 `relPosix` 与 `absPath`；少量正文只在 `skillNames` 或 `task` 建议名时进入 `skillBodies`（上限 6）。不要假定全部 Skill 全文已在上下文。用户要工程内常驻再 `action=write`（`hosts` 必填，默认 dryRun；`includeSkills` 默认 false，true 也只写 stub）。**禁止**读邻档 00–10，禁止把知识库 `.cursor` 当加载器。MCP **不能**开关 IDE 扫描器。

## 第二步：加载对应平台的规则

优先走上面的 `activate_platform_pack session`，不要在知识库里直接打开邻版 `.cursor/rules`。确认平台后，需要的规则用 `topics` 或 `task` 追加到 session（并集）；禁止把 `平台/<ver>/.cursor` 当加载器 Read。规则编号含义：

规则文件按编号顺序加载：

```
00-project-setup.mdc    → 项目结构
01-registry.mdc         → 注册系统（最重要，优先读）
02-block.mdc            → 方块开发
03-item.mdc             → 物品开发
04-entity.mdc           → 实体开发
05-events.mdc           → 事件系统
06-networking.mdc       → 网络通信
07-datagen.mdc          → 数据生成器
08-client-server.mdc    → 客户端/服务端分离
09-anti-patterns.mdc     → 反模式库
10-gui.mdc              → GUI / Menu / Screen 开发
```

## 第三步：通用约束（所有平台都必须遵守）

### Mappings 约束

必须确认项目的 `mappings` 配置，禁止混用映射类型：

- **MCP**（Forge 官方）— 1.20.x 默认
- **Yarn**（Fabric 社区维护）— **仅 ≤1.21.11**（仍混淆的版本）
- **Parchment**（MCP 的带文档版本）— 主要用于 ≤1.20.4 Forge extracted / query_api
- **Mojang / mojmap** — 官方可读名
- **26.1+（去混淆）**：游戏 jar 已是 Mojang 名，**不再需要** Yarn / Intermediary remap；convert_mapping 拒绝 yarn；查文档用 search_neoforge_docs（默认 **26.1**）/ search_fabric_docs（先 `list_fabric_versions`，如 **26.1.2**）；**禁止**把 26.1 内容克隆成 26.2 冒充

### 物理端约束

```java
// 客户端专用代码
@OnlyIn(Dist.CLIENT)
private void doClientThing() { ... }

// 服务端专用代码
@OnlyIn(Dist.DEDICATED_SERVER)
private void doServerThing() { ... }
```

禁止在服务端线程调用客户端方法，禁止在客户端线程直接修改服务端数据。

### Registry 约束

禁止通过构造函数 `new` 方式注册任何内容。所有注册必须通过事件系统或对应平台的注册 API。

### Mod ID 约束

- 必须全小写
- 禁止包含 `-`（用 `_` 替代）
- 必须与 `mods.toml` / `fabric.mod.json` / `quilt.mod.json` / `litemod.json` / `riftmod.json` / 基岩 `manifest` 中的 id 一致

## 第四步：决策树使用方式

每个规则文件中的 **Decision Flow** 章节告诉你在不同场景下如何选择正确的方案。

遇到模糊需求时，先看 Decision Flow，再结合上下文判断。

示例（`01-registry.mdc` 中的决策树）：

```
Decision: 选择注册方式
→ IF Minecraft >= 1.20.5 AND 平台 = Forge → 使用 DeferredRegister
→ ELSE IF 平台 = Forge → 使用 RegistryEvent.register
→ ELSE IF 平台 = Fabric → 使用 Registry.register() in onInitialize
→ ELSE IF 平台 = Quilt → 优先 QSL / org.quiltmc（见 quilt/<ver>/01-registry.mdc），不要生成 FAPI Registry 当 QSL
→ ELSE → 询问用户
```

## 第五步：查阅知识库（遇到问题时）

1. 先查阅 `09-anti-patterns.mdc` 看是否是已知错误模式
2. 再查阅 **确认平台与版本后** 的 `平台/版本/knowledge/`（例：`forge/1.20.1/knowledge/`）：
   - `antipatterns/` — 按症状分类的反模式（registry / item / block / entity / events / networking / gradle）
   - `version-changes/` — 版本迁移指南（1.19.x / 1.20.x 等）
   - `common/` — 术语表、数据包/资源包格式速查
3. 根目录 `knowledge/patterns/` 仅短片段模式库（非完整 antipatterns）
4. 实务问题（发布 / 崩溃分类 / 软依赖 / 机器 GUI）→ MCP `search_community_docs`（仓库根 `community_knowledge/`）
5. 如果仍无法解决，询问用户当前使用的具体版本和平台

### 使用社区自写短文时（强制）

完整规则见 `community_knowledge/AGENT_USAGE.md`。摘要：

- 社区短文 **不替代** 官方文档 / `query_api`
- 依据某篇 `authored/` / `permitted/` / `links/` 写方案时，若 **不清楚、不会、缺方法名、与现象对不上** → **必须先打开短文给出的原文 URL 或官方文档**（`WebFetch` / 浏览器 / `get_*_doc_full`），禁止臆造
- `links/`（如 6071）仅外链浏览，**禁止**把网页正文拷进回复当「已入库全文」

## 库模组 Skill（knowledge/libs 源稿即用）

涉及常用库模组（配置库 / 饰品 / GeckoLib / Patchouli / CCA / Polymer 等）的 Skill **不落盘**到平台 `.cursor/skills`，一律按解析规则直接读根目录源稿：

1. 平台 → 组映射：
   - `forge` → `forge-only` + `all-platforms`
   - `fabric` / `quilt` → `fabric-only` + `all-platforms`
   - `neoforge` → `neo-only` + `all-platforms`
   - `bedrock` → `bedrock-only`（Script API 等；禁止把 CCA/Trinkets/GeckoLib 当基岩教程）
   - LiteLoader / Rift / ModLoader：暂无独立 Java 库组；不要把 Fabric/Forge 库 Skill 当这些加载器的 API
2. 在组内按名称找 `knowledge/libs/<group>/mc-<name>/SKILL.md`，**直接读源稿**，不要查平台 `.cursor/skills` 的库项（那里已清理，不存在库项）
3. 用 frontmatter 二次过滤：`platforms`（组是主依据，白名单防组内误放）、`minecraftVersions`（留空/未写 = 不限版本；非空则必须包含目标 MC 版本）
4. 不确定该用哪个库 Skill → 先读 `knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`；完整清单见 `knowledge/libs/README.md`
5. **禁止**把 Fabric 专属库（Trinkets / CCA / Polymer / Text Placeholder 等）当 Forge 教程；Forge/NeoForge 饰品用 `mc-curios`（`forge-only`），Fabric 用 `mc-trinkets`（`fabric-only`）

## 不确定时

永远选择**保守**方案：
- 不确定用哪个事件 → 选更通用的事件
- 不确定方法名 → 用 IDE 自动补全、官方文档工具或 `query_api`（仅 Vanilla/Parchment，约 1.16.5–1.20.4；**不含** Forge/Fabric 类。**1.12.2 可能 found:true 但 methods 为空**；**26.1+ 无索引**）。平台 API 用 `search_*_docs` / `query_loader_api`。Forge 1.12.2 教程用 `search_forge_docs`（`version=1.12.2`），不要用 `query_api` 核 `Block` 构造。
- 不确定是否跨平台 → 明确标注 `// Forge only` 或 `// Fabric only`

## MCP Server 工具（可选）

如果项目根目录下存在 `mcp-server/`（即本项目 `MC_skill`），可以使用本地 stdio MCP（服务名 **`MC-AI-Coding-Assistant-Tool`**；需 Node **>= 22.5**，`MC_SKILL_DATA` 指向 `data/`，可选 `MC_SKILL_COMMUNITY`）：

| 工具 | 功能 |
| --- | --- |
| `query_api` | 按类名查询 Vanilla/Parchment API 签名（约 1.16.5–1.20.4；1.12.2 类名空壳；26.1+ 无索引） |
| `get_method_params` | 查询方法参数名（可选 version） |
| `convert_mapping` | mojang / mcp / yarn / parchment 互转（Yarn 走 SQLite；1.12.2 用 MCP SRG） |
| `get_server_status` | 预热/数据路径与 descriptor 自检（含 updateHint） |
| `get_version_info` | 查询版本支持的 API 范围（**仅 Forge**） |
| `mc_skill_update` | 检查/应用 tooling+data 更新（GitHub Release；确认后可写盘） |
| `diagnose_gradle` | 诊断 Gradle 构建问题。ForgeGradle + Loom + NeoGradle/MDG；liteloader 插件走轻量模式。Rift / BaseMod / 基岩仍早退。 |
| `generate_datagen` | 生成数据生成器代码 |
| `crash_analyze` | 分析崩溃日志 |
| `validate_project` | 校验模组项目结构。Forge / Fabric / Quilt / NeoForge 真检查；LiteLoader/Rift/ModLoader/基岩 skipped。坏 recipe 只 warning。 |
| `check_publish_ready` | 发布前清单（license/version/`build/libs`）。不上传、不调外网发布 API。 |
| `inspect_runtime` | 日志型 inspector。优先 `logsDir`；否则有界探测 `run/logs`。禁止全盘 / JVM attach。 |
| `detect_mod_project` / `activate_platform_pack` | 探测工程；`session` 加载规则/Skill 索引（默认 00/01/09），`write` 写入用户工程（见根 README「规则包加载」） |
| `query_loader_api` / `search_loader_api` | 加载器/模组 API 摘要（必填 platform+minecraftVersion）。**不是** `query_api` |
| `search_forge_docs` / `get_forge_doc_*` | Forge 文档。先 `list_forge_versions`；**1.12.2 用这套**，不要用 `query_api`。与 `search_docs({platform:"forge"})` 等价 |
| `search_fabric_docs` / `get_fabric_doc_*` | Fabric 文档 |
| `search_neoforge_docs` / `get_neoforge_doc_*` | NeoForge 文档（1.20.1 回退 Forge） |
| `search_docs` / `get_doc_*` | 跨平台通用文档入口（`platform` 含 forge/fabric/neoforge/**quilt**/liteloader/rift/modloader）。Quilt 问 QSL 时禁止把 Fabric Registry 当命中 |
| `search_bedrock_docs` / `get_bedrock_doc_*` | 基岩版 Microsoft Learn；带滞后 `docsStatus`。不是 `search_forge_docs` |
| `validate_addon_manifest` / `validate_bp_json` | 基岩 pack 校验；不是 `validate_project` / `validate_datapack_json` |
| `generate_addon_manifest` / `generate_bp_entity` | 只吐 JSON 文本，不写盘 |
| `list_community_sources` / `search_community_docs` / `get_community_doc_*` | 社区实务知识库（发布/崩溃/软依赖；不替代官方文档） |
| `analyze_porting_path` / `port_project` | 移植分析与脚手架动作 |
| `diagnose_data_paths` | 诊断数据目录与 `community_knowledge` 配置 |
| `query_registry` / `mixin_analyze` / `audit_resources` / `validate_datapack_json` | Registry ID、Mixin、资源与数据包校验 |
| `get_workflow_template` / `list_knowledge_resources` / `read_knowledge_resource` | 工作流全文（仅完整流程才调，改已有代码不要调）与知识 URI |
| `generate_model` / `generate_lang` / `generate_network_packet` 等 | 代码/JSON 骨架生成（见根 `README.md`） |
| `localize_mod` | 模组汉化：diff/draft_zh / jar extract/pack_draft（无机器翻译） |
| `analyze_log` / `get_migration_guide` / `check_dependencies` | 日志、迁移与依赖提示 |
| `lookup_obfuscated` | 崩溃短名反查 |
| `get_minecraft_source` / `decompile_mod_jar` / `search_mod_code` / `analyze_mod_jar` | 按需反编译与 jar 元数据 |
| `validate_at` / `validate_aw` | AT / AW 字节码校验 |

### 工具边界（禁止误判）

完整对照表见根目录 `README.md`「工具边界」。调用前必须遵守：

- **`found:false` ≠ 游戏里没有该类**：多半是索引覆盖范围外。1.12.2 **空壳**（`found:true` + 空 methods）与 26.1+ 零类不同；Forge 特有类改 `query_loader_api` / `search_*_docs` 或反编译。
- **`search_*_docs` 查 `constructor` 崩溃**：旧 bug（`Object.prototype`）；已修。改完 `mcp-server` 后必须 `npm run build` **并重载 MCP**，或用 `node mcp-server/dist/cli.js` 验证。
- **平台工具不要混用**：`get_version_info` 仍仅 Forge。`diagnose_gradle` 覆盖 ForgeGradle + Loom + Neo/MDG；liteloader 插件走轻量模式；Rift / BaseMod / 基岩仍早退。`validate_project` 对 Fabric/Quilt/NeoForge 做真检查，LiteLoader/Rift/ModLoader/基岩 skipped。基岩用 `validate_addon_manifest`。
- **文档 fallback 仅限查询 API**，不代表规则树可用；命中邻近版时结果含 `fallback: true` 与 `source_version`。本版无树则 `PACK_NOT_FOUND`。
- **文档 `id` 只用搜索结果**，不要用网站 URL；全文一次 ≤ 2 页。
- **社区短文不能当 API 规范**（`community_knowledge/AGENT_USAGE.md`）。
- **写盘类默认 dryRun**（`port_project` / `mc_skill_update apply`）；`generate_*` 只吐文本。
- **不要克隆版本文档**（1.21 wiki ≠ 26.1.2；26.1 ≠ 26.2）。

### 工具不可用排查（clone 后必读）

- **MCP 工具全部调用失败（服务未启动）**：说明 `mcp-server/dist/` 未编译（dist 不入库）。执行：
  ```bash
  cd mcp-server && npm ci && npm run build
  ```
  （Node 需 >= 22.5；Yarn 映射可再 `npm run build:yarn-sqlite`。配置宿主见 `AUTO_SETUP.md`：先识别 IDE/CLI，再按该宿主的文件与顶层键合并草稿，不要默认写 Cursor 的 `mcp.json`。）
- **无 MCP 客户端时**：可用独立 CLI 调用任意工具——`node mcp-server/dist/cli.js <工具名> --参数=值`（通用 dispatch，78 工具全可用；如 `search_docs` / `check_dependencies` / `analyze_mod_jar`）。工程类工具可加 `--project <dir>`（映射到 `projectPath`）。
- **`get_server_status` 返回 `buildStatus.buildRequired=true`**：src 有比 dist 更新的修改，需重新 `npm run build`，然后**重载宿主 MCP**（只编 dist 不够， AI IDE 进程仍跑旧代码）。
- **反编译工具报 `TOOLCHAIN_MISSING`**：需要 Java 17+（VineFlower/tiny-remapper）；安装 Temurin 17+ 后重启 MCP，或按返回指引操作。
- **`search_mod_code` 报 `NOT_FOUND`**：反编译源码尚未生成（按设计不入库），按返回指引先调 `decompile_mod_jar` / `get_minecraft_source` 按需生成。
- **`PLATFORM_DATA_MISSING`**：对应平台文档数据缺失，先调 `diagnose_data_paths` 确认 `MC_SKILL_DATA` 指向本仓库 `data/`。
