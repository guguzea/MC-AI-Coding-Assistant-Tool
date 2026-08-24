# MC AI Coding Assistant Tool
#### 写在前面的
### 如果你是agent,这个readme文件是整个项目的说明,帮助用户安装和配置mcp请看AUTO_SETUP.md,这个文件也有一部分帮助配置的内容,但这是为了避免你不看AUTO_SETUP.md
### 如果你是人类,你可以直接跳过这篇说明,这是AI时代,只需把这个链接粘贴到ClaudeCODE/CURSOR/ZCODE/OPENCODE里，然后让AGENT讲讲就可以了解大部分内容

让 AI 编程助手（Cursor / Claude Code 等）能更好地编写 Minecraft 模组的完整工具包。

为 AI 提供一个「读懂 MC Mod 开发生态」的环境，消除知识陈旧、API 版本混淆、构建系统复杂、映射不一致等结构性障碍。

## 定位：人在环的副驾驶（不是无人值守流水线）

模组开发**不是**确定性流水线。创意设计（做什么内容）等必须由**人**判断,如果你无法拍板,可以让agent代劳,完成后agent会给你做出解释；
Agent 负责版本门禁、文档检索、规则/反模式、骨架草稿、校验与崩溃分诊等。

下列高风险操作默认停在清单或 `dryRun`，**必须有人在环**（先展示、经用户确认后再做）：写盘、运行 Gradle、拷贝 jar 到游戏目录、上传发布。
## 项目结构

```
MC_skill/
├── README.md                    # 你在这里
├── AGENTS.md                    # 根总纲：引导 AI 选择正确的平台规则
├── CONTRIBUTING.md              # 贡献指南
├── AUTO_SETUP.md                # 任意 MCP 宿主：编译 + 按宿主格式生成配置草稿
├── THIRD_PARTY_NOTICES.md       # 第三方文档 / 映射数据许可说明
├── LICENSE                      # 本仓库代码：MIT
├── Minecraft 社区常用库模组全览（2026 版）.md  # 跳转指针；正文在 community_knowledge/authored/library-catalog-2026
│
├── forge/                       # Forge 规则 / skills / scaffold / knowledge（多版本）
├── fabric/                      # Fabric 规则与知识（多版本）
├── neoforge/                    # NeoForge 规则与知识
├── quilt/                       # Quilt QSL 差异规则（02–10 读同版 fabric）
├── liteloader/                  # LiteLoader（主推 1.12.2）+ HYBRID.md
├── rift/                        # Rift 1.13.2
├── modloader/                   # Risugami ModLoader 1.6.4 + 安全 API 表
├── bedrock/                     # 基岩 Add-On 规则（扁平 bedrock/）
│
├── community_knowledge/         # 社区实务知识库 → MCP search_community_docs
│   ├── authored/                # 自写短文（含 48 篇 lib-* 库集成 + 发布/崩溃/GUI 等）
│   ├── permitted/               # 许可入库的社区帖提炼（如 mcmod 3993）
│   ├── links/                   # 仅标题 / 摘要 / 外链（如 mcmod 6071）
│   ├── patterns/                # 代码模式示范（mcskill://patterns/README）
│   ├── indexes/index-l0.json    # L0 索引（实测 109 条：authored 94 / links 11 / permitted 4；含 generatedAt 构建时间戳）
│   ├── AGENT_USAGE.md           # Agent 用法规则（短文不能当 API 规范）
│   └── README.md                # 主题 id 速查
│
├── knowledge/                   # 仓库级知识源稿（不落盘到平台 .cursor/skills）
│   ├── libs/                    # 库模组 Skill 源稿：35 份 / 33 唯一 skillId
│   │   ├── all-platforms/       # 20（含 mc-lib-catalog 路由中枢）
│   │   ├── fabric-only/         # 9（Trinkets / CCA / Polymer…）
│   │   ├── forge-only/          # 2（Curios / KFF）
│   │   ├── neo-only/            # 2（Curios / KFF 镜像）
│   │   ├── bedrock-only/        # 2（Script API）
│   │   └── README.md            # 分组规则、解析流程、数据链指针
│   └── patterns/                # 短片段模式库（与 community_knowledge/patterns 互补）
│
├── scripts/                     # 维护脚本（库数据链 + skill 同步 + 规则校验）
│   ├── sync-skills.ps1          # 多 IDE skill 镜像（-All / -TargetDir）
│   ├── resolve-lib-skills.mjs   # knowledge/libs §3.6 解析校验
│   ├── （库 catalog 脚本在 mcp-server/scripts/，见下）
│   ├── build-lib-manifest.mjs   # → mcp-server/data/lib-manifests/
│   ├── build-api-summaries.mjs  # → mcp-server/data/lib-api-summaries/
│   ├── batch-decompile.mjs      # 分批反编译（源码 → $MC_SKILL_CACHE，不入库）
│   └── merge-verified-api.mjs   # 回填 catalog verifiedApi
│
├── mcp-server/                  # 本地 stdio MCP Server（78 个工具）
│   ├── src/                     # 工具实现（api / docs / diagnostics / wave…）
│   ├── scripts/                 # 文档抓取、语义索引、数据审计；含 build-library-catalog-from-authored.mjs
│   └── data/                    # 随仓分发的 MCP 侧数据（非 MC_SKILL_DATA）
│       ├── lib-manifests/       # Modrinth 版本矩阵（45 slug / 2867 条目）
│       ├── lib-api-summaries/   # 44 库 public API 摘要
│       └── loader-api-summaries/ # Forge/Neo/Fabric-API/QSL 类摘要
│
└── data/                        # 离线官方数据（MC_SKILL_DATA 指向此处根）
    ├── forge_* / fabric_* / neoforge_* / …  # 各平台文档 L0/L1/L2 + semantic/
    └── mappings/                # 分平台版本目录（Yarn SQLite、MCP CSV 等），不是单一扁平文件
```

平台版本目录内另有 `.cursor/rules/`（00–10）、`.agents/skills/`、scaffold、`knowledge/antipatterns` 等；库 Skill **只**在根 `knowledge/libs/`，经 `activate_platform_pack` 或按路径 Read，不写进各平台 skills 目录。



## 平台说明


| 平台       | 状态   | 规则 / 数据（摘要）                                              |
| -------- | ---- | -------------------------------------------------------- |
| Forge    | ✅ 完成 | 多版本规则（主推 **1.20.1**）；数据目录 `data/forge_`*                 |
| Fabric   | ✅ 完成 | 多版本规则（主推 **1.20.1 / 1.21.x / 26.x**）；数据目录 `data/fabric_*`；**26.1+ 仅 mojmap** |
| NeoForge | ✅ 完成 | 规则集在 `neoforge/`（主推 **1.20.4+ / 26.x**）；文档数据见 `data/neoforge_*`（主文档默认 **26.1**；primer 可有 26.2） |
| Quilt    | ✅ 混合 | `quilt/<ver>/` 只写 QSL 差异（00/01/05/06）+ **本档 QSL Skill 3**（registry/events/networking），02–04/07–08/10 读 `fabric/<ver>`；`search_docs(platform=quilt)` 问 QSL 不回退 Fabric Registry |
| 基岩版   | ✅ 完成 | 扁平 `bedrock/`；`search_bedrock_docs` + 滞后 `docsStatus`；实验开关按 `min_engine_version` 分层 |
| LiteLoader | ✅ 完成 | `liteloader/1.12.2/` 纯客户端 + `HYBRID.md`；`diagnose_gradle` 对 liteloader 插件走轻量模式 |
| Rift     | ✅ 完成 | `rift/1.13.2/`；元数据 `riftmod.json`；方法名只来自已抓 wiki/源码 |
| ModLoader | ✅ 完成 | `modloader/1.6.4/` + 安全 API 表；禁止用 Forge Javadoc / `func_*` 冒充 |


### 支持版本

规则树（`activate_platform_pack action=list`）与官方文档数据（`list_*_versions`）**可能不一致**：有规则无文档、或有文档无完整 00–10 规则均属正常。Agent 须以工程**精确**版本为准，禁止用邻档顶上。

