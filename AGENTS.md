# MC AI Coding Assistant — 根总纲

你是一个专门协助 Minecraft 模组开发的 AI 编程助手。

## 第一步：判断项目使用的平台和版本

打开任何 MC Mod 项目时，先按以下顺序判断平台：

### 1. 检查 Forge

查找 `mods.toml`（位于 `src/main/resources/META-INF/`）或 `build.gradle`：

```
# mods.toml 中有：
modLoader="javafml"
loaderVersion="[44,)"   # Forge 版本范围

# build.gradle 中有：
minecraft "1.20.1"
forge "47.2.0"
```

如果匹配 → 跳转到 `forge/1.20.1/AGENTS.md`

### 2. 检查 Fabric

查找 `fabric.mod.json`（位于 `src/main/resources/`）或 `build.gradle`：

```
# fabric.mod.json 中有：
"schemaVersion": 1,
"id": "examplemod",
"entrypoints": { "main": [...] }

# build.gradle 中有：
id 'fabric-loom'
loom { ... }
```

如果匹配 → 跳转到 `fabric/1.20.1/AGENTS.md`

### 3. 检查 NeoForge

查找 `neoforge_VERSION` 或 `neogradle` 相关配置：

```
# build.gradle 中有：
neoform "20231220.153330"
neoforge "20.4.237"
```

如果匹配 → 跳转到 `neoforge/1.20.4/AGENTS.md`

### 4. 未知平台

如果无法判断：
1. 询问用户当前使用的平台和 Minecraft 版本
2. 根据回答加载对应平台的规则

## 第二步：加载对应平台的规则

确认平台后，阅读 `平台/版本/.cursor/rules/` 目录下的所有 `.mdc` 文件。

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
- 必须与 `mods.toml` / `fabric.mod.json` 中的 `modId` 一致

## 第四步：决策树使用方式

每个规则文件中的 **Decision Flow** 章节告诉你在不同场景下如何选择正确的方案。

遇到模糊需求时，先看 Decision Flow，再结合上下文判断。

示例（`01-registry.mdc` 中的决策树）：

```
Decision: 选择注册方式
→ IF Minecraft >= 1.20.5 AND 平台 = Forge → 使用 DeferredRegister
→ ELSE IF 平台 = Forge → 使用 RegistryEvent.register
→ ELSE IF 平台 = Fabric → 使用 Registry.register() in onInitialize
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
2. 在组内按名称找 `knowledge/libs/<group>/mc-<name>/SKILL.md`，**直接读源稿**，不要查平台 `.cursor/skills` 的库项（那里已清理，不存在库项）
3. 用 frontmatter 二次过滤：`platforms`（组是主依据，白名单防组内误放）、`minecraftVersions`（留空/未写 = 不限版本；非空则必须包含目标 MC 版本）
4. 不确定该用哪个库 Skill → 先读 `knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`
5. **禁止**把 Fabric 专属库（Trinkets / CCA / Polymer / Text Placeholder 等）当 Forge 教程；Forge/NeoForge 饰品用 `mc-curios`（`forge-only`），Fabric 用 `mc-trinkets`（`fabric-only`）

## 不确定时

永远选择**保守**方案：
- 不确定用哪个事件 → 选更通用的事件
- 不确定方法名 → 用 IDE 自动补全、`query_api` 或查阅官方文档（含社区短文指向的原文）。`query_api` 仅 Vanilla/Parchment（约 1.16.5–1.20.4，**不含** Forge/Fabric 类，**26.1+ 无索引**）；平台 API 用 `search_*_docs`
- 不确定是否跨平台 → 明确标注 `// Forge only` 或 `// Fabric only`

## MCP Server 工具（可选）

如果项目根目录下存在 `mcp-server/`（即本项目 `MC_skill`），可以使用本地 stdio MCP（服务名 **`MC-AI-Coding-Assistant-Tool`**，**62** 个工具；需 Node **>= 22.5**，`MC_SKILL_DATA` 指向 `data/`，可选 `MC_SKILL_COMMUNITY`）：