| 平台 | 规则树（`平台/<ver>/`） | 文档数据（`list_*_versions`） | 主推 | 备注 |
|------|-------------------------|-------------------------------|------|------|
| **Forge** | `1.7.10` · `1.12.2` · `1.13.2` · `1.14.4` · `1.15.2` · `1.16.5` · `1.17.1` · `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` | `1.7.10`–`1.20.4`（含 `1.8.9` / `1.9.4` / `1.10.2` / `1.11.2` 等 javadoc 档） | **1.20.1** | `1.12.2` 有 forge-docs 教程；`1.7.10` 为 javadoc 核实表 + 短规则（**ready**）。`forge/1.21.1` 为 **draft**（无完整规则树，`PACK_NOT_FOUND`；仅改口文档搜索） |
| **Fabric** | `1.14.4` · `1.16.5` · `1.17.1` · `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` · `1.21.1` · `1.21.3` · `1.21.4` · `1.21.8` · `1.21.10` · `1.21.11` · `26.1.2` | `list_fabric_versions` 含上述档（**无 1.21.5**） | **1.20.1** / **1.21.x** / **26.1.2** | `26.1.2` 仅 `fabric-docs`、无 wiki；**26.1+ 仅 mojmap**。`1.21.4`/`1.21.8`/`1.21.10` 有 versioned fabric-docs **和** 现行 `fabric-wiki`（wiki 不是该档历史快照）。**`1.21.5` 无 versions/ 源** → `PACK_NOT_FOUND`。禁止拷 `1.21.11` |
| **NeoForge** | `1.20.1` · `1.20.4` · `1.20.6` · `1.21.1` · `1.21.3` · `1.21.5` · `1.21.8` · `1.21.10` · `1.21.11` · `26.1` | `1.20.1`（回退 Forge）· `1.20.4` · `1.20.6` · `1.21.1`–`1.21.11` · `26.1` | **1.20.4+** / **26.1** | 主文档默认 **26.1**；primer 可有 26.2 旁路。`1.20.1` 本档核实表 + 短规则（Forge 兼容数据） |
| **Quilt** | `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` · `1.21.1` · `1.21.3` · `1.21.4` · `1.21.8` · `1.21.10` · `1.21.11`（**10** 档） | `search_docs({platform:"quilt"})` | 随 Fabric 同版 | **本档 QSL Skill 3** + Fabric overlay；00/01/05/06 为 QSL 差异（有 `06-networking.mdc` 的档不要 overlay Fabric 网络），02–04/07–08/10 读 `fabric/<ver>` |
| **LiteLoader** | `1.8.9` · `1.10.2` · `1.12.2` | `search_docs({platform:"liteloader"})`（官方 wiki + hybrid 语义库；API 以核实表为准） | **1.12.2** | 纯客户端；与 Forge 混合见 `HYBRID.md` |
| **Rift** | `1.13.2` | `search_docs({platform:"rift"})`（官方 wiki + hybrid；方法名以核实表为准） | **1.13.2** | 方法名只来自已抓 wiki/源码 |
| **ModLoader** | `1.2.5` · `1.5.2` · `1.6.4` | 无 Java 文档树 | **1.6.4** | 只用 safe-api 表；禁止 Forge Javadoc |
| **基岩版** | 扁平 `bedrock/`（`*`） | `search_bedrock_docs` + `docsStatus` | 按 manifest | 无 `平台/<ver>/` 分档；实验开关按 `min_engine_version` |

查询本机已建档列表：`node mcp-server/dist/cli.js activate_platform_pack --action=list`；文档档：`list_forge_versions` / `list_fabric_versions` / `list_neoforge_versions` / `list_doc_versions`。


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

> 按根目录 `AGENTS.md` 判断平台与**精确**版本，然后调用 `activate_platform_pack action=session` 加载该档规则 / Skill 索引（不要直接读邻版 `平台/<ver>/.cursor`）。官方文档先 `list_*_versions`，再把 `version` 写死成工程版本去 `search_*_docs` / `search_docs`。创意、兼容取舍、API 选择由用户拍板,兼容取舍、API 选择在用户不想或者没有能力决定时,可以代劳,但是一定要对用户进行解释,解释模板见下文的解释模板部分；写盘 / Gradle / 拷 jar / 上传须确认后再做（人在环，不是无人值守流水线）。
*解释模板*
  1. 决策透明
  任何代替用户做出的兼容取舍或 API 选择，都必须在决策后立即在回复中明确说明，不得默默执行。
  格式示例：

  我已替你选择使用 DeferredRegister，原因见下。

  2. 解释必须包含四要素
  每次代替用户决策，解释至少包含：

  选择了什么：具体的技术点或方案（例如“使用 Forge 1.20.1 的 SimpleChannel 而不是 NeoForge 的 Payload”）。

  为什么这样选：与当前版本、文档、最佳实践或用户项目情况的关联（例如“NeoForge 1.20.1 是 Forge 兼容层，官方文档指向 SimpleChannel”）。

  主要替代方案：一到两个可选方案，并说明为何没有采用（例如“也可以使用 NeoForge 1.20.4+ 的 Payload，但你的版本是 1.20.1，不适用”）。

  影响与风险：该选择可能带来的后果、限制或需要注意的地方（例如“这样写会在编译时依赖 net.minecraftforge 包，请确认你的工程已包含该依赖”）。

  3. 语言适配用户水平
  如果用户表示“不太懂技术”或“你决定就行”，解释应避免堆砌术语，用通俗语言说明选择会带来什么结果。

  如果用户是专业开发者，可以给出更技术性的依据（如类名、方法签名、文档链接）。

  无论哪种，都必须给出可验证的出处（例如 search_forge_docs 的结果、规则编号、官方文档链接），不能只说“最佳实践”。

  4. 高风险决策需先行确认
  低风险决策（如选择某个 API 写法、推荐某个依赖版本）：可以直接代劳，但执行后立即按第 2 条解释。

  高风险决策（如切换加载器平台、更改包结构、移除依赖、修改构建脚本）：即使可以代劳，也应在执行前简要说明推荐方案和理由，等待用户回复确认，除非用户已经明确表示“不用问我，直接做”。

  如果用户说“我不懂，你来决定”，则视为已授权，但仍需在决策后解释清楚，并告知如何回退。
**对新项目使用脚手架：**

> 使用对应平台版本下的 `scaffold/`（如 `forge/1.20.1/scaffold/`）生成带规则的项目骨架。

**多 IDE 同步：**

> 修改 `.cursor/` 后，在该版本目录运行 `sync-skills.ps1`。

**配置本地 MCP Server：**

> 将 `[AUTO_SETUP.md](./AUTO_SETUP.md)` 拖入当前 AI IDE / CLI。Agent 应识别宿主（Cursor / Claude Code / VS Code / Continue / Trae / OpenCode / Codex 等），编译 `mcp-server`，按该宿主格式生成配置草稿，**经你确认后合并**（不会静默覆盖）。  
> 要求 **Node.js >= 22.5**（**22.5–22.12 需加 `--experimental-sqlite` 启动**——内置 `node:sqlite` 在 22.13 起才默认开启；服务入口会检测并给出醒目指引）；服务名 `MC-AI-Coding-Assistant-Tool`（stdio，78 个工具）。无 MCP 客户端时用 `node mcp-server/dist/cli.js`。

## 社区知识与库模组

与 `data/` 下的**官方** Forge/Fabric/NeoForge 文档分离，本仓库另有两套实务知识，供 Agent 在「发布 / 崩溃 / 软依赖 / 库选型 / 依赖树」等场景使用。**二者都不替代** `search_*_docs` 或 `query_api`。

### 社区实务知识（`community_knowledge/`）

| 目录 | 含义 | Agent 注意 |
|------|------|------------|
| `authored/` | 本仓库自写短文（可改） | 实务清单与反模式，**不是 API 规范** |
| `permitted/` | 作者许可入库的社区帖提炼 | 仍不确定时打开原文 URL |
| `links/` | 仅标题 / 摘要 / 外链 | **禁止**把网页正文当已入库全文 |

索引：`indexes/index-l0.json`（约 **81** 条）。MCP：`list_community_sources` → `search_community_docs` → `get_community_doc_summary` / `get_community_doc_full`。环境变量 `MC_SKILL_COMMUNITY` 可改根路径。

**主题速查**（完整表见 [`community_knowledge/README.md`](./community_knowledge/README.md)）：发布 / 崩溃 / 软依赖 / 机器 GUI / 本地化 / 代码模式（`patterns/`）等。**库集成**另有 48 篇 `authored/lib-*.md` + 总览 `library-catalog-2026`、陷阱 `lib-traps-2026`、配方集成 `library-integration` / `library-integration-jei-emi`。

**强制规则**：依据社区短文写代码前，若方法名 / 版本细节不确定，必须先查短文给出的原文或官方文档（见 [`community_knowledge/AGENT_USAGE.md`](./community_knowledge/AGENT_USAGE.md)）。

### 库模组知识体系（`knowledge/libs/` + 数据链）

三层结构（详见下文 MCP 工具 **§7 / §7.5**）：

1. **社区短文** — `authored/lib-*.md`，经 `search_community_docs` 检索；含反编译验证小节（`verifiedApi` 来源）。
2. **库 Skill 源稿** — `knowledge/libs/<group>/mc-<name>/SKILL.md`，**不落盘**到平台 `.cursor/skills`；按 `AGENTS.md`「库模组 Skill」解析：platform → 组映射（`forge-only`+`all-platforms` / `fabric-only`+`all-platforms` / `neo-only`+`all-platforms` / `bedrock-only`）+ frontmatter 二次过滤。不确定选哪个库 → 先读 `knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`。
3. **数据链** — 短文 frontmatter → `mcp-server/scripts/build-library-catalog-from-authored.mjs` → `library-catalog.ts`（**50** 条 / **1880** `verifiedApi` 键）+ `lib-manifests/all.json`（**45** slug / **2867** 版本条目）+ `lib-api-summaries/`（**44** 库 API 摘要）→ `check_dependencies` 识别依赖与版本窗口。

**Agent 推荐路径（库相关）**：`check_dependencies`（看 `detectedLibraries`）→ `search_community_docs`（`lib-<name>` 或 `library-catalog-2026`）→ 按 `skillId` 或名称 Read `knowledge/libs/.../SKILL.md` → 仍缺签名再走 `search_*_docs` / `query_loader_api`。

## 环境变量


| 变量                      | 说明                                     | 示例                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_DATA`         | 数据目录根路径（指向 `data/`，不含版本子目录）            | `H:/MC_skill/data`                |
| `MC_SKILL_COMMUNITY`    | 社区知识库根路径（默认仓库根 `community_knowledge/`） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE`  | `1` 时允许 `port_project` 写盘              | `1`                               |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许的项目根（绝对路径）                         | `H:/mods/my-mod`                  |
| `MC_SKILL_STRICT`       | `1` 时数据无效则 MCP 启动失败                    | `1`                               |
| `MC_SKILL_DEBUG_PATHS`  | `1` 打印路径解析过程                           | `1`                               |
| `MC_SKILL_CACHE`        | 反编译/MDK/loader-jar 缓存根。MCP 与脚本都读此变量；不设则 MCP 默认 APPDATA、脚本默认 `D:\mc-skill-temp`，会分家 | `D:/mc-skill-temp` |
| `MC_SKILL_SKIP_DOWNLOAD` | `1` 时反编译工具跳过一切下载并诚实失败（CI 语义）       | `1`                               |
| `MCP_TIMEOUT_MS`        | 测试脚本超时毫秒数                              | `30000`                           |




## MCP 工具使用注意

本地 MCP 服务名：`MC-AI-Coding-Assistant-Tool`（**79** 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`；**22.5–22.12 需在 NODE_OPTIONS 或启动参数加 `--experimental-sqlite`，22.13+ 无需**）。仓库 / Release **不含** `node_modules`，需自行 `npm ci && npm run build`（建议再跑 `npm run build:yarn-sqlite`）。

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

**数据与模型位置**：语义库在 `data/{platform}_{ver}/{source}/{ver}/semantic/db.sqlite`（跳过 `forge_javadoc`），当前约 **57** 个；嵌入模型在 `data/_models/Xenova/all-MiniLM-L6-v2`（transformers.js，**唯一允许远程拉模型的入口**）。构建：`npm run fetch:embedding-model`；`npm run build:semantic-index -- --all`（可 `--platform` / `--version` / `--source` / `--no-embed` / `--force`；可中断续跑）。产物清单：`data/semantic-index-manifest.json`。

### 文档查询（Forge / Fabric / NeoForge）

1. **页面 ID 必须用搜索结果里的** `id`，不要用网站 URL 路径。
  - 正确：`get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
  - 错误：`id: "items/first-item"`
2. **推荐流程**：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`。
3. 搜索默认 **hybrid**（见上一节）。只有降级到 `l0-only` 时才「只匹配索引字段」。
4. 前缀查询示例：`class:Item`、`event:lifecycle`。
5. NeoForge `1.20.1` 文档查询会回退到 Forge 1.20.1 视图（兼容层），属预期。
6. 若某平台数据包未下载，对应 list/search 会返回 `PLATFORM_DATA_MISSING`（可用 `diagnose_data_paths` 确认）。
7. **先 `list_*_versions` / `list_doc_versions`**，确认本机有该版再搜。`search_forge_docs` 与 `search_docs({ platform: "forge" })` 走同一套 Forge 索引。
8. **按版本选工具**（不要用 `query_api` 顶官方文档）：

| 目标 | 文档搜索 | Vanilla / 映射 | 平台 API |
|------|----------|----------------|----------|
| Forge **1.12.2** | `search_forge_docs` / `search_docs`（`version=1.12.2`）。有 `data/forge_1.12.2/forge-docs` 教程（如 `1.12.2/blocks_blocks`） | **不要**把 `query_api` 当 javadoc：该版 extracted 约 3300 个**类名空壳**，`found:true` 且 `methods:[]`。映射用 `convert_mapping`（MCP SRG） | `query_loader_api` / `search_loader_api`（`1.12.2-forge` 已索引，约 1100 类） |
| Forge **1.7.10–1.11.2** | 无教程规则树；落到 `forge_javadoc` / `search_docs`，`semantic: false` | 同上，类名空壳；不要 `query_api` | 无 loader 摘要（`search_loader_api mode=list` 的 `noIngest`） |
| Forge **1.13.2** | `search_forge_docs` / javadoc | 类名空壳 | `1.13.2-forge` 已索引 |
| Forge **1.14.4 / 1.15.2** | `search_forge_docs` | `query_api` 索引为 `{}`（0 类） | `*-forge` 已索引 |
| Forge **1.16.5–1.20.4** | `search_forge_docs` | Vanilla 可用 `query_api`（真方法签名） | `query_loader_api` 或文档 |
| Fabric | 先 `list_fabric_versions`；**禁止**把邻版 wiki 当本版。26.1.2 仅 `fabric-docs`、无 wiki | 26.1+ 无 `query_api` 索引 | `search_loader_api mode=list`：`1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.20.4` / `1.21.1` / `1.21.3` / `1.21.11` / `26.1.2` 的 fabric-api **已索引**（不要再当成 maven 404） |
| Quilt | `search_docs({platform:"quilt"})`；问 QSL 禁止把 Fabric Registry 当命中 | 同左版本的 Vanilla 边界 | QSL 摘要见 `mode=list`（如 `1.19.4-qsl` / `1.21.1-qsl`） |
| NeoForge | 先 `list_neoforge_versions`。`1.20.1` 回退 Forge 文档（兼容层） | 26.1+ 无 `query_api` | `*-neoforge` 多档已索引 |
| LiteLoader / Rift / ModLoader | `search_docs`。LiteLoader/Rift 有官方 wiki **hybrid** 语义库；ModLoader 仍为 **L0-only** | `convert_mapping` / 反编译 | 仓库内核实表仍是 API 准绳；未 ingest → `PLATFORM_SKIPPED`。用户自备 jar 走 `ingest_loader_api`（默认 dryRun） |
| 基岩 | `search_bedrock_docs`（带 `docsStatus`） | 无 Java `query_api` | `validate_addon_manifest` / `validate_bp_json`，不是 `validate_project` |

9. 查询用类名或短词（`Block`、`class:RegistryEvent`）。失败先换短查询或改走 `search_docs`，不要把崩溃/空结果当成「该版没有文档」。
10. **改完 `mcp-server` 源码后**：`npm run build`，然后在宿主里**重载 MCP**。Cursor 里正在跑的进程不会自动换成新 `dist/`；用 `node mcp-server/dist/cli.js` 才能立刻验证。

### 工具陷阱（实测，同类问题）

这些不是「游戏里没有该类」，而是索引/查找写错或文档过时：

| 现象 | 实际 | Agent 应做 |
|------|------|------------|
| `search_*_docs` 查 `constructor` 抛 `abbr is not iterable` | `ABBREV_EXPAND[query]` 命中 `Object.prototype.constructor` | 已改为 `Object.hasOwn` / `ownGet`。若 MCP 仍崩 → 重载服务 |
| `get_version_info({version:"constructor"})` 返回 `undefined。注册流程：DeferredRegister…` | `VERSION_DB["constructor"]` 是 Function | 未知 version 必须 `forgeVersion=unknown`，禁止套 1.20 注册流程 |
| `get_migration_guide({route:"constructor"})` `found:true` | 自由字符串查 `MIGRATION_GUIDES[key]`，命中 Function | 已 `ownGet`，必须 `found:false` |
| `get_workflow_template({name:"constructor"})` | MCP schema 是工作流名 **enum**（Zod 直接拒）；函数层仍要 `ownGet` | 不要把校验失败理解成「没有工作流系统」 |
| `query_api` 1.12.2 `Block` `found:true` | 约 3313 个类名、几乎全是 `methods:[]` | 看 `warning` / `notes`；改 `search_forge_docs` / `query_loader_api` |
| `generate_datagen` platform=forge version=1.12.2 吐出 Java | 1.12.2 **无 DataGen**；旧模板还曾发出 1.21 的 `ResourceLocation.fromNamespaceAndPath` | Forge **1.20.1**（`Consumer<FinishedRecipe>`）与 **1.20.4**（仅 recipe，`buildRecipes(RecipeOutput)`）；NeoForge 1.20.1 改口 `search_neoforge_docs`、1.20.4/1.20.6 仅 recipe、1.21.x 与 26.1；**Fabric** 1.21.1/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1（**无 1.21.5**）；**Quilt 无** generate_datagen（改口 `search_docs platform=quilt` + Fabric overlay 手写）；其它 version 返回 error |
| `get_version_info` 1.12.2 action=register 仍教 DeferredRegister | gotchas 写「不支持」，recommendation 被强行追加 1.20 流程 | 1.12.2 注册是 `RegistryEvent.Register<T>` |
| `search_loader_api` 对 Fabric 1.14.4 等返回空 | 文档曾写 maven 404 / `LOADER_API_NOT_INDEXED` | 以 `mode=list` 为准；`skipped-ingest.json` 的 `mavenNotIndexed` 现为空数组 |
| 文档 `semantic: false` 或 warning 含 `stale` | 故意 L0-only（**仅 ModLoader** 三档），或 sqlite 落后于 processed/ | 看该次 JSON，不要只看 `get_server_status.semanticIndex.modeHint` |

同类查找一律走 `ownGet`（`mcp-server/src/utils/own-record.ts`），不要写 `record[userString]`。

### 规则包加载（`activate_platform_pack`）

知识库里的 `forge/<ver>/.cursor` **不会**被用户模组工程的 IDE 扫到。编码期用 MCP 把该档送进**当前对话**，不要把规则拷进 `MC_skill` 仓库根。

| `action` | 作用 |
|----------|------|
| `list` | 已建档平台 / 版本 |
| `session` | **不写盘**、不依赖项目根。返回该档 `AGENTS.md`、规则正文、Skill **索引**（`name` / `description` / `relPosix` / `absPath`）。默认只注入规则 **00 / 01 / 09**；`topics` 与 `task` **追加**到底座（并集，永不替换）；`skillNames` 与 `task` 建议名去重后注入 `skillBodies`（总条数上限 8）。`topics` 永不注入 Skill 正文。库 Skill 不进 `nextReads`，只有显式 `skillNames` 才注入库正文。`includeAllRules=true` 才灌 00–10 规则全文。ok=true 且带「仅底座」warning = 包可用但规则未按任务扩展（`rulesMode=base`，含 `next` 对象）。包存在但缺 00/01/09 文件 → `ok:false` + `PACK_INCOMPLETE`（不是 `PACK_NOT_FOUND`）。库 Skill 仍读 `knowledge/libs/`。 |
| `write` | 写入**用户模组工程**的 IDE 目录。`hosts` 必填（`cursor` / `claude` / … / `all`）。默认 `dryRun`。不要再用 `includeSkills`，改用 `writeSkillStubs`（二者都未传时默认 **true**，写入 stub，提示去读知识库路径，不是 Skill 全文）。`includeSkillBodies` 才写全文。目标不能是本知识库（**整棵仓库树**均拒绝，含版本子目录）。**破坏性变更（2026-08）**：设置 `MC_SKILL_PROJECT_ROOT` 时它是**硬边界**——`projectPath` 必须落在其内，否则拒绝（`PATH_OUTSIDE_ALLOWLIST`，响应带 `breakingChange: true` 与 `allowRoot`）；此前 `projectPath` 可覆盖 env。迁移：把 env 指向包含目标工程的目录，或改用其内的 projectPath。 |
| `deactivate` | 按清单撤写 |

**不能**开关 Cursor/Claude 等 Skill 扫描器。重载 MCP 不会让设置页出现条目。

### 边界

文档向量搜索 **补不了** Vanilla 方法签名。缺索引时保持 `found:false` / 空结果 + 说明，

| 情况 | 表现 | Agent 应改用 |
|------|------|----------------|
| MC **26.1+** 的 `query_api` / `get_method_params` | 该类 extracted 为 **0 个类**（无 Parchment api-index） | `search_neoforge_docs`（须传 version，先 `list_neoforge_versions`）/ `search_fabric_docs`（先 `list_fabric_versions`，如 26.1.2）；或 `get_minecraft_source` / 反编译。映射层返回 `UNOBFUSCATED_NO_YARN` |
| Forge **1.14.4 / 1.15.2** `api-index.json` | 占位 `{}`，Parchment 约从 1.16.5 才有（`forge_1.8.9` / `forge_1.9.4` 的 `class-names.json` 同为 `[]` 占位） | 换 `version=1.16.5+` 查相近 Vanilla 名，或靠文档 / MCP 映射，不要当有完整 javadoc |
| Fabric **26.1.2** | 仅 `fabric-docs`（页数少），**无** `fabric-wiki` | `source` 保持默认 `fabric-docs`；不要把 1.21.x wiki 当 26.1.2 |
| Forge **1.12.2** | `list_forge_versions` **含** 1.12.2；有 `forge-docs` 教程树。`query_api` 可能 `found:true` 但 `methods:[]`（类名空壳） | `search_forge_docs` / `search_docs({platform:"forge", version:"1.12.2"})` → `get_forge_doc_full`。Forge 类用 `query_loader_api`。**禁止**把空 methods 当完整签名 |
| Forge **1.7.10–1.11.2** | `1.7.10` 有 javadoc 核实表与短 00/01/09；其余档搜索落到 Javadoc 类名，`semantic: false` | 当类名索引用；`search_forge_docs version=1.7.10` / `search_docs({platform:"forge"})`。不要用 1.12.2 / 1.20.1 规则顶上，也不要假 pin 1.7.10 MDK |
| `diagnose_gradle` / `validate_project` | **ForgeGradle + Loom + Neo/MDG**；Rift / BaseMod / 基岩仍早退。`validate_project` 对 Fabric/Quilt/NeoForge 做真检查（`passed`/`failed`）；LiteLoader/Rift/ModLoader/基岩 `skipped`。基岩 → `validate_addon_manifest` | Java 扫描上限默认 300，可用 `MC_SKILL_JAVA_SCAN_MAX_FILES` 提高（超限 warning 含「检查可能不完整」） |
| `get_server_status.updateHint` 显示有更新 | 可能是检查缓存过期 | 以 `mc_skill_update action=check` 为准；git describe 已超前 Release 则不必 apply |



Agent **不得**把「工具返回空 / found:false / warning」解释成「游戏或文档里不存在」，也不得用错平台的工具硬查。对照：

| 误判 | 实际边界 |
|------|----------|
| `query_api` 能查 `DeferredRegister` / Fabric API | **不能**。只含 Vanilla Parchment extracted（约 1.16.5–1.20.4）。平台 API → `query_loader_api`（必填 platform+minecraftVersion）或对应 `search_*_docs` |
| `query_api` 能查 Forge **1.12.2** `Block` 构造 | **不能**当 javadoc。该版无 Parchment 方法条目：常见 `found:true` + `methods:[]` + `warning` 空壳说明。改 `search_forge_docs` / `query_loader_api` / `convert_mapping` |
| `search_forge_docs` 报错或空 = 该版无文档 | 先 `list_forge_versions`。1.12.2 **有**教程树。查询词 `constructor` 曾因原型键崩溃，已修；若仍崩则重载 MCP。失败换短查询或 `search_docs({platform:"forge"})` |
| `query_api` `found:false` = 类不存在 | 索引没有该类、简名歧义（`Handler` 不会命中 `MouseHandler`），或 `action.code=DATA_UNAVAILABLE`（该版无 extracted / Worker 未就绪）。26.1+ 收录 **0** 类；1.14.4/1.15.2 空 `{}`。1.12.2 是**空壳**（found 可能为 true）。改文档搜索或 `get_minecraft_source` |
| `get_method_params` 覆盖所有 MC 版本 | 与 `query_api` 同一数据源，边界相同 |
| `get_version_info` 适用于 Fabric/NeoForge | **仅 Forge** |
| `diagnose_gradle` 能修 Loom / NeoGradle | **覆盖** ForgeGradle + Loom + NeoGradle/MDG；Rift / BaseMod / 基岩仍早退。liteloader 插件走轻量模式 |
| `validate_project` 能校验 `fabric.mod.json` | Fabric/Quilt/NeoForge **真检查**；LiteLoader/Rift/ModLoader/基岩仍 `skipped`。基岩用 `validate_addon_manifest` |
| `query_registry` 能查模组注册名 | 只查原版 `minecraft:` 资源 ID |
| 文档搜索为空 = 数据包坏了 | 可能是 L0 降级、标签不对、或该版无 wiki。看 `semantic` / `warning` |
| 用网站 URL 当 `get_*_doc_full` 的 `id` | **必须**用搜索结果里的 `id` |
| `search_community_docs` 可当官方 API | **不能**。`links` 条目不抓网页正文 |
| `port_project` 会改用户工程 | 默认 **dryRun**；真写需 `confirmed` + `MC_SKILL_ALLOW_WRITE` + 路径在 `MC_SKILL_PROJECT_ROOT` 内 |
| 工作流 / MCP 不跑 Gradle、不拷 jar、不上传 = 漏做无人值守 | **人在环设计**。创意、兼容取舍、API、性能、调试由人决定；高风险操作须确认后再执行 |
| `analyze_porting_path` 对任意文件夹都有移植路径 | 非模组目录 → `NOT_A_MOD_PROJECT`；LiteLoader / Rift / ModLoader / 基岩 → `UNSUPPORTED_PORT` |
| `generate_*` / `generate_datagen` 会写文件 | **只返回文本骨架**。`platform`/`loader` 与（datagen/config/capability/renderer 的）`version` 必填，禁止默认 forge。datagen：**Forge 1.20.1 与 1.20.4**（1.20.4 仅 recipe）、NeoForge 1.20.4/1.20.6（仅 recipe）/1.21.x/26.1、**Fabric** 1.21.1/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1（无 1.21.5）；Quilt 无 generate_datagen（改口 `search_docs platform=quilt`）；其它 Forge 版本（含 1.12.2）error。`generate_capability`：forge=Capability；neoforge 仅 1.20.4+ Attachment；fabric/quilt 改口 CCA |
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
| `DOC_NOT_FOUND` / 规则树空壳就抄邻版 API | **禁止**。保持未核实 stub，不是漏写 |

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
| 工作流  | `get_workflow_template`    | 模板名以 `get_workflow_template` 列表为准（含 `mc-new-block` / `mc-new-item` / `mc-new-blockentity` / `mc-mixin` / `mc-worldgen` / `mc-config` / `mc-gametest` / `mc-setup-env` / `mc-publish` 等，与 Prompt 同名） |
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




## Agent Skills（**35** 个 Forge 唯一名 + 平台扩展，多 IDE 镜像）

路径示例：`forge/1.20.1/.agents/skills/<name>/`（另有 `.cursor` / `.continue` / `.opencode` / `.zcode` 等宿主镜像）。Wave D 新增 skill 已用 `scripts/propagate-wave-d-skills.mjs` 同步到各平台/版本，再经 `scripts/sync-skills.ps1 -All` 镜像到各 IDE。

> 库模组 Skill（`mc-config` / `mc-geckolib` / `mc-curios` / `mc-patchouli` 等）**不落盘**：源稿在根目录 `knowledge/libs/<group>/mc-<name>/SKILL.md`（`all-platforms` / `fabric-only` / `neo-only` / `forge-only` / `bedrock-only`），按 AGENTS.md「库模组 Skill」解析规则使用；`propagate-wave-d-skills.mjs` 与平台 `.cursor/skills` **不再包含库项**。当前库源稿：all-platforms 20 + fabric-only 9 + forge-only 2 + neo-only 2（Curios/KFF 镜像）+ bedrock-only 2 = **35 份** / **33 唯一 skillId**（以 `knowledge/libs` 实际源稿为准）。

| 平台/版本 | 数量 | 结构 | 说明 |
|-----------|------|------|------|
| `forge/1.12.2`–`1.20.4` 主档 | **35** | 目录（每 skill 一目录） | 15 核心 + 19 Wave D + `mc-events`（2026-08 D-1 补齐；1.7.10 为诚实 stub） |
| `forge/1.15.2` / `forge/1.17.1` | **35** / **34** | 目录 | 1.17.1 有 `mc-events`、无 `mc-capability`（与 1.20.1 集合不同） |
| `forge/1.7.10` | **3 规则 + 3 技能** | 目录 | 仅 00/01/09 + `mc-item` / `mc-registry` / `mc-events`（stub：无 05 规则，事件 API 未核实禁止生成） |
| `fabric/*` 主档（11 个版本，含 26.1.2；规则树另有 **14** 档） | **38** | `.md` 文件 | 主档 18 基础（含 `mc-fabric-api` / `mc-kotlin` / `mc-cloth-config`）+ 19 Wave D + `mc-events`（2026-08 D-1 补齐）；薄档 `1.21.4`/`1.21.8`/`1.21.10` 技能数以该目录为准，不要按 38 套用 |
| `neoforge/<ver>` session 索引 | **以版本目录为准** | 目录 | 根 `neoforge/.agents/skills` **不是** session 源；主档与薄档（1.20.6 / 1.21.5 / 1.21.10）本档 Skill 同名集合（entity/datagen 等），不再是 6 个。**`neoforge/1.20.1` 本档仅 `mc-registry`**，其余走 Forge 1.20.1 overlay |
| `quilt/<ver>` 本档磁盘 Skill | **3** | 目录 | 仅 QSL 差异 `mc-registry` / `mc-events` / `mc-networking`；entity/gui 等继续 Fabric overlay，不计入本档磁盘数 |
| `liteloader/<ver>`（1.8.9 / 1.10.2 / 1.12.2） | **3** | 目录 | `mc-events` / `mc-gui` / `mc-networking`（LiteLoader 专用口径，非 Forge API） |
| `rift/1.13.2` | **3** | 目录 | `mc-events` / `mc-gui` / `mc-networking` |
| `modloader/1.6.4`；`modloader/1.2.5`、`1.5.2` | **2**；**1** | 目录 | 1.6.4：`mc-item` + `mc-registry`；其余仅 `mc-registry`（safe-api 表外禁止输出） |
| `bedrock` | **10** | 目录（×7 IDE 镜像） | Script API / manifest / 资源与行为包等，见 `bedrock/.cursor/skills/`；不钉版本号，live docsStatus |

| 分类           | Skills                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 核心           | `mc-registry`、`mc-block`、`mc-item`、`mc-blockentity`、`mc-entity`、`mc-mixin`、`mc-networking`、`mc-datagen`、`mc-capability`、`mc-gui` |
| 内容           | `mc-fluid`、`mc-particle`、`mc-sound`、`mc-recipe`、`mc-enchantment`、`mc-potion`、`mc-effect`、`mc-command`、`mc-villager`、`mc-ai`      |
| 渲染 / 模型      | `mc-renderer`、`mc-model`                                                                                                           |
| 世界 / 数据包     | `mc-worldgen`、`mc-structure`、`mc-advancement`、`mc-loottable`、`mc-datapack`、`mc-resourcepack`、`mc-dimension`、`mc-weather`         |
| 配置 / 测试 / 能源 | `mc-gametest`、`mc-energy`、`mc-multiblock`                                                                                          |
| 兼容 / 文档库     | `mc-compat-jei`（knowledge/libs 源稿 + forge/1.20.1、neoforge/26.1 平台自有副本，非镜像）；库类（`mc-config` / `mc-yacl` / `mc-geckolib` / `mc-architectury` / `mc-terrablender` / `mc-playeranimator` / `mc-pehkui` / `mc-kubejs` / `mc-balm` / `mc-modern-ui` / `mc-patchouli` / `mc-owo` / `mc-curios` / `mc-kotlin-for-forge` / `mc-trinkets` / `mc-cca` / `mc-polymer` / `mc-text-placeholder` / `mc-satin` / `mc-fabric-language-kotlin` / `mc-libgui` / `mc-lib-catalog` / `mc-author-shared-libs` / `mc-resourceful-lib` / `mc-moonlight-lib` / `mc-caelus` / `mc-spruceui` / `mc-player-ability-lib` / `mc-server-translations` / `mc-impersonate` / `mc-script-ui` / `mc-script-server` = 32 库类 + `mc-compat-jei` = **33 唯一 skillId**（**35** 份源稿）→ `knowledge/libs`） |

Fabric 另含 `mc-fabric-api`、`mc-kotlin`、`mc-cloth-config`；Forge 1.12.2–1.20.4 与 Fabric 主档均含 `mc-events`（2026-08 D-1 补齐，经 `FABRIC_SKILL_DONORS` 回填的薄档带 DONOR_SKILL 横幅）。代码模式示范见 `community_knowledge/patterns/`（也可经 `mcskill://patterns/README` 读取）。

## MCP Server 工具（78 个）

服务名：`MC-AI-Coding-Assistant-Tool`。安装与配置见 `[AUTO_SETUP.md](./AUTO_SETUP.md)`、`[mcp-server/README.md](./mcp-server/README.md)`。

推荐通用流程：

1. `diagnose_data_paths` / `list_*_versions` / `get_server_status` 确认数据与版本
2. 文档：`search_*` → `get_*_summary` → `get_*_full`（全文勿一次超过 2 页；`id` 必须来自搜索结果）
3. **平台 API** 用 `query_loader_api` / `search_loader_api` 或 `search_*_docs`；**Vanilla 签名**才用 `query_api` / `get_method_params`（仅约 1.16.5–1.20.4；1.12.2 是类名空壳；26.1+ 无索引）。规则树用 `activate_platform_pack action=session`（默认 00/01/09 + Skill 索引，见上文「规则包加载」）
4. 映射：`convert_mapping` / `lookup_obfuscated`（26.1+ 无混淆层）
5. 工程：`diagnose_gradle` / `validate_project` / `generate_datagen` / `crash_analyze` / `inspect_runtime`（日志型）。Forge/Fabric/Quilt/NeoForge 跑对应检查；LiteLoader/Rift/基岩的 `validate_project` 仍 skipped
6. 移植：`analyze_porting_path` →（确认后）`port_project`（默认 dryRun）
7. **社区 / 库模组**：实务与库选型 → `search_community_docs`（`lib-*` / `library-catalog-2026`；遵守 `AGENT_USAGE.md`）→ Read `knowledge/libs/.../SKILL.md`（先 `mc-lib-catalog`）；`check_dependencies` 看 `detectedLibraries`
8. 工作流 / 知识：`get_workflow_template` / `list_knowledge_resources` → `read_knowledge_resource`

工具限制与误判对照见上文「工具边界」。

---



### 1. API 与映射 / 状态（6）


| 工具                  | 作用                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query_api`         | 查询 Vanilla/Parchment 类的方法签名、参数名、返回类型与 javadoc（按 `version` 加载 extracted 索引，**必填 version**，禁止默认 1.20.1）。**不含** Forge 特有类。覆盖约 **1.16.5–1.20.4**。1.7.10–1.12.2 可能 `found:true` 但 `methods:[]`；1.14.4/1.15.2 / **26.1+** 无可用方法索引。精确 FQCN 或唯一简名（如 `Item`）才 `found:true`（改写时带 `autoCorrected`）；`Handler` 等歧义子串 `found:false` + suggestions。平台 loader API 用 `query_loader_api`。   |
| `get_method_params` | 按类名 + 方法名查询完整参数名列表（可带 JNI `descriptor` 区分重载）。多重载未传 descriptor → `found:false` + `ambiguous` + `candidates`。26.1+ 无索引 → `DATA_UNAVAILABLE`。 |
| `convert_mapping`   | 在 **mojang / mcp / yarn / parchment / obfuscated / intermediary** 间互转类/方法/**字段**（SQLite **v3**）。`memberKind=field`；`to=mojang` 为 Tiny official 短名（同 obfuscated 层）；失败默认 `converted:null`（可选 `allow_fallback`）。 |
| `lookup_obfuscated` | 崩溃日志反混淆：单 token（`method_6032` / `er` / `func_110143_aJ` / `field_100013_f`）反查 → yarn 可读名 + ownerClass + descriptor。方法→字段→类；多命中 AMBIGUOUS；26.1+ 返回 `UNOBFUSCATED_NO_YARN`。 |
| `get_server_status` | API 索引预热状态、`diagnose_data_paths` 摘要、descriptor 自检与 **updateHint**；可选 `warmup` 先加载指定版本。                                                                                           |
| `get_version_info`  | **【Forge only】** 按 MC 版本 + 操作（如「注册方块」）给出推荐做法、关键变更、gotchas 与官方 Changelog 链接。                                                                                       |


### 1b. Loader API 与平台包（5）

| 工具 | 作用 |
| --- | --- |
| `query_loader_api` | 查 Forge/NeoForge/Fabric-API/QSL 摘要中的类与 `MethodInfo`。**必填** `platform` + `minecraftVersion`，无默认 1.20.1。**不是** `query_api`。`found:false` 不代表游戏里没有该类。LiteLoader/Rift/ModLoader 无摘要 → `PLATFORM_SKIPPED`（可 `ingest_loader_api`）。 |
| `search_loader_api` | 在 `fqcnIndex` 上子串搜索（`limit` 默认 20 封顶 50）。`mode=list` 列出已索引档 / skipped / cache overlay。 |
| `ingest_loader_api` | 用户自备 jar（官方不代下的 LiteLoader/Rift/ModLoader）抽成摘要，只写 `$MC_SKILL_CACHE/loader-api-summaries` overlay，**禁止写仓库 `data/`**。`jarPath` 绝对路径 + `mappingsVersion` 必填。默认 dryRun。不要用 `--file`。 |
| `detect_mod_project` | 只读探测模组工程（Quilt 在 Fabric 前）。`projectPath`（CLI `--project`）优先于 `MC_SKILL_PROJECT_ROOT`。知识库根 / 某版 `scaffold` → `KNOWLEDGE_REPO_NOT_MOD`（Architectury 的 `forge/`+`fabric/` 无版本 `pack.meta.json` 不误伤）。对不上规则树 → `PACK_NOT_FOUND`，禁止邻档 00–10。 |
| `activate_platform_pack` | `list` / `session` / `write` / `deactivate`。session 不写盘、不依赖项目根：默认规则 **00/01/09** + Skill **索引**（`topics`/`task` 追加并集；`skillNames` 注入正文上限 8；见上文「规则包加载」）。write 默认 dryRun，`hosts` 必填。不要再用 `includeSkills`，改用 `writeSkillStubs`（默认 true，只写 stub）；`includeSkillBodies` 才写全文。目标只能是用户模组工程（拒绝知识库根）。**不能**开关 IDE 扫描器。 |


### 2. 工程辅助


| 工具                 | 作用                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_gradle`  | 检查 `build.gradle` / `gradle.properties`：ForgeGradle + Fabric/Quilt Loom + NeoGradle/ModDevGradle。26.1 Loom 必须 `net.fabricmc.fabric-loom`、Java 25、禁止 `modImplementation`。liteloader 插件走轻量模式。Rift / BaseMod / 基岩仍早退。    |
| `generate_datagen` | 生成 DataGen Provider 模板。**platform 与 version 必填**。**Forge 1.20.1 与 1.20.4**（1.20.4 仅 recipe，`buildRecipes(RecipeOutput)`）、NeoForge 1.20.4/1.20.6（仅 recipe）/1.21.x/26.1、**Fabric** 1.21.1/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1（无 1.21.5）。Quilt 无 generate_datagen，改口 `search_docs platform=quilt`。其它 Forge 版本返回 error。需 `modId`、`targetName`。 |
| `crash_analyze`    | 解析崩溃报告全文（或传 `crashReportPath` 直接读文件），推断 `crashKind`（含 `fml` / `client` / `server` / `fabric` / `quilt` / `liteloader` / `rift` / `modloader`）、可能成因、缺前置/版本不兼容与 `logHints`。优先于盲目网页搜索；实务分类可配合社区工具。                                                                                              |
| `validate_project` | Forge：mods.toml / DeferredRegister。Fabric/Quilt：`fabric.mod.json` / `quilt.mod.json` + entrypoint。NeoForge：`neoforge.mods.toml`、`@Mod` + `IEventBus`。LiteLoader/Rift/ModLoader/基岩 `skipped`。坏 recipe 只 warning。Java 扫描上限默认 300（`MC_SKILL_JAVA_SCAN_MAX_FILES`）。 |
| `check_publish_ready` | 发布前清单：license/version、`build/libs` 是否像正式 jar。**不上传**、不调 Curse/Modrinth API。 |
| `inspect_runtime` | 日志型 inspector：优先 `logsDir`/`crashReportsDir`；否则有界探测 `run/logs` 等。禁止全盘 / JVM attach。默认读文件尾部。 |




### 3. Forge 官方文档（5）


| 工具                      | 作用                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `list_forge_versions`   | 列出本地已加载的 Forge 文档版本。无数据时返回 `PLATFORM_DATA_MISSING`。                                                   |
| `search_forge_docs`     | **hybrid** 搜索（L0 + 语义 RRF；无库则纯 L0）。`version` 必填（先 `list_forge_versions`）。与 `search_docs({platform:"forge"})` 等价。1.12.2 走 `forge-docs` 教程，不是 `query_api`。支持 `class:` / `event:` / `method:` 前缀与 `|` OR、去停用词、标签过滤。返回页面 `id` 供后续工具使用。 |
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
| `search_neoforge_docs`     | **hybrid** 搜索（DeferredRegister、Data Components、Payload 等）；无语义库则纯 L0。**须传 version**（先 `list_neoforge_versions`）。 |
| `get_neoforge_doc_summary` | NeoForge 页 L1 摘要。                                                     |
| `get_neoforge_doc_full`    | NeoForge 页全文 + 关键段高亮。                                                 |
| `get_neoforge_doc_related` | NeoForge 相关页推荐。                                                       |




### 6. 跨平台通用文档（5）

与专用工具能力对应，通过 `platform`（`forge` / `fabric` / `neoforge` / `quilt` / `liteloader` / `rift` / `modloader`，**必填**）统一入口。基岩请用 `search_bedrock_docs`（见 §6b）。


| 工具                  | 作用                                                         |
| ------------------- | ---------------------------------------------------------- |
| `list_doc_versions` | 列出**指定** platform 的可用版本（不会一次返回三平台）。                        |
| `search_docs`       | 多平台 **hybrid** 搜索；Fabric 时可传 `source`。无语义库 → 纯 L0；缺平台数据 → `PLATFORM_DATA_MISSING`。 |
| `get_doc_summary`   | 多平台 L1 摘要，用于判断某篇文档是否包含所需内容。Quilt 缺页回退 Fabric（`fallback=fabric`）；FAPI 专属 Registry/ItemGroup 页拒绝（ok=false）。                                                 |
| `get_doc_full`      | 多平台全文。适用于查看 API 完整步骤、事件列表、配置项清单；`highlight_key` 默认突出 🔴🟠🟢 关键段。Quilt 缺页回退 Fabric；FAPI 专属页拒绝，不返回 Registry 正文。                                                     |
| `get_doc_related`   | 多平台相关页，返回共享最多关键词的其他页面。成功时 JSON 根是数组。Quilt 回退 Fabric 时仍为数组（条目带 `sourcePlatform:"fabric"` / `warning`），并丢掉 FAPI 专属页；FAPI 专属 id 拒绝（ok=false）。                                                    |




### 6b. 基岩 Add-On（8）

与 Java `search_*_docs` / `validate_project` 分开。基岩用 Learn 文档与 pack JSON，不要用 Yarn / Mixin / `query_api`。

| 工具 | 作用 |
|------|------|
| `search_bedrock_docs` | 检索 Microsoft Learn 基岩文档（带滞后 `docsStatus`）。 |
| `get_bedrock_doc_summary` | 基岩页 L1 摘要。 |
| `get_bedrock_doc_full` | 基岩页全文。 |
| `get_bedrock_doc_related` | 基岩相关页。 |
| `validate_addon_manifest` | 校验 Add-On `manifest.json`（header/modules uuid 与 version）。不是 `validate_project`。 |
| `validate_bp_json` | 校验行为包实体等 JSON。 |
| `generate_addon_manifest` | 只吐 manifest JSON 文本，不写盘。 |
| `generate_bp_entity` | 只吐行为包实体 JSON 文本，不写盘。 |


### 7. 社区知识库（4）

与官方文档分离；**不替代** `search_*_docs`。适合发布、崩溃分类、软依赖、机器 GUI、库选型等实务。索引约 **81** 条（`authored` 73 / `links` 4 / `permitted` 4）；库集成占其中 **48** 篇 `lib-*.md`。用法规则见 [`community_knowledge/AGENT_USAGE.md`](./community_knowledge/AGENT_USAGE.md)；主题 id 速查见 [`community_knowledge/README.md`](./community_knowledge/README.md)。


| 工具                          | 作用                                                              |
| --------------------------- | --------------------------------------------------------------- |
| `list_community_sources`    | 列出 `community_knowledge` 条目（permitted / authored / links）及来源统计。 |
| `search_community_docs`     | 搜索社区库；命中含 `sourceKind`、`url`、`summary`。库集成可搜 `lib-curios`、`library-catalog-2026` 等。 |
| `get_community_doc_summary` | 社区条目摘要（含署名）；links 仅元数据 + 外链。                                    |
| `get_community_doc_full`    | permitted/authored 返回仓库内 Markdown；**links 只给 URL，不抓网页正文**。      |


### 7.5 库模组知识体系（短文 + Skill + 数据链）

三层结构，覆盖「库模组是什么 → 怎么用 → 数据从哪来」：

**① 社区短文**（`community_knowledge/authored/`，经 `search_community_docs` 检索）

- **48 篇 `lib-*.md`**，按功能分类：配置（Cloth/YACL/Fzzy/owo/MidnightLib…）、动画（GeckoLib/playerAnimator/Satin）、跨加载器（Architectury/Balm/Resourceful/Moonlight）、饰品（Curios/Trinkets/Caelus）、世界生成（TerraBlender）、GUI（LibGui/ObsidianUI/Modern UI）、数据附加（CCA/PAL）、服务端网络文本（Polymer/Text Placeholder/Server Translations/Impersonate/Pehkui）、脚本语言（KubeJS/Kotlin…）、配方（JEI/EMI/REI）、全家桶（Collective/Bookshelf/MaLiLib 等 15 篇）
- 总目录 `library-catalog-2026`（全览导航）、陷阱专篇 `lib-traps-2026`（8 条选型陷阱）、配方集成 `library-integration` / `library-integration-jei-emi`
- 每篇含「**核对（2026-08 反编译验证）**」小节：已反编译核对的 MC 版本 × loader 的顶层 API 包/入口，细节以官方为准

**② 库 Skill 源稿**（`knowledge/libs/`，按 AGENTS.md「库模组 Skill」解析使用，**不落盘**平台目录）

- 五组：`all-platforms` 20 / `fabric-only` 9 / `forge-only` 2 / `neo-only` 2（Curios、KFF 与 forge-only 镜像）/ `bedrock-only` 2 = **35 份** `mc-*/SKILL.md`（**33** 唯一 skillId）
- 解析规则：platform → 组映射（forge→forge-only+all-platforms；fabric/quilt→fabric-only+all-platforms；neoforge→neo-only+all-platforms；bedrock→bedrock-only）+ frontmatter `platforms`/`mcVersions` 二次过滤。路由中枢：`mc-lib-catalog`

**③ 数据链**（短文 frontmatter → 脚本生成 → MCP 消费）

```
authored/lib-*.md frontmatter（+ library-integration / library-integration-jei-emi 导航专篇）
  → mcp-server/scripts/build-library-catalog-from-authored.mjs → library-catalog.ts（50 条 catalog / 1880 verifiedApi 键 / supportedVersions / officialUrls）
  → build-lib-manifest.mjs（Modrinth API）→ lib-manifests/all.json（45 slug / 2867 版本条目）
  → batch-decompile.mjs（分批反编译，源码按需生成到 $MC_SKILL_CACHE，不入库）
  → merge-verified-api.mjs → 回填 verifiedApi
  → build-api-summaries.mjs → lib-api-summaries/（44 库 API 摘要）
  → check_dependencies 消费 catalog + manifest（库识别 / supportedVersions / 版本摘要）