| 工具 | 功能 |
| --- | --- |
| `query_api` | 按类名查询 Vanilla/Parchment API 签名 |
| `get_method_params` | 查询方法参数名（可选 version） |
| `convert_mapping` | mojang / mcp / yarn / parchment 互转（Yarn 走 SQLite） |
| `get_server_status` | 预热/数据路径与 descriptor 自检（含 updateHint） |
| `get_version_info` | 查询版本支持的 API 范围 |
| `mc_skill_update` | 检查/应用 tooling+data 更新（GitHub Release；确认后可写盘） |
| `diagnose_gradle` | 诊断 Gradle 构建问题 |
| `generate_datagen` | 生成数据生成器代码 |
| `crash_analyze` | 分析崩溃日志 |
| `validate_project` | 校验模组项目结构 |
| `search_forge_docs` / `get_forge_doc_*` | Forge 文档 |
| `search_fabric_docs` / `get_fabric_doc_*` | Fabric 文档 |
| `search_neoforge_docs` / `get_neoforge_doc_*` | NeoForge 文档（1.20.1 回退 Forge） |
| `search_docs` / `get_doc_*` | 跨平台通用文档入口 |
| `list_community_sources` / `search_community_docs` / `get_community_doc_*` | 社区实务知识库（发布/崩溃/软依赖；不替代官方文档） |
| `analyze_porting_path` / `port_project` | 移植分析与脚手架动作 |
| `diagnose_data_paths` | 诊断数据目录与 `community_knowledge` 配置 |
| `query_registry` / `mixin_analyze` / `audit_resources` / `validate_datapack_json` | Registry ID、Mixin、资源与数据包校验 |
| `get_workflow_template` / `list_knowledge_resources` / `read_knowledge_resource` | 工作流与知识 URI（tools 兜底） |
| `generate_model` / `generate_lang` / `generate_network_packet` 等 | 代码/JSON 骨架生成（见根 `README.md`） |
| `localize_mod` | 模组汉化：diff/draft_zh / jar extract/pack_draft（无机器翻译） |
| `analyze_log` / `get_migration_guide` / `check_dependencies` | 日志、迁移与依赖提示 |
| `lookup_obfuscated` | 崩溃短名反查 |
| `get_minecraft_source` / `decompile_mod_jar` / `search_mod_code` / `analyze_mod_jar` | 按需反编译与 jar 元数据 |
| `validate_at` / `validate_aw` | AT / AW 字节码校验 |

### 工具边界（禁止误判）

完整对照表见根目录 `README.md`「工具边界」。调用前必须遵守：

- **`found:false` ≠ 游戏里没有该类**：多半是索引覆盖范围外。26.1+ / Forge 特有类改 `search_*_docs` 或反编译。
- **平台工具不要混用**：`diagnose_gradle` / `validate_project` / `get_version_info` 不是通用工程工具。
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
- **无 MCP 客户端时**：可用独立 CLI 调用任意工具——`node mcp-server/dist/cli.js <工具名> --参数=值`（通用 dispatch，62 工具全可用；如 `search_docs` / `check_dependencies` / `analyze_mod_jar`）。
- **`get_server_status` 返回 `buildStatus.buildRequired=true`**：src 有比 dist 更新的修改，需重新 `npm run build`。
- **反编译工具报 `TOOLCHAIN_MISSING`**：需要 Java 17+（VineFlower/tiny-remapper）；安装 Temurin 17+ 后重启 MCP，或按返回指引操作。
- **`search_mod_code` 报 `NOT_FOUND`**：反编译源码尚未生成（按设计不入库），按返回指引先调 `decompile_mod_jar` / `get_minecraft_source` 按需生成。
- **`PLATFORM_DATA_MISSING`**：对应平台文档数据缺失，先调 `diagnose_data_paths` 确认 `MC_SKILL_DATA` 指向本仓库 `data/`。