```

相关脚本均在 `mcp-server/scripts/`；数据位置见「反编译数据产物」一节。




### 8. 移植与数据诊断（3）


| 工具                     | 作用                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_data_paths`  | 诊断数据目录配置（高级排障用）。诊断 `MC_SKILL_DATA` / `MC_SKILL_COMMUNITY` 解析结果，以及 forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock/community 是 `found` / `empty` / `not_found`。排障首选。                                                                   |
| `analyze_porting_path` | 扫描项目，识别平台/版本/Mappings/Architectury，输出风险、`routeSteps`、参考链接与建议的 `query_api` 调用。LiteLoader / Rift / ModLoader / 基岩 → `UNSUPPORTED_PORT`。                                                                                                               |
| `port_project`         | 执行移植步骤：`init_architectury` / `extract_common` / `apply_version_migration`。默认 **dryRun**；真正写入需 `dryRun=false` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + 路径在 `MC_SKILL_PROJECT_ROOT` 内。 |




### 9. Registry / Mixin / 资源（9）


| 工具                                                     | 作用                                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `query_registry`                                       | 查询 Vanilla 资源 ID（`nameLayer: registry_id`）；类/方法名用 `convert_mapping`。 |
| `mixin_analyze`                                        | 解析 mixins.json 与 @Mixin 注入目标（多映射层；高风险，见 supportMatrix）。`deep:true` 时基于已缓存 remapped 客户端 jar 做字节码级校验（目标类/选择器/@At 调用点）；jar 未缓存 → CACHE_MISS 引导（不自动下载）。 |
| `validate_at`                                          | 字节码级校验 Forge/NeoForge `*_at.cfg`：类/成员存在性（继承链/record/内部类）、映射层不匹配建议、跨文件冲突。 |
| `validate_aw`                                          | 字节码级校验 Fabric `.accesswidener`：header/namespace、条目类型、存在性、transitive、跨文件冲突。 |
| `audit_resources`                                      | 静态检查模型纹理引用、孤儿纹理、modId 命名等。                                           |
| `validate_datapack_json`                               | recipe / loot_table / advancement / tag 精简 JSON 校验（1.21+ recipe `result` 可为对象；不是完整 pack_format schema）。                  |
| `get_workflow_template`                                | 工作流全文（以 `get_workflow_template` 列表为准；与 MCP Prompt 同名；Cursor tools 兜底）。         |
| `list_knowledge_resources` / `read_knowledge_resource` | 列出/读取 `mcskill://`（含 patterns、schema、workflow、community 等）。          |

字节码级校验（`mixin_analyze deep` / `validate_at` / `validate_aw`）依赖 T2 缓存管线：
jar 未缓存时返回 `CACHE_MISS` 引导（先调 `get_minecraft_source`），**绝不自动大下载**。
详见 `mcp-server/docs/mixin-support.md`。




### 10. 代码生成模板（7）

`generate_model`（`kind` 默认 `block`；`item` 只出物品模型）、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`（Fabric/Quilt 吐 Cloth Config 骨架并 warning，不是改口 mc-config）、`generate_entity_renderer`、`generate_worldgen`（骨架代码/JSON，非写盘）。

`localize_mod`：自有模组 `diff`/`draft_zh`，或第三方 jar `extract`/`pack_draft`；无机器翻译，标 `needsTranslation`；无 `en_us` 时可回退其它语言作源。

### 11. 日志与依赖诊断（3）


| 工具                    | 作用                                      |
| --------------------- | --------------------------------------- |
| `analyze_log`         | 解析游戏/崩溃日志片段（可复用 `crash_analyze` 分类）。    |
| `get_migration_guide` | 默认 Primer **toc**；`section` 只返回该章；`full=true` 才全文（含 url/license/loader）。route 含 platform 或 `from->to`。 |
| `check_dependencies`  | 根据 `build.gradle` / `mods.toml` / `fabric.mod.json` / `quilt.mod.json` / `litemod.json` / `riftmod.json` / 基岩 manifest 提示依赖问题：loader 判定（quilt/fabric/forge/neoforge/liteloader/rift/modloader/bedrock）、库模组识别（catalog 接线）、冲突/陷阱检测。返回 `detectedLibraries`（含 `supportedVersions` 反编译验证版本窗口与 `manifestSummary` 版本/加载器摘要，数据来自 `library-catalog.ts` + `data/lib-manifests/all.json`）。 |

### 12. 自我更新（1）

| 工具 | 作用 |
|------|------|
| `mc_skill_update` | 检查 / 应用本仓库 **tooling + data** 更新（GitHub Release）。`action=check\|apply`；`scope=tooling\|data\|all`；默认 `channel=stable`（忽略预发布）。`apply` 默认 dryRun；真写需 `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT`=**本仓库根**。返回 `filesToOverwrite` / `diskSpace` / `restartRequired`。CLI：`mc-skill update --action check\|apply`（旧位置参数 `check\|apply` 仍兼容，stderr 有迁移提示）。详见 [`mcp-server/docs/mc-skill-update.md`](./mcp-server/docs/mc-skill-update.md)。 |

`get_server_status` 附带 `buildStatus`（src 比 dist 新时 `buildRequired=true`，提示重新 `npm run build`）、`updateHint`（上次 check 缓存，默认 TTL 1h）与 `pendingRestart`。

### 13. 反编译与模组源码（5）— T2 Wave C

**默认零下载**：不预热、不预取；仅显式调用时按需下载到 `$MC_SKILL_CACHE`（默认 `%APPDATA%/mc-skill-cache` / `~/.config/mc-skill-cache`），**绝不写项目目录**。`MC_SKILL_SKIP_DOWNLOAD=1`（CI）时下载类工具诚实失败并给出指引。**Java 17+ 前置**（VineFlower / tiny-remapper）：缺失时返回 `TOOLCHAIN_MISSING` + Adoptium 安装指引，进程不崩溃。

| 工具 | 作用 |
|------|------|
| `get_minecraft_source` | 按需下载+重映射+反编译真实 MC 源码，返回类源码片段（支持行区间 / `force` 重编译）。首次 3–10 分钟，同版本缓存命中 <1s。 |
| `analyze_mod_jar` | 纯 Node 解析本地 mod jar：fabric.mod.json / mods.toml / neoforge.mods.toml、mixins.json 引用、entrypoints、依赖、AW/AT。无 Java、零下载。 |
| `decompile_mod_jar` | VineFlower 按需反编译本地 jar → `$MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/`，返回源码树摘要；可选 remap（需匹配 MC 版本）。 |
| `search_mod_code` | 对已反编译源码做行级 grep（子串/正则），返回 file:line 命中；入口：`decompiledDir` 或已反编译过的 `jarPath`。 |
| `download_official_mdk` | 下载官方 MDK zip 到 `$MC_SKILL_CACHE`。GitHub pin commit（校验和在 `mcp-server/data/mdk-checksums.json`）；默认 `dryRun`。解压依赖 unzip / 7z / bsdtar。 |

**版本支持矩阵**（与 26.x 现状对齐）：

| 版本区间 | Yarn | Mojmap | 说明 |
|---|---|---|---|
| 1.14 – 1.21.11 | ✅ | ✅ | 两步 remap（official→intermediary→named） |
| 26.1+ | ❌（已停更） | ✅ | 去混淆，免 remap |

**与 `query_api` 的分工**：`query_api` / `get_method_params` 查 **1.16.5–1.20.4 Vanilla** 签名（快、离线）；**不含** Forge/Fabric API，**26.1+ 无索引**。以上 4 工具仅在确实需要完整源码/反编译时使用（下载量大）。各工具 description 均带 ⚠️ 提示。各工具 description 带边界说明。

**已入库的反编译数据产物**（供 `check_dependencies` 等消费，clone 后即用）：

| 数据 | 位置 | 内容 |
|---|---|---|
| `library-catalog.ts` | `mcp-server/src/diagnostics/` | **50** 条 catalog（48 篇 `lib-*` + 集成导航专篇）/ **1880 个 verifiedApi 键**（`gameVersion/loader → packages/entrypoints`）+ `supportedVersions` 版本窗口 + `officialUrls` |
| `lib-api-summaries/*.json` | `mcp-server/data/` | 44 库 / 12,225 个 public 类 / 49,040 方法签名摘要（轻量 javadoc，约 4MB） |
| `lib-manifests/all.json` | `mcp-server/data/` | **45** slug / **2867** 版本条目（版本号/URL/hash/loader 矩阵，Modrinth API 生成） |

反编译源码本体（28 万 .java）**不入库**（按需生成至 `$MC_SKILL_CACHE`）；`search_mod_code` 在源码缺失时返回 `NOT_FOUND` + 指引先调 `decompile_mod_jar`。相关脚本：`scripts/build-lib-manifest.mjs`（manifest）、`scripts/build-api-summaries.mjs`（API 摘要）、`scripts/batch-decompile.mjs`（分批反编译）、`scripts/merge-verified-api.mjs`（回填 catalog）。

另：`registerPrompt` / `registerResource`（工作流与知识 URI）供支持 prompts/resources 的客户端使用；详见 `mcp-server/docs/prompts-client-compat.md`。
### 工作流模板（MCP Prompts）

工作流模板通过 `registerPrompt` 注册（支持 prompts 的客户端可用）；数量以 `get_workflow_template` 列表为准。Cursor 等仅 tools 客户端用该工具获取同款全文。

这些模板是 **Agent 步骤清单**（人在环）：对齐创意与版本取舍后给出检索/草稿/校验顺序。不代跑 Gradle、不自动拷 mods、不上传商店——高风险步骤写明「用户确认后执行」，这是设计。


| 模板名               | 标题      | 流程要点                                                                                                              |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `mc-new-block`    | 新方块工作流  | DeferredRegister 注册 → BlockItem → 模型（generate_model）→ lang（generate_lang）→ loot（generate_datagen）→ 可选 tags/recipe |
| `mc-new-entity`   | 新实体工作流  | EntityType + 属性 → SpawnPlacement/生物蛋 → 渲染器（generate_entity_renderer）→ loot/音效                                     |
| `mc-new-gui`      | GUI 工作流 | MenuType + AbstractContainerMenu → Screen 注册 → 按平台同步（Forge SimpleChannel / NeoForge Payload / Fabric ServerPlayNetworking） |
| `mc-crash-triage` | 崩溃分诊    | analyze_log/crash_analyze → search_community_docs → validate_project + mixin_analyze → diagnose_gradle            |
| `mc-port-mod`     | 移植模组    | analyze_porting_path → 确认目标 → port_project dryRun → get_migration_guide                                           |
| `mc-build-mod`    | 模组构建流程  | validate_project / diagnose_gradle → **用户确认后** gradlew build → 确认 build/libs jar；失败则分析日志；可接真机循环 |
| `mc-ingame-iterate` | 真机测试与修复循环 | 索取并核对启动器路径（官方/HMCL/PCL2 版本隔离）→ **用户确认后**装 jar → 复现 → 修 → 再测。路径约定见模板正文与 [HMCL 隔离文档](https://docs.hmcl.net/launcher/isolation.html) |
| `mc-localize-mod` | 模组汉化 | 判定 own/third_party → `localize_mod` diff/draft 或 extract/pack_draft → Agent 填中文 → 自检；见 `authored/localization-lang` |
| `mc-decompile-mod` | 模组反编译研究 | 定位 jar → `analyze_mod_jar` → `decompile_mod_jar` / `get_minecraft_source` → `search_mod_code` → 定位目标类 → 修改建议 → 衔接 `mc-build-mod` / `mc-ingame-iterate` |
| `mc-new-item` | 新物品工作流 | 该档 03-item 注册 → 模型/lang → 合成（有模板才 generate_datagen） |
| `mc-new-blockentity` | 方块实体工作流 | BlockEntityType + 方块 → 渲染/同步；GUI 接 mc-new-gui |
| `mc-mixin` | Mixin 工作流 | mixin_analyze → mixins.json 分桶 → 核 mappings |
| `mc-worldgen` | 世界生成工作流 | configured/placed feature → 该档 biome 注入 |
| `mc-config` | 配置工作流 | generate_config（loader+version 必填）或 Cloth Config |
| `mc-gametest` | GameTest 工作流 | 按平台核文档，禁止默记 Forge 1.20.1 |
| `mc-publish` | 发布清单 | 元数据 / build/libs / changelog / license；尽量让用户自行上传（人在环，不代传） |
| `mc-setup-env` | 开发环境搭建 | detect_mod_project → MDK dryRun 或 Loom/映射清单；genRuns 由用户确认后执行 |
| `mc-full-mod` | 从零新模组总链 | 仅从零：setup-env → mc-new-* → build → ingame-iterate → 可选 localize/publish |
| `mc-networking` | 网络通信清单 | session task=mc-networking → generate_network_packet（带版本后缀） |
| `mc-capability` | 能力 / 附件清单 | Forge/Neo 1.20.1 Capability；Neo 1.20.4+ Attachment |
| `mc-recipe-data` | 配方与数据包 | 07-datagen / mc-recipe / loot / advancement |
| `mc-audio-vfx` | 音效与粒子 | mc-sound / mc-particle |
| `mc-commands` | 命令 | mc-command |
| `mc-dimension-structure` | 维度与结构 | mc-dimension / mc-structure |
| `mc-access` | AT / AW | validate_at / validate_aw |
| `mc-bedrock-addon` | 基岩 Add-On | search_bedrock_docs / validate_addon_manifest；不灌 Java 02–10 |
| `mc-fluid` | 流体 | 02 + mc-fluid |
| `mc-enchant-potion` | 附魔 / 药水 / 效果 | mc-enchantment / mc-potion / mc-effect |
| `mc-energy` | 能量 | mc-energy / mc-capability |
| `mc-creative-tags` | 创造栏与标签 | 03 |
| `mc-kotlin` | Kotlin 模组 | 00；核该档文档 |
| `mc-jei` | JEI 兼容 | mc-compat-jei |
| `mc-ci-publish-extra` | CI 发布附加 | 00；只出步骤名（可复制 YAML 见 `community_knowledge/patterns/examples/mod-ci-github-actions.md`），不代跑 CI、不上传（人在环） |
| `mc-villager` | 村民职业 / 交易 | session task=mc-villager → 04-entity；职业/交易签名核本档文档，禁抄邻档 |
| `mc-multiblock` | 多方块结构 | session task=mc-multiblock → 02-block / 07-datagen；无模板时文档手写 |
| `mc-ai` | 实体 AI / Goal | session task=mc-ai → 04-entity；Goal/Brain 类名核本档文档，禁把 1.12 AI 任务表抄进 1.20+ |


### 知识暴露（MCP Resources）

通过 `registerResource` 注册 `mcskill://` URI（支持 resources 的客户端）；`list_knowledge_resources` / `read_knowledge_resource` 工具兜底。


| URI                                     | 内容                                                         |
| --------------------------------------- | ---------------------------------------------------------- |
| `mcskill://matrix/mixin-support`        | mixin_analyze 支持矩阵（SRG/Yarn/Mojang/readable/descriptor 形态） |
| `mcskill://schema/sqlite`               | yarn-mappings.sqlite v2/v3 字段说明                            |
| `mcskill://version-changes/1.21`        | 1.21 变更专章（知识库）                                             |
| `mcskill://antipatterns/registry`       | 注册反模式短文                                                    |
| `mcskill://patterns/README`             | 代码模式库索引（community_knowledge/patterns/）                     |
| `mcskill://workflow/mc-new-block` 等 | 与 Prompt 同名的工作流正文（以 `get_workflow_template` 列表为准） |


### 独立 CLI（`mc-skill`，78 工具全可用）

flags-only（`--key value` / `--key=value` / 裸 `--key`→true），输出统一 JSON 包装 `{success, tool, result|error}`，退出码 0=成功 / 1=工具错误 / 2=用法错误。全局 flag（不进工具 schema）：`--help`/`-h`、`--version`、`--json`、`--compact`、`--fail-on-error`、`--project <dir>`、`--file field=path`；所有 string 字段支持文件输入——`--crashReport @./latest.txt` 读文件、`--crashReport=-` / `@-` 读 stdin（全进程一次）、`--file crashReport=./latest.txt` 等价写法，单文件上限约 8MB。**加 `--fail-on-error` 时，`found:false` 与 `errors[]` 非空也升为退出码 1**。完整语义见 `[mcp-server/README.md](./mcp-server/README.md)` §独立 CLI：

> ⚠️ **Windows PowerShell 5.1 控制台坑（E-7）**：PS 5.1 在 GBK 代码页下用管道捕获本 CLI 的 UTF-8 JSON 会引入坏控制字符导致 `JSON.parse` 失败；纯 Node `spawnSync` 管道解析同一输出完全正常。脚本化消费请用 Node 子进程，或先 `chcp 65001`。

```bash
node dist/cli.js status --version 1.20.1            # 服务器状态（含 buildStatus）
node dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F'
node dist/cli.js update --action check
node dist/cli.js list-tools                          # 全部 79 个工具的 schema
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
| Phase 3   | ✅ 完成  | MCP Server（文档 + 映射 + 移植 + 社区 + Wave B/C/D 扩展 + 五平台；工具数以 `list-tools` 为准） |
| Phase 4   | ✅ 完成  | 知识库 / 反模式 / 数据审计与 Release 分发 |
| Phase 4.5 | ✅ 完成  | **库模组全覆盖**：48 篇 `lib-*` 短文 + 33 唯一库 Skill（`knowledge/libs` 35 份源稿）+ check_dependencies 增强 + 全量反编译（1515 jar → 1880 verifiedApi 键）+ API 摘要 + manifest + 通用 CLI dispatch |
| Phase 5   | 📋 部分  | `inspect_runtime` = 日志型 inspector（非 JVM attach）；微调数据集仍暂缓 |


