# MC AI Coding Assistant Tool
## 写在前面的
### 如果你是agent,这个readme文件是整个项目的说明,帮助用户安装和配置mcp请看AUTO_SETUP.md,这个文件也有一部分帮助配置的内容,但这是为了避免你不看AUTO_SETUP.md
### 如果你是人类,请看下面的人类读本
    如果你想要了解详细的,可以直接让AGENT给你解决一下
[English](README.en.md) | **简体中文** · [人类读本](README_human.md)

> **本文数据截至 2026-10-02**（各节另有更细的 as-of 标注）。文中计数、版本清单、页数等均为标注日期实跑核对；引用前请按小节给出的复算命令自行重跑，不要按字面信任旧值。




让 AI 编程助手（Cursor / Claude Code 等）能更好地编写 Minecraft 模组的完整工具包。

为 AI 提供一个「读懂 MC Mod 开发生态」的环境，消除知识陈旧、API 版本混淆、构建系统复杂、映射不一致等结构性障碍。

## 定位：人在环的副驾驶

模组开发**不是**确定性流水线。创意设计（做什么内容）等必须由**人**判断；如果你无法拍板，可以让 Agent 代劳，完成后 Agent 会按「解释模板」（见「快速开始」一节）向你说明取舍与替代方案。
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
│   ├── indexes/index-l0.json    # L0 索引（实测 110 条：authored 95 / links 11 / permitted 4；含 generatedAt 构建时间戳）
│   ├── AGENT_USAGE.md           # Agent 用法规则（短文不能当 API 规范）
│   └── README.md                # 主题 id 速查
│
├── knowledge/                   # 仓库级知识源稿（不落盘到平台 .cursor/skills）
│   ├── libs/                    # 库模组 Skill 源稿：36 份 / 34 唯一 skillId
│   │   ├── all-platforms/       # 20（含 mc-lib-catalog 路由中枢）
│   │   ├── fabric-only/         # 10（Trinkets / CCA / Polymer…）
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
├── mcp-server/                  # 本地 stdio MCP Server（86 个工具）
│   ├── src/                     # 工具实现（api / docs / diagnostics / wave…）
│   ├── scripts/                 # 文档抓取、语义索引、数据审计；含 build-library-catalog-from-authored.mjs
│   └── data/                    # 随仓分发的 MCP 侧数据（非 MC_SKILL_DATA）
│       ├── lib-manifests/       # Modrinth 版本矩阵（49 slug / 3003 条目；as-of 2026-09-25 重抓后的完整面，旧值 48 / 2870 系被截断的首页快照）
│       ├── lib-api-summaries/   # 48 库 public API 摘要
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
| Rift     | ✅ 完成 | `rift/1.13.2/`（`code-patterns/` 3 件 + `knowledge/common/` 4 篇）；元数据 `riftmod.json`；**Rift 侧签名已对真构件 `javap` 核过**（`verified-api.md`，39 个 listener 接口全量表），**MC 侧未核**；依赖走 JitPack `com.github.DimensionalDevelopment:Rift:1.0.4-106`（`dev` classifier；原 `www.dimdev.org/maven/` 已 DNS `ENOTFOUND`） |
| ModLoader | ✅ 完成 | `modloader/1.6.4/` + 安全 API 表；禁止用 Forge Javadoc / `func_*` 冒充 |


### 支持版本

规则树（`activate_platform_pack action=list`）与官方文档数据（`list_*_versions`）**可能不一致**：有规则无文档、或有文档无完整 00–10 规则均属正常。Agent 须以工程**精确**版本为准，禁止用邻档顶上。

| 平台 | 规则树（`平台/<ver>/`） | 文档数据（`list_*_versions`） | 主推 | 备注 |
|------|-------------------------|-------------------------------|------|------|
| **Forge** | `1.7.10` · `1.12.2` · `1.13.2` · `1.14.4` · `1.15.2` · `1.16.5` · `1.17.1` · `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` | `1.7.10`–`1.20.4`（含 `1.8.9` / `1.9.4` / `1.10.2` / `1.11.2` 等 javadoc 档） | **1.20.1** | `1.12.2` 有 forge-docs 教程；`1.7.10` 为 javadoc 核实表 + 短规则（**ready**）。`forge/1.21.1` 为 **draft**（无完整规则树，`PACK_NOT_FOUND`；仅改口文档搜索） |
| **Fabric** | `1.14.4` · `1.16.5` · `1.17.1` · `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` · `1.21.1` · `1.21.3` · `1.21.4` · `1.21.8` · `1.21.10` · `1.21.11` · `26.1.2` | `list_fabric_versions` 含上述档（**无 1.21.5**） | **1.20.1** / **1.21.x** / **26.1.2** | `26.1.2` 仅 `fabric-docs`、无 wiki；**26.1+ 仅 mojmap**。`1.21.4`/`1.21.8`/`1.21.10` 有 versioned fabric-docs **和** 现行 `fabric-wiki`（wiki 不是该档历史快照）。**`1.21.5` 无 versions/ 源** → `PACK_NOT_FOUND`。禁止拷 `1.21.11`。附加数据（Data Attachments）逐档覆盖：`1.21.10` / `1.21.11` / `26.1.2` 已按**本档语料页**登记（只写该页出现的简名，FQCN / 模块 id 未核实者已注明）；`1.21.4` / `1.21.8` / `1.14.4` 本档无该主题来源 → 见各档 `pack.meta.json` 的 `gaps.attachments`（`1.14.4` 规则里是**负例**，不是空洞），禁止抄邻版 |
| **NeoForge** | `1.20.1` · `1.20.4` · `1.20.6` · `1.21.1` · `1.21.3` · `1.21.5` · `1.21.8` · `1.21.10` · `1.21.11` · `26.1` | `1.20.1`（回退 Forge）· `1.20.4` · `1.20.6` · `1.21.1`–`1.21.11` · `26.1` | **1.20.4+** / **26.1** | 主文档默认 **26.1**；primer 可有 26.2 旁路。`1.20.1` 本档核实表 + 短规则（Forge 兼容数据）。附加数据（Data Attachments）：`1.20.4` / `1.20.6` 已按本档 `datastorage/attachments` 页 + 本档 loader-api 摘要核实（`1.20.4` docs 页把静态方法写成 `AttachmentSerializer.serializable()`，摘要内无该类，真实为 `AttachmentType.serializable()`，已在核实表钉为禁止输出）；`26.1` 本档无独立 attachments 页，规则自带 fallback 标注 |
| **Quilt** | `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` · `1.21.1` · `1.21.3` · `1.21.4` · `1.21.8` · `1.21.10` · `1.21.11`（**10** 档） | `search_docs({platform:"quilt"})` | 随 Fabric 同版 | **本档 QSL Skill 3** + Fabric overlay；00/01/05/06 为 QSL 差异（有 `06-networking.mdc` 的档不要 overlay Fabric 网络），02–04/07–08/10 读 `fabric/<ver>`。`1.21.11` 是 MC **1.21.11**，不是 `1.21.1` 笔误（两档并存、不得互顶）；该档 QSL / QFAPI 已停更且本版本无可用构件，口径见 `quilt/1.21.11/AGENTS.md` 顶部横幅与 `00-project-setup.mdc` |
| **LiteLoader** | `1.8.9` · `1.10.2` · `1.12.2` | `search_docs({platform:"liteloader"})`（官方 wiki + hybrid 语义库；API 以核实表为准） | **1.12.2** | 纯客户端；与 Forge 混合见 `HYBRID.md` |
| **Rift** | `1.13.2` | `search_docs({platform:"rift"})`（官方 wiki + hybrid；方法名以核实表为准） | **1.13.2** | 方法名只来自已抓 wiki/源码 |
| **ModLoader** | `1.2.5` · `1.5.2` · `1.6.4` | 无 Java 文档树 | **1.6.4** | 只用 safe-api 表；禁止 Forge Javadoc |
| **基岩版** | 扁平 `bedrock/`（`*`） | `search_bedrock_docs` + `docsStatus` | 按 manifest | 无 `平台/<ver>/` 分档；实验开关按 `min_engine_version` |

查询本机已建档列表：`node mcp-server/dist/cli.js activate_platform_pack --action=list`；文档档：`list_forge_versions` / `list_fabric_versions` / `list_neoforge_versions` / `list_doc_versions`。


## 模组测试流程 loop：两段（2026-10-01 起）

真机测试拆成两段 loop，**覆盖面不同**：

| 段 | loop 内容 | 覆盖面 | 承载 |
| --- | --- | --- | --- |
| **前半** | agent 写码 → 构建 → **自动起游戏** → 看崩溃 → 改码 → 再测试 | **所有平台**（Forge / Fabric / NeoForge / Quilt / LiteLoader / Rift / ModLoader / 基岩） | `mc-build-mod`、`mc-ingame-iterate`（步骤清单，人在环）；构建/启动报错与崩溃由 `inspect_runtime` / `analyze_log` / `crash_analyze` 读 `<gameDir>/logs/latest.log` + `crash-reports/`；基岩侧读 content log（`analyze_bedrock_log`） |
| **后半** | 自动起游戏 → **进游戏自己操作、测试** → 拿证据回传 → 改码 → 再测试 | **MC 1.20.1 及以上（含 1.20.1）** 的 Java 平台：Fabric / Quilt / Forge / NeoForge | `generate_playtest_driver`（无桥：进程内临时 driver；有桥：BlackBoxPro 动作序列）+ `playtest_bridge` / `playtest_intent` / `inspect_playtest_evidence`；工作流 `mc-ingame-playtest` |

**两条路线**：

- **无桥（进程内 driver）**：`generate_playtest_driver driverMode=temporary_client_tick_driver`（或 `in_jvm_player_agent`：LLM 通过 `<evidenceDir>/intent.json` 邮箱逐步下意图）。driver 编进被测工程，进游戏后按剧本（`smoke` / `village` / 自定义 `plan` DSL）自己操作、断言、取证；**长驻 + 剧本热载**（改 `<evidenceDir>/plan.txt` 即在同一进程开新一轮，不重启游戏）。证据 = `state.json` / `exit-code.txt` / `qa.log` / `rounds.jsonl` + 截图。
- **有桥（第三方桥 mod）**：预编译桥 mod（当前 = BlackBoxPro，MIT）装进游戏实例，经 `127.0.0.1:38081` 用 `playtest_bridge` 发动作/查询/截图；证据 = `calls.jsonl` + 截图 + query 响应。桥件的 MC 覆盖由第三方发布决定（BlackBoxPro 现行件覆盖 **fabric/neoforge 1.21.1 与 1.21.11**、forge 1.12.2）。

**证据判读统一入口**：`inspect_playtest_evidence`（三态 `present|absent|unreadable`，缺件不得读成“没有失败”）；执行权与授权见根 `AGENTS.md`「人在环例外：游玩自测（三通道）」。

### 测试要求：交付前必须测到什么程度

上面的 loop 是**机制**，本节是**门槛**。按正常软件开发流程，改动不是编译通过就算交付 —— 交付前必须测，而且要测全。逐层「用什么工具、红会长什么样」的完整表在根 `AGENTS.md`「游玩测试要求（交付门槛）」；这里是给人读的摘要。

**阶梯（低层红不许跳高层）**：L0 构建 → L1 结构与静态校验 → L2 数据面（配方 / 战利品 / 标签 / 方块状态 / lang）→ L3 GameTest 自动化 → L4 真机冒烟 → L5 场景验收（**本次改动**那个玩家可见行为）→ L6 服务端与多人 → L7 回归与共存 → 发布前收口。

**最低线按改动面取最大者**：

| 改动 | 最低测到 |
| --- | --- |
| 逻辑 / 注册 | L3（GameTest） |
| 玩家可见行为（方块 / 物品 / 实体 / GUI / 配方效果 / 世界生成） | L4 + L5 |
| 网络 / 存档 / 服务端侧 | L6 |
| 升 loader 或 MC 版本 | L0–L7 全跑 |
| 纯文档 / 注释 | L0 |

**「全面」= 把维度铺开，不是同一条路径多跑几遍**：改动面（代码 / 资源 / 数据 / 配置 / 平台元数据）、平台 × 版本（每个目标档各测一遍，不许拿邻版的绿顶替）、客户端与服务端**双侧**、新世界与旧存档升级、权限档（生存 / 创造 / 授权）、边界与异常（空满背包、目标方块不存在、区块未加载、死亡与重连、非房主加入）、表现面（模型与纹理、GUI 溢出与缩放、`en_us` 与 `zh_cn` 每个键都有值）、日志面（`latest.log` 无新增 `ERROR`、`crash-reports/` 为空；基岩看 content log）。

**判红（fail-closed）**：缺证据 = 没通过。`absent` 不等于「没有失败」；`exit-code.txt` 非 `0` 或不在盘上 ⇒ 红。真 driver 覆盖 = 生成器内 `PLAYTEST_VERIFIED_TIER`（唯一真源，正文不数档），**表外版本不等于免测** —— 走桥路线或人工游玩，并如实写「人工验过 / 未验」。`MC_SKILL_PLAYTEST_INTENT_E2E` 未设 ⇒ 按未验证处理，不静默通过。

**与人在环不冲突**：门槛规定「必须测」，不改变「谁去跑」—— 跑 Gradle、起游戏仍受三通道授权约束。没拿到授权就在交付里写明「本轮未真机验证」，并把上面这张清单交给用户照着跑，**不得**替用户宣布通过。

### 后半 loop 真机矩阵（村庄测试：`newworld` 造世界 → `locate` 定位 → 飞抵 → `land` 落地 → 扫描 → 断言 → 截图；as-of 2026-10-04，读数由各实例 `evidence/` 直读）

> 单元格 = 该 combo 的村庄测试**真机**结果：✅ = 整轮通过（`exit-code=0`；证据在授权根 `E:\MC_GAME\instances\<tag>\evidence{,-bridge}/`）；❌ = 未通过（原因随行注明）；⏳ = 修复/重跑中；⚠️ = 该档或实例未建；`—` = 该档没有对应路线的可用件（**不是失败**）。

| 平台 | 版本 | 无桥 driver（村庄整轮） | 有桥 BlackBoxPro |
| --- | --- | --- | --- |
| Fabric | 1.20.1 / 1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.11 | ✅ 各整轮（`exit-code=0` + 村庄 `blocks hits` + 截图；1.21.4 / 1.21.11 经 retry 轮） | **1.21.1 ✅ + 1.21.11 ✅ 各整轮**（纯桥路线：`locate` → `tp` → `land` → 自适应列探针定地面层 → 方块网格；1.21.1 证据 `oak_log`+`dirt_path`+`farmland`+`beetroots`+4×`cobblestone`；1.21.11 证据 `oak_planks`+`cobblestone_stairs`+`mossy_cobblestone`+`white_terracotta`+`dirt_path`，`groundY=97`，`await` `matched:true`）；其余 —（未装桥件） |
| Fabric | 1.21.10 | ✅ 整轮（第 1 轮 17/17，`blocks hits=2125`，`nearest=oak_log@-1281,68,-1522` / `first=cobblestone@-1344,64,-1491`；此前的“坠虚空”靠 `forceload` + 长等待计划解掉） | — |
| Fabric | 26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3 | ✅ **五档各整轮通过（2026-10-03）**：统一走**无桥进程内 driver**（26.1+ 已进 `PLAYTEST_VERIFIED_TIER`），剧本 19 步「**`newworld name=qa_<tag>` 造世界** → `gamemode creative` → `/locate` → 飞抵 → `forceload` → `land` → `scan` → `assert scan_blocks` → 截图」**四档第 1 轮即绿**（`exit-code=0`）。逐档读数：`26.1` → `land y=62`、`entities hits=6`（`nearest=villager@1955.48,51.00,-1269.32 d=14.75`）、`blocks hits=1574`（`nearest=dirt_path@1969,61,-1264`）；`26.1.1` → `land y=85.50`、`entities hits=5`、`blocks hits=1970`（`nearest=oak_log@-207,82,-176`）；`26.2` → `land y=77`、`entities hits=5`、`blocks hits=2151`（`first=dirt_path@289,82,58`）；`26.3` → `land y=63`、`entities hits=10`（`nearest=villager@-255.94,62.94,-252.24 d=4.30`）、`blocks hits=1939`（`first=oak_planks@-320,62,-246`）。**`26.1.2`**（本档最早跑通、经多轮热载迭代的那条）—— 证据目录 `rounds.jsonl` 共 8 轮（`ok` 序列 `false×5, true, false, true`），**最后一轮绿** = 22 步变体：「冒烟移动 → `/locate` → `forceload` → 飞抵 → `land` → `scan` → 断言 → 截图」，`land y=90.00`、`blocks hits=27`（`nearest=oak_planks@-347,83,561`，`first=-411,69,533=oak_planks`）、`[QA] DONE :: PLAN 全部 22 步完成`；同实例另用 `newworld` 建出 `qa_newworld`（12 个 region 文件 + `level.dat`，`saves` 由 `{playtest_demo}` 变 `{playtest_demo, qa_newworld}`）⇒ `newworld` 造世界面首证（**注：该代码路径在 2026-10-03 被查出「注入失效」，现已修复，此读数按「待复跑确认」对待** —— 见下方边界条「`newworld` 注入曾整段失效」）。证据 `E:\MC_GAME\instances\fabric-26.x\evidence\`（各含游戏内截图）。**前置三项**：工程带 fabric-api（26.1.x 线用 `0.155.3+26.1.2`，26.2 用 `0.161.0+26.2`，26.3 用 `0.161.0+26.3`；`implementation` 不是 `modImplementation`）、`run/options.txt` 的 `onboardAccessibility:false`、`pauseOnLostFocus:false` | —（无 26.x 桥件：BlackBoxPro 只覆盖 1.12.2 / 1.21.1 / 1.21.11） |
| Fabric | **1.14.4 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4** | ✅ **五档真机整轮全绿（2026-10-04，各 `exit-code=0` + 15/15 + `qa.log`/`rounds.jsonl` + 游戏内截图）**——`blocks hits` 逐档：`1.14.4`=`farmland` 672 ｜ `1.16.5`=`oak_log` 872 ｜ `1.17.1`=`dirt_path` 1501 ｜ `1.18.2`=`cobblestone` 2390 ｜ `1.19.4`=`oak_planks` 2067（`nearest@47,79,739 d=0.79`）。**跑通前置**：前三档 loom 无 DLI ⇒ 官方 `gradlew runClient`；后两档自建启动器 ⇒ **必须** `gradlew configureLaunch` 生成 `launch.cfg`（否则 DLI pass-through ⇒ 生产模式 ⇒ 无 `PackageAccessFixer` ⇒ Bootstrap `IllegalAccessError`，见社区短文坑 64）＋ `extractNatives`/natives 检查（坑 65）；实例侧另修依赖钉子两处（1.17.1 `fabric-api`→`fabric`、1.14.4 删 `java`+`fabricloader>=0.10.5`，坑 67）。**编译验证口径（保留）**：`1.14.4` / `1.16.5` = **JDK 8 `javac` 对真 named jar + 真 yarn-remapped Fabric API 模块 jar ⇒ COMPILE_OK**；`1.17.1` / `1.18.2` = JDK 17 `javac --release 16/17` 对真 named jar + FAPI 替身（2 类）⇒ COMPILE_OK；`1.19.4` = 与 1.20.1 同表（`rewriteForFabric1201`）。**本族两条共同点**：① 无 `IntegratedServerLoader`（进世界走 `MinecraftClient.startIntegratedServer`）、无 `sendChatCommand`（走 `ClientPlayerEntity.sendChatMessage`）、注册表是旧包 `util.registry.Registry`；② **无客户端消息事件**（`fabric-message-api-v1` 这几档都没有）⇒ `goto parsed` 只走 `<runDir>/logs/latest.log` 的 `[CHAT]` 行兜底、**解析不到 fail-closed 判红**；`newworld` 在该族全部 fail-closed。**`1.14.4` 另有 9 条**（截图混淆名 `method_1659` / `window` 字段 / `Entity.x/y/z·onGround` 公开字段 + `BlockPos` 仍 `getX()` / `inventory` 公开字段 + `getInvStack` / 三参 `startIntegratedServer` / 静态 `KeyBinding.setKeyPressed` / 无 `toShortString` / 运行期 Java 8） | —（无 1.14.4–1.19.4 桥件） |
| Quilt | 1.20.1 / 1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 | ✅ 各整轮（1.21.3 / 1.21.4 / 1.21.8 经 retry 轮；1.21.4 = `oak_planks@-1281,68,-1524` 7 hits；1.21.10 `land y=63` 后 19 hits） | —（**桥无 quilt 构件**：BlackBoxPro 源码 `mod/` 只有 `1.12.2` / `1.21.1` / `1.21.11`，各含 `fabric`+`neoforge`（1.12.2 为 `forge`），grep `quilt` 0 命中；发布件 10 个也只有 fabric/neoforge/forge；README 自述「五平台支持」不含 Quilt ⇒ 桥路线在 quilt 上**结构上不可用**） |
| Quilt | **1.18.2 / 1.19.4** | ✅ **两档真机整轮全绿（2026-10-04，各 `exit-code=0` + 15/15 + `qa.log`/`rounds.jsonl` + 截图）**：`1.18.2` → `land y=79`、`blocks hits=2416`（`nearest=cobblestone@47,77,739 d=1.52` / `first=-9,80,803=oak_log`）；`1.19.4` → `blocks hits=2063`（`nearest=oak_planks@47,79,739 d=0.64`）；`/locate` 按档语法（1.18.2 `village_plains` / 1.19.4 `structure minecraft:village_plains`，社区短文坑 72）。**前置**：quilt-loom 同为自建启动器 ⇒ 必须 `gradlew configureLaunch` 生成 `launch.cfg`（DLI pass-through 坑 64 在 quilt 侧同形；quilt-loom 任务名与 loom 相同）＋工程 dev-only `fabric-api`（quilt-loader 不含 FAPI）；Gradle/JVM 走 **JDK 21**（quilt-loom 1.15.1 要求）。**边界**：quilt 全族仍**无 javac 编译验证**（本机无 quilt 的 yarn-remapped 模块件）——真机通过是实测证据，不冒充编译验证 | —（桥无 quilt 构件，同上行） |
| Forge | 1.20.1 | ✅ 整轮（18/18 `ok:true`） | —（BlackBoxPro 无 forge ≥1.20.1 件；发布件只有 forge 1.12.2） |
| Forge | 1.20.4 | ✅ 整轮（修好两个真缺陷：FML 49 dev 合并块 + Forge 49 loot ISE；第 2 轮 17/17，`blocks hits=2162`，`nearest=dirt_path@48,74,751` / `first=oak_log@-13,79,808`） | — |
| Forge | 1.21.1 | ⚠️ **draft 档，无规则树**：该目录只有 `AGENTS.md` + `pack.meta.json`（自述「仅改口，不是完整 00–10」），**没有 `.cursor/rules/`**；`data/forge_1.21.1` 也不存在 ⇒ session `PACK_NOT_FOUND`、`list_forge_versions` 不含该档。未建实例 | — |
| Forge | **1.13.2 / 1.14.4 / 1.15.2 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4** | ✅ **七档真机整轮全绿（2026-10-04，各 `exit-code=0` + 15/15 + 截图；统一 `gradlew runClient`）**——`blocks hits` 逐档：1.13.2=1728 ｜ 1.14.4=674 ｜ 1.15.2=731 ｜ 1.16.5=876 ｜ 1.17.1=1501 ｜ 1.18.2=2424 ｜ 1.19.4=2067（`nearest`/`first` 见各实例 `evidence/qa.log`）。**编译验证（9/9 COMPILE_OK，2026-10-03）**（七档改写表**各不相同**：1.13.2 走整套 MCP 命名表，1.14.4/1.15.2/1.16.5 是旧 mojmap 族但字段名逐档不同，1.17.1/1.18.2 现代名，1.19.4 与 1.20.1 同形；`newworld` 只在 1.19.4 已实现，1.13.2–1.18.2 保持 fail-closed） | — |
| Forge | **1.12.2** | ✅ **真机整轮全绿（2026-10-04，`exit-code=0` + 14/14 步 + `qa.log`/`rounds.jsonl` + 截图）**——`land y=64`、`scan blocks hits=743`（`nearest=farmland@-1003,63,807 d=1.29`；玩家从上一轮落点起飞，`/locate Village` 按**当前位置**给最近村 = `(-1016,808)`，与桥路线的 `(-744,-792)` 是同一个世界里两个村）；截图逐字可见麦田 + 火把桩 + 木板/圆石村屋（`E:\MC_GAME\forge-1.12.2\run\screenshots\2026-10-04_16.19.32.png`）。**编译验证（保留）**：JDK 8 `javac` 对真构件 `forgeBin-1.12.2-14.23.5.2847.jar`，两模式各 COMPILE_OK（tier 52）。**该档 API 面与 1.13.2 不同源**：Forge 三包在 `fml.common.*` 旧位置、无 `Minecraft.getInstance()`、无 `mainWindow`、截图无 Consumer 变体、`ITextComponent` 无 `getString()`、`GuiScreen.mouseClicked` 是 protected+void（点击证明降级走 `PlayerControllerMP.windowClick` 后端）；`newworld` fail-closed。**真机照出来的三条实测坑（前两条是生成物缺陷，第三条是我补丁自己踩的）**：① 生成物的 **`PLAN_FILE` 与 `EVIDENCE_DIR` 是两个独立占位符**，只换后者 ⇒ 驱动读不到 `plan.txt`、**静默跑内置 11 步 smoke 剧本**（表现为 `break_unchanged` 判红，而 `EVIDENCE_DIR` 明明是对的）；② `goto parsed` 的 `parseXZ` 只认 `[x, ~, z]`，而 1.12.2 的 `commands.locate.success` 原文是 **`Located Village at -744 (y?) -792`**（无方括号、y 渲染成 `(y?)`）⇒ `goto_parse_failed`，2000 tick 白等；③ 给②补兜底正则时**分隔符必须排除 `-`**（`[^\d-]+`）——用 `\D+` 贪婪会把第二个数的负号一起吃掉，实测把 `-792` 解析成 `+792`、飞到镜像点并"正常落地"（scan 0 hits 才暴露） | ✅ **村庄整轮通过（2026-10-04，桥路线）**：发布件 `BlackBoxPro-forge-1.12.2-2.2.4.jar`（2 410 633 B，sha256 `4FA598…CFFE`，MIT，已记账）放进 `run/mods` —— **自足件：jar 自带 shade 的 kotlin-stdlib 且 `mcmod.info` 依赖为空 ⇒ 不需要 KFF**（与 1.21.x 线必须配 KFF 不同）→ 桥 `create_world` 造世界（**该档 `newworld` fail-closed、盘上又无现成世界 ⇒ 世界只能由桥造**）→ `locate Village` → `tp` → 落地 `y=65`/`groundY=63` → **村民 18 / 可见实体 71 / `grass_path` 2 命中**，截图 `001_bridge.png`（261 KB，848×463）；证据 `E:\MC_GAME\instances\forge-1.12.2\evidence-bridge\`（verdict.json + calls.jsonl + bridge-trace.jsonl）。**两条环境前置**：`run/options.txt` 必须 `pauseOnLostFocus:false`（否则单机世界暂停：实测 `worldTime` 停在 34、玩家悬在 y=140 不掉、区块不生成 ⇒ 全 air 判红）；FG2.3 的资产下载走 `http://resources.download.minecraft.net`，该 CDN 现在对明文 HTTP 一律 **400**（HTTPS 才 200）⇒ 需先用 HTTPS 把 `indexes/1.12.json` 的对象预灌进 `~/.gradle/caches/minecraft/assets/objects`（1 305 件 / 1 296 新下 / 0 失败），否则 `:getAssets` 会 2 340 次失败后无限重试。**⚠️ 上面这条桥路线用的是 BlackBoxPro 第三方预编译件，不是本仓自建模板** —— 本仓「最小桥 mod」模板（10 动作）的**真机仍未跑过**，只有编译层证据（见下方「老平台最小桥 mod」条）。**桥路线读数（2026-10-05 主对话扫证据目录复核）**：`verdict.json` 村庄 `(-744,-792)`、`arrived=true`/`onGround=true`/`groundY=63`、`colProbe=["65:air","63:dirt"]`、玩家落点 `(-743.5, 65, -791.5)`、`health 20/20`；`calls.jsonl` 共 **356 次调用 / 9 个动作** = `query_block_state` 290 + `query_chat_history` 33 + `query_player_state` 13 + `chat_command` 8 + `player_abilities` 5 + `query_nearby_entities` 2 + `screenshot` 2 + `await` 2 + `query_world_state` 1；**世界由桥自己 `create_world` 造**（1.12.2 盘上无可 join 的现成世界）。
| LiteLoader | **1.12.2（hybrid）** | ✅ **真机整轮全绿（2026-10-04，`exit-code=0` + 16/16 步 + `qa.log`/`rounds.jsonl` + 截图）**——实例 `E:\MC_GAME\liteloader-1.12.2`（**Forge 1.12.2 + LiteLoader 作 tweak**）：`cmd locate Village` → `Located Village at -1016 (y?) 808` 解析成功 → `goto arrived dist=14.96 @ -1025.16,68.00,819.83` → `land y=68` → `scan blocks hits=525`（`nearest=farmland@-1026,67,824 d=4.71`）→ `assert scan_blocks -> PASS` → 截图。**tick 确认只走一条路**：驱动已摘掉 Forge `ClientTickEvent`，世界与剧本全靠工程 `LiteMod implements LiteMod, Tickable` 的 `onTick` → `PlaytestQaDriver.onLiteLoaderTick(mc)` 转发；LiteLoader 确实在跑（`[LiteLoader]: Baking listener list for …`、`[mixin]: Mixing MixinScreenShotHelper from mixins.liteloader.client.json`）。**产物零 `com.mumfrey.*` 依赖**；聊天回包仍走 Forge `ClientChatReceivedEvent`；tier 53 的编译验证保留。**建实例踩到的三层坑（均已实测绕过）**：① **`generate_playtest_driver --platform=liteloader` 被 schema 拒** —— 生成器 `PLAYTEST_PLATFORMS` 含 `liteloader`（`playtest-driver.ts:26`），但 zod 输入枚举在 `mcp-server/src/wave/register.ts:173` 写死 `["forge","neoforge","fabric","quilt"]` ⇒ CLI/MCP 面 `INVALID_ENUM_VALUE`（本次绕开：直接 `import dist/generators/playtest-driver.js` 调 `generatePlaytestDriver`，**仓库未改**）；② **`liteloader/1.12.2/scaffold/hybrid/build.gradle` 按原样编不过** —— FG2.3 的 `net.minecraftforge.gradle.liteloader`（`LiteloaderPlugin extends UserVanillaBasePlugin`，已 javap 核）是 **vanilla+LiteLoader、不带 Forge**，且 `LiteloaderExtension.checkVersion` 要求 `minecraft.version` 就是 `versions.json` 的键（必须写 `'1.12.2'`；写 `'1.12.2-14.23.5.2847'` 直接 `No ForgeGradle-compatible LiteLoader version found`）。真 hybrid 只能「forge 插件 + `deobfCompile 'com.mumfrey:liteloader:1.12.2-SNAPSHOT'`（发布件是 SRG 名，必须走 FG deobf 管线）+ `tasks.runClient.args '--tweakClass','com.mumfrey.liteloader.launch.LiteLoaderTweaker'`」；③ **LiteLoader 声明的两个库要手工补且必须 `transitive = false`** —— 缺 `org.spongepowered:mixin` 时 LiteLoader `onPreInit` 先炸 `NoClassDefFoundError: MixinBootstrap`（随后连带 `ClassCircularityError: com/mumfrey/liteloader/core/runtime/Obf`，那是**下游症状**不是根因），而带传递依赖又会把 gson 升到 2.8.x、撞 Forge 1.12.2 `ModList` 的 `GsonBuilder.setLenient()`（`NoSuchMethodError`）。**缺陷 ④ 已定案并修复（2026-10-05）：不是渲染缺陷，是本实例 `run/options.txt` 的 `fov:70.0` 单位写错。** 1.12.2 的 `fov` 键存的是**归一化滑块值**（默认 `0.0` 映射 70°），写 `70.0` ⇒ `fovSetting = 70 + 70×40 = 2870`；`setupCameraTransform` 把它当角度传给 `Project.gluPerspective`，于是 `f = 1/tan(2870×1.1/2)`，而 `3157/2 = 1578.5 ≡ 138.5° (mod 180)` ⇒ **tan 为负 ⇒ f 为负 ⇒ 投影矩阵 m00 与 m11 同时为负 ⇒ 整个世界图像绕视轴转 180°**；HUD 走自己的 `setupOverlayRendering()` 正交投影所以正常。**矩阵实测（同实例同探针，改前/改后）**：改前 `pj m00=-0.6353 / m11=-1.1303`、`fovSetting=2870.0`；改 `fov:0.0` 后 `pj m00=+0.7066 / m11=+1.2572`、`fovSetting=70.0`（`1/tan(70×1.1/2)=1.2572` 逐位吻合）。四色方块截图改后恢复"emerald 在左、gold 在右、diamond 在上"；村庄整轮改后复跑 `exit-code=0` + 16/16 步 + `scan blocks hits=760` + `PASS`。**为什么看起来像 hybrid 专属**：`forge-1.12.2` 与 `liteloader-1.12.2-pure` 两个实例的 `options.txt` **都没有 `fov` 行**（走默认 70°）⇒ 它们正常 —— 差异来自 options.txt，与加载器无关。**通用判据**：① 别手写 `options.txt` 的数值键（`fov`/`mouseSensitivity`/`gamma`/`chatOpacity` 等是归一化值，写错不报错、只静默给出荒谬有效值）；② 判"渲染是否被翻转"**直接读 `GL_PROJECTION_MATRIX` 的 m00/m11** —— 同号为正常、同为负 = 180° 旋转。**下面这段"撤回→恢复→成因未定论"的来回保留作方法论留档**：该 hybrid 实例的**世界渲染整体绕视轴旋转 180°**（上下与左右**同时**反），而 **HUD / 聊天 / 快捷栏 / 手臂全部正常**。**判据（不可误读，先量后判）**：`cmd tp @s 0 200 0` 站到纯天空高空后，在正前方 z=8 放四个世界坐标已知的彩色方块 —— `diamond`(y=202，上面那块) / `redstone`(y=201，下面那块) 一组量上下、`emerald`(x=+5，玩家左侧) / `gold`(x=−5，玩家右侧) 一组量左右；像素定位实测（2560×1494 原生帧）：**diamond y=57% / redstone y=49%（上下反）**、**gold x=29% / emerald x=70%（左右反）**。**两条独立产物同结论**：MC 自己的 PNG（`glReadPixels`，不经窗口）与**真实窗口屏幕抓屏**（`CopyFromScreen`）都翻 ⇒ 翻转在**渲染出的帧缓冲里**，**不是**窗口合成或 150% DPI 缩放伪影。**已逐一排除**：① 相机朝向 —— 驱动 `look` 无参回读实际值 `yaw=-630.90（≡89.1°）/ pitch=35.85`，均在正常范围；② 截图路径 —— 窗口与 PNG 同时翻；③ 视点摆动 —— **原"改 `bobView:false` 重启后依旧翻"这条排除本身无效**（用到的 `screen_boboff.png` 是 `PrintWindow` 抓的窗口图：无 HUD、满屏单一泥土贴面，判别力为零）；真正的排除是**算术**：`EntityPlayer.onLivingUpdate` 里 `cameraYaw` 的目标值 `sqrt(motionX²+motionZ²)` **被硬钳到 0.1** ⇒ 滚转上限 `0.1×3.0 = 0.3°`；④ 驱动写的状态 —— 驱动只写 `capabilities.isFlying` 与冲刺按键，仅影响 FOV，不可能产生 180° 滚转。**成因未定论（2026-10-04 深夜复审；→ 2026-10-05 已定案，见上，本段留档）**：① **已排除 LiteLoader 的变换层（结论仍成立，但比法已修）** —— `-Dmixin.debug.export=true` 导出被变换的类，与 vanilla（`forgeBin-1.12.2-14.23.5.2847.jar`）的 `javap -c -p` 比对。⚠️ **上一版按"行数相同"比是无效比法**：`javap -c` 打印的 `invokevirtual #18` 常量池索引会因新增方法整体位移，导致几乎每个方法都"行数相同、内容不同"。**已改用剥掉字节码偏移与常量池索引后的语义 token 比对**：`EntityRenderer` 98 个共有方法**语义全同**，仅 8 个不同 = 恰好是 mixin 注入点所在方法（`updateCameraAndRender`/`renderWorld`/`renderWorldPass`/`renderCloudsCheck`/`renderHand`/ctor/`static{}`）+ `setupCameraTransform` 一处 `invokevirtual→invokespecial` 编码差异（无行为影响）；**`orientCamera`/`applyBobbing`/`hurtCameraEffect` 语义完全一致**；`Minecraft` 220 个共有方法仅 8 个不同（同为注入点），`Framebuffer` 25 个仅 2 个。LiteLoader 自身源码也**零** `rotate|scale|flip`。**⇒ 翻转不是这几个类的变换造成的**。另两条同批否掉的：`debugView`/`debugViewDirection`/`cameraZoom` 在 `EntityRenderer` 里**从未被赋值**（死代码），portal/nausea 的 `rotate(…,0,1,1)` 需 `timeInPortal>0`（实测 `0.0`），Forge `CameraSetup.roll` 无订阅者。`② **"纯 Forge 正常"这条对照不足以定因果** —— 那是**不同姿态、不同时间**的两张图（肉眼读），**不是同探针 A/B**；本轮想补同工程去 LiteLoader 的对照，**两处都被卡住**：世界确实加载成功（日志 `Player93 logged in at (0.5, 200.0, …)`，正站在标记块位置），但随后 `Saving and pausing game...` ⇒ **世界被暂停、按 tick 推进的剧本不再前进**（注入 ESC 也未恢复），且这条路上 hybrid 驱动**故意摘掉了 Forge tick**（只走 `LiteMod.onTick`）⇒ 临时补 Forge tick 转发才动起来、仍卡暂停；纯 Forge 1.12.2 实例的驱动则卡在 `open world requested` 之后不推进（同症状）。⇒ **同探针对照目前拿不到，成因未定。**（注：即便 `run/options.txt` 写了 `pauseOnLostFocus:false`，这条路上世界仍被暂停 —— 这是一条值得单独查的独立坑。）**"第二处偏差"其实是同一病根（2026-10-05 更正）**：1 格方块成像比 `fov:70` 预期**小约 1.5 倍**（≈96–116 px vs ≈163 px）曾被记成"驱动飞掠把 FOV 改大"，真因是 `fovSetting=2870` 让透视矩阵本身崩了。**保留的正确部分**：驱动 `goto` 的"飞掠"确实会同时打开 `isFlying`（×1.1）与冲刺键（×1.15）—— **驱动有 FOV 副作用，判图前必须先知道**。**影响面（已随修复消解）**：机器可判证据（`scan hits`、坐标、`exit-code`、`rounds.jsonl`）自始不受影响，翻转只影响看图的人。**修复 = 把 `run/options.txt` 的 `fov:70.0` 改成 `fov:0.0`** —— 不需要动加载器、驱动或构建；本实例已改并复跑验证。**同批保留的另一个真坑（计划作者坑，与翻转是两回事）**：相机被塞进地形/树冠（`land` 后 `tp ~ ~+N ~`、或落点贴着山坡）⇒ 整屏一种方块贴面或全黑，**看起来也像朝向不对**（实测 `pitch=0` 一张是 100% 树叶）；取证应"别额外 `tp`、用 `land` 落点 + 显式 `look yaw`"，或先造已知干净的高台再站上去 | —（无 LiteLoader 桥件） |
| NeoForge | 1.20.4 / 1.20.6 / 1.21.1 | ✅ 各整轮（1.20.4 18/18；1.20.6 / 1.21.1 = 1206+ 新表首跑，经 retry 轮） | —（**1.21.1 不可用**：发布件 `BlackBoxPro-neoforge-1.21.1-2.2.4.jar` 实测**不是 mod jar** —— 包内只有 `META-INF/MANIFEST.MF` + `*.kotlin_module`，无 `neoforge.mods.toml` / `mixins.json`） |
| NeoForge | 1.20.1 | ⚠️ 未建实例（该档 scaffold 无构建插件，待研究） | — |
| NeoForge | **1.21.11** | ⚠️ 未建实例（**桥路线 ✅ 已跑通，见右列**） | **✅ 村庄整轮通过**（2026-10-02）：桥 mod + `kotlinforforge-6.3.0-all.jar` 装进 `run/mods` → 客户端起 → 桥 `join_world{worldName=playtest_demo}` 进世界（`state=in_world`，`creative`）→ `locate` 命中 `-352,576` → 飞行抵达 `arrived/onGround=true`、`groundY=97` → 方块证据 `dirt_path`+`cobblestone_stairs`+`mossy_cobblestone`+`oak_planks`（struct 2 / path 2 / block 4）+ 村民 1 + 截图 `001_bridge.png`；证据 `E:\MC_GAME\instances\neoforge-1.21.11\evidence-bridge\` |
| NeoForge | 1.21.3 / 1.21.5 / 1.21.8 / 1.21.10 | ⚠️ 未建实例（**规则树齐备**：这 4 档各有 11 条 `00–10` + `data/neoforge_<ver>` 语料 + `search_neoforge_docs` 可用；「未建实例」指没起过客户端，不是缺档） | — |
| NeoForge | **26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3** | ✅ **五档各整轮通过（2026-10-03）**：走**无桥进程内 driver**，与 fabric 26.x 共用 `apply26xxShared`（事件栈换 NeoForge 26.x：`NeoForge.EVENT_BUS` + `ClientTickEvent$Post` 无 phase + `ClientChatReceivedEvent.getMessage()`），剧本同 19 步（`newworld name=…` 造世界 → `/locate` → 飞抵 → `forceload` → `land` → `scan` → `assert scan_blocks` → 截图），**全部第 1 轮即绿**（`exit-code=0`，各带 1 张游戏内截图）。逐档读数（`land y` / `entities hits` / `blocks hits`）：`26.1` 96 / **12** / **2616**（`nearest=dirt_path@-223,95,272`，`first=oak_log@-253,104,293`）；`26.1.1` 68 / 5 / 2234（`first=oak_log@-11,84,-1032`）；`26.1.2` 102 / 13 / 1567；`26.2` 107 / 12 / 1430（`nearest=cobblestone@560,110,-1971`）；`26.3` 108 / 4 / 1691（`nearest=oak_planks@1926,104,1407`）。证据 `E:\MC_GAME\instances\neoforge-26.x\evidence\`。**跑这五档的两条前置**：① 上游构件锚点 —— `26.1.2 → 26.1.2.114`、`26.2 → 26.2.0.88` 有正式版，**`26.1 → 26.1.0.19-beta`、`26.1.1 → 26.1.1.15-beta`、`26.3 → 26.3.0.43-beta` 上游只有 beta**（按 pom 的 `net.neoforged:neoform:<MC 三段>-<n>` 依赖逐条核出）；② **26.2 / 26.3 要把 ModDevGradle 升到 ≥ 2.0.148**（本仓 scaffold 钉的 2.0.144 在这两档上 `recompile` 必失败，见下方边界条） | —（无 26.x 桥件） |

**已核实边界（写清不吹）**：

- **有桥**此前只覆盖 BlackBoxPro 有预编译件的档；其余档一律走**无桥**（进程内 driver）。**2026-10-04 起 `forge 1.7.10–1.12.2` 也可走桥** —— `generate_playtest_driver driverMode=external_bridge` 会**附赠**一份自建「最小桥 mod」模板（`playtest/bridge/BridgeMod.java` + `mcmod.info` + `README.bridge.md`；tick 钩子 + 内嵌 `com.sun.net.httpserver`，线协议逐键对齐 `playtest_bridge` ⇒ **工具面零改动**）。桥**无鉴权**且通配绑定 ⇒ 只在可信网络、短会话；`playtest_bridge` 只连 `127.0.0.1`。
- **桥的 `/status.ready` 不可信**（2026-10-02 实测）：主菜单下它也报 `ready:true`；判「在不在世界」只能看 `query_player_state` —— 成功带 `data` = 在；`ok:false` + `"Player not available"` = 不在。**一次超时不能当「不在世界」**，否则会像本轮一样误触发全量世界重载，慢盘上 ~28 分钟不回来。
- **CLI 对 `status` / `execute` 的 HTTP 超时写死 10s**（`playtest-bridge` 的 `DEFAULT_TIMEOUT_MS`；`timeoutMs` 只作用于 `await`）：慢盘上 `join_world` 触发的整合服世界加载期间，**每一次** 调用都会 10s 超时（游戏侧逐条 `Failed to write HTTP response`）。桥路线在这种盘上要么**先把世界进好再驱动**，要么把等待预算按分钟计 —— 别读成「桥坏了」。
- **CLI envelope 是 `{success, tool, result:{…}}`**：读字段一律先解 `result`（`st.ok` 恒 `undefined`；`status` 的 `ready` 在 `result.ready`）。驱动脚本的 CLI 路径若含非 ASCII 目录名，**用 `String.fromCharCode` 拼**，别让文件编码把它变成 U+FFFD（那会让每次 `node <path>` 都 MODULE_NOT_FOUND，看起来像「CLI 退化」）。
- **无桥 driver 的“真代码”档**以 `generate_playtest_driver` 的 `PLAYTEST_VERIFIED_TIER`（生成器内表）为准；不在表里的档只出结构壳（`// TODO(未核实)`），**不会**静默编成假 driver。
- **forge 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 四档已进 `PLAYTEST_VERIFIED_TIER`（2026-10-03，javac 编译验证；真机未跑）**：jar 全部取自本机 `.gradle/caches/forge_gradle`（免下载）。四条边界各不相同——① **1.16.5 是“旧 mojmap”**（1.17 大批改名之前）：`net.minecraft.client.gui.screen.Screen`（单数）/ `client.entity.player.ClientPlayerEntity` / `client.network.play.ClientPlayNetHandler` / `util.registry.Registry` / `util.ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer)` / `Minecraft.options` 类型是 `GameSettings` / `Entity.yRot·xRot` 与 `PlayerEntity.inventory·abilities` 都是**公开字段**；② **1.17.1 / 1.18.2** 无 `WorldOpenFlows` ⇒ 自动进世界走 `Minecraft.loadLevel(String)`，命令走 `LocalPlayer.chat(String)`（`ClientPacketListener.sendCommand` 1.19 才有），注册表是 `core.Registry` 静态字段；③ **1.19.4 与 1.20.1 基本同形**（`createWorldOpenFlows().loadLevel` / `BuiltInRegistries` / `sendCommand` / 7 参 `LevelSettings` 都在），仅 `Entity.isOnGround()`（`onGround()` 是 1.20 才改的名）；④ `newworld`（造世界）只在 **1.19.4** 已实现，1.16.5–1.18.2 保持 fail-closed。
- **forge 1.13.2 / 1.14.4 / 1.15.2 三档已进 `PLAYTEST_VERIFIED_TIER`（2026-10-03，JDK 8 `javac` 编译验证；真机未跑，tier 47 → 50）**：jar 全部取自本机 `.gradle/caches/forge_gradle`（免下载）。三条边界互不相同——① **1.13.2 = MCP 命名层**（与 1.14+ 的 mojmap **完全不同源**，整表分派 `applyForgeMCP132()`）：`net.minecraft.block.state.IBlockState`（`World.getBlockState()` 返的是**接口**，不是 `BlockState` 类）/ `client.gui.GuiScreen` / `client.gui.inventory.GuiInventory` / `client.entity.EntityPlayerSP` / `client.multiplayer.WorldClient`；`Minecraft.world/player/currentScreen/gameSettings/gameDir/mainWindow` 全是**公开字段**（**无 `getWindow()`**）；`GuiScreen` 关屏是 `onGuiClosed()`；`KeyBinding` **无 `setDown`** ⇒ 静态 `setKeyBindState(Input,boolean)`；截图 `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)`；命令走 `EntityPlayerSP.sendChatMessage(String)`；`WorldClient` 取实体用公开字段 `loadedEntityList`（无 `getAllEntities()`）；**`TickEvent` 在 `net.minecraftforge.fml.common.gameevent`**（1.14 才搬到 `net.minecraftforge.event`）。② **1.14.4 = 旧 mojmap 且字段名整批更旧**：`world`/`currentScreen`/`gameSettings`/`gameDir`/**`mainWindow` 字段**/`getFramebuffer()`/`displayGuiScreen`；`ClientWorld.getAllEntities()`；`PlayerInventory.getStackInSlot(int)`；`Entity.rotationYaw·rotationPitch·onGround` 与 **`posX/posY/posZ` 位置字段**（**无 `getX/getY/getZ`**）；`PlayerAbilities.isFlying` + `sendPlayerAbilities()` + **`sendChatMessage(String)`（无 `chat`）** + `saveScreenshot`（**不是 grab**）；`MainWindow.getScaledWidth/Height()`（无 getGuiScaled*）；BlockPos **`up()/down()/toImmutable()/add(int,int,int)`**。③ **1.15.2 = 与 1.16.5 同族，只差三处**：`Minecraft.selectLevel(String,String,WorldSettings)`（无 `loadLevel`）；`Entity.onGround` 公开字段；**`Entity` 既无 `blockPosition()` 也无 `getPosition()`** ⇒ 现造 `new BlockPos(getX(),getY(),getZ())`（其余：`yRot/xRot`、`PlayerInventory.getItem(int)`、`KeyBinding.setDown(boolean)`、`BlockPos.below()/immutable()/offset(int,int,int)`、`MainWindow.getGuiScaledWidth/Height()`、`WorldType.NORMAL`——1.14.4/1.13.2 才叫 `DEFAULT`）。**重构出的两个自证缺陷**：① 把 `createWorldOpenFlows().loadLevel(null,WORLD)`→`loadLevel(WORLD)` 与 `sendCommand`→`chat` 两条搬进了只服务 1.17.1/1.18.2 的分支，1.16.5 立刻回红 ⇒ 改为挂在旧 mojmap 族共享块（**共享语句要挂最内层公共祖先**）；② `player.getX()`→`player.posX` 的朴素替换把 `bp.getX()`（BlockPos 仍叫 `getX()`）一起吃掉 ⇒ 改负向 lookbehind。
- **`fabric 1.14.4` 已实现并进 `PLAYTEST_VERIFIED_TIER`（2026-10-03，**推翻**上一轮「不实现」的判定；tier 50 → 51）**：证据 jar 由 **本仓 `fabric/1.14.4/scaffold` 自己的 Gradle 构建**落盘（JDK 8 + Gradle 6.9.4 + loom 0.6.60，`BUILD SUCCESSFUL in 4m 19s`）——**没有绕过任何校验门**（`MAPPINGS_CHECKSUM_MISSING` 只守 `get_minecraft_source` 自己的下载+校验路径）。实现 = `rewriteForFabricLegacy` 加 `1.14.4` 支（**9 条**差异，逐条 javap 实测）：① 截图**方法名仍是混淆形** `ScreenshotUtils.method_1659(File,int,int,Framebuffer,Consumer)`；② `MinecraftClient` **无 `getWindow()`**（`window` 是公开字段）；③ `Entity` 的 `x/y/z` 是**公开字段**（**无 `getX/getY/getZ`**）且**无 `isOnGround()`**（公开字段 `onGround`）—— 而 `BlockPos`/`Vec3i` **仍叫 `getX()`** ⇒ 必须按接收者负向 lookbehind 限定；④ `PlayerEntity` **无 `getInventory()`**（公开字段 `inventory`）+ `PlayerInventory.getInvStack(int)`（**不是 `getStack`**）；⑤ 自动进世界 `startIntegratedServer(String,String,LevelInfo)`（**三参**）；⑥ `KeyBinding` **无 `setPressed`** ⇒ 静态 `KeyBinding.setKeyPressed(getDefaultKeyCode(),bool)`；⑦ `Vec3i` **无 `toShortString()`** ⇒ `toString()`；⑧ **无客户端消息事件**（见下条）；⑨ 运行期 JVM = Java 8（见下条）。**编译验证 = JDK 8 `javac` 对真 named jar + 真 yarn-remapped Fabric API 模块 jar（45 项 classpath）⇒ COMPILE_OK**；同族 `1.16.5` 用**真模块 jar**（JDK 8）也是 COMPILE_OK，`1.17.1` / `1.18.2` 是「真 named jar + 两类替身」腿（本机没有那两档的 yarn-remapped FAPI）。
- **两条**跨档**编译缺陷，被 `fabric 1.14.4` 的取证顺手照出来、并回溯修掉 5 个档（2026-10-03）**：
  - **① J11 库 API（`Path.of` / `Files.writeString`）**：基线模板用了两个 **Java 11** 的 `java.nio.file` API，而 `-source 8` **拦不住**。**真会炸的档**：`forge 1.15.2` / `1.16.5` scaffold 钉 `java.toolchain.languageVersion = 8`（**真用 JDK 8 javac**）、`fabric 1.16.5` 钉 `options.release = 8`（ct.sym 里没这两个方法）⇒ **编译期就红**；`forge 1.13.2` / `1.14.4` 钉 `sourceCompatibility='1.8'` ⇒ JDK 8 构建直接红、新 JDK 构建则**运行期** `NoSuchMethodError`（1.16.5 及以下只支持 Java 8）。修法 = 新增 `applyJava8LibSwaps`（`Paths.get(...)` + `Files.write(p, (s).getBytes(StandardCharsets.UTF_8)[, opts])`），宿主 `JAVA8_RUNTIME_VERSIONS = ["1.13.2","1.14.4","1.15.2","1.16.5"]`。**判据**：**改任何「Java 8 运行期的档」之后必须用 JDK 8 的 `javac` 复跑** —— `-source 8` / `--release 8` 只拦语言特性与 ct.sym 里的 API，**JDK 8 的 rt.jar 才是唯一真闸**。
  - **② `ClientReceiveMessageEvents` 在整个 fabric legacy 族（1.14.4–1.18.2）都不存在**：该类属 `fabric-message-api-v1`，而该模块在 `fabric-api` 的 **`0.28.5+1.14` / `0.42.0+1.16` / `0.46.1+1.17` / `0.77.0+1.18.2` 四档 POM 依赖表里都没有**（最早带它的是 `0.87.2+1.19.4`），且 1.14.4 / 1.16.5 的 **loom remapped 真模块 jar** 里 `*ReceiveMessage*` 类数 = 0 ⇒ **留着就是编译不过**。修法 = 本族统一摘掉 `import` + 注册行，`goto parsed` 走 `readLastChatLine`（`<runDir>/logs/latest.log` 的 `[CHAT]` 行）兜底（解析不到 fail-closed 判红，不静默）。1.19.4+ **不动**（那些 FAPI 有该模块）。**教训**：**替身只能证「签名形状」，证不了「类存在」** —— 1.16.5 当年那条「走 `ClientReceiveMessageEvents.GAME`」的结论就是拿手写替身验出来的，替身自己写了那个类，把「本版到底有没有这个类」吞掉了；判存在必须拿真构件（POM 依赖表 / 真 jar 类名扫描 / javap 真 classpath）。
- **`quilt` 前置（不是缺陷，是口径）**：**quilt-loader 不含 Fabric API**（实测 `quilt-loader-0.31.0-beta.4.jar` 里 `net/fabricmc/fabric/api/` 类数 = **0**，只 bundle `mixinextras-fabric`），而 driver 的 tick/chat 钩子走 Fabric API ⇒ **quilt 档必须让工程自备 dev-only `fabric-api`**；生成端本轮补了一条 **quilt 专用前置警告**（原先只有 26.x 警告提到该前置）。**quilt 全族仍无编译验证**（本机没有 quilt 的 yarn-remapped 模块件）—— 如实标注，不假装验过。
- **`forge 1.12.2` 已实现并进 `PLAYTEST_VERIFIED_TIER`（2026-10-04，tier 51 → 52，把坑 63 的「唯一划算」判定兑现）**：证据件 = 本机 `~/.gradle/caches/minecraft/net/minecraftforge/forge/1.12.2-14.23.5.2847/stable/39/forgeBin-1.12.2-14.23.5.2847.jar`（FG2.3 的 **MCP 命名 + Forge 合并件**，**免下载**）。实现 = `rewriteForForgeLegacy` 加 `1.12.2` 支 = `applyForgeMCP132` + 新增 **`applyForgeMCP1122`**（在 MCP 层之上再退一层，**8 处** javap 实测差异）：① **Forge 三包在 1.12.2 是旧位置** —— `net.minecraftforge.fml.common.registry.ForgeRegistries`（1.13 才搬 `net.minecraftforge.registries`）、`fml.common.eventhandler.SubscribeEvent`（1.13 才搬 `eventbus.api`）、`fml.common.gameevent.TickEvent`（同 1.13.2，有 `phase` 字段）；② **无 `Minecraft.getInstance()`** ⇒ 静态 `Minecraft.getMinecraft()`；③ **无 `mainWindow`** ⇒ 像素尺寸走公开 int 字段 `Minecraft.displayWidth/displayHeight`、GUI 缩放尺寸走 `GuiScreen.width/height`；④ **截图无 Consumer 变体**：`ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer)`（返 `ITextComponent`）⇒ 模板那条 `t -> {...});` lambda 尾巴整个摘掉（5 参版 1.13.2 才有）；⑤ **`ITextComponent` 无 `getString()`**（只有 `getUnformattedText/getFormattedComponentText/getFormattedText`）⇒ 聊天回包换 `getUnformattedText()`；⑥ **`Entity.getName()` 返 `String`**（1.13 起才返 ITextComponent）⇒ `player.getName().getString()` 收敛成 `player.getName()`；⑦ **实体 id 走 `net.minecraft.entity.EntityList.getKey(Entity)`**（`Entity` 无 `getType()`，1.13+ 才有）；⑧ **`EntityPlayer.capabilities`**（非 `abilities`）、`KeyBinding.getKeyCode()`（非 `getKey()`）、`GuiScreen.mouseClicked(int,int,int)`（非 `double,double,int`）⇒ 分母 `.0` 也去掉。**额外一条结构性降级**：1.12.2 的 `GuiScreen.mouseClicked(int,int,int)` 是 **`protected` + `void`**（1.13 起才 `public boolean`）⇒ 进程内**无法合成点击**，`guiClicked` 改由**真实点击的后端** `PlayerControllerMP.windowClick(windowId,0,0,ClickType.PICKUP,player)`（**public**，正是 `GuiContainer` 里一次真实点击最终调用的容器入口）置位 —— **不是伪造，语义如实写在产物注释里**。**编译验证 = JDK 8 `javac` 对上面那只真构件、两种模式（`temporary_client_tick_driver` + `in_jvm_player_agent`）各 COMPILE_OK**；`newworld` 与 1.13.2–1.18.2 一样保持 **fail-closed**（`FORGE_NO_NEWWORLD_VERSIONS`）。**真机未跑**；另注：**该档有桥件**（BlackBoxPro 发布件含 forge 1.12.2，本仓他处已记），桥路线未在本轮实跑。
- **老平台「最小桥 mod」模板已落地（2026-10-04；第二批把目标从 6 档扩到 **8 个**：`forge 1.7.10–1.12.2` 六档 + **`rift 1.13.2`** + **`modloader 1.6.4`**）**：`generate_playtest_driver driverMode=external_bridge` 在 `(platform,version) ∈ BRIDGE_MOD_TARGETS` 时**附赠** `playtest/bridge/**`（生成器 = `mcp-server/src/generators/playtest-bridge-mod.ts`，**不进 `PLAYTEST_VERIFIED_TIER`、不参与 driver 派发** ⇒ 与 driver 链隔离）。**为什么需要**：`playtest_bridge` 这条路线此前只有 BlackBoxPro 预编译件（覆盖 fabric/neoforge 1.21.1+1.21.11、forge 1.12.2），**1.7.10–1.11.2 / rift 1.13.2 / modloader 1.6.4 一件都没有**。**线协议逐键对齐**（`GET /status` → `{status,version,platform,httpPort,actions,ready}`；`POST /execute` → `{id,status,message,data}`，**HTTP 恒 200**；超时串逐字 `Timeout after 10000ms` ⇒ 工具侧照常映射 `PLAYTEST_TIMEOUT`）⇒ **工具面一行不改**。**逐版本差异全有出处**（本仓 `data/forge_javadoc/<ver>/raw/**` 实页；1.12.2 另有真构件 javap）：① 包名 1.8 换代（1.7.10 = `cpw.mods.fml.*`，1.8.9+ = `net.minecraftforge.fml.*`）；② **注册总线分叉**（1.7.10 = `FMLCommonHandler.instance().bus()`（该档**未** `@Deprecated`）；1.8.9+ 该法已 `@Deprecated`，改 `MinecraftForge.EVENT_BUS`）；③ 读方块（1.7.10 = `World.getBlock(int,int,int)`（**该档没有 `BlockPos`**）；1.8.9+ = `getBlockState(BlockPos)`）；④ `isAir` 参数在 1.9.4 多一个；⑤ 截图**忽略返回值**以规避 1.7.10/1.8.9（`IChatComponent`）↔1.9.4+（`ITextComponent`）的改名。**刻意不读 `TickEvent.Phase`**（语料只给 `valueOf`/`values`，不给枚举常量名 ⇒ 本仓不背书；桥是请求驱动，不需要）。**验证强度分两等**：`1.12.2` = **JDK 8 `javac` 对真构件 `forgeBin-1.12.2-14.23.5.2847.jar` COMPILE_OK**（另核过线协议 9 个键、`ready` 在 tick 线程刷新、`sendResponseHeaders(200,…)`、无残留 `{ok:…}` 信封）；`1.7.10–1.11.2` = **只有 javadoc 出处、未编译验证**（本机无该档构件）。**字段名逐档不同，且有一处「构件 vs javadoc」差异**（六档 javadoc 实页逐页实测 + 1.12.2 真构件复证）：玩家/世界字段在 **`1.10.2 → 1.11.2` 改名**（`thePlayer`/`theWorld` 只属 `1.7.10 / 1.8.9 / 1.9.4 / 1.10.2`；`1.11.2`/`1.12.2` 的 javadoc 就是 `player`/`world`）；游戏目录六档 javadoc 都写 `mcDataDir`，而 `1.12.2` 的 `stable_39` **真构件**是 `gameDir`（⇒ 该档以构件为准）⇒ 模板按这三条分叉后替换，并逐版本写进 `forge/<ver>/knowledge/common/verified-api.md`。**动作 10 个**（第三批补齐：`query_player_state`（含 `health` ⇒ `await health_*` 可用）/ `chat_command` / `screenshot` / `block_at` / `query_inventory_slot` / `query_inventory` / `query_nearby_entities` / `query_chat_history` / `use_item` / `query_screen`），恰好覆盖 `playtest_bridge await` 的 5 个 condition（`inventory_contains`→`query_inventory_slot`、`health_*`→`query_player_state`、`entity_nearby`→`query_nearby_entities`、`chat_message_matches`→`query_chat_history`、`ready`→`/status`）；动作名与 `params` 键名（如 `itemId` 不是 `match`）**以工具源码 `src/playtest-bridge/index.ts` 的 `probe()` 为准**。**逐档可用性不同，不可用的返回带原因的 `failure`（fail-closed，不假绿）**：`1.7.10` 的 `query_chat_history` 未实现（无聊天接收事件页）；`1.9.4–1.12.2` 的 `use_item` 未实现（入口要 `EnumHand`，其常量名本仓无出处）；`rift 1.13.2` 的 `query_chat_history`（Rift 无聊天 listener）与 `use_item`（`PlayerController` 不在 tsrg）均未实现；`modloader 1.6.4`（骨架）全部 fail-closed。**又一处处「构件 vs javadoc」差异（真 jar 编译揪出）**：`Item` 的物品名在 `1.12.2` 真构件里是 `getTranslationKey()`，而 `1.7.10–1.11.2` javadoc 是 `getUnlocalizedName()` ⇒ 模板按版本分叉。**⚠️ 能力天花板 = 「命令级」（别当 driver 用）**：桥发的是**聊天包**、不是键位输入 ⇒ ① 读数与观察可用（位置/血量/方块/背包/实体列表/当前界面/截图）；② **命令级操控**可用（`/tp` `/setblock` `/give` `/summon` `/time` …，受实例 op / 是否开作弊约束）；③ **玩家物理路径测不了**（走位 / 跳跃 / 挖掘耗时 / 碰撞——只有真按键才走得到）；④ GUI 点击不可用（`query_screen` 只能**观察**当前界面，点不了按钮）。⇒ **「命令级操控 + 观察」通了，「玩家级操控」没通**；要做玩家物理级验证只能在 `PLAYTEST_VERIFIED_TIER` 里有 driver 的档上做。**⚠️ 截至 2026-10-05，本仓自建模板的真机状态：从未跑过** —— forge 1.12.2 上跑绿的那条桥路线用的是 **BlackBoxPro 第三方预编译件**（见平台表 Forge 1.12.2 行右列），不是本仓产物；**`liteloader 1.12.2` 上桥路线也没跑**（`BRIDGE_MOD_TARGETS` 不含 `liteloader`，实例侧零桥痕迹：`run/mods/1.12.2` 空、无 `evidence-bridge/`）⇒ 本模板目前只有**编译层**证据（`forge 1.12.2` 对真 `forgeBin` COMPILE_OK，其余档为签名替身）。**验证强度的两腿口径（引用前看清）**：`forge 1.12.2` = **真构件**；`rift 1.13.2` = **Rift 侧真构件**（JitPack `Rift-1.0.4-106-dev.jar`，`RIFT_REALJAR_EXIT=0`）＋ **MC 侧替身**（本机无 1.13.2 构件）；`forge 1.7.10–1.11.2` / `modloader 1.6.4` = **全替身**。

  **第二批：`rift 1.13.2`（真模板）与 `modloader 1.6.4`（骨架）** ——

  - **`rift 1.13.2` = 真模板，逐名有出处**。入口换成 Rift listener（`implements org.dimdev.rift.listener.client.ClientTickable`，`public void clientTick()`（**无参** ⇒ 自己取单例），类名写进 `riftmod.json` 的 `listeners`）；元数据出 `playtest/bridge/riftmod.json`。**MC 侧名字全部来自本仓 `data/forge_1.13.2/mappings/{joined.tsrg,methods.csv,fields.csv}` + `extracted/config/{constructors.txt,static_methods.txt}`** —— 该档 MCP 快照 `20180921-1.13` 与 `rift/1.13.2/scaffold` 钉的 `snapshot_20180921` **是同一个快照**（同一 MC 版本共用一套可读名，与加载器无关）：`Minecraft.getInstance()`（`func_71410_x`，javadoc 逐字 “Return the singleton Minecraft instance for the game”）/ `.player`（`field_71439_g`）/ `.world`（`field_71441_e`）/ `.gameDir`（`field_71412_D`）；`player.posX|posY|posZ|rotationYaw|rotationPitch|onGround|getHealth()`；`EntityPlayerSP.sendChatMessage(String)`（`func_71165_d`，javadoc “Sends a chat message from the player.”）；截图 `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)`（**静态性由 `static_methods.txt` 正面证明**）+ `mainWindow.getFramebufferWidth()/getFramebufferHeight()`；读方块 `World.getBlockState(BlockPos)` / `IBlockState.getBlock()` / `Block.isAir(IBlockState)` / `new BlockPos(int,int,int)`（`constructors.txt:46030`）。**两处本档特有的缺口（生成物里逐条披露，不猜）**：① **`Minecraft.getInstance()` 的 `static` 性本仓证不出** —— 1.13.2 的 extracted 数据不含修饰符，而 `config/static_methods.txt` 经实测是**部分提示表**（覆盖 844 类、含 **15 个 Minecraft 方法**，却**漏掉确定静态的 `func_71410_x`**）⇒ 它**不能当反证**；另注本仓 1.13.2 forge-docs 语料用的是**旧快照名** `Minecraft.getMinecraft()`（同一 SRG、class 限定调用）⇒ 换映射快照要改名。② **`block_at` 只回 translation key（`tile.stone` 形），不回注册名** —— 1.13.2 的方块注册表字段（`Block.REGISTRY`，SRG `field_149771_c`）在 `joined.tsrg` 里**根本不存在** ⇒ 无背书；返回里带 `"idKind":"translationKey"` 明示。**验证强度 = JDK 8 `javac -encoding UTF-8` 对签名替身 COMPILE_OK**（⚠️ **替身只证签名形状、不证类存在**）。**依赖源已死**：Rift 官方 maven `dimdev.org`（含去 www）实测 **DNS ENOTFOUND**（不是 404）⇒ 编译需自备 Rift API jar；JitPack `com.github.DimensionalDevelopment:Rift` 有 `1.0.4-106` 但**有无 `dev` classifier 未核**、与 wiki 记的 `1.0.3-45` **不等价**；另 Rift 的 MultiMC 组件 JSON 写 `requires: {equals: "1.13"}` ⇒ 「**Rift 是否官方支持 1.13.2（vs 仅 1.13）**」**未核实**。出处表见 `rift/1.13.2/knowledge/common/bridge-api.md`。
  - **`modloader 1.6.4` = 骨架（协议半边真、MC 半边全 `TODO(未核实)`）**。类 `extends BaseMod`（`package net.minecraft.src`），HTTP 半边 + `ModLoader.setInGameHook(this, true, false)`（**本档唯一有出处的一项**）是真的 ⇒ `/status` 通；**MC 半边（客户端单例 / 玩家与位置字段 / 发聊天 / 截图 / 读方块）在本仓没有任何来源**（该档无映射、无上游文档、工具链不覆盖，ModLoader 自 MC 1.6.2（2013）停更）⇒ 全部收进内部类 `Mc` **逐条 `throw`** 并点名「未核实」，`/execute` **一律 fail-closed**（返回带 `TODO(未核实)` 的 failure，**不是假绿**）。回调方法名 `onTick()` 也是**占位**（safe-api 没给回调名）。**验证强度 = JDK 8 `javac -encoding UTF-8` 对 `BaseMod`/`ModLoader` 签名替身 COMPILE_OK**（⚠️ 替身只证形状）。补齐清单（5+2 项）在生成物 `README.bridge.md` 与本档 `knowledge/common/safe-api.md`。
  - **编码坑（三个平台通用，实测踩过）**：生成物含中文注释，本机 Java 编译器默认 **GBK** ⇒ 不加 `-encoding UTF-8` 会报 `unmappable character for encoding GBK`。
  - **顺带修掉一个工具面缺口（pit 76，并发会话记录）**：`generate_playtest_driver` 的输入 schema 此前是 `z.enum(["forge","neoforge","fabric","quilt"])`（**漏 `liteloader`**，而生成器本体 `PLAYTEST_PLATFORMS` 已含它）⇒ 现改为与 `PLAYTEST_PLATFORMS` 同集（`forge/neoforge/fabric/quilt/liteloader/rift/modloader`）。实测 `--platform=liteloader --version=1.12.2` 由 `INVALID_ENUM_VALUE` 变为 `success:true`。

  **真机未跑**（按人在环：装 jar / 跑 Gradle 由用户确认后执行）。
**老平台按「能做驱动 / 能做桥 / 都不行」分档（2026-10-04；「能桥」面本轮共下推 5 档 + 复核 1 档）**：**能 driver** = 有可用 Gradle 载体 + 构件可得 —— `forge 1.12.2–1.19.4`、`fabric 1.14.4–1.19.4`、`quilt 1.18.2/1.19.4`、**`liteloader 1.12.2（hybrid）`**（已进 tier = 53）；**能桥** = ① 有现成桥件（BlackBoxPro 发布件）—— `fabric`/`neoforge 1.21.1` + `1.21.11`、`forge 1.12.2`；② **能自建桥**（判据 = **该档 tick 钩子有出处** —— 桥**不需要** `gradlew runClient`，那是 driver 的要求）—— `forge 1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2 / 1.12.2`（**模板已落地，桥件下限从 1.12.2 推到 1.7.10**）、**`rift 1.13.2`**（**模板已落地（真模板，逐名有 1.13.2 MCP 快照出处）** —— tick 钩子 `org.dimdev.rift.listener.client.ClientTickable#clientTick()` 本仓早有出处，见 `rift/1.13.2/knowledge/common/listeners.md`；**卡点不是坐标而是 dev jar 来源** —— 原 maven `dimdev.org` 2026-10-04 实测 **DNS ENOTFOUND**，JitPack 有 `com.github.DimensionalDevelopment:Rift`（release `1.0.4-106`）但**有无 `dev` classifier 未核**）、**`liteloader 1.8.9 / 1.10.2`**（tick 出处**本轮取证受阻**：上游 GitLab 项目 404 + 无 GitHub 镜像 + 本仓无 jar，档内明令禁抄 1.12.2；**替代设计** = 已核的 `HUDRenderListener` 渲染回调当泵，同线程 ⇒ 原理可行但**未实测**）、**`modloader 1.6.4`**（tick ✅ `setInGameHook`，但**还差 5 项接口出处**：客户端单例 / 玩家对象与位置字段 / 发聊天 / 截图 / 读方块签名 ⇒ **本轮已落地为「骨架」**：协议半边真 + MC 半边 5 项 `TODO(未核实)` 逐条 throw / fail-closed；且无 Gradle ⇒ 手工 javac+打 jar）；**仍都不行** = `modloader 1.2.5 / 1.5.2`（档内空表且明令禁抄 1.6.4；ModLoader 自 1.6.2 停更 ⇒ 官方出处无稳定落点）、`forge ≤1.6.4`（本仓 forge 树底就是 1.7.10，该区段**零出处**，不猜）。**「都不行」怎么办的头脑风暴**（5 条路线、各自的取证前置与隔离边界）写在社区短文**坑 74**；逐档复核读数与「受阻」证据记在各档 `knowledge/common/` 表尾。
- **`forge 1.7.10–1.11.2` / `modloader` 全档仍不补 driver（2026-10-04 复核维持；但 forge 那五档已可走桥 —— 见上一段的「最小桥 mod」模板）**：本机 `forge_gradle` 缓存**从 1.13.2 起**（`~/.gradle/caches/minecraft` 只有 1.12.2 那一份），且 1.7.10 **没有 `BlockPos`**（1.8 才加）⇒ 事件/GUI/渲染面差两代，等于**另写一套 driver**，不是再写一张改写表；那五档规则树本身是故意的 3 条薄档、无 scaffold。**`modloader 1.6.4 / 1.2.5 / 1.5.2` 结构上不可能**：该平台**没有 Gradle 工程形态**（MCP + Eclipse），而 driver 整条链路建立在 `gradlew runClient` 上。逐档口径见社区短文坑 63。**「老平台另起一套游玩方式」的调研结论见社区短文坑 74（与现有 driver/桥链隔离）；其中「路线 1 自建最小桥」已于同日实现，见坑位 75。**
- **远古档 scaffold 的现状是「设计如此」，不是漏建（2026-10-03 实扫，与各档 `pack.meta.json` 自述一致）**：forge `1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2` **无 scaffold**（各档 `status:"ready"` 但无 `scaffold` 字段，note 写明「薄档：javadoc + `search_forge_docs`；仅 00/01/09；禁止邻档 API」）；liteloader `1.8.9 / 1.10.2` 与 modloader `1.2.5 / 1.5.2` 是 `status:"draft"` + `scaffold.mode:"source-only"` + `buildVerified:false`，gaps 逐字写着「**无 Gradle 工程形态（MCP + Eclipse），给它造 gradlew 属造假**」「规则文件为未核实占位 ⇒ 降 draft」「`download_official_mdk` → `MDK_NOT_PINNED`（LiteLoader 禁止再分发 / 工具链无 ModLoader MDK 通道）」⇒ **不可补**；能补的两档已补 —— liteloader `1.12.2`（`scaffold/hybrid` = `apply plugin: 'net.minecraftforge.gradle.liteloader'` 的真 Gradle 工程，因为 FG2.3 仍支持 1.12.2）与 modloader `1.6.4`（source-only 样本）；rift `1.13.2` 是 `mode:"reference"` **半套**（`build.gradle` 无 `buildscript{}`、无 wrapper/settings、`libs/` 需用户自备 rift dev jar，`MDK_NOT_PINNED`）⇒ 只有拿到插件坐标的用户能补完，本仓不替它猜。
- **`newworld` 注入曾整段失效（2026-10-03 发现并修复）**：`rewriteForForge()` 里那段 `s.replace(<fabric fail-closed 文案>, <forge createFreshLevel>)` 的**搜索串与 `javaSource` 模板逐字不符**（模板已改成 `本档（fabric 基表，≤1.21.x）…`）⇒ forge 1.20.x / neoforge 1.20.x–1.21.x / fabric·neoforge 26.x 的 `newworld` **都退回了 fail-closed 桩**。修复搜索串后，26.x 那份替换块（`applyNewworld26xx`）才第一次真正被执行并**当场编译不过**——它假设的 `LevelSettings(String,GameType,LevelSettings$DifficultySettings,boolean,WorldDataConfiguration)` **不存在**（javap 实测 26.1.2 仍是 7 参 `(String,GameType,boolean,Difficulty,boolean,gamerules.GameRules,WorldDataConfiguration)`，且 `gamerules.GameRules` **无无参构造** ⇒ 需传 `FeatureFlags.VANILLA_SET`）。两者都已按实测签名改正并 javac 复验（fabric 26.1.2 / neoforge 1.20.6 / 1.21.1 / 26.1.2 全绿）。
- **自动进世界**用 vanilla quick play（Loom/ForgeGradle 的 runClient `programArgs "--quickPlaySingleplayer"`）；1.20.4 / 1.21.1 / 1.21.3 等档**不要**让 driver 自己调 `IntegratedServerLoader.start`（会把客户端冻在“等服务器载入”循环，jstack 已验证）。
- **26.1.2 的 quickPlay「看起来失效」= 两道模态屏挡路，不是参数没被消费（2026-10-03 定因，**推翻**本条旧结论）**：命令行确实带上了 `--quickPlaySingleplayer playtest_demo`（`-Dfabric.dli.config` 那一行的 java 命令行逐字读到），`Main.getQuickPlayVariant` 也把它解析成 `GameConfig$QuickPlaySinglePlayerData`（javap 实测 `net/minecraft/client/main/Main.class`）。真正卡住的是**先于回调出现的两张屏**：① **首次启动的 `AccessibilityOnboardingScreen`（“Welcome to Minecraft! … Narrator”）** —— `Minecraft.addInitialScreens` 先跑它，`buildInitialScreens`（内含 `QuickPlay.connect` 回调）要等它被关掉才轮得到 ⇒ 只要 `run/options.txt` 是 `onboardAccessibility:true`（新实例默认）或**根本没有这个键**，**任何** quickPlay 参数都不会有反应（这正是当时 `--quickPlayMultiplayer` 阳性对照也零反应的原因）；置 `onboardAccessibility:false` 后 quickPlay 立刻生效。② 关掉引导屏后冒出 **“Create a backup before upgrading this world?”**（`WorldOpenFlows.openWorld` 对**旧 DataVersion 存档**发的确认框）—— 它与引导屏一样**等输入**，quickPlay 就停在这一屏；点一次 “I know what I'm doing!”（存档就地升级，日志 `Starting upgrade for world "…"` → `Upgrade done`）后该存档版本与游戏一致，**之后每次都是无人干预直进世界**（实测 `Starting integrated minecraft server version 26.1.2` → `Player744 joined the game`）。⇒ 26.1.2 的 quickPlay **可用**；「参数没被消费」作废。跨版本复用存档时，首次进世界要么预先把存档升到目标版本，要么接受一次人工确认。
- **26.1+ 走无桥 driver 的前置 = 工程自带 fabric-api**（2026-10-03 实测）：`fabric/26.1.2` scaffold 没带，driver 用的 `ClientTickEvents` / `ClientReceiveMessageEvents` 编译不过；加 `implementation "net.fabricmc.fabric-api:fabric-api:0.155.3+26.1.2"` 即可（26.1 是去混淆档，Modrinth 上 `fabric-api` 的 `+26.1.2` 构建在，实测 latest = `0.155.3+26.1.2`；**用 `implementation` 不是 `modImplementation`**）。
- **“Gradle requires JVM 17 or later … configured to use JVM 8”也可能是 JDK 装坏了，不是 JAVA_HOME 没设**（2026-10-03 实测）：`…\jdk25\…` 的 `lib/` 只剩一个 `modules`（`jvm.cfg` 缺失）⇒ `java.exe` 直接报 `could not open …\lib\jvm.cfg`，Gradle 于是回落到 JVM 8。判据 = **先单独跑 `%JAVA_HOME%\bin\java.exe -version`**，能打出 `openjdk version "25…"` 再谈 Gradle；重解压即愈（本次从留存 zip 重解压修复）。
- **桥路线进世界用桥自己的动作，别依赖程序参数**：BlackBoxPro 提供 `create_world(worldName, gameMode, difficulty, allowCommands, generateStructures, bonusChest, seed)` 与 `join_world(worldName)`（`ActionCatalog.kt` 的 `register(...)` 逐字）。neoforge 1.21.11 实测：改用 `join_world{worldName:"playtest_demo"}` 立刻返回 `state=in_world` 并正常游玩 ⇒ **桥路线的推荐进世界姿势是 `join_world` / `create_world`**（当时读到的「quickPlay 参数传到了但没用」是上面 ① 那条遮挡造成的假象，**已作废**：该实例同样受首次启动引导屏影响）。
- **NeoForge 桥的 KotlinForForge 必须取 Modrinth 的 `-all.jar`（2026-10-02 实测，易踩）**：maven 坐标 `thedarkcolour:kotlinforforge-neoforge:5.8.0` 与 `thedarkcolour:kotlinforforge:5.8.0` **逐字节相同**（同 `sha256 A5024435…`, 6 269 705 B），且**都不是 mod jar** —— 包内 12 条目全是 `META-INF/jarjar/*.jar`，`MANIFEST.MF` 只写 `FMLModType: LIBRARY`，**无 `services/` 语言加载器**；装上去 FML 直接拒启：`Missing language loader kotlinforforge wanted by jar(mods/BlackBoxPro-neoforge-1.21.11-2.2.4.jar)`。真正的分发件在 Modrinth（slug **`kotlin-for-forge`**，注意不是 `kotlinforforge`），命名 `kotlinforforge-<ver>-all.jar`，内含 `META-INF/jarjar/thedarkcolour.kfflang-*.jar`（即语言加载器）；装 `kotlinforforge-6.3.0-all.jar` 后日志出现 `Found language provider kotlinforforge, version 6.3.0` + `KotlinModContainer … BlackBoxProNeoForge` + 全量 action 注册，桥 HTTP 200 `platform=neoforge, actions=116`。
- **`await entity_nearby` 的 `type` 语义要在靠近目标处用（2026-10-02 复测）**：`type` 已确实透传（neoforge 桥实例实测：带 `type` → `Found 0 entities`、不带 → `Found 20 entities`，`lastDetail.typeCount` 逐字反映）。但**客户端实体只在追踪范围（≈48 格）内可见** ⇒ 目标不在附近时带 `type` 会**正确地**超时（`PLAYTEST_TIMEOUT` + `typeCount:0`），别读成「type 又丢了」。
- **fabric 26.1.2 的构建工具链是另一套（2026-10-02 实测通过；2026-10-03 补 wrapper）**：`Loom 1.17.21` 的 `runtimeElements` 声明 `org.gradle.plugin.api-version=9.5.0` ⇒ **Gradle 9.2.1 会报 no matching variant**，必须 **Gradle ≥ 9.5**；`java.toolchain` 要 **JDK 25**（`develop_porting_index` 的 1.21.11→26.1 同款要求）。三者齐后 `gradlew build` `BUILD SUCCESSFUL in 2m52s`。**本仓 `fabric/26.1.2/scaffold` 现自带 wrapper 四件套（Gradle 9.7.1，2026-10-03 按上游 `fabric-example-mod` 分支 26.1 实读值补入）** ⇒ 复制 scaffold 即可直接 `./gradlew build`，不必再借 wrapper；loom 钉值同步刷新为上流现值 `1.18-SNAPSHOT`。
- **`scan` 的方块采样是「玩家脚边 −4..+8 格的薄层」**（默认 `stride=4`）：村庄在地面 ⇒ 计划必须在 `goto` 之后、`scan` 之前写 **`land max=<n>`**（等 `isOnGround`）再扫；让角色悬停在空中扫地面**必然 0 命中**（实测 quilt-1.21.10：hover 在 y≈140 → `blocks hits=0`；同点落地后 13–17 命中）。`land` 超时（区块缺失、角色一直坠落）判红——这是**故障信号不是假红**。
- **重活互斥纪律**：同一实例同时只允许一件重活（起游戏 / 构建 / 替换存档）。并发会在 U 盘级 I/O 上互相饿死，症状 = 服务器 `Can't keep up! … ticks behind` + 抵达点区块未就绪 + 角色坠入虚空 → `scan=0`（**不是**驱动缺陷）。替换 `run/saves/<世界>` 必须在确认该实例无 java 进程后进行。
- **`newworld`（造世界）已取证并取代「先手建存档」**（2026-10-03 实测，fabric + neoforge 26.x 五档共用）：step 语法是 **`newworld name=<存档目录名>`**（**具名参数**；写成 `newworld <名>` 会得到 `[QA] ERROR: newworld：既未给 name= 且 WORLD 也为空`）。实现 = `client.execute(() -> createWorldOpenFlows().createFreshLevel(name, new LevelSettings(name, GameType.CREATIVE, new LevelSettings.DifficultySettings(Difficulty.NORMAL,false,false), true, WorldDataConfiguration.DEFAULT), WorldOptions.defaultWithRandomSeed(), WorldPresets::createNormalWorldDimensions, null))` —— **必须 `client.execute` 丢到渲染线程下一 tick**（`createFreshLevel` 内部走 `loadWorldDataBlocking`，同步阻塞渲染线程）。它让**空实例**（没有 `run/saves`）也能一枪跑通村庄剧本；仍 fail-closed 的是 **fabric ≤1.21.x / quilt / neoforge ≤1.21.x 的 fabric 基表**（缺 `createAndStart` 的 `LevelInfo`/`GeneratorOptions` 构造面），那些档请照旧 `enterWorld=<名>` 或 `--quickPlaySingleplayer`。⚠ **跨 MC 版本别搬存档**：旧 `DataVersion` 的存档会被 `WorldOpenFlows.openWorld` 弹「Create a backup before upgrading this world?」挡住 quickPlay（本档第一轮就踩过，见坑位 41）。
- **driver 生成物的两个 `<runId>` 占位符必须都替换（2026-10-03 实测，坑一次）**：除 `EVIDENCE_DIR` 外还有**独立**的 `PLAN_FILE`（并**不**由前者拼出）。只替一处 ⇒ 驱动能进世界、`state.json` 也落对，但热载剧本读的是字面量 `playtest-evidence/<runId>/plan.txt` ⇒ `Path.of` 在 Windows 抛 `InvalidPathException: Illegal char < at index 18`，然后**静默回落到内置 `PLAN`**（症状：你写的 19 步一行没跑，日志里却是 `mark: village:fly-and-probe`）。正规做法是给 `generate_playtest_driver` 传 **`evidenceDir=`**（生成器两处同源），别事后替换。
- **NeoForge 26.x 的 `FMLEnvironment` 只有 `getDist()` 方法**（2026-10-03 javap 实测 `fancymodloader:loader:10.0.36.jar`：全部成员就是 `public static Dist getDist()` + `public static boolean isProduction()`）：写 `FMLEnvironment.dist` **编译不过**；正解 `FMLEnvironment.getDist().isClient()`（`net.neoforged.api.distmarker.Dist` 的 `CLIENT`/`DEDICATED_SERVER` 与 `isClient()`/`isDedicatedServer()` 均已核）。另注：`FMLEnvironment` / `Dist` / `Mod` **不在** `neoforge-<ver>-universal.jar` 里，`SubscribeEvent` / `IEventBus` 也**不在**那儿（在 `bus-<ver>.jar`）—— `javap` 找不到 ≠ 该版本没有该类。
- **NeoForge 26.1 / 26.1.1 / 26.3 上游只有 beta 件（2026-10-03 实测）**：`https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml` **可达**（1 771 个版本；旧注释称其 404 是错的）。按 pom 的 `net.neoforged:neoform:<MC 三段>-<n>` 依赖逐条核出：`26.1.2 → 26.1.2.114`（release）、`26.2 → 26.2.0.88`（release）、`26.1 → 26.1.0.19-beta`、`26.1.1 → 26.1.1.15-beta`、`26.3 → 26.3.0.43-beta`。⇒ 这三档只能用 beta，**不是本仓漏抓**。
- **「上游缺件」的判据必须单独 curl 一次那个 URL（2026-10-03 实测，差点误判）**：fabric 26.2/26.3 的 `fabric-api` 子模块（`fabric-particles-v1` / `fabric-object-builder-api-v1` / `fabric-client-gametest-api-v1` / `fabric-sound-api-v1` …）构建时报 `Could not GET …pom`，逐个复验却**都是 HTTP 200** —— 那是**瞬时网络错误**（本机实测：与正在跑的游戏客户端抢带宽时必现，重跑即过）。同类还有 `libraries.minecraft.net` 的 `Remote host terminated the handshake`（TLS 瞬时失败）。**别把瞬时失败写进结论**。
- **MC 26.2 / 26.3 需要 ModDevGradle ≥ 2.0.148（2026-10-03 实测）**：本仓 `neoforge/26.1/scaffold` 钉的 **2.0.144** 在 MC 26.2 / 26.3 上 `gradlew build` **稳定失败**（`Node action for recompile failed` → `java.io.IOException: Compilation failed`，往上翻是编译 MC 自身源码的可见性错 `HolderSet$1.contents()`），重试 5 次全红；换 **2.0.148**（`https://maven.neoforged.net/releases/net/neoforged/moddev-gradle/maven-metadata.xml` 的 `<release>`）后**一次通过**（`BUILD SUCCESSFUL in 5m 50s`）。`26.1 / 26.1.1 / 26.1.2` 在 2.0.144 下正常。⇒ 跑 26.2/26.3 请自行升 MDG（该 scaffold 是 26.1 档，本仓未改它的钉值）。
- **NeoForge 建实例报 configuration-cache 序列化错时，真因在 `Caused by`（2026-10-03 实测）**：日志只有 4 行就 `BUILD FAILED`（18 s），首句像 `Configuration cache state could not be cached: field artifactManifestEntries of task :createMinecraftArtifacts …`，**真因**是紧随其后的 `Caused by: Could not resolve all artifacts for configuration ':neoFormRuntimeDependenciesCompileClasspath'` → `Could not download loader-11.0.5.jar` / `sponge-mixin-0.17.0+mixin.0.8.7.jar` / `jtracy-1.14.38.jar`（`Could not GET` / `Could not HEAD`）。⇒ **判 MDG 构建失败先看 `Caused by:` 的下载项**。26.1 / 26.1.1 / 26.3 走 beta 线，依赖 `fancymodloader:loader:11.0.5`（已缓存的 26.1.2 线是 `10.0.36`）⇒ 这三档要多下一批先前没碰过的 jar，本机网络上就容易翻车；**构建重试 3–5 次即过**。另外 MDG 的 `:createMinecraftArtifacts` 单步 800+ 秒是正常的（实测 `downloadServer` 805 s），别据「很久没输出」就判挂。
- **强杀构建会在 `fabric-loom` 缓存留下「已弃主」锁，下一次构建的 daemon 会永久停在锁条件上（2026-10-03 jstack 定因）**：症状 = 构建日志卡在 `FOUND existing cache lock file (ACQUIRED_PREVIOUS_OWNER_DISOWNED), rebuilding loom cache` 之后**一小时无输出**，而 `jstack` 显示 daemon 主线程 park 在 `AbstractQueuedSynchronizer$ConditionObject`、wrapper 停在 `DaemonClient.monitorBuild → SocketConnection.receive`（两边都在等，没人干活）。**处置**：起构建前删掉 `C:\Users\<u>\.gradle\caches\fabric-loom\*.lock`（及实例 `.gradle` 下的 `*.lock`）即可立即恢复 —— 本轮 fabric-26.3 就是这么从「卡 2 小时」变「6 分钟 BUILD SUCCESSFUL」的。⇒ 结论：**别在构建中途杀 JVM**；真杀了就先清锁。
- **26.1 Loom 要 Gradle ≥ 9.7**（2026-10-03 实测）：`net.fabricmc.fabric-loom:1.18.2` 的 `runtimeElements` 声明 `org.gradle.plugin.api-version=9.7.0` ⇒ 用缓存的 Gradle **9.5.1** 会报 `No matching variant … consumer needed '9.5.1'`；换 **9.7.1**（本机已缓存）即过。⤴ 与「Gradle ≥9.5 + JDK 25」那条并列：**9.5 够跑 1.17.x loom，9.7 才够跑 1.18.x loom**。
- **fabric-api 的 26.1.x 线共用一个件**（2026-10-03 实测）：Modrinth 上 `0.155.3+26.1.2` 的 `game_versions` **同时**声明 `26.1` / `26.1.1` / `26.1.2` ⇒ 三档填同一坐标；`26.2` 用 `0.161.0+26.2`、`26.3` 用 `0.161.0+26.3`（逐档在 `maven.fabricmc.net` 复核过 `<version>+26.2` / `+26.3` 线各 35 个）。
- **driver 的 `shot` 预算与证据落盘都有时序陷阱（2026-10-03 实测，两处都修了）**：① 截图是**异步写盘**，原 `shot` 步只等 **60 tick（3 s）**，U 盘级 gameDir 上「请求 → 落盘」要 4 s+ ⇒ 报 `screenshot_timeout` 而 PNG 其实已写出（本档实测）——生成器已把预算提为常量 **`SHOT_WAIT_TICKS = 200`（10 s）**。② 驱动在 `finish()` 里**先打 `[QA] DONE/ERROR`、再写 `exit-code.txt` / `state.json` / `qa.log` / `rounds.jsonl`** ⇒ 编排脚本一看到 DONE 就杀 JVM 会把写盘**打断**，读回的证据还停在上一次失败轮（本轮踩过）；**杀进程前留 ~10 s** 让证据落盘。③ 另外 `latest.log` 只在新客户端启动时才被截断 ⇒ 轮询判轮次前先清空该文件，否则会读到上一轮的 `[QA] ERROR`。
- **`cmd` 步会覆盖「最近一条游戏消息」，用它的顺序要小心（2026-10-03 实测）**：`goto parsed` 靠「最近一条 `/locate` 回执」拿坐标，而驱动只保留**一条** `lastGameMessage` ⇒ 在 `cmd locate …` 与 `goto parsed` **之间插任何 `cmd`**（本轮插了 `forceload`，回执变成 `Marked 35 chunks … to be force loaded`）都会让解析等到超时（`goto_parse_failed`）。**处方：把 `forceload` / `time set day` 这类 `cmd` 全部排在 `cmd locate` 之前。**
- **飞抵后落不落地取决于区块是否就绪：加 `forceload` + `land`（2026-10-03 实测）**：`goto` 用飞行抵达后若目标区块**尚未加载**（慢盘 + 整合服追帧），角色会**直接坠入虚空**（实测 `y` 落到 `-233`，`state.json` 读回 `y=-851`），随后 `scan blocks hits=0` 假红。处方（本档跑绿的那份剧本）= `cmd forceload add <x1> <z1> <x2> <z2>` → `wait 800` → `cmd locate` → `goto parsed …` → **`land max=1200`** → `wait 200` → `look` → `scan`。注意 `land` 步超时文案原先**硬编码写「200 tick」**，即使传了 `max=` 也照写（生成器已改成回显实际值）。
- **世界供给**：单机存档需 `allowCommands=1`（`/locate` 需要）；跨加载器可复用**同 MC 版本**的 `run/saves/<name>`（客户端会按需升级旧版存档）。
- **关客户端**要按命令行精确杀真身 JVM（含 `-Dfabric.dli.config` / `-Dneoforge...` 的那个 java 进程），只杀 `gradlew` wrapper 会残留客户端并锁住存档（`session.lock`）。
- 游玩自测的**驱动文件测完必须撤除**（`playtest/REVERT.md`），证据只留授权根，不入正式实例 / 正式分支。

[[详细口径单源：`community_knowledge/authored/ingame-playtest-automation.md`（桥契约、坑位清单、意图空间定稿）]]


### 后半 loop 教程：三条路线，逐步跑通

> 本节回答"**从零怎么把游戏跑起来、让 agent 在里面自己玩并留下证据**"。逐档取证与坑位编号以 `community_knowledge/authored/ingame-playtest-automation.md` 为准（其「最小复现路径」是 A/B/C 三档的完整命令序列，「意图空间」是意图表单一真源）；本节把散在各处的步骤与运维要点集中成可照抄的教程。

**三条路线怎么选**：

| 路线 | driverMode / 工具 | 覆盖 | 适合 | 主要代价 |
| --- | --- | --- | --- | --- |
| ① 有桥 | 桥 mod + `playtest_bridge` | BlackBoxPro 预编译件（fabric/neoforge 1.21.1+1.21.11、forge 1.12.2）**或**本仓自建最小桥（8 目标 = `forge 1.7.10–1.12.2` + `rift 1.13.2` + `modloader 1.6.4`，`generate_playtest_driver driverMode=external_bridge` 附赠；**rift 是真模板，modloader 只到骨架**） | 到手最快、动作集大 | 版本覆盖窄；自建桥动作只有 4 个；桥无鉴权 ⇒ 只本机短会话 |
| ② 无桥剧本 | `generate_playtest_driver driverMode=temporary_client_tick_driver` | 已验证档出真 driver；其余档结构壳 | 确定性回归 / CI 复现 | 要装驱动 + 供世界 |
| ③ 无桥意图会话 | `driverMode=in_jvm_player_agent` + `playtest_intent` | 真执行器覆盖 = `PLAYTEST_VERIFIED_TIER`（生成器内表，随取证扩面，**正文不数档**；表外档只出菜单契约 + 结构壳） | agent 实时决策、"选错→判红→换意图" | 观测粒度 = 每条意图一次；v1 `goto` 无寻路 |

#### 路线 ① 有桥（最快）

1. **授权**：`MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<绝对路径>`（三通道与禁令见根 `AGENTS.md`「人在环例外：游玩自测」）。
2. **装桥**：BlackBoxPro 对应端 jar + 依赖（fabric 端需 fabric-api 与 FLK）；**来源/版本/sha256 记账**，jar 只进授权根。
3. **起游戏 → 探活**：`playtest_bridge action=status` ⇒ `ready=true` 才算"已进世界"（`actions` 每档不同：1.21.1 实测 114、1.21.11 116）。
4. **进世界**：`execute create_world` / `join_world` —— 建世界要几十秒，**响应超时 ≠ 失败**（实测超时后世界里其实已建好）。
5. **驱动**：动作序列由 `generate_playtest_driver driverMode=external_bridge` 出（`playtest/actions.json` + 后置条件 + 证据约定）；单步 `execute`，复合动作 `batch` + `delay`，"等条件"用 `await`（桥没有 `wait_until`；超时映射 `PLAYTEST_TIMEOUT`，**不得塌成"没失败"**）。
6. **判读**：`inspect_playtest_evidence`（三态 `present|absent|unreadable`）+ `calls.jsonl` + 截图；失败 → 改码 → `mc-build-mod` 重建 → 重跑。

#### 路线 ② 无桥剧本 driver（面最广）

1. **建工程**：把对应档 scaffold 拷到 `<ROOT>/<平台>-<版本>` —— **工程目录即游戏根**（`run/` 就是 gameDir，不改 runDir DSL）。JDK 分线：1.20.1 线 JDK 17、1.21.x 线 JDK 21。
2. **关失焦暂停（必做）**：`<gameDir>/options.txt` 写 `pauseOnLostFocus:false` —— 否则按键位移恒 `0.00`（强杀进程时 MC 不会自己写这份文件，得手建）。
3. **生成驱动**：`generate_playtest_driver{platform, version, driverMode:"temporary_client_tick_driver", enterWorld:"<存档名>" 或留空, evidenceDir:"<授权根内绝对路径>", plan:[…] 或 scenario:"smoke"|"village"}` ⇒ `PlaytestQaDriver.java` 放进 `src/main/java/<pkg>/playtest/`，客户端入口加一行 `PlaytestQaDriver.register();`。
4. **供世界**：`<gameDir>/saves/<存档名>/level.dat` 必须存在 + `allowCommands=1`（`/locate` 等 `cmd` 类步骤需要）—— 做法见下面「运维散件」。
5. **跑**：`gradlew build` → `gradlew runClient`；日志里程碑 `[QA] driver registered` → `[QA] open world requested` → `[QA] ROUND 1 START` → `[QA] DONE ::` / `[QA] ERROR:`。
6. **热载**：改动作/断言/坐标只改 `<evidenceDir>/plan.txt`（同一进程内开新一轮，**不重启游戏**）；只有 driver/被测 mod 的 Java 源码变了才重建重启。
7. **判读 + 撤除**：同路线 ① 的判读；收工按 `playtest/REVERT.md` 删驱动与调用行（**绝不提交**）。

#### 路线 ③ 无桥意图会话（agent 实时下意图；详细）

> 与路线 ② 的关系（**别读成两条并行线**）：同一个驱动、同一个解释器；意图只是"展开成原语子计划"的步骤，外层剧本退化成一条 `waitintent` 守候环。同一 tick 只有一个计划在跑。

1. **前置**：同路线 ② 的 1–2 步 ＋ **已验证档**（真执行器覆盖 = `PLAYTEST_VERIFIED_TIER`，唯一真源、随取证扩面——正文不数档；表外档只出菜单契约 + 结构壳，不会假装能跑）。
2. **进世界**：按该档配方 —— 冻结族（`fabric 1.20.4 / 1.21.1 / 1.21.3`）用 vanilla quick play（`build.gradle` 的 loom runs 加 `programArgs "--quickPlaySingleplayer", "<存档名>"`）且 `enterWorld` **留空**；`1.21.11` 线可直接 `enterWorld:"<存档名>"`。
3. **生成**：`generate_playtest_driver{platform:"quilt", version:"1.21.11", driverMode:"in_jvm_player_agent", capabilityProfile:"operator"|"creative"|"strict_survival", evidenceDir:"<授权根内绝对路径>", budgetTicks:36000}` ⇒ 出五件产物 ＋ **`playtest/intent-menu.json`**（菜单契约）；默认剧本 = `mark in_jvm:intent-session` ＋ `waitintent max=6000`。
4. **装 + 跑**：同路线 ②；到 `[QA] ROUND 1 START` 后，进世界的第一条 `waitintent` tick 会把 `state.json`（观测面）补种出来。
5. **观测（read）**：`playtest_intent{action:"read", evidenceDir}` ⇒ 观测面：`intentState`（档位/菜单/邮箱/剩余预算/当前意图）、`intents[]`、`lastIntent`、`scan.nearest{found,id,x,y,z}`、`goto{x,z,arrived,arrivedDist}`，外加 `menu`、`mailbox` 状态与 **`nextSteps`**（上一条失败时 = 该意图菜单里的 fallback）。
6. **下意图（write）**：`playtest_intent{action:"write", evidenceDir, intent:"walk_to", params:{x:10,z:-20,tol:3}, confirmed:true}` ⇒ 写 `<evidenceDir>/intent.json`（扁平 JSON）。**写侧六段校验**：confirmed → 禁列（`kill`/`tnt`/`fill`）→ 13 意图菜单 → 参数白名单 → 必填 → 邮箱占用（占用回 `MAILBOX_BUSY`，除非 `overwrite=true`）；非法**在写侧就拒**，不进执行器。**首次真机实测（fabric 26.1.2，2026-10-03）暴露的两条易用性边界**：① **菜单默认查找会落空** —— 生成器把 `playtest/intent-menu.json` 写在**工程根**，而工具默认按 `<evidenceDir>/intent-menu.json` → `<evidenceDir>/../playtest/intent-menu.json` 两级找；`evidenceDir` 推荐放在工程之外（`<授权根>/instances/<tag>/evidence-intent`）时两级同时不中 ⇒ **必须显式传 `menuPath=<工程根>/playtest/intent-menu.json`**，否则 `MENU_NOT_FOUND`。② **`observe` 必须给 `entities=` 或 `blocks=`** —— 只给 `radius=` 会被判红 `observe_need_scan`（v1：空扫无判据），这是 fail-closed 设计、不是 bug。
7. **会话循环**：`read` 看观测 → 选意图（失败就按 `nextSteps` 换）→ `write` → driver 消费（`intent.json` 改名 `intent.done.json`）→ 展开原语执行 → 判**唯一一条**类型化后置条件 → 写 `intents[]` + 刷新 `state.json` → 回守候。**失败不得自动重试**（一次性意图重试会重复消耗方块/触发副作用），只许换意图。
8. **收尾**：`write {"intent":"stop"}` ⇒ 收尾本轮（**不关游戏**）；之后按 `playtest/REVERT.md` 撤除。

**实测链（去混淆档 fabric 26.1.2，2026-10-03 首次真机）**：`observe`(先被 `observe_need_scan` 拒 → 补 `blocks=` 后 `scan_written`，`scan.nearest=oak_log@-34.5,71,-2.5`) → `walk_to{x:-34,z:-2,tol:3}` → `distance_le_tol_and_moved_ge_min`(`dist=2.75 traveled=6.28`) → `screenshot` → `screenshot_file_nonempty`(`2026-10-03_20.22.16.png bytes=351378`) → `stop` → `driver_stops`；`exit-code=0`、`rounds.jsonl` 第 2 轮 `ok:true intents:5`。**两条运维口径**：`state.json` 的 `at` 是**最后一条意图的时间**（不是文件写入时间）⇒ 判驱动是否在跑要看**进程 + 文件 mtime + `intent.done.json`**，别拿 `at` 判活；`screenshot` 的 PNG 落 **`<gameDir>/screenshots/`**（`runClient` 的 gameDir = `run/`），不是工程根。默认剧本 `waitintent max=6000`（5 min）可能在你发首条意图前过期（整轮判红）——**驱动不退出**、回到守候 `plan.txt` 的 idle 态，**重写一次 `plan.txt` 即在同一进程开新一轮**（`max=30000` 更稳）。

**失败语义（三条线里最要紧的差别）**：邮箱形态失败 = **数据**（`intents[]` 记 `ok:false` ＋ `failure` 字段）并**继续守候**（会话不死）；协议违规（禁列/不在菜单/档位不符）在写侧就被工具拒；脚本形态（`plan.txt` 里的 `intent` 步骤）失败 = **判红停轮**。

**预算与协议**：单意图上限 = 菜单 `budgetTicks` 列（`walk_to` 1200 / `find_and_goto` 9000 / 其余 60–600）；单次守候 5 min（`waitintent max=6000`）；整轮默认 30 min（`budgetTicks=36000`）；邮箱**单槽**（一条在跑时新写的只在邮箱等，再写会被拒）。参数写错（如 `x=abc`）判红 `param_not_number`，**不会**静默用默认值。

**v1 落地面与已知限制**：已实现 = `walk_to` / `look_at`(yaw|pos) / `find_and_goto`(structure|block|entity) / `observe` / `open_gui` / `inventory` / `screenshot` / `wait`(ticks) / `tp`(op/creative) / `stop`；`mine`/`place`/`interact` 与 `wait until=` 未实现（命中即判红，不静默）。`goto` **无寻路**（直线 + `fly` + 巡航 140/防卡；复杂地形超时 → 换意图）；`structure` 形态需该世界开作弊；`block` 形态垂直采样只有 `-4..+8` 薄层（先在目标高度附近）；`entity` 只覆盖追踪范围 ≈48 格；村内扫不到村民先怀疑废弃村（换个村再扫）。

**真机读数（as-of 2026-10-01，`quilt 1.21.11` / `operator`）**：四会话全 `exit-code=0` —— 含"`find_and_goto{diamond_ore}` miss 判红 → 换 `structure` PASS"的换意图链、`entity:villager found=true dist=0.62`、`block:hay_block onGround=true`、截图 `ageMs` 新鲜度判据、`walk_to{x:abc}` 负例判红。逐条读数见口径单源「意图空间」的「执行器落地面」。

#### 后半 loop 运维散件（散在各处，集中在这里）

| 事项 | 做法 |
| --- | --- |
| JDK 分线 | 1.20.1 线 **JDK 17**；1.21.x 线 **JDK 21**（`JAVA_HOME` 指到对应版本；旧线可加 `-Porg.gradle.java.installations.paths=<jdk17>`） |
| 授权 | `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<绝对路径>`；证据与驱动只留该根 |
| 失焦暂停 | `<gameDir>/options.txt` 写 `pauseOnLostFocus:false`（强杀后 MC 不会自己写；只有这一行也能跑） |
| 世界供给 | 用**同 MC 版本**的 vanilla 服务端造一次世界（`eula=true` + `server.properties` 指定 `level-name` / `gamemode=creative` / `online-mode=false`）→ 到 `Done (…)` 后 `stop` → 把 `saves/<名字>/` 复制进各档 `<gameDir>/saves/`（同版本跨加载器互通）；**开作弊** = `level.dat`（gzip NBT）把 `allowCommands` 载荷字节 `0→1`（等长改写；定位按"名字前 3 字节是 tag 类型、前 2 字节是长度"）；改完**先确认没有客户端持有该世界**（否则旧客户端退出时会把值写回 0） |
| 进世界（冻结族） | `fabric 1.20.4 / 1.21.1 / 1.21.3` **不要**让 driver 调 `IntegratedServerLoader.start`（会把 Render thread 冻在等服务器载入的 `Thread.sleep`，jstack 实证）⇒ vanilla quick play（`--quickPlaySingleplayer "<存档名>"`）+ `enterWorld` 留空；`1.21.11` 线可用 `enterWorld` |
| 资源卡住 | 首跑 `:downloadAssets` 失败/长时间无输出：ForgeGradle 与 Loom 的 assets 缓存**可互借**；缺件按官方 manifest → `assetIndex.id` → `indexes/<id>.json` 定位对象 → 比大小补件；坏件（截断）用真实例 `assets/objects/xx/<hash>`（内容寻址、同路径）覆盖 |
| 首跑死在 mixin prepare | `fabric 1.20.1 / 1.20.4 / 1.21.1` 的老 clone：scaffold 的 `filesMatching` 补 `examplemod.mixins.json`（已在库修） |
| 关客户端 | 精确杀真身 JVM（命令行含 `-Dfabric.dli.config` 的那个 `java`）；**别只杀 `gradlew` wrapper** —— 残留客户端会占存档 `session.lock`，下一轮进世界报"另一个程序已锁定文件的一部分" |
| 独立实例 | 每次运行用独立 runId / 独立实例（共用 runDir 会静默互相覆盖截图） |
| 证据判读 | `inspect_playtest_evidence`（三态；**缺件不得读成"没有失败"**）；`rounds.jsonl` **每行一条合法 JSON**（条目 `{intent,params,ok,postcondition|failure,detail}`）；截图看新鲜度 `ageMs`（负值属时钟抖动）；`qa.log` 必须是 `.log`（判读器按"目录内任意 `.log` 尾部"抽 `[QA]` 段） |
| 撤除 | 删驱动文件 + `register()` 调用行，证据只留授权根；`git status` 自检零命中 —— **绝不提交** |

> 三条路线的**详细规程、坑位编号与每次真机读数**：`community_knowledge/authored/ingame-playtest-automation.md`；历史台账：`mcp-server/CHANGELOG.md` 各批。

## 快速开始

**对 AI（打开一个 MC Mod 项目时）：**

> 按根目录 `AGENTS.md` 判断平台与**精确**版本，然后调用 `activate_platform_pack action=session` 加载该档规则 / Skill 索引（不要直接读邻版 `平台/<ver>/.cursor`）。官方文档先 `list_*_versions`，再把 `version` 写死成工程版本去 `search_*_docs` / `search_docs`。创意设计由用户拍板；兼容取舍 / API 选择默认也由用户决定，用户不想或没能力决定时可代劳，但必须按下方「解释模板」说明（模板已同步写入根 `AGENTS.md`「人在环」节，对 Agent 强制生效）；写盘 / Gradle / 拷 jar / 上传须确认后再做（人在环，不是无人值守流水线）。

### 解释模板（代劳决策时的强制说明格式）

1. **决策透明**

   任何代替用户做出的兼容取舍或 API 选择，都必须在决策后立即在回复中明确说明，不得默默执行。

   格式示例：

   > 我已替你选择使用 `DeferredRegister`，原因见下。

2. **解释必须包含四要素**

   每次代替用户决策，解释至少包含：

   - **选择了什么**：具体的技术点或方案（例如「使用 Forge 1.20.1 的 SimpleChannel 而不是 NeoForge 的 Payload」）。
   - **为什么这样选**：与当前版本、文档、最佳实践或用户项目情况的关联（例如「NeoForge 1.20.1 是 Forge 兼容层，官方文档指向 SimpleChannel」）。
   - **主要替代方案**：一到两个可选方案，并说明为何没有采用（例如「也可以使用 NeoForge 1.20.4+ 的 Payload，但你的版本是 1.20.1，不适用」）。
   - **影响与风险**：该选择可能带来的后果、限制或需要注意的地方（例如「这样写会在编译时依赖 net.minecraftforge 包，请确认你的工程已包含该依赖」）。

3. **语言适配用户水平**

   - 用户表示「不太懂技术」或「你决定就行」→ 解释应避免堆砌术语，用通俗语言说明选择会带来什么结果。
   - 专业开发者 → 可给出更技术性的依据（类名、方法签名、文档链接）。
   - 无论哪种，都必须给出**可验证的出处**（`search_forge_docs` 的结果、规则编号、官方文档链接），不能只说「最佳实践」。

4. **高风险决策需先行确认**

   - **低风险决策**（选择某个 API 写法、推荐某个依赖版本）：可以直接代劳，但执行后立即按第 2 条解释。
   - **高风险决策**（切换加载器平台、更改包结构、移除依赖、修改构建脚本）：即使可以代劳，也应在执行前简要说明推荐方案和理由，等待用户回复确认，除非用户已明确表示「不用问我，直接做」。
   - 用户说「我不懂，你来决定」→ 视为已授权，但仍需在决策后解释清楚，并告知如何回退。

**对新项目使用脚手架：**

> 使用对应平台版本下的 `scaffold/`（如 `forge/1.20.1/scaffold/`）生成带规则的项目骨架。

**多 IDE 同步：**

> 修改 `.cursor/` 后，在该版本目录运行 `sync-skills.ps1`。IDE 目录清单与批量同步命令见 [人类读本](README_human.md#多-ide-支持)。

**配置本地 MCP Server：**

> 将 [AUTO_SETUP.md](./AUTO_SETUP.md) 拖入当前 AI IDE / CLI。Agent 应识别宿主（Cursor / Claude Code / VS Code / Continue / Trae / OpenCode / Codex 等），编译 `mcp-server`，按该宿主格式生成配置草稿，**经你确认后合并**（不会静默覆盖）。  
> 要求 **Node.js >= 22.5**（**22.5–22.12 与 23.0–23.3 必须加 `--experimental-sqlite` 启动**——内置 `node:sqlite` 在 22.13 / 23.4 起才默认开启；MCP/CLI 入口会在**任何 sqlite 使用之前**检测该窗口，命中即打印醒目指引并以非零码退出）；服务名 `MC-AI-Coding-Assistant-Tool`（stdio，86 个工具）。无 MCP 客户端时用 `node mcp-server/dist/cli.js`。
>
> **完整安装步骤不放在本文** —— [AUTO_SETUP.md](./AUTO_SETUP.md) 是唯一的安装说明书，按它的 Step 走：Step 0-pre 校验既有配置里的绝对路径 → Step 1 识别宿主 → Step 2 检查 Node 并 `npm ci && npm run build`（含**编译后自检四步**）→ Step 3 算出路径与规范 stdio 载荷 → Step 4 按宿主生成配置草稿 → Step 5 合并 + 重载 + **用工具验收**（Agent 自己调工具，不要只让用户看 UI）→ Step 6（可选）装 Skill。该文另有「常见错误」「CLI 兜底」两节；开头「Agent 必读：执行顺序」是对 Agent 的硬约束。

## 社区知识与库模组

与 `data/` 下的**官方** Forge/Fabric/NeoForge 文档分离，本仓库另有两套实务知识，供 Agent 在「发布 / 崩溃 / 软依赖 / 库选型 / 依赖树」等场景使用。**二者都不替代** `search_*_docs` 或 `query_api`。

### 社区实务知识（`community_knowledge/`）

| 目录 | 含义 | Agent 注意 |
|------|------|------------|
| `authored/` | 本仓库自写短文（可改） | 实务清单与反模式，**不是 API 规范** |
| `permitted/` | 作者许可入库的社区帖提炼 | 仍不确定时打开原文 URL |
| `links/` | 仅标题 / 摘要 / 外链 | **禁止**把网页正文当已入库全文 |

索引：`indexes/index-l0.json`（约 **110** 条）。MCP：`list_community_sources` → `search_community_docs` → `get_community_doc_summary` / `get_community_doc_full`。环境变量 `MC_SKILL_COMMUNITY` 可改根路径。

**主题速查**（完整表见 [`community_knowledge/README.md`](./community_knowledge/README.md)）：发布 / 崩溃 / 软依赖 / 机器 GUI / 本地化 / 代码模式（`patterns/`）等。**库集成**另有 48 篇 `authored/lib-*.md` + 总览 `library-catalog-2026`、陷阱 `lib-traps-2026`、配方集成 `library-integration` / `library-integration-jei-emi`。

**强制规则**：依据社区短文写代码前，若方法名 / 版本细节不确定，必须先查短文给出的原文或官方文档（见 [`community_knowledge/AGENT_USAGE.md`](./community_knowledge/AGENT_USAGE.md)）。

### 库模组知识体系（`knowledge/libs/` + 数据链）

三层结构（详见下文 MCP 工具 **§7 / §7.5**）：

1. **社区短文** — `authored/lib-*.md`，经 `search_community_docs` 检索；含反编译验证小节（`verifiedApi` 来源）。
2. **库 Skill 源稿** — `knowledge/libs/<group>/mc-<name>/SKILL.md`，**不落盘**到平台 `.cursor/skills`；按 `AGENTS.md`「库模组 Skill」解析：platform → 组映射（`forge-only`+`all-platforms` / `fabric-only`+`all-platforms` / `neo-only`+`all-platforms` / `bedrock-only`）+ frontmatter 二次过滤。不确定选哪个库 → 先读 `knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`。
3. **数据链** — 短文 frontmatter → `mcp-server/scripts/build-library-catalog-from-authored.mjs` → `library-catalog.ts`（**50** 条 / **2632** `verifiedApi` 键）+ `lib-manifests/all.json`（**49** slug / **3,003** 版本条目；2026-09-25 现算（重抓后的完整面；旧值 **48 / 2,870** 是翻页修复前的首页截断面，见 `mcp-server/README.md` §数据来源与边界），口径 = 该文件顶层数组的 `length` = slug 数、各元素 `entries` 数组长度求和 = 版本条目数）+ `lib-api-summaries/`（**48** 库 API 摘要）→ `check_dependencies` 识别依赖与版本窗口。（计数口径与脚本位置见 §7.5）

**Agent 推荐路径（库相关）**：`check_dependencies`（看 `detectedLibraries`）→ `search_community_docs`（`lib-<name>` 或 `library-catalog-2026`）→ 按 `skillId` 或名称 Read `knowledge/libs/.../SKILL.md` → 仍缺签名再走 `search_*_docs` / `query_loader_api`。

## 环境变量


| 变量                      | 说明                                     | 示例                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
**常设（多数用户会碰到的）**

| 变量                      | 说明                                     | 示例                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_DATA`         | 数据目录根路径（指向 `data/`，不含版本子目录）            | `<仓库根>/data`                |
| `MC_SKILL_COMMUNITY`    | 社区知识库根路径（默认仓库根 `community_knowledge/`） | `<仓库根>/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE`  | `1` 时允许 `port_project` 写盘              | `1`                               |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许的项目根（绝对路径）                         | `<你的模组工程绝对路径>`                  |
| `MC_SKILL_STRICT`       | `1` 时数据无效则 MCP 启动失败                    | `1`                               |
| `MC_SKILL_DEBUG_PATHS`  | `1` 打印路径解析过程（诊断“找不到 data/”时先开它）        | `1`                               |
| `MC_SKILL_CACHE`        | 反编译/MDK/loader-jar 缓存根。MCP 与脚本都读此变量；不设则 MCP 默认 APPDATA、脚本默认 `os.tmpdir()/mc-skill-cache`，会分家 | `%APPDATA%/mc-skill-cache`（脚本回退 `os.tmpdir()/mc-skill-cache`） |
| `JAVA_HOME`             | 反编译 / remap 用的 JDK（需 17+；缺失 ⇒ 工具回 `TOOLCHAIN_MISSING`） | `<Temurin 17+ 安装目录>`           |
| `MC_SKILL_PLAYTEST_ALLOW` | `1` 时放开游玩自测三通道的授权闸（须与 `MC_SKILL_PLAYTEST_ROOT` 成对出现） | `1`                               |
| `MC_SKILL_PLAYTEST_ROOT` | 游玩自测授权根（绝对路径；目标 realpath 必须落在其内）         | `<授权实例存档根>`                     |
| `MC_SKILL_SKIP_DOWNLOAD` | `1` 时反编译工具跳过一切下载并诚实失败。**须显式设成逐字 `1`** 才生效（实现是严格比较 `=== "1"`，见 `mcp-server/src/decompile/java/java-process.ts:168`；不设或设 `true` 均不生效）。本仓 `.github/workflows/` **四支工作流均已设该变量**（as-of 2026-10-02 实测） | 未设（默认按需下载）      |

**进阶 / 排障（按需；多数场景不必设）**

| 变量                      | 说明                                     | 默认 / 示例                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_JAVA_SCAN_MAX_FILES` | `validate_project` 等 Java 源码扫描的文件上限 | `300`                        |
| `MC_SKILL_JAVA_TIMEOUT_MS` | 反编译子进程超时毫秒数（非法值忽略并下沉）             | 内建回落值                        |
| `MC_SKILL_SCRIPT_TIMEOUT_MS` | **CLI 侧**脚本子进程超时毫秒数（不设 = 不设超时，长跑不被误杀） | 未设                   |
| `MC_SKILL_MAX_ENTRY_BYTES` | 解压时单条目未压缩大小上限（防 zip 炸弹）             | `268435456`（256 MB）            |
| `MC_SKILL_MDK_CHECKSUMS` | MDK 校验和 pin 文件路径覆盖                      | `mcp-server/data/mdk-checksums.json` |
| `MC_SKILL_BEDROCK_API_PIN` | 基岩 Script API pin 文件路径覆盖                  | `mcp-server/data/bedrock-script-api-pin.json` |
| `MC_SKILL_FETCH_BACKEND` | 设 `curl` 时 GitHub 抓取改走系统 `curl.exe`（Node TLS 失败时的逃生口） | 未设（先试 Node，失败回落 curl） |
| `MC_SKILL_GITHUB_API_BASE` | GitHub API 镜像基址（同时被加入抓取 host 白名单）     | 未设（`api.github.com`）           |
| `MC_SKILL_GITHUB_TIMEOUT_MS` | GitHub 请求超时毫秒数                        | 内建回落值                        |
| `MC_SKILL_GITHUB_TOKEN` / `GITHUB_TOKEN` | 自更新 / 上游查询的 GitHub token（提速率、免匿名限流） | 未设                   |
| `MC_SKILL_UPDATE_REPO` / `MC_SKILL_UPDATE_REMOTE` | 自更新仓库 slug / 强制 git remote 名     | `guguzea/MC-AI-Coding-Assistant-Tool` |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | 自更新检查缓存 TTL（秒）                    | `3600`                            |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | 自更新下载超时毫秒数                   | `600000`                          |
| `MC_SKILL_UPSTREAM_CACHE` | 设 `0` 整体关掉 `query_upstream_releases` 磁盘缓存  | 未设（按档 TTL）                    |
| `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`（含全小写） | 抓取的代理                         | 未设                              |
| `APPDATA`               | Windows 下缓存根默认基址（`MC_SKILL_CACHE` 未设时） | 系统值                          |
| `NODE_OPTIONS`          | Node 22.5–22.12 / 23.0–23.3 需含 `--experimental-sqlite` | 未设（22.13+ / 23.4+ 无需）      |
| `MCP_TIMEOUT_MS`        | **测试/CI 侧**超时毫秒数（`test-mcp.mjs` / `release-smoke.mjs` / 四支 CI 工作流读它；**MCP 服务进程本身不读**） | `30000`            |

> 上表覆盖对用户有行为影响的面，非穷尽：服务端源码实际读取 **37** 个环境变量名（as-of 2026-10-02），其余为内部调试开关。要拿全量清单，扫 `mcp-server/src/**` 的 `process.env.*` 即可（`MC_SKILL_STRICT` / `MC_SKILL_DEBUG_PATHS` 属本表已列；`ComSpec` / `COMSPEC` 等为 spawn 细节，无需配置）。




## MCP 工具使用注意

本地 MCP 服务名：`MC-AI-Coding-Assistant-Tool`（**86** 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`；**22.5–22.12 与 23.0–23.3 需在 NODE_OPTIONS 或启动参数加 `--experimental-sqlite`，22.13+ / 23.4+ 无需**）。仓库 / Release **不含** `node_modules`，需自行 `npm ci && npm run build`（建议再跑 `npm run build:yarn-sqlite`）。

**测试**：`cd mcp-server && npm test`（构建 + 全部单测：核心 / 脚本 / 数据审计 / Wave BCD / localize / update / CLI / 反编译 / 深 mixin / MCP 协议）。CI 语义：`.github/workflows/` 四支工作流的 job env 统一设 `MC_SKILL_SKIP_DOWNLOAD=1`，下载类工具在 CI 里诚实失败而非静默拉网络（该变量须在 mcp-server 内跑 `node test-decompile.mjs` 实测绿后方可依赖此语义）。CLI 另有两档独立门：`npm run test:cli:quick`（`mcp-server/scripts/assert-cli-quick.mjs`，快档，已进默认门链）与 `npm run test:cli:full`（`mcp-server/scripts/assert-cli-full.mjs`，全量档（权威名单跑时现取）：入口契约探针 + 真实调用 + 逐条豁免原因，**不默认跑**）。

### 安装后验收与 npm 脚本速查

装完（或首次 clone）后，跑下面四条确认环境是对的；**全绿再往下走**：

```bash
(cd mcp-server && npm ci && npm run build)    # dist/ 不入库，必须自建
node mcp-server/dist/cli.js --version                    # 应打印版本号（当前 package.json = 1.0.4）
node mcp-server/dist/cli.js list-tools --names-only      # 应回 86 个工具名
node mcp-server/dist/cli.js activate_platform_pack --action=list   # 应回本机已建档的平台 / 版本
node mcp-server/dist/cli.js diagnose_data_paths          # 各平台应为 found；empty / not_found = MC_SKILL_DATA 没指对
```

MCP 宿主里工具全不可调 ⇒ 多半是 `dist/` 未编译或宿主未重载（装了新 `dist/` 也要**重载 MCP**）。详见 `AUTO_SETUP.md` 与本文「工具不可用排查」。

`cd mcp-server` 后的常用脚本（完整 33 条以 `mcp-server/package.json` 为准）：

| 脚本 | 用途 | 何时跑 |
|---|---|---|
| `npm run build` | `tsc` 编译到 `dist/` | 改源码后；跑 MCP/CLI 前 |
| `npm ci` | 安装依赖 | 首次 clone（仓库/Release 不含 `node_modules`） |
| `npm test` | 全量门链（构建 + 单测 + 各 `assert-*.mjs` 门） | 提交前 |
| `npm run test:core` | 核心单测（含规则加载 / 兼容注释钉子） | 改了 core / 规则加载 |
| `npm run test:cli` | CLI 契约单测（参数解析 + 信封 + 退出码） | 改了 CLI 入口 / 信封 / 退出码 |
| `npm run test:cli:quick` / `test:cli:full` | CLI 快档（已进默认门链）/ 全量档（不默认跑，权威名单跑时现取） | 改了 CLI |
| `npm run test:scripts` | `mcp-server/scripts/**` 门链 | 改了脚本 / 门（**收口必跑**） |
| `npm run test:audit` | 数据审计单测 | 改了 `data/` 或审计器 |
| `npm run test:semantic` | 语义索引单测 | 重建语义库后 |
| `npm run test:decompile` / `test:deep-mixin` | 反编译 / deep mixin（需 JDK 17+） | 改了反编译 / 字节码校验 |
| `npm run test:update` | 自更新单测 | 改了 `src/update/` |
| `npm run build:yarn-sqlite` | 重建 Yarn 映射 SQLite（`--all`） | 首次 / 换档后；用 `convert_mapping` 前 |
| `npm run fetch:embedding-model` | 下载本地嵌入模型 | 首次建语义索引前 |
| `npm run build:semantic-index` | 重建语义索引（`npm run … -- --all`） | 要离线 / 语义检索时 |
| `npm run build:vanilla-registries` | 重建 Vanilla Registry 数据（`-- --version=<v>`） | 改了 `query_registry` 数据 |
| `npm run audit:data` | 全平台数据一致性审计（任何 ERROR = 不宜发布） | 发布数据包前 |
| `npm run audit:data:forge` / `:fabric` / `:neoforge` / `:fail-on-error` | 单平台 / 全平台失败即错 | 只改了一个平台时 |
| `npm run community:index` | 重建社区 L0 索引（`--write`） | 增删 `community_knowledge/` 条目后 |
| `npm run smoke:release` | 发布冒烟 | 打包前 |

> 其余脚本（`test:w3` / `assert:no-yarn-slurp` / `build:yarn-named` / `repair:quilt-indexes` / `audit:quilt-indexes` / `fetch:quilt-docs` / `fetch:bedrock-docs` / `fetch:vanilla-registries` 等）按需直查 `mcp-server/package.json`。

### 两个一等公民入口：MCP 与 CLI（2026-09-17 提级）

同一条 core、两个适配器（**互不分叉**）：MCP（stdio，给 AI 宿主）与 CLI（终端 / 脚本，给人）。前提与 MCP 相同：Node ≥ 22.5 + `cd mcp-server && npm ci && npm run build`（CLI 跑 `dist/`）。

#### 入口一：工具线（= MCP 工具，全量可调）

```bash
node mcp-server/dist/cli.js --version
node mcp-server/dist/cli.js list-tools --names-only                    # 工具名清单
node mcp-server/dist/cli.js list-tools --tool resolve_lib_skills       # 单工具 schema
node mcp-server/dist/cli.js search_docs --platform fabric --version 1.21.1 --query registry
node mcp-server/dist/cli.js resolve_lib_skills --platform fabric --mcVersion 1.21.1
node mcp-server/dist/cli.js check_dependencies --project .
node mcp-server/dist/cli.js crash_analyze --crashReport @./crash-reports/latest.txt
```

- **参数约定**：flags-only（`--key value` / `--key=value` / 裸 `--flag`→true）；`--file field=path`、`@path` / `@-`（读文件 / stdin）、`--stdin-json`（整参对象基座，命令行同名恒胜）、`--raw [field]`（字面量逃生）、`--timeout <ms>`、`--quiet`、`--project <dir>`、`--output-format json`。**参数名按各工具 schema**（如 `resolve_lib_skills` 用 `--mcVersion`；拿不准先 `… <工具名> --help`）。
- **输出**：恒定 JSON 包装 `{success, tool, result|error}`；**退出码** 0=成功 / 1=工具失败或超时（`errorKind: tool_failure | timeout`）/ 2=用法错误（`usage | validation`）。
- **工程类工具**：`--project <dir>` 映射 `projectPath`；`--fail-on-error` 把 `found:false` / 非空 `errors[]` 升为退出码 1。
- 全部细节（全局 flag 全表 / 别名 / 字段优先 / 迁移提示）见 [`mcp-server/README.md`](./mcp-server/README.md)「独立 CLI」节。

#### 入口二：仓库线（维护侧脚本子命令）

```bash
node mcp-server/bin/mc-skill-scripts.mjs --help                 # 命令总表
node mcp-server/bin/mc-skill-scripts.mjs lib resolve --platform fabric --version 1.21.1
node mcp-server/bin/mc-skill-scripts.mjs lib resolve --validate # 逐组合解析校验（组合清单以脚本内 VALIDATE_COMBOS 为准；= test-core §S15 同一门）
node mcp-server/bin/mc-skill-scripts.mjs lib summary --only libgui --write
node mcp-server/bin/mc-skill-scripts.mjs lib ownership          # G1 库归属门
node mcp-server/bin/mc-skill-scripts.mjs corpus decompile --filter slug=cloth-config,jei
node mcp-server/bin/mc-skill-scripts.mjs corpus merge --input x.jsonl --dry-run
node mcp-server/bin/mc-skill-scripts.mjs cloth project          # 注入标记 ↔ versions.json 校验
node mcp-server/bin/mc-skill-scripts.mjs gate list
node mcp-server/bin/mc-skill-scripts.mjs gate run lib-ownership # 跑一道门（退出码透传）
```

- 九个命令 = `lib resolve|summary|ownership` · `corpus decompile|emit|merge` · `cloth project` · `gate list|run`；
- **薄壳**：转发 `scripts/` 与 `mcp-server/scripts/` 的既有脚本，参数与退出码原样透传；`… <组> <命令> --help` 给命令说明（脚本自带参数的 `--help` 走直跑脚本）；
- **边界**：CLI 需在仓库内运行（脚本位于仓库根 `scripts/` 与 `mcp-server/scripts/`）；仓库线属**维护侧**作业（批量反编译 / 摘要重建 / G1 门 / 注入回填），MCP 工具面不暴露。
- 冒烟门：`mcp-server/scripts/assert-cli-smoke.mjs`（双入口 `--version`/`--help` + 8 组 `--help` + `gate list` + `lib resolve` 真跑×2）已接 `test-core` §S16。装包后（如 `npm i -g ./mcp-server`）两入口暴露为 bin：mc-skill 与 mc-skill-scripts。

> **库模组文件保持 AI 直接可读**：`knowledge/libs/**` 是"源稿即用"——AI 按 `AGENTS.md`「库模组 Skill」规则**直接读文件**；`resolve_lib_skills`（MCP 与 CLI `lib resolve` 同一 core）只做**解析与真值提示**（返回仓库相对路径 + `versionsJson`），**不代替文件、不缓存正文**。

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

**数据与模型位置**：语义库在 `data/{platform}_{ver}/{source}/{ver}/semantic/db.sqlite`（跳过 `forge_javadoc`），当前 **60** 个（2026-09-13 实算：`find data -type f -name db.sqlite -path "*/semantic/*"`；不含 `db.sqlite.tmp-*` / `-journal` 残渣，`forge_javadoc` 树本就没有语义库）；嵌入模型在 `data/_models/Xenova/all-MiniLM-L6-v2`（transformers.js，**唯一允许远程拉模型的入口**）。构建：`npm run fetch:embedding-model`；`npm run build:semantic-index -- --all`（可 `--platform` / `--version` / `--source` / `--no-embed` / `--force`；可中断续跑）。产物清单：`data/semantic-index-manifest.json`。

#### Agent 怎么调用（两条入口、两步走、一个字段）

**入口 A：MCP 工具**（AI IDE 已挂 `MC-AI-Coding-Assistant-Tool` 时，这是 Agent 的正规调用方式）。按平台选工具，参数只有 `version` + `query`，语义层**自动**参与、没有任何开关：

- Forge → `search_forge_docs { version: "1.14.4", query: "entity goal" }`
- Fabric → `search_fabric_docs { version: "1.21.4", query: "custom enchantment effect" }`（先 `list_fabric_versions` 确认入库档名）
- NeoForge → `search_neoforge_docs { version: "1.20.1", query: "..." }`（1.20.1 回退 Forge 语料，属预期）
- 通用（quilt / liteloader / rift / modloader 等）→ `search_docs { platform: "...", version: "...", query: "..." }`

**入口 B：独立 CLI**（无 MCP 客户端，或想在 shell 里立刻验证——改完源码没重载宿主时也用它）：

```bash
node mcp-server/dist/cli.js search_forge_docs --version=1.14.4 --query="entity goal selector"
```

（`MC_SKILL_DATA` 指向 `data/`；工具输出恒为 JSON，`--json` 不改变工具输出。）

**两步走**：`search_*_docs` 拿结果里的 **`id`**（不是网站 URL）→ `get_*_doc_full` / `get_*_doc_summary` 读正文。一次最多 2 页，防止上下文溢出。

**响应契约**：`{ ok, total, totalPool, truncated, semantic, results: [{ id, score, … }], matches? }`。**`total` 在文档检索面 = 本次返回条数（= `results.length`，随你传的 `limit` 变），不是语料命中总数**；判「拿全了没」看另外两个**无条件**在载荷里的键：`totalPool` = 进窗口前该面手里可用的候选条数，`truncated` = (`total < totalPool`)（2026-09-28 落地，八个发射点全覆盖；`limitWindow.candidates` 在多数面仍是窗口不是池，bedrock 面的窗口块在 `demotion` 下）。**残余口径**：`totalPool` 只到「本面可得」这一层，不等于语料全量（fusion 输入与 L0 检索各有上限）。`query_loader_api`／`query_upstream_releases`／`search_mod_code` 三面的 `total` 才是全池 ⇒ 两族判式符号相反，别照抄。Agent 必须读 `semantic` 字段：

- `semantic: true` = 本轮走语义库（FTS5 BM25 + MiniLM 向量余弦、RRF 融合），命中可视为按相关性排序的 coverage 证据；
- `semantic: false` = 降级 L0 关键词（该树没建语义库 / 嵌入模型缺失 / `semanticSearch` 返回 null），带 warning——此时命中**不穷尽**，`found:false` 什么都不能证明；
- 命中可带 `matches[]`（`sectionHeading` / `snippet` / `score`），snippet 来自 chunks 表**真实正文**，可直接引用。

**Agent 侧规矩**（根 `AGENTS.md`「不确定时」条款，2026-09-19 起）：查 API / 文档 / 机制**先语义搜索**；`query_api` / `query_loader_api` 是兼容工具（见下节），只作兜底。

#### query_\* 兼容工具与 1.14.4/1.15.2 边界报告（2026-09-19，sweep104）

`query_api` / `query_loader_api` 被标记为**兼容工具**（类名/签名索引类，覆盖按版本而异且有限）。每次调用的响应都显式提醒，不再静默：

1. **query_api 每次响应**：`notes` 末尾追加「query_api 是兼容工具……文档与语义面请优先 search_forge_docs / search_docs 语义搜索」。
2. **query_api 查 1.14.4 / 1.15.2**：`warning` 显式报告边界——这两档 api-index 为空是**设计行为**（MCP stable CSV 仅成员级 searge↔named，Parchment 索引自 1.16.5 起才有），`found:false` 不代表游戏里没有该类；响应推荐改用 `search_forge_docs` **语义搜索**（这两档语料与语义库完整：1.68MB / 1.32MB，实测 `semantic: true`）+ `convert_mapping`（1.14–1.15 CSV 仅 searge↔named，**类名不可查**，方法名可以）。背景：这两档旧版恰好落在「1.7–1.13 空壳警告」与「classCount===0 警告」两条分支之间静默返回，sweep104 补上专门分支。
3. **query_loader_api 每次响应**：`notes` 追加兼容注释（覆盖以已 ingest 的档为界）。
4. **第二档出处 `nameIndex`（2026-09-25）**：`query_api` 在 api-index 未命中、或该版本压根没有 Parchment 索引（如 1.21.x Fabric / 无 extracted 索引的 NeoForge 档）时，会再查一次在盘映射索引 `data/<平台>_<版本>/mappings/yarn-mappings.sqlite`，把结果挂在响应里的 `nameIndex`：`exists` / `matchKind`（exact｜simple-unique｜ambiguous｜contains｜none）/ `named` / `memberCounts` / `memberSample` / **`mappingEra` + `dbKind`**。边界有三条，缺一不可：`found` 恒仍为 `false`（存在性不冒充签名命中）、`mappingEra` 必须读（`yarn-tiny` 的 `named` 是 Yarn 名，`forge-srg`/`tsrg`/`mcp-csv` 的 `named` 是 MCP `func_/field_` 名，`mcp-config-srg`（Forge 1.16.5–1.20.4 六档）的是 SRG 类名 + `m_N_/f_N_` 成员名）、该档没有库或表为空时**整键缺席**（不凭空造一档）。**选库按加载器**（2026-09-26 补）：本工具的 api-index 只读 `data/forge_<ver>/extracted` ⇒ `nameIndex` 也按 Forge 线取库，两棵树都有库的 1.16.5–1.20.4 不再由 fabric 的 yarn-tiny 代答（修前连包名都会给错：`RenderCall` 在 Yarn 是 `blaze3d/systems/`、在本档是 `blaze3d/pipeline/`）；forge 无库时照旧回落 fabric。要签名仍走 `search_*_docs` 或按需 `get_minecraft_source`。

钉子：`test-core.mjs`（1.20.1 兼容注释 / 1.14.4 与 1.15.2 边界 warning / 1.12.2 空壳警告保留 / **S1′ 三腿：接线（1.21.1 `StatusEffect` 给得出 nameIndex 且 `found:false`）、证伪（乱造的名字必须 `exists:false`）、披露（三句 note 缺一即红）+ 无库档 26.1.2 与命中路径 1.20.1 都不得出现 nameIndex**）与 `test-loader-api.mjs`（兼容注释）。

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
| Forge **1.14.4 / 1.15.2** | `search_forge_docs`（**语义库完整**，1.68MB / 1.32MB，实测 `semantic: true`——查这两档优先用语义搜索） | `query_api` 索引为 `{}`（0 类，**设计边界**——每次查询响应带边界 `warning` 并推荐语义搜索，见「向量 / 语义搜索」节；类名在文档语料里逐字可引，见 sweep103 验证） | `*-forge` 已索引 |
| Forge **1.16.5–1.20.4** | `search_forge_docs` | Vanilla 可用 `query_api`（真方法签名） | `query_loader_api` 或文档 |
| Fabric | 先 `list_fabric_versions`；**禁止**把邻版 wiki 当本版。26.1.2 仅 `fabric-docs`、无 wiki | 26.1+ 无 `query_api` 索引 | `search_loader_api mode=list`：`1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.20.4` / `1.21.1` / `1.21.3` / `1.21.11` / `26.1.2` 的 fabric-api **已索引**（不要再当成 maven 404；**11 档 = 14 个 `fabric/*` 规则树 − 薄档 `1.21.4` / `1.21.8` / `1.21.10`**） |
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
| `generate_datagen` platform=forge version=1.12.2 吐出 Java | 1.12.2 **无 DataGen**；旧模板还曾发出 1.21 的 `ResourceLocation.fromNamespaceAndPath` | Forge **1.20.1**（`Consumer<FinishedRecipe>`）与 **1.20.4**（仅 recipe，`buildRecipes(RecipeOutput)`）；NeoForge 1.20.1 改口 `search_neoforge_docs`、1.20.4/1.20.6 仅 recipe、1.21.x 与 26.1；**Fabric** 1.21.1/**1.21.3**/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1（**无 1.21.5**）；**Quilt 无** generate_datagen（改口 `search_docs platform=quilt` + Fabric overlay 手写）；其它 version 返回 error |
| `get_version_info` 1.12.2 action=register 仍教 DeferredRegister | gotchas 写「不支持」，recommendation 被强行追加 1.20 流程 | 1.12.2 注册是 `RegistryEvent.Register<T>` |
| `search_loader_api` 对 Fabric 1.14.4 等返回空 | 文档曾写 maven 404 / `LOADER_API_NOT_INDEXED` | 以 `mode=list` 为准；`skipped-ingest.json` 的 `mavenNotIndexed` 现为空数组 |
| 文档 `semantic: false` 或 warning 含 `stale` | 故意 L0-only（**仅 ModLoader** 三档），或 sqlite 落后于 processed/ | 看该次 JSON，不要只看 `get_server_status.semanticIndex.modeHint` |

同类查找一律走 `ownGet`（`mcp-server/src/utils/own-record.ts`），不要写 `record[userString]`。

### 实跑取证：常见错误码与「什么时候别用」（as-of 2026-10-04）

下表每个 `code` 都来自本机 CLI 的**最小失败调用**实跑，不是文档推导：

| 工具（调用形态） | 实测 `code` | 什么时候别用 / 该怎么读 |
|---|---|---|
| `activate_platform_pack action=session`（未建档版本） | `PACK_NOT_FOUND` | 别拿邻档顶替；换已建档版本，或先 `action=list` |
| `search_forge_docs` / `search_*`（未建档版本） | `VERSION_NOT_FOUND` | 先 `list_*_versions`；**不在清单 ≠ 上游没有**（查上游用 `query_upstream_releases`） |
| `query_api`（该版本无 extracted 索引） | `DATA_UNAVAILABLE`（`found:false`） | 26.1+ / 1.14.4 / 1.15.2 无索引；改语义搜索，或 `get_minecraft_source` |
| `diagnose_gradle`（缺 `--project`） | `INVALID_INPUT` | 必须给工程路径；Rift / BaseMod / 基岩仍早退 |
| `generate_lang` / `get_minecraft_source`（缺必填项） | `MISSING_REQUIRED` | 先补齐必填；这不是"工具坏了" |
| `check_dependencies`（无工程 / 无已知依赖） | `ok:false` + `detectedLibraries: []` | **空数组 ≠ 没有依赖** —— 未收录的库会漏（启发式，不是完整 Gradle 解析） |
| `crash_analyze`（缺 version） | `VERSION_REQUIRED` | 传版本；它只覆盖你贴进来的那一段日志 |
| `detect_mod_project`（无 `projectPath` 且未设 env） | `PROJECT_ROOT_REQUIRED` | 先设 `MC_SKILL_PROJECT_ROOT` 或传 `--project`；指向知识库根会判 `KNOWLEDGE_REPO_NOT_MOD` |
| `generate_worldgen`（编造版本 `1.99.9`） | `INVALID_INPUT`（`errorKind: usage`） | 两端版本哨兵直接拒绝，不默默生成；文档称此时点名 `WORLDGEN_MAX_MINOR_1X` |
| `localize_mod` / `port_project` / `query_loader_api` / `generate_lang` / `analyze_mod_jar` / `resolve_lib_skills` / `get_method_params` / `get_version_info` / `search_fabric_docs` / `list_doc_versions` / `search_docs` / `query_registry`（缺必填） | `MISSING_REQUIRED` | 先补齐必填参数；这不是"工具坏了"。**实测这 12 个内置工具的缺参形态统一收敛到这一个码**（此处 12 是**本行列出的子集**，不是服务端工具总数；总数以 `list-tools` 为准） |
| `search_mod_code`（未给 `jarPath` / `decompiledDir`） | `INVALID_INPUT` | 必须先 `decompile_mod_jar`（或已有反编译目录），否则 `NOT_FOUND` |
| `get_workflow_template`（未知名的模板） | `INVALID_ENUM_VALUE` | 工作流名是 enum，Zod 直接拒；模板名以该工具列表为准，别猜 |
| `convert_mapping`（该版本无目标层） | `DATA_UNAVAILABLE`（`converted: null`） | 失败默认 `converted:null`；只有 `allow_fallback` 才回传原名并带 `fallbackUsed`（禁止假成功） |

> 取证方式：`node mcp-server/dist/cli.js <工具> <最小失败参数>`，读响应里的 `ok` / `code` / `errorKind`。**没实跑取证到的工具一律不写码** —— 见 §6b / §9 / §11 表下「`—` = 本仓库未记载」的口径。

### 86 个工具的错误码覆盖清单（as-of 2026-10-04，工具数与顺序以 `list-tools` 为准）

证据三档：**实测** = 本机 `node mcp-server/dist/cli.js <工具> <最小失败参数>` 读到；**文档** = 本文件该工具行已具名；**未记载** = 仓库文档与实测都没有专属码（失败细节以响应 `errors[]` / `error.code` 为准）。

| 组 | 工具 | 错误码 | 证据 |
|---|---|---|---|
| 版本 / 索引类 | `activate_platform_pack` · `search_forge_docs` · `query_api` · `detect_mod_project` · `convert_mapping` · `generate_worldgen` | `PACK_NOT_FOUND`（+`PACK_INCOMPLETE`）· `VERSION_NOT_FOUND` · `DATA_UNAVAILABLE` · `PROJECT_ROOT_REQUIRED`（+`KNOWLEDGE_REPO_NOT_MOD`）· `DATA_UNAVAILABLE`（`converted:null`）· `INVALID_INPUT` | 实测 |
| 必填校验类 | `get_method_params` · `get_version_info` · `search_fabric_docs` · `list_doc_versions` · `search_docs` · `query_registry` · `localize_mod` · `generate_lang` · `analyze_mod_jar` · `resolve_lib_skills` · `get_workflow_template` | `MISSING_REQUIRED`（11 个）；`get_workflow_template` 为 `INVALID_ENUM_VALUE`（工作流名是 enum） | 实测（缺参形态收敛于 `MISSING_REQUIRED`） |
| 诊断类 | `diagnose_gradle` · `inspect_runtime` · `crash_analyze` | `INVALID_INPUT` · `INVALID_INPUT` · `VERSION_REQUIRED` | 实测 |
| 索引 / 反查类 | `list_forge_versions` · `list_fabric_versions` · `list_neoforge_versions` · `mixin_analyze` · `lookup_obfuscated` · `query_loader_api` · `search_loader_api` · `ingest_loader_api` | `PLATFORM_DATA_MISSING` · `CACHE_MISS` · `UNOBFUSCATED_NO_YARN` · `PLATFORM_SKIPPED` · `LOADER_API_NOT_INDEXED` · `INVALID_INPUT` | 文档 |
| 移植 / 写盘类 | `analyze_porting_path` · `port_project` | `NOT_A_MOD_PROJECT` · `UNSUPPORTED_PORT` · `INVALID_INPUT` · `PROJECT_ROOT_REQUIRED` · `PATH_OUTSIDE_ALLOWLIST` | 文档 |
| 上游查询类 | `query_upstream_releases` | `URL_REJECTED`（另有 `ok:false` / `available:false` 两态，语义不同） | 文档 |
| 游玩自测类 | `playtest_intent` · `playtest_bridge` · `inspect_playtest_evidence` | `CONFIRMATION_REQUIRED` · `INTENT_FORBIDDEN` · `INTENT_NOT_IN_MENU` · `PARAM_NOT_DECLARED` · `MISSING_REQUIRED_PARAM` · `MAILBOX_BUSY` · `MENU_NOT_FOUND` · `PLAYTEST_TIMEOUT` · 三态 `present\|absent\|unreadable` | 文档 |
| 反编译类 | `get_minecraft_source` · `decompile_mod_jar` · `download_official_mdk` · `search_mod_code` | `TOOLCHAIN_MISSING` · `NOT_FOUND` · `MDK_NOT_PINNED` · `NOT_FOUND` | 文档 |
| 生成类 | `generate_datagen` · `generate_model` · `generate_network_packet` · `generate_capability` · `generate_config` · `generate_entity_renderer` · `generate_addon_manifest` · `generate_bp_entity` · `generate_playtest_driver` | 三态 `resultKind`：`ok` / `generation_failed` / `write_blocked`；写盘未完成时 `writeError.code` ∈ `CONFIRMATION_REQUIRED` / `PROJECT_ROOT_REQUIRED` / `PATH_OUTSIDE_ALLOWLIST` / `NOTHING_TO_WRITE` / `WRITE_FAILED` | 文档 |
| **无专属码（39 个）** | `get_server_status` · `validate_project` · `check_dependencies` · `mc_skill_update` · `check_publish_ready` · `list_community_sources` · `search_community_docs` · `get_community_doc_summary` · `get_community_doc_full` · `get_forge_doc_summary` · `get_forge_doc_full` · `get_forge_doc_related` · `get_fabric_doc_summary` · `get_fabric_doc_full` · `get_fabric_doc_related` · `get_neoforge_doc_summary` · `get_neoforge_doc_full` · `get_neoforge_doc_related` · `search_neoforge_docs` · `get_doc_summary` · `get_doc_full` · `get_doc_related` · `diagnose_data_paths` · `search_bedrock_docs` · `get_bedrock_doc_summary` · `get_bedrock_doc_full` · `get_bedrock_doc_related` · `analyze_bedrock_log` · `validate_addon_manifest` · `validate_bp_json` · `audit_resources` · `validate_datapack_json` · `validate_at` · `validate_aw` · `list_knowledge_resources` · `read_knowledge_resource` · `analyze_log` · `analyze_build_log` · `get_migration_guide` | **未记载专属码** ⇒ 失败时读响应的 `errors[]` / `error.code`；**禁止凭记忆补码**。其中 `get_*_doc_*`、`list_*`、`audit_*`、`validate_*`、`analyze_*`、`read_*` 属"有结果 / 空结果 / 工具失败"三态，**空结果 ≠ 目标不存在** | 未取证 |

> 覆盖口径：本清单点名全部 **86** 个工具（组内合计 6+11+3+8+2+1+3+4+9+39 = 86）。「未记载」不是缺陷结论，而是**证据不足的如实标注** —— 要补齐这些码，需要为每个工具设计一个"参数合法但语义失败"的调用并实跑（例：`get_*_doc_full` 传一个格式合法但不存在的 `id`），属独立一轮工程。

### 规则包加载（`activate_platform_pack`）

知识库里的 `forge/<ver>/.cursor` **不会**被用户模组工程的 IDE 扫到。编码期用 MCP 把该档送进**当前对话**，不要把规则拷进 `MC_skill` 仓库根。

| `action` | 作用 |
|----------|------|
| `list` | 已建档平台 / 版本 |
| `session` | **不写盘**、不依赖项目根。返回该档 `AGENTS.md`、规则正文、Skill **索引**（`name` / `description` / `relPosix` / `absPath`）。默认只注入规则 **00 / 01 / 09**；`topics` 与 `task` **追加**到底座（并集，永不替换）；`skillNames` 与 `task` 建议名去重后注入 `skillBodies`（总条数上限 8）。`topics` 永不注入 Skill 正文。库 Skill 不进 `nextReads`，只有显式 `skillNames` 才注入库正文。`includeAllRules=true` 才灌 00–10 规则全文。ok=true 且带「仅底座」warning = 包可用但规则未按任务扩展（`rulesMode=base`，含 `next` 对象）。包存在但缺 00/01/09 文件 → `ok:false` + `PACK_INCOMPLETE`（不是 `PACK_NOT_FOUND`）。库 Skill 仍读 `knowledge/libs/`。 |
| `write` | 写入**用户模组工程**的 IDE 目录。`hosts` 必填（`cursor` / `claude` / … / `all`）。默认 `dryRun`。不要再用 `includeSkills`，改用 `writeSkillStubs`（二者都未传时默认 **true**，写入 stub，提示去读知识库路径，不是 Skill 全文）。`includeSkillBodies` 才写全文。目标不能是本知识库（**整棵仓库树**均拒绝，含版本子目录）。**破坏性变更（2026-08）**：设置 `MC_SKILL_PROJECT_ROOT` 时它是**硬边界**——`projectPath` 必须落在其内，否则拒绝（`PATH_OUTSIDE_ALLOWLIST`，响应带 `breakingChange: true` 与 `allowRoot`）；此前 `projectPath` 可覆盖 env。迁移：把 env 指向包含目标工程的目录，或改用其内的 projectPath。 |
| `deactivate` | 按清单撤写 |

**不能**开关 Cursor/Claude 等 Skill 扫描器。重载 MCP 不会让设置页出现条目。

### 工具边界

文档向量搜索 **补不了** Vanilla 方法签名。缺索引时保持 `found:false` / 空结果 + 说明，

| 情况 | 表现 | Agent 应改用 |
|------|------|----------------|
| MC **26.1+** 的 `query_api` / `get_method_params` | 该类 extracted 为 **0 个类**（无 Parchment api-index） | `search_neoforge_docs`（须传 version，先 `list_neoforge_versions`）/ `search_fabric_docs`（先 `list_fabric_versions`，如 26.1.2）；或 `get_minecraft_source` / 反编译。映射层返回 `UNOBFUSCATED_NO_YARN` |
| Forge **1.14.4 / 1.15.2** `api-index.json` | 占位 `{}`，Parchment 约从 1.16.5 才有（`forge_1.8.9` / `forge_1.9.4` 的 `class-names.json` 同为 `[]` 占位）。**每次 `query_api` 查询都会报此边界并推荐 `search_forge_docs` 语义搜索**（sweep104；这两档 docs 语料与语义库完整） | 换 `version=1.16.5+` 查相近 Vanilla 名，或靠文档 / MCP 映射，不要当有完整 javadoc |
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
| 工作流 / MCP 不跑 Gradle、不拷 jar、不上传 = 漏做无人值守 | **人在环设计**。创意、性能、调试由人决定；兼容取舍 / API 选择可代劳但须按「解释模板」说明；高风险操作须确认后再执行 |
| `analyze_porting_path` 对任意文件夹都有移植路径 | 非模组目录 → `NOT_A_MOD_PROJECT`；LiteLoader / Rift / ModLoader / 基岩 → `UNSUPPORTED_PORT` |
| `generate_*` / `generate_datagen` 会写文件 | **默认只返回文本骨架 + `suggestedPath`**。可选写盘须 `write=true` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + 绝对 `MC_SKILL_PROJECT_ROOT`，路径相对工程根且不含 `..`；缺任一条件只吐文本，不会静默落盘。**三态语义（2026-09-19）**：默认不传 `write` = **dry-run**（只吐文本，恒 `ok:true`、`resultKind:"ok"`，`ok` 不对写盘作任何承诺）；版本/平台不支持等**生成失败** ⇒ `ok:false` + `resultKind:"generation_failed"`（原因在 `errors[]`）；骨架已出但**写入未完成**（缺 `confirmed` 或写盘被沙箱拒）⇒ `ok:false` + `resultKind:"write_blocked"`（CLI `success:false` + exit 1，写盘未发生，文本预览仍在 `result`，细粒度原因在 `writeError.code`：`CONFIRMATION_REQUIRED` / `PROJECT_ROOT_REQUIRED` / `PATH_OUTSIDE_ALLOWLIST` / `NOTHING_TO_WRITE` / `WRITE_FAILED`）。`platform`/`loader` 与（datagen/config/capability/renderer 的）`version` 必填，禁止默认 forge。datagen：**Forge 1.20.1 与 1.20.4**（1.20.4 仅 recipe）、NeoForge 1.20.4/1.20.6（仅 recipe）/1.21.x/26.1、**Fabric** 1.21.1/**1.21.3**/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1（无 1.21.5）；Quilt 无 generate_datagen（改口 `search_docs platform=quilt`）；其它 Forge 版本（含 1.12.2）error。`generate_capability`：forge=Capability；neoforge 仅 1.20.4+ Attachment；fabric/quilt 改口 CCA |
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

### 工具与网络边界（只写边界，不写结论）

下列两条**本机核不到上游本身**（能核的只有通道，见下表）。这里登记的是「不许推出什么」，不是「已核实为否」。

| 边界 | 已核实到的程度 | 禁止的推断 |
|------|----------------|------------|
| 外网可达性只能核到**本机通道**层面，不是「通 / 不通」一个布尔 | `download_official_mdk` 的 pin commit、`mc_skill_update` 的 Release、以及规则/AGENTS 里钉的 example-mod commit 短哈希，都只能在可达网络下复验。2026-09-06 实测：**Node `fetch`** 对 `raw.githubusercontent.com` 与 `services.gradle.org` 一律 `TLS_VERIFY_FAILED`（同口径见 `$MC_SKILL_CACHE/loader-api-summaries/fetch-qsl-last.json` 台账）；**同一 URL** 换 `curl.exe --ssl-no-revoke` GET = `200`（719 B / 0.1s），`services.gradle.org/distributions/…` = `307`；`api.github.com` 的 `git/trees?recursive=1` 单次 12s 超时（未复测） | **本机拉不到 ≠ 上游不存在 / 校验和不对 / 那个 commit 是假的**；也**不得**把 TLS 类失败记成 `NOT_FOUND` 或「缺档」。相关条目保持「未核实」标注，换网络或让用户在本机复验，不要改成另一套自猜的值 |
| 基岩 `description.identifier` 等命名空间 ID 的长度上限与字符集 | Microsoft Learn 只规定要带命名空间，**未**给出长度上限与允许字符集；社区只给「小写、无空格/特殊字符」「路径长度受主机限制」这类**建议** | **不要把建议当硬限制**，也不要因 Learn 没写就断言「无限制」。`validate_addon_manifest` / `validate_bp_json` 不据长度/字符集报错；生成 ID 时按建议取保守形式并说明这是约定不是官方约束 |

fetch 通道矩阵（写维护脚本时按这张表选腿，别照搬「这台机器没网」）：

| 腿 | 本机实测 | 用法 |
|----|----------|------|
| Node `fetch`（github / gradle / maven 域） | 一律 `TLS_VERIFY_FAILED` | 不得当主腿；失败必须归 TLS 类，与 404 / 限流分开 |
| `curl.exe --ssl-no-revoke` GET | `200` / `307`（本机唯一稳定可用腿） | win32 主腿。**冷连接首试可能超时**（实测一次 15s 零字节），必须带退避重试 |
| `curl.exe --head` | 同一 URL 跨轮实测 `502` 与 `200` 都出现过 | **禁止**用 HEAD 判可达性，探测一律 GET |
| `api.github.com` | 本轮 `git/trees?recursive=1` 单次超时 | 需要它建表时先单独复验，不要假设与 `raw` 同命运 |

`scripts/_lib/fetch-with-ua.mjs` 把这张表落成代码：`downloadWithFallback({ preferCurl: process.platform === "win32" })`，curl 腿恒带 `--ssl-no-revoke` + UA，fetch 腿恒带 `AbortSignal.timeout()` + UA，失败类别见 `FETCH_FAILURE`（`TLS_VERIFY_FAILED` / `TLS_REVOCATION_CHECK_FAILED` / `TLS_HANDSHAKE_FAILED` / `RATE_LIMITED` / `NOT_FOUND` 互不混用）。




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
3. **字段查询**：传 `memberKind: "field"`（或 `"auto"` 时按名称风格推断），建议带 `ownerClass`；1.14–1.15 仅全局 `field_`*/`searge↔named`。schema 仍为 v2 时返回 `SCHEMA_FIELDS_UNAVAILABLE`（需重建 sqlite）。CLI：`node mcp-server/dist/cli.js convert --kind field ...`。
4. 失败默认 `found:false`、`converted:null`；过渡参数 `allow_fallback` 可回传原名并设 `fallbackUsed`（禁止假成功）。
5. 构建：`cd mcp-server && npm run build:yarn-sqlite`（本地 temp 写入后复制，避免盘符 I/O 问题）。
6. **`from=mojang`（拿 mojmap 可读名来查）有两档出处**：第一档 = 上表的 `official` 列，而那一列对**被混淆的类**存 Tiny 混淆短名，只有本来不混淆的少数类带可读全路径（13 档 100 985 行实测：短名 100 310 ／可读路径 675 = 0.67%，如 `com/mojang/blaze3d/…`）⇒ 用 `Container`／`Level` 这类可读名点查必然 `found:false`，**这不代表该版本没有这个类**（未命中回执自带这条披露）。第二档 = 派生对照表 `data/_yarn-mojmap-pairs/`（类名级 `obf`／`mojmap`／`yarn` + 两侧 FQCN，**无 intermediary 列**），只在 `from=mojang` 且 `to` 为 `yarn`／`obfuscated` 时参与，命中带 `fallbackUsed:true` 并在 notes 点名是哪张表、该表多少条；`to=intermediary` 直接拒答，不回落第一档。



### 工作流模板与知识资源（Prompts / Resources + 工具兜底）

Cursor 主路径是 **tools**；协议层仍注册 Prompt/Resource，工具兜底保证同款正文可读：


| 能力   | 工具                         | 说明                                                                                                   |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| 工作流  | `get_workflow_template`    | 模板名以 `get_workflow_template` 列表为准（含 `mc-new-block` / `mc-new-item` / `mc-new-blockentity` / `mc-mixin` / `mc-worldgen` / `mc-config` / `mc-gametest` / `mc-setup-env` / `mc-publish` 等，与 Prompt 同名） |
| 知识列表 | `list_knowledge_resources` | 列出 `mcskill://` URI                                                                                  |
| 知识读取 | `read_knowledge_resource`  | 按 URI 读正文                                                                                            |


常用 URI：`mcskill://patterns/README`（→ `community_knowledge/patterns/README.md`）、`mcskill://schema/sqlite`、`mcskill://matrix/mixin-support`、`mcskill://version-changes/1.21`、`mcskill://antipatterns/registry`、`mcskill://workflow/<模板名>`、`mcskill://community/<authored-id>`。兼容说明见 [mcp-server/docs/prompts-client-compat.md](./mcp-server/docs/prompts-client-compat.md)。

**补充文档**（`mcp-server/docs/`）：`mixin-support.md`（字节码校验支持矩阵）、`vanilla-registries.md` / `registry-data-source.md`（Registry 数据源）、`mc-skill-update.md`（自更新机制）、`prompts-client-compat.md`（Prompt/Resource 客户端兼容）。

### 移植分析（`analyze_porting_path`）

平台识别综合源码与构建/元数据（`build.gradle`、`mods.toml`、`fabric.mod.json` 等）。空目录 / 无构建也无元数据 → `ok:false` + `NOT_A_MOD_PROJECT`（不是 `platform: unknown`）。

输出契约：`targetPlatform` **必填**（未指定 → `INVALID_INPUT`，不做静默默认）；`routeSteps` 始终是给人读的 `string[]`；机器可读交接是并行的 `nextSteps[]`，每项 `{ text, tool?, args? }`，其中 `tool` + `args` 必须能直接调用（必填参数齐备、无占位值），填不齐就只给 `text`。`port_project` 按 `nextSteps` 续跑。

### 写操作（`port_project`）

默认只读。真正写盘需要同时设置 `MC_SKILL_ALLOW_WRITE=1` 与 `MC_SKILL_PROJECT_ROOT=<允许写入的项目根>`，且目标路径必须落在该根目录下。

## 数据复现与分发

`data/` 中的索引和文本由 `mcp-server/scripts/` 生成。大型 `*.jar` / `*.zip` 默认被 `.gitignore` 排除（`data/**` 有例外保留规则），不要假定 Git 一定含全部二进制。

- 只从脚本声明的官方来源重建数据。
- 运行 `cd mcp-server && npm run audit:data`；任何 `ERROR` 表示数据包不宜发布。
- 完整数据包可通过 GitHub Release 的 `mc-skill-data-full-*.zip` + `SHA256SUMS-*.txt` + `data-manifest.json` 分发。
- 本地原始包丢失时应重新 fetch，不要跨版本复制改名。

第三方文档与映射的许可说明见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

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

路径示例：`forge/1.20.1/.agents/skills/<name>/`（另有 `.cursor` / `.continue` / `.opencode` / `.zcode` 等宿主镜像）。Wave D 新增 skill 曾用 `scripts/_oneoff/propagate-wave-d-skills.mjs` 同步（一次性，勿再跑），日常镜像用 `scripts/sync-skills.ps1 -All`。

> 库模组 Skill（`mc-config` / `mc-geckolib` / `mc-curios` / `mc-patchouli` 等）**不落盘**：源稿在根目录 `knowledge/libs/<group>/mc-<name>/SKILL.md`（`all-platforms` / `fabric-only` / `neo-only` / `forge-only` / `bedrock-only`），按 AGENTS.md「库模组 Skill」解析规则使用；`propagate-wave-d-skills.mjs` 与平台 `.cursor/skills` **不再包含库项**。当前库源稿（2026-09-24 现扫 `find knowledge/libs -name SKILL.md`）：all-platforms 20 + fabric-only 10 + forge-only 2 + neo-only 2（Curios/KFF 镜像）+ bedrock-only 2 = **36 份** / **34 唯一 skillId**（口径：份数 = 各组 `mc-*/SKILL.md` 数；唯一 skillId 按目录名去重与按 frontmatter `name:` 去重**同数** 34，差额来自 `mc-curios` / `mc-kotlin-for-forge` 在 forge-only 与 neo-only 各一份镜像）。与本文 §7.5「② 库 Skill 源稿」行及 `knowledge/libs/README.md`「当前清单」一致。

| 平台/版本 | 数量 | 结构 | 说明 |
|-----------|------|------|------|
| `forge/1.12.2`–`1.20.4` 主档 | **35** | 目录（每 skill 一目录） | 15 核心 + 19 Wave D + `mc-events`（2026-08 D-1 补齐；1.7.10 为诚实 stub） |
| `forge/1.15.2` / `forge/1.17.1` | **35** / **34** | 目录 | 1.17.1 有 `mc-events`、无 `mc-capability`（与 1.20.1 集合不同） |
| `forge/1.7.10` | **3 规则 + 3 技能** | 目录 | 仅 00/01/09 + `mc-item` / `mc-registry` / `mc-events`（stub：无 05 规则，事件 API 未核实禁止生成） |
| `forge/1.8.9` · `1.9.4` · `1.10.2` · `1.11.2` | **3 规则 + 0 技能** | 只有 `rules/` | 四档各 00/01/09，`.cursor/skills` **目录不存在** ⇒ 0 技能是**按设计**（短规则树只做「别把现代 API 抄进早期档」的门），不是漏建。实测 2026-09-13（`readdir <pack>/.cursor/rules` 计 `*.mdc`、`.cursor/skills` 计条目）；禁止拿 1.12.2 的 00–10 或 35 技能顶替 |
| `forge/1.21.1` | **0 规则 + 0 技能**（draft） | 只有 `AGENTS.md` + `pack.meta.json` | 实测该目录**连 `.cursor/` 都没有** ⇒ session 必回 `PACK_NOT_FOUND`，也不在 `list_forge_versions`。登记为按设计，禁止为凑一个版本号克隆一棵新树，也禁止用 NeoForge 1.21.1 或 Forge 1.20.4 顶上 |
| `fabric/*`（**14 档**，骨架全档同数；26.1.2 为 Mojmap） | **38** | `.md` 文件（薄档/26.1.2 为目录 layout） | 各档 18 基础（含 `mc-fabric-api` / `mc-kotlin` / `mc-cloth-config`）+ 19 Wave D + `mc-events`（含 **1.21.3** 与 **26.1.2**，2026-08 审查补齐；26.1.2 为 Mojmap，禁止 Yarn）。薄档 `1.21.4`/`1.21.8`/`1.21.10` 的**规则 11 条 + Skill 38 项与其余 11 档完全同数**（实测 2026-09-13（`readdir <pack>/.cursor/rules` 计 `*.mdc`、`.cursor/skills` 计条目）：fabric 全部 14 档均为 11/38，没有例外），「薄」指的是语料不是骨架：该三档 `knowledge/` 实扫 **2 篇**（本档 `common/verified-api-<ver>.md` + 三档共用的 `version-changes/1.21.x.md`；`pack.meta.json` 里写的「1 篇」只数档专属的 `common/` 页），而有 `code-patterns/` 的 7 档为 **12–13 篇**（同为实测），且薄档**不落 `code-patterns/`**。`pack.meta.json` 的 `status:"ready"` 与这一自述不矛盾——判据取盘上实测、不取本句自称（2026-09-08 裁定「薄档即声明」） |
| `neoforge/<ver>` session 索引 | **以版本目录为准** | 目录 | 根 `neoforge/.agents/skills` **不是** session 源；主档与薄档（1.20.6 / 1.21.5 / 1.21.10）本档 Skill 同名集合（entity/datagen 等），不再是 6 个。**`neoforge/1.20.1` 本档仅 `mc-registry`**，其余走 Forge 1.20.1 overlay |
| `quilt/<ver>` 本档磁盘（规则 **4** + Skill **3**） | **3** | 目录 | 仅 QSL 差异 `mc-registry` / `mc-events` / `mc-networking`；entity/gui 等继续 Fabric overlay，不计入本档磁盘数。规则实测 2026-09-13（`readdir <pack>/.cursor/rules` 计 `*.mdc`、`.cursor/skills` 计条目）全部 10 档均为 4 条（`00-project-setup` / `01-registry` / `05-events` / `06-networking`），**不是** 00–10 全集，其余主题走同版 Fabric overlay |
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
| 兼容 / 文档库     | `mc-compat-jei`（knowledge/libs 源稿 + forge/1.20.1、neoforge/26.1 平台自有副本，非镜像）；库类（`mc-config` / `mc-cloth-config` / `mc-yacl` / `mc-geckolib` / `mc-architectury` / `mc-terrablender` / `mc-playeranimator` / `mc-pehkui` / `mc-kubejs` / `mc-balm` / `mc-modern-ui` / `mc-patchouli` / `mc-owo` / `mc-curios` / `mc-kotlin-for-forge` / `mc-trinkets` / `mc-cca` / `mc-polymer` / `mc-text-placeholder` / `mc-satin` / `mc-fabric-language-kotlin` / `mc-libgui` / `mc-lib-catalog` / `mc-author-shared-libs` / `mc-resourceful-lib` / `mc-moonlight-lib` / `mc-caelus` / `mc-spruceui` / `mc-player-ability-lib` / `mc-server-translations` / `mc-impersonate` / `mc-script-ui` / `mc-script-server` = 33 库类 + `mc-compat-jei` = **34 唯一 skillId**（**36** 份源稿；2026-09-25 现扫 `find knowledge/libs -name SKILL.md` = 36、目录名去重 = 34，份数差 = `mc-curios` / `mc-kotlin-for-forge` 在 forge-only 与 neo-only 各一份镜像 ⇒ 唯一 skillId 只多数一次。口径与本文「项目结构」的库 Skill 源稿行、「工具陷阱」表的 validate_datapack_json 行、「工具参考 §1b」的 query_loader_api 行，及 `knowledge/libs/README.md` §当前规模一致；本行上一版写「32 库类 + `mc-compat-jei` = 33 唯一（35 份源稿）」，漏举的正是 `mc-cloth-config`）→ `knowledge/libs`） |

Fabric 另含 `mc-fabric-api`、`mc-kotlin`、`mc-cloth-config`；Forge 1.12.2–1.20.4 与 Fabric 主档均含 `mc-events`（2026-08 D-1 补齐，经 `FABRIC_SKILL_DONORS` 回填的薄档带 DONOR_SKILL 横幅）。代码模式示范见 `community_knowledge/patterns/`（也可经 `mcskill://patterns/README` 读取）。

## MCP/CLI TOOLS:86

服务名：`MC-AI-Coding-Assistant-Tool`。安装与配置见 [AUTO_SETUP.md](./AUTO_SETUP.md)、[mcp-server/README.md](./mcp-server/README.md)。

推荐通用流程：

1. `diagnose_data_paths` / `list_*_versions` / `get_server_status` 确认数据与版本
2. 文档：`search_*` → `get_*_summary` → `get_*_full`（全文勿一次超过 2 页；`id` 必须来自搜索结果）
3. **平台 API** 用 `query_loader_api` / `search_loader_api` 或 `search_*_docs`；**Vanilla 签名**才用 `query_api` / `get_method_params`（仅约 1.16.5–1.20.4；1.12.2 是类名空壳；26.1+ 无索引）。规则树用 `activate_platform_pack action=session`（默认 00/01/09 + Skill 索引，见上文「规则包加载」）
4. 映射：`convert_mapping` / `lookup_obfuscated`（26.1+ 无混淆层）
5. 工程：`diagnose_gradle` / `validate_project` / `generate_datagen` / `crash_analyze` / `analyze_build_log` / `inspect_runtime`（日志型）。Forge/Fabric/Quilt/NeoForge 跑对应检查；LiteLoader/Rift/基岩的 `validate_project` 仍 skipped
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
| `convert_mapping`   | 在 **mojang / mcp / yarn / parchment / obfuscated / intermediary** 间互转类/方法/**字段**（SQLite **v3**）。`memberKind=field`；`to=mojang` 为 Tiny official 短名（同 obfuscated 层）；失败默认 `converted:null`（可选 `allow_fallback`）。**六个层不是每版都可用的**：yarn-tiny 档（fabric **1.14.4–1.21.x**）无 MCP/Parchment 可读层，`to=mcp` / `to=parchment` 直接拒绝 → `YARN_TINY_NO_MCP_LAYER`（改用 `to=yarn` 或 `query_api` / `get_method_params`）；`mcp↔parchment` 为同名层（identity）。**批量（S3）**：`memberName` 用逗号 / 分号 / 换行传 ≤50 个名字，一次拿 `results[]` + `batch{requested,found,missing}`（超上限 `INVALID_INPUT`，不静默截断；单个名字时输出形状不变）。**条目行（S2）**：`accessLines=true` 附可粘贴的 AT / AW 行，名字层按加载器分叉——Forge 成员行必须 SRG 名、NeoForge 用可读名 + 粘连描述符、Fabric/Quilt 的 AW 条目名与描述符须同工程映射层（头随 `to` 取 named / intermediary / official）；缺名或缺描述符 ⇒ `complete:false` 且行内 `<TODO…>`，完整行回灌 `validate_at` / `validate_aw` 同一解析器（`selfCheckOk`）。**生成面收窄（2026-09-26）**：AW 侧只出 `accessible` 条目，`validate_aw` 认的 `extendable` / `mutable` / `transitive-*` 并列形与两操作数指令 `inject-interface` / `extend-enum` **不代生成**（校验 ⊃ 生成，需要时手写）。**SRG 成员层覆盖（2026-09-26）**：Forge 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 六档已从 MCPConfig 削减件建出 `mappingEra=mcp-config-srg` 的库（`named` = SRG 名：1.17+ 哈希形 `m_/f_`、1.16.5 老形 `func_/field_`），这六档的 Forge AT 成员行出实名；该库只在 `platform=forge` 时参与选库。neoforge_* / quilt_* 仍无成员库 ⇒ 照旧 `<TODO…>`。**`from=mojang` 两档出处（2026-09-27）**：第一档 = 该档库的 `official` 列，那一列对**被混淆的类**存 Tiny 混淆短名（`a`／`fac`／`ccv`），只有本来不混淆的少数类带可读全路径（13 档 100 985 行实测：短名 100 310 ／可读路径 675 = 0.67%）⇒ 拿 `Container`／`Level` 这类 mojmap 可读名点查必然 `found:false`，**不得**读成「该版本没有这个类」；第二档 = 派生对照表 `data/_yarn-mojmap-pairs/`（类名级 `obf`／`mojmap`／`yarn` + 两侧 FQCN，**无 intermediary 列**），只在 `from=mojang` 且 `to` 为 `yarn`／`obfuscated` 时参与，命中带 `fallbackUsed:true` 且 notes 点名表与条数，`to=intermediary` 直接拒答不回落第一档。 |
| `lookup_obfuscated` | 崩溃日志反混淆：单 token（`method_6032` / `er` / `func_110143_aJ` / `field_100013_f`）反查 → yarn 可读名 + ownerClass + descriptor。方法→字段→类；多命中 AMBIGUOUS；26.1+ 返回 `UNOBFUSCATED_NO_YARN`。 |
| `get_server_status` | API 索引预热状态、`diagnose_data_paths` 摘要、descriptor 自检与 **updateHint**；可选 `warmup` 先加载指定版本。另返回 **`java`** 探测（`node` / `JAVA_HOME` / `version` / `ready` / `hint`，反编译与 remap 需 JDK 17+）。**只报本机 Java 现状，不做 Gradle ↔ JDK 匹配判定**（那走 `diagnose_gradle`）。                                                                                    |
| `get_version_info`  | **【Forge only】** 按 MC 版本 + 操作（如「注册方块」）给出推荐做法、关键变更、gotchas 与官方 Changelog 链接。                                                                                       |


### 1b. Loader API 与平台包（5）

| 工具 | 作用 |
| --- | --- |
| `query_loader_api` | 查 Forge/NeoForge/Fabric-API/QSL 摘要中的类与 `MethodInfo`。**必填** `platform` + `minecraftVersion`，无默认 1.20.1。**不是** `query_api`。`found:false` 不代表游戏里没有该类。LiteLoader/Rift/ModLoader 无摘要 → `PLATFORM_SKIPPED`（可 `ingest_loader_api`）。 |
| `search_loader_api` | 在 `fqcnIndex` 上子串搜索（`limit` 默认 20 封顶 50）。`mode=list` 列出已索引档 / skipped / cache overlay。 |
| `ingest_loader_api` | 用户自备 jar（官方不代下的 LiteLoader/Rift/ModLoader）抽成摘要，只写 `$MC_SKILL_CACHE/loader-api-summaries` overlay，**禁止写仓库 `data/`**。`jarPath` 绝对路径 + `mappingsVersion` 必填。默认 dryRun。不要用 `--file`。**同一平台多套构件时用 `library` 选键位**（2026-09-28）：`platform=fabric` 的候选键是 `<ver>-fabric-api`（API 库）与 `<ver>-fabric`（加载器本体），从前写侧固定取第一个候选键 ⇒ **拿 fabric-loader jar 不传 `library=fabric` 会覆盖该档的 API 摘要**；后缀不在候选里 ⇒ `INVALID_INPUT` 并列出候选，不猜、不新造键名。 |
| `detect_mod_project` | 只读探测模组工程（Quilt 在 Fabric 前）。`projectPath`（CLI `--project`）优先于 `MC_SKILL_PROJECT_ROOT`。知识库根 / 某版 `scaffold` → `KNOWLEDGE_REPO_NOT_MOD`（Architectury 的 `forge/`+`fabric/` 无版本 `pack.meta.json` 不误伤）。对不上规则树 → `PACK_NOT_FOUND`，禁止邻档 00–10。 |
| `activate_platform_pack` | `list` / `session` / `write` / `deactivate`。session 不写盘、不依赖项目根：默认规则 **00/01/09** + Skill **索引**（`topics`/`task` 追加并集；`skillNames` 注入正文上限 8；见上文「规则包加载」）。write 默认 dryRun，`hosts` 必填。不要再用 `includeSkills`，改用 `writeSkillStubs`（默认 true，只写 stub）；`includeSkillBodies` 才写全文。目标只能是用户模组工程（拒绝知识库根）。**不能**开关 IDE 扫描器。 |


### 2. 工程辅助（7）


| 工具                 | 作用                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_gradle`  | 检查 `build.gradle` / `gradle.properties`：ForgeGradle + Fabric/Quilt Loom + NeoGradle/ModDevGradle。26.1 Loom 必须 `net.fabricmc.fabric-loom`、Java 25、禁止 `modImplementation`。liteloader 插件走轻量模式。Rift / BaseMod / 基岩仍早退。    |
| `generate_datagen` | 生成 DataGen Provider 模板。**platform 与 version 必填**。**Forge 1.20.1 与 1.20.4**（1.20.4 仅 recipe，`buildRecipes(RecipeOutput)`）、NeoForge 1.20.4/1.20.6（仅 recipe）/1.21.x/26.1、**Fabric** 1.21.1/**1.21.3**/1.21.4/1.21.8/1.21.10/1.21.11 与 26.1（无 1.21.5）。Quilt 无 generate_datagen，改口 `search_docs platform=quilt`。其它 Forge 版本返回 error。需 `modId`、`targetName`。 |
| `crash_analyze`    | 解析崩溃报告全文（或传 `crashReportPath` 直接读文件），推断 `crashKind`（含 `fml` / `client` / `server` / `fabric` / `quilt` / `liteloader` / `rift` / `modloader`）、可能成因、缺前置/版本不兼容与 `logHints`。优先于盲目网页搜索；实务分类可配合社区工具。                                                                                              |
| `validate_project` | Forge：mods.toml / DeferredRegister。Fabric/Quilt：`fabric.mod.json` / `quilt.mod.json` + entrypoint。NeoForge：`neoforge.mods.toml`、`@Mod` + `IEventBus`。LiteLoader/Rift/ModLoader/基岩 `skipped`。坏 recipe 只 warning。Java 扫描上限默认 300（`MC_SKILL_JAVA_SCAN_MAX_FILES`）。 |
| `check_publish_ready` | 发布前清单：license/version、`build/libs` 是否像正式 jar，并读 `community_knowledge/authored/publishing.md` 的清单（缺项只 warning）。**不上传**、不调 Curse/Modrinth API。 |
| `inspect_runtime` | 日志型 inspector：优先 `logsDir`/`crashReportsDir`；否则有界探测 `run/logs` 等。禁止全盘 / JVM attach。默认读文件尾部。 |
| `resolve_lib_skills` | 按平台 + 精确 MC 版本解析 `knowledge/libs` 库 skill 源稿（§3.6：组映射 + `platforms`/`mcVersions` 过滤）；返回仓库相对 `path` 与 `versionsJson` 真值提示（带该文件的库写坐标前先读对应 MC 版本 slot）。与 CLI `lib resolve` **同一 core**；只解析、不返回正文 —— AI 仍直接读源稿（文件即用）。 |




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
| `list_neoforge_versions`   | 列出本地 NeoForge 文档版本；主文档默认 **26.1**（26.2 构建已发布，但官方主文档不按版本分线且本仓无 26.2 语料 ⇒ 不克隆冒充）；**1.20.1** 可回退 Forge 数据。 |
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




### 6b. 基岩 Add-On（9）

与 Java `search_*_docs` / `validate_project` 分开。基岩用 Learn 文档与 pack JSON，不要用 Yarn / Mixin / `query_api`。

| 工具 | 作用 | 判读（三态） | 错误码 |
|------|------|------|------|
| `search_bedrock_docs` | 检索 Microsoft Learn 基岩文档（带滞后 `docsStatus`）。可按调用放宽 `limit`（默认口径不变；只加宽窗口，不改排序与 release-notes 降权，池大小与放宽后的差额会在 `demotion` / `warning` 里说破）。 | 命中类：`ok` + `results[]`；**空 ≠ 没有该文档** —— 先看 `docsStatus` / `demotion` / `warning` | — |
| `get_bedrock_doc_summary` | 基岩页 L1 摘要。 | 命中类：`ok` + 摘要；缺页走 `ok:false` + `error` | — |
| `get_bedrock_doc_full` | 基岩页全文。 | 命中类：`ok` + 全文；**一次不超过 2 页** | — |
| `get_bedrock_doc_related` | 基岩相关页。 | 命中类：`ok` + 数组；空数组 ≠ 失败 | — |
| `validate_addon_manifest` | 校验 Add-On `manifest.json`（header/modules uuid 与 version）。不是 `validate_project`。 | 校验类：结论在 `errors[]`；本档未记载其专属三态名，以响应 `ok` / `error` 为准 | — |
| `validate_bp_json` | 校验行为包实体等 JSON。 | 校验类：同上 | — |
| `generate_addon_manifest` | 只吐 manifest JSON 文本，不写盘。 | 生成类：`resultKind` 三态同 §10（`ok` / `generation_failed` / `write_blocked`） | — |
| `generate_bp_entity` | 只吐行为包实体 JSON 文本，不写盘。 | 生成类：同上 | — |
| `analyze_bedrock_log` | 基岩 content-log（`content_log.txt`）分诊。**不是** Java `crash_analyze`。 | 读取类：无匹配 ⇒ 空结果 ≠ 无问题 | — |

> 判读列口径：`ok:true` = 有结果；`ok:false` = 工具失败（原因在 `errors[]` / `error`）。**命中类工具的空结果不等于目标不存在**（索引缺失、语义降级、工具边界都会写明）。生成类另有 `resultKind` 三态，见 §10。
> 错误码列的 `—` = 本仓库文档未记载该工具的专属错误码；实际错误以响应里的 `errors[]` / `error.code` 为准，**禁止凭记忆补码**。


### 7. 社区知识库（4）

与官方文档分离；**不替代** `search_*_docs`。适合发布、崩溃分类、软依赖、机器 GUI、库选型等实务。索引 **110** 条（`authored` 95 / `links` 11 / `permitted` 4，as-of 2026-10-02 直读 `community_knowledge/indexes/index-l0.json`）；库集成占其中 **48** 篇 `lib-*.md`。用法规则见 [`community_knowledge/AGENT_USAGE.md`](./community_knowledge/AGENT_USAGE.md)；主题 id 速查见 [`community_knowledge/README.md`](./community_knowledge/README.md)。


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

- 五组：`all-platforms` 20 / `fabric-only` 10 / `forge-only` 2 / `neo-only` 2（Curios、KFF 与 forge-only 镜像）/ `bedrock-only` 2 = **36 份** `mc-*/SKILL.md`（**34** 唯一 skillId）
- 解析规则：platform → 组映射（forge→forge-only+all-platforms；fabric/quilt→fabric-only+all-platforms；neoforge→neo-only+all-platforms；bedrock→bedrock-only）+ frontmatter `platforms`/`mcVersions` 二次过滤。路由中枢：`mc-lib-catalog`

**③ 数据链**（短文 frontmatter → 脚本生成 → MCP 消费）

```
authored/lib-*.md frontmatter（+ library-integration / library-integration-jei-emi 导航专篇）
  → mcp-server/scripts/build-library-catalog-from-authored.mjs → library-catalog.ts（50 条 catalog / 2632 verifiedApi 键 / officialUrls）
  → scripts/build-lib-manifest.mjs（Modrinth API）→ lib-manifests/all.json（49 slug / 3,003 版本条目；as-of 2026-09-25 现算）
  → scripts/batch-decompile.mjs（分批反编译，源码按需生成到 $MC_SKILL_CACHE，不入库）
  → scripts/merge-verified-api.mjs → 回填 verifiedApi
  → scripts/build-api-summaries.mjs → lib-api-summaries/（48 份库 API 摘要）
  → check_dependencies 消费 catalog + manifest（库识别 / 版本摘要）
```

**脚本位置分散，两处都有**（勿只查一处）：

| 脚本 | 位置 |
|---|---|
| `build-library-catalog-from-authored.mjs` | `mcp-server/scripts/` |
| `build-lib-manifest.mjs` | **`scripts/`（仓库根）** |
| `batch-decompile.mjs` | **`scripts/`（仓库根）** |
| `merge-verified-api.mjs` | **`scripts/`（仓库根）** |
| `build-api-summaries.mjs` | **`scripts/`（仓库根）** |

数据位置见 [反编译数据产物](#反编译数据产物) 一节。

> 这两个口径的**权威出处与复算纪律**见 [`CONTRIBUTING.md` §库数据链计数口径](./CONTRIBUTING.md)；本处只给现场读数与结论。
>
> **计数口径 A（`verifiedApi` 键）**：分母 = `mcp-server/src/diagnostics/library-catalog.ts` 中各 entry 的 `verifiedApi` 顶层 `"<gameVersion>/<loader>"` 键之和，**实算 2632（2026-09-24 复跑该命令）**；复核命令 `grep -cE '"[0-9][^"]*/[a-z]+": \{' mcp-server/src/diagnostics/library-catalog.ts`（同数钉在 `mcp-server/scripts/assert-lib-ownership.mjs` 的 `LEDGER.verifiedApiKeys`，磁盘实算与钉值不一致该门即红；文档历史写死值 1880 / 1836 / 1830 均已过期，本文件其余处出现的 1836 属历史遗留，一律以本行口径为准）。
> **计数口径 B（库 API 摘要侧）**：分母 = `mcp-server/data/lib-api-summaries/*.json` 的份数与其 `versions` 组键合计，**实算 48 份 / 824 组（2026-09-24 复跑该命令）**；复核命令 `node -e "const fs=require('fs'),p='mcp-server/data/lib-api-summaries';const f=fs.readdirSync(p).filter(x=>x.endsWith('.json'));console.log(f.length,f.reduce((a,x)=>a+Object.keys(JSON.parse(fs.readFileSync(p+'/'+x,'utf8')).versions||{}).length,0))"`。A 与 B 是**两个不同分母**（2632 ≠ 824），禁止互相顶替或混写。
> 版本窗口另见各 entry 的 `supportedVersions: string[]`（Modrinth 实测的受支持 MC 版本列表），
> 与 `verifiedApi` 的 `gameVersion/loader` 键是**两个独立字段**，二者并存。




### 8. 移植、数据诊断与上游可用性（4）


| 工具                     | 作用                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_data_paths`  | 诊断数据目录配置（高级排障用）。诊断 `MC_SKILL_DATA` / `MC_SKILL_COMMUNITY` 解析结果，以及 forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock/community 是 `found` / `empty` / `not_found`。排障首选。                                                                   |
| `analyze_porting_path` | 扫描项目，识别平台/版本/Mappings/Architectury，输出风险、`routeSteps`、参考链接与建议的 `query_api` 调用。**`targetPlatform` 必填**（禁止静默默认 forge→neoforge，缺失 → `INVALID_INPUT`）。`routeSteps` 是给人读的 `string[]`；机器可读交接在 `nextSteps[]`（`tool` + 可直接调用的 `args`）。LiteLoader / Rift / ModLoader / 基岩 → `UNSUPPORTED_PORT`。                                                                                                               |
| `port_project`         | 执行移植步骤：`init_architectury` / `extract_common` / `apply_version_migration`。默认 **dryRun**；真正写入需 `dryRun=false` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + 路径在 `MC_SKILL_PROJECT_ROOT` 内。 |
| `query_upstream_releases` | 查**上游发布源**「某个加载器/映射/模组的版本到底存在吗、最新出到第几 build」。`source` 七选一：`forge` / `neoforge`（maven-metadata.xml，全量可查）、`fabric-loader` / `fabric-yarn` / `quilt-loader` / `parchment`（端点按 MC 版本分列，**必须带 `minecraftVersion`**；parchment 的 artifact 名是 `parchment-<mc>`、版本串本身是日期如 `2023.09.03`）、`modrinth`（`slug`，任意第三方模组/库）。**与 `list_*_versions` 的区别**：那些列的是本仓库已入库的文档档位，不在清单 ≠ 上游没有。三态必读：`ok:false` ⇒ 没查到（网络/HTTP/解析），**不得**据此断言上游没有；`ok:true` + `available:false` ⇒ 上游确实没有。`matchRule` 回显版本归属规则（如 neoforge：MC 1.21.1 → 前缀 `21.1.`）。`releases` 按版本降序截断到 `limit`（默认 12），总数看 `total`；正式版排在同号 nightly 之前。**需联网**；Node TLS 失败自动回退 `curl.exe --ssl-no-revoke`，不改系统证书库；入口与重定向落点都过主机白名单（parchment 的托管后端 `ldtteam.jfrog.io` 已显式登记），落点不在白名单 ⇒ 报 `URL_REJECTED` 且不读正文。仓库首个带 `outputSchema` + `structuredContent` 的工具。**S4′ 磁盘缓存（2026-09-25）**：按档 TTL —— `available:true` 6 小时 / `available:false` 2 小时（证否会被新版本推翻，故短档）/ `ok:false` **不缓存**；缓存根只许 `$MC_SKILL_CACHE/upstream-cache/`（解析进仓库 ⇒ 拒写）；响应带 `cache{hit,tier,ttlMs,ageMs?,wrote?,note?}`，`refresh=true` 强制回源、`MC_SKILL_UPSTREAM_CACHE=0` 整体关掉；缓存键含 `source`/`minecraftVersion`/`slug`/`limit`。`outputSchema` 同步声明了 `cache` 位。 |




### 9. Registry / Mixin / 资源（9）


| 工具                                                     | 作用                                                                   | 判读（三态）                                                              | 错误码        |
| ------------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------- |
| `query_registry`                                       | 查询 Vanilla 资源 ID（`nameLayer: registry_id`）；类/方法名用 `convert_mapping`。 | 命中类：`ok` + 结果；**空 ≠ 没有该 ID**（只覆盖 `minecraft:`）                | —           |
| `mixin_analyze`                                        | 解析 mixins.json 与 @Mixin 注入目标（多映射层；高风险，见 supportMatrix）。`deep:true` 时基于已缓存 remapped 客户端 jar 做字节码级校验（目标类/选择器/@At 调用点）；jar 未缓存 → CACHE_MISS 引导（不自动下载）。 | 校验类：`ok` + 结论；**jar 未缓存 = `CACHE_MISS` 引导，不是失败**（先调 `get_minecraft_source`） | `CACHE_MISS` |
| `validate_at`                                          | 字节码级校验 Forge/NeoForge `*_at.cfg`：类/成员存在性（继承链/record/内部类）、映射层不匹配建议、跨文件冲突。 | 校验类：结论在 `errors[]`；本档未记载其专属三态名，以响应 `ok` / `error` 为准      | —           |
| `validate_aw`                                          | 字节码级校验 Fabric `.accesswidener`：header/namespace、条目类型、存在性、transitive、跨文件冲突。 | 校验类：同上                                                               | —           |
| `audit_resources`                                      | 静态检查模型纹理引用、孤儿纹理、modId 命名等。                                           | 校验类：同上（静态面，不做字节码级）                                             | —           |
| `validate_datapack_json`                               | recipe / loot_table / advancement / tag 精简 JSON 校验（1.21+ recipe `result` 可为对象；不是完整 pack_format schema）。                  | 校验类：**精简 schema ⇒ 通过 ≠ 完整 pack_format 合规**，只证明覆盖了本节列出的面 | —           |
| `get_workflow_template`                                | 工作流全文（以 `get_workflow_template` 列表为准；与 MCP Prompt 同名；Cursor tools 兜底）。 | 命中类：`ok` + 全文；模板名以该工具的列表为准（不是靠猜名字）                     | —           |
| `list_knowledge_resources` / `read_knowledge_resource` | 列出/读取 `mcskill://`（含 patterns、schema、workflow、community 等）。          | 命中类：`ok` + URI 列表 / 正文；缺 URI ⇒ `ok:false`                        | —           |

> 判读列口径：`ok:true` = 有结果；`ok:false` = 工具失败（原因在 `errors[]` / `error`）。**命中类工具的空结果不等于目标不存在**。生成类另有 `resultKind` 三态，见 §10。
> 错误码列的 `—` = 本仓库文档未记载该工具的专属错误码；实际错误以响应里的 `errors[]` / `error.code` 为准，**禁止凭记忆补码**。本组唯一的确证码是 `CACHE_MISS`（`mixin_analyze deep` 的 jar 未缓存引导，不是错误而是"先补缓存"）。

> 计数口径：本组 **9 个工具 / 8 行** —— 末行把 `list_knowledge_resources` 与 `read_knowledge_resource` 合并为一行，标题「（9）」数的是工具数。

字节码级校验（`mixin_analyze deep` / `validate_at` / `validate_aw`）依赖 T2 缓存管线：
jar 未缓存时返回 `CACHE_MISS` 引导（先调 `get_minecraft_source`），**绝不自动大下载**。
详见 `mcp-server/docs/mixin-support.md`。




### 10. 代码生成模板（9）

本组 9 项工具**默认只吐文本 + `suggestedPath`，不写盘**。可选写盘须同时满足：`write=true` + `confirmed=true` + 环境变量 `MC_SKILL_ALLOW_WRITE=1` + 绝对路径 `MC_SKILL_PROJECT_ROOT`（缺失即 `PROJECT_ROOT_REQUIRED`）；写入路径必须相对工程根且不含 `..`，越界报 `PATH_OUTSIDE_ALLOWLIST`。缺任一条件只回文本，不会静默落盘。**三态语义（2026-09-19）**：默认（无 `write`）= dry-run，恒 `ok:true` + `resultKind:"ok"`；**生成失败** ⇒ `ok:false` + `resultKind:"generation_failed"`（原因在 `errors[]`）；**写入未完成** ⇒ `ok:false` + `resultKind:"write_blocked"`（CLI `success:false` + exit 1，写盘未发生，文本预览仍在 `result`，细粒度原因在 `writeError.code`）。计数口径：本组就是下表 9 项；**`generate_datagen`（DataGen Provider 模板）归 §2 工程辅助**，不在本组内。

| 工具 | 作用 |
|------|------|
| `generate_model` | 方块/物品 JSON 模型与 blockstate 模板。`version` 必填；`kind` 默认 `block`，`kind=item` 只出物品模型（无 blockstates）。 |
| `generate_lang` | en_us + zh_cn lang JSON 骨架。`version` 必填；骨架不随 pack_format 变。**空 `entries` 不静默（2026-09-25 S6-③）**：仍 `ok:true`，但响应带披露 warning + 机读 `emptyEntries:true` ⇒ 那是空骨架，不是成品。 |
| `generate_network_packet` | 网络包（C2S / S2C）骨架，按平台与版本给注册与收发样板。 |
| `generate_capability` | Capability / DataAttachment 骨架。`platform` 与 `version` 必填。forge 1.20.1（及 1.18.2–1.20.4）Capability；neoforge 1.20.1 同 Capability 形态、1.20.4+ Data Attachment；fabric/quilt → error 改口 CCA。 |
| `generate_config` | 配置骨架。`loader` 与 `version` 必填，禁止默认 forge。neoforge 1.21+/26.1/1.20.4/1.20.6 用 ModConfigSpec；1.20.1 用 ForgeConfigSpec（Forge 兼容）；fabric/quilt 吐 Cloth Config 最小骨架并 warning 声明依赖（不是改口 mc-config）。fabric/quilt 的**默认永远是 Cloth**；YACL 只作**显式 opt-in**（`library` 参数已实现：枚举 `cloth | yacl`，默认 `cloth`，不传即 Cloth；禁止改默认）。**传 `library=yacl` 拿到的是结构壳**：除类声明与已核实成员名外全是 `// TODO(未核实)`，用户必须另外对自己的 yacl jar 跑 `ingest_loader_api` 才能编译。Cloth / YACL 等**第三方配置库不是 loader API**：要用其方法名，必须先由用户自备 jar 走 `ingest_loader_api` 入库（默认 dryRun，只写 `$MC_SKILL_CACHE` overlay），未入库 → `query_loader_api` 只回 `found:false`，只能留 `// TODO(未核实)`。 |
| `generate_entity_renderer` | 实体渲染器骨架。`platform` 与 `version` 必填；fabric/quilt 直接 error。 |
| `generate_worldgen` | 世界生成 JSON 骨架。`platform` 与 `version` 必填，且有**两端版本哨兵**：1.x 只收 1.18.2–1.21.x、26.x 只收 `26.<n>[.<n>]`（编造版本号如 `1.99.9` 一律拒绝并点名 `WORLDGEN_MAX_MINOR_1X` 抬哨兵出口，不默默生成）；`platform=forge` × 26.x 直接拒绝（Forge 无 26.x）。forge / neoforge 的 feature JSON；fabric / quilt 仅 `configured_feature` / `placed_feature`（禁止 forge `biome_modifier`）。无模板时 `errors` 列出支持档。 |
| `localize_mod` | 汉化：自有模组 `diff` / `draft_zh`，或第三方 jar `extract` / `pack_draft`。无机器翻译，未填项标 `needsTranslation`；无 `en_us` 时可回退其它语言作源。 |
| `generate_playtest_driver` | 游玩自测骨架：`driverMode` 默认 `external_bridge`（桥动作序列 + 后置条件 + 证据约定）；`in_jvm_player_agent` 在 **`PLAYTEST_VERIFIED_TIER` 列出的档**（唯一真源；as-of 2026-10-04 为 **53** 项 = `fabric` 18 / `neoforge` 14 / `quilt` 10 / `forge` 10 / `liteloader` 1，含去混淆档 `fabric`/`neoforge` 的 `26.1`/`26.1.1`/`26.1.2`/`26.2`/`26.3`，以及 forge `1.12.2`–`1.19.4` 八档与 fabric `1.14.4`）出**真执行器**（意图菜单 + 邮箱消费 + 类型化后置条件 + 逐意图预算），表外档只出契约 + 结构壳。不装桥、不跑游戏。 |

### 11. 日志与依赖诊断（7）

| 工具                    | 作用                                      | 判读（三态）                                               | 错误码                                                     |
| --------------------- | --------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| `analyze_log`         | 解析游戏/崩溃日志片段（可复用 `crash_analyze` 分类）。    | 读取类：`ok` + 分类结论；片段解析 ⇒ 结论只覆盖你贴进来的那一段            | —                                                        |
| `analyze_build_log`   | 解析粘贴的 Gradle/javac 构建失败日志（不执行 gradlew）；返回符号/文件与建议工具。 | 读取类：`ok` + 符号/文件 + 建议工具；**它不跑 gradlew**           | —                                                        |
| `get_migration_guide` | 默认 Primer **toc**；`section` 只返回该章；`full=true` 才全文（含 url/license/loader）。route 含 platform 或 `from->to`。 | 命中类：默认只给 toc（三档：`toc` / `section` / `full`）；**没给全文不等于没有该章** | —                                                        |
| `check_dependencies`  | 根据 `build.gradle` / `mods.toml` / `fabric.mod.json` / `quilt.mod.json` / `litemod.json` / `riftmod.json` / 基岩 manifest 提示依赖问题：loader 判定（quilt/fabric/forge/neoforge/liteloader/rift/modloader/bedrock）、库模组识别（catalog 接线）、冲突/陷阱检测。返回 `detectedLibraries`（含 `supportedVersions` 反编译验证版本窗口与 `manifestSummary` 版本/加载器摘要，数据来自 `library-catalog.ts` + `data/lib-manifests/all.json`）。 | 命中类：`ok` + `detectedLibraries`；**启发式 + catalog ⇒ 未收录的库会漏**（不是完整 Gradle 解析） | —                                                        |
| `inspect_playtest_evidence` | 读游玩自测证据（exit-code / state.json / `[QA]` 段 / calls.jsonl / 截图），每件三态 `present\|absent\|unreadable`；须 `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT`（realpath 硬边界）。可选委派 `inspect_runtime` 读日志。 | **三态**：每件 `present` / `absent` / `unreadable`；**缺件不得读成"没有失败"** | —                                                        |
| `playtest_intent` | 游玩自测**意图邮箱**（`in_jvm_player_agent` 真执行器的 LLM 侧接线）：`action=read\|write`；write 写 `<evidenceDir>/intent.json`（driver 的 `waitintent` 步消费并改名 `intent.done.json`）。校验顺序：confirmed → 禁列（kill/tnt/fill）→ 菜单（`intent-menu.json`）→ 参数白名单 → 必填 → 邮箱占用（overwrite 覆盖）。须 `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT`。失败码：`CONFIRMATION_REQUIRED` / `INTENT_FORBIDDEN` / `INTENT_NOT_IN_MENU` / `PARAM_NOT_DECLARED` / `MISSING_REQUIRED_PARAM` / `MAILBOX_BUSY` / `MENU_NOT_FOUND`。 | 写侧六段校验；**非法在写侧就拒**，不进执行器。失败形态三档：邮箱形态失败 = 数据（继续守候）／协议违规 = 写侧拒／脚本形态 = 判红停轮 | `CONFIRMATION_REQUIRED` · `INTENT_FORBIDDEN` · `INTENT_NOT_IN_MENU` · `PARAM_NOT_DECLARED` · `MISSING_REQUIRED_PARAM` · `MAILBOX_BUSY` · `MENU_NOT_FOUND` |
| `playtest_bridge` | 调 BlackBoxPro 桥（host 恒 `127.0.0.1`，端口默认 38081）：`status` 看 `/status.ready`（已进世界）；`execute` 发 `/execute`（原生超时 ⇒ `PLAYTEST_TIMEOUT`）；`await` 轮询 `query_*` 等条件（桥无 `wait_until`）。`execute`/`await` 须 `confirmed=true` + 授权。桥无鉴权且通配绑定 —— 只在本机用。 | **超时 ≠ 没失败**：原生超时映射 `PLAYTEST_TIMEOUT`，**不得塌成"没失败"**。`/status.ready` 不可信，判"在不在世界"看 `query_player_state` | `PLAYTEST_TIMEOUT`                                       |

> 判读列口径：`ok:true` = 有结果；`ok:false` = 工具失败（原因在 `errors[]` / `error`）。**命中类工具的空结果不等于目标不存在**。本节三个真三态面：`inspect_playtest_evidence` 的 `present|absent|unreadable`、`playtest_intent` 的三档失败形态、`playtest_bridge` 的超时语义。
> 错误码列的 `—` = 本仓库文档未记载该工具的专属错误码；实际错误以响应里的 `errors[]` / `error.code` 为准，**禁止凭记忆补码**。本节填写的 8 个码均为文档具名值。

### 12. 自我更新（1）

| 工具 | 作用 |
|------|------|
| `mc_skill_update` | 检查 / 应用本仓库 **tooling + data** 更新（GitHub Release）。`action=check\|apply`；`scope=tooling\|data\|all`；默认 `channel=stable`（忽略预发布）。`apply` 默认 dryRun；真写需 `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT`=**本仓库根**。返回 `filesToOverwrite` / `diskSpace` / `restartRequired`。CLI：`node mcp-server/dist/cli.js update --action check\|apply`（旧位置参数 `check\|apply` 仍兼容，stderr 有迁移提示）。详见 [`mcp-server/docs/mc-skill-update.md`](./mcp-server/docs/mc-skill-update.md)。 |

`get_server_status` 附带 `buildStatus`（src 比 dist 新时 `buildRequired=true`，提示重新 `npm run build`）、`updateHint`（上次 check 缓存，默认 TTL 1h）与 `pendingRestart`。

### 13. 反编译与模组源码（5）— T2 Wave C

**默认零下载**：不预热、不预取；仅显式调用时按需下载到 `$MC_SKILL_CACHE`（默认 `%APPDATA%/mc-skill-cache` / `~/.config/mc-skill-cache`），**绝不写项目目录**。`MC_SKILL_SKIP_DOWNLOAD=1`（CI）时下载类工具诚实失败并给出指引。**Java 17+ 前置**（VineFlower / tiny-remapper）：缺失时返回 `TOOLCHAIN_MISSING` + Adoptium 安装指引，进程不崩溃。

| 工具 | 作用 |
|------|------|
| `get_minecraft_source` | 按需下载+重映射+反编译真实 MC 源码，返回类源码片段（支持行区间 / `force` 重编译）。首次 3–10 分钟，同版本缓存命中 <1s。 |
| `analyze_mod_jar` | 纯 Node 解析本地 mod jar：fabric.mod.json / mods.toml / neoforge.mods.toml、mixins.json 引用、entrypoints、依赖、AW/AT。传 `version` 则回显 `mcVersionConstraints` + `versionMatch`（match / mismatch / unknown，未核实形态不猜）。无 Java、零下载。 |
| `decompile_mod_jar` | VineFlower 按需反编译本地 jar → `$MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/`，返回源码树摘要；可选 remap（需匹配 MC 版本）。 |
| `search_mod_code` | 对已反编译源码做行级 grep（子串/正则），返回 file:line 命中；入口：`decompiledDir` 或已反编译过的 `jarPath`。 |
| `download_official_mdk` | 下载官方 MDK zip 到 `$MC_SKILL_CACHE`。GitHub pin commit（校验和在 `mcp-server/data/mdk-checksums.json`）；默认 `dryRun`。解压依赖 unzip / 7z / bsdtar。 |

**版本支持矩阵**（与 26.x 现状对齐）：

| 版本区间 | Yarn | Mojmap | 说明 |
|---|---|---|---|
| 1.14 – 1.21.11 | ✅ | ✅ | 两步 remap（official→intermediary→named） |
| 26.1+ | ❌（已停更） | ✅ | 去混淆，免 remap |

**与 `query_api` 的分工**：`query_api` / `get_method_params` 查 **1.16.5–1.20.4 Vanilla** 签名（快、离线）；**不含** Forge/Fabric API，**26.1+ 无索引**。本节取源码类工具（`get_minecraft_source` / `decompile_mod_jar` / `search_mod_code` / `download_official_mdk`）仅在确实需要完整源码/反编译时使用（下载量大），各工具 description 均带 ⚠️ 边界提示。

### 反编译数据产物

**已入库的反编译数据产物**（供 `check_dependencies` 等消费，clone 后即用）：

| 数据 | 位置 | 内容 |
|---|---|---|
| `library-catalog.ts` | `mcp-server/src/diagnostics/` | **50** 条 catalog（48 篇 `lib-*` + 集成导航专篇）/ **2632 个 verifiedApi 键**（`gameVersion/loader → packages/entrypoints`）+ **`supportedVersions` 版本窗口**（Modrinth 实测受支持 MC 版本列表，反编译验证）+ `officialUrls` |
| `lib-api-summaries/*.json` | `mcp-server/data/` | **48 份**库摘要 / **824** 个版本组（as-of 2026-10-02 现算；旧值 44 库 / 12,225 类 / 49,040 方法 / 约 4MB 已过期）；按库累计 public 类 114,708 / 方法签名 545,127，磁盘约 **38 MB**。复核：`node -e "const fs=require('fs'),p='mcp-server/data/lib-api-summaries';…"`（见本表下方计数口径 B） |
| `lib-manifests/all.json` | `mcp-server/data/` | **49** slug / **3,003** 版本条目（版本号/URL/hash/loader 矩阵，Modrinth API 生成）。复核（as-of 2026-09-25 现算）：`node -e "const j=require('./mcp-server/data/lib-manifests/all.json');console.log(j.length, j.reduce((a,e)=>a+e.entries.length,0))"` ⇒ `49 3003`（旧值 `48 2870` = 第 44 轮翻页修复前的首页截断面）；嵌套键是 `entries`，按 `versions` 取会算出 0 |

> **`packages` 是启发式产物，不可当 import 依据**：`verifiedApi.<版本/加载器>.packages` 由 `scripts/batch-decompile.mjs`
> 从反编译产物的顶层目录截得来（通用 TLD 取前 3 段、其余取前 2 段，且同层只按字母序取首个子目录），
> 所以它只回答「这个库大概活在哪几个包根下」，**不是**可直接照抄的全类名清单。要落到具体类名，
> 必须走 `query_loader_api`（先让用户自备 jar 跑 `ingest_loader_api`）或 IDE 补全核对。
> 归属侧已有硬约束：`scripts/merge-verified-api.mjs` 会整行拒绝「包根已被别的库条目证实」的包名（JiJ 内嵌库泄漏），
> 自检见 `mcp-server/test-scripts.mjs` 的 §S3 块。

> **已知缺口（已实测核实，不伪造）**：catalog 50 条中有 **6** 条 `verifiedApi` 为空对象（2026-09-13 实算：逐 entry 花括号配对取空体）—— 其中 4 条是拉不到 jar 的第三方库 `lib-config-legacy`、`lib-libgui`、`lib-server-translations`、`lib-spruceui-obsidianui`。根因：这 4 条在 `library-catalog.ts` 中 `modrinthSlug` 为空，且实测 Modrinth `project/libgui`、`project/spruceui`、`project/server-translations-api`、`project/config-legacy` 均返回 **404**（无对应项目），因此 `build-lib-manifest` 拉不到版本清单、`batch-decompile` 无 jar 可反编译，`verifiedApi` 保持 `{}`。这些库的 API 请以各自 `officialUrls`（GitHub 仓库）为准，禁止从邻库或邻版克隆摘要。另 2 条 `authored/lib-traps-2026`（`role: "trap"`）与 `authored/library-integration`（汇编条目）按设计不带 `verifiedApi`，不属缺口。
> 注：`lib-spruceui-obsidianui` 条目中的 `obsidianui` 在 Modrinth 确实存在（200）。若后续要为其补摘要，正确做法是在 `community_knowledge/authored/lib-spruceui-obsidianui.md` 的 frontmatter 补 `modrinthSlug` 后重跑数据链，**不要**直接手改生成物 `library-catalog.ts`。

反编译源码本体（28 万 .java）**不入库**（按需生成至 `$MC_SKILL_CACHE`）；`search_mod_code` 在源码缺失时返回 `NOT_FOUND` + 指引先调 `decompile_mod_jar`。相关脚本：`scripts/build-lib-manifest.mjs`（manifest）、`scripts/build-api-summaries.mjs`（API 摘要）、`scripts/batch-decompile.mjs`（分批反编译）、`scripts/merge-verified-api.mjs`（回填 catalog）。

另：`registerPrompt` / `registerResource`（工作流与知识 URI）供支持 prompts/resources 的客户端使用；详见 `mcp-server/docs/prompts-client-compat.md`。
### 工作流模板（MCP Prompts）

工作流模板通过 `registerPrompt` 注册（支持 prompts 的客户端可用）；Cursor 等仅 tools 客户端用该工具（`get_workflow_template`）获取同款全文。**共 49 个**（as-of 2026-10-02 由 `get_workflow_template` 的枚举实测；本表已列全）。

这些模板是 **Agent 步骤清单**（人在环）：对齐创意与版本取舍后给出检索/草稿/校验顺序。**没有** Gradle / 拷 jar 进游戏目录 / 上传发布的 MCP 工具；`mc-build-mod` / `mc-ingame-iterate` 只列步骤，须用户确认后在本机执行。不代跑 Gradle、不自动拷 mods、不上传商店——高风险步骤写明「用户确认后执行」，这是设计。


| 模板名               | 标题      | 流程要点                                                                                                              |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `mc-new-block`    | 新方块工作流  | DeferredRegister 注册 → BlockItem → 模型（generate_model）→ lang（generate_lang）→ loot（generate_datagen）→ 可选 tags/recipe |
| `mc-new-entity`   | 新实体工作流  | EntityType + 属性 → SpawnPlacement/生物蛋 → 渲染器（generate_entity_renderer）→ loot/音效                                     |
| `mc-new-gui`      | GUI 工作流 | MenuType + AbstractContainerMenu → Screen 注册 → 按平台同步（Forge SimpleChannel / NeoForge Payload / Fabric ServerPlayNetworking） |
| `mc-crash-triage` | 崩溃分诊    | analyze_log/crash_analyze → search_community_docs → validate_project + mixin_analyze → diagnose_gradle            |
| `mc-port-mod`     | 移植模组    | analyze_porting_path → 确认目标 → port_project dryRun → get_migration_guide                                           |
| `mc-build-mod`    | 模组构建流程  | validate_project / diagnose_gradle → **用户确认后** gradlew build → 确认 build/libs jar；失败则分析日志；可接真机循环 |
| `mc-ingame-iterate` | 真机测试与修复循环 | 索取并核对启动器路径（官方/HMCL/PCL2 版本隔离）→ **用户确认后**装 jar → 复现 → 修 → 再测。路径约定见模板正文与 [HMCL 隔离文档](https://docs.hmcl.net/launcher/isolation.html) |
| `mc-ingame-playtest` | 游戏内游玩测试（桥） | preflight（桥 jar/依赖记账）→ `playtest_bridge`（`/execute` + `/status.ready` + `await`）→ 截图/查询证据 → `inspect_playtest_evidence` → 改码回灌；执行权见根 AGENTS.md「人在环例外：游玩自测（三通道）」 |
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
| `mc-events-forge` | Forge 事件系统清单 | session task=mc-events-forge → 05-events / mc-events；注册期 vs 运行期订阅分叉逐版取该档 05-events.mdc（≤1.17 起）；类名核 search_forge_docs |
| `mc-events-neoforge` | NeoForge 事件系统清单 | session task=mc-events-neoforge → 05-events / mc-events；mod bus（注册期）vs 游戏总线（运行期）逐档取该档 05-events.mdc；类名核 search_neoforge_docs |
| `mc-events-fabric` | Fabric / Quilt 事件系统清单 | session task=mc-events-fabric → 05-events / mc-events；「初始化里 register 回调 vs 回调内运行期逻辑」逐档取该档 05-events.mdc（薄档 1.21.4/1.21.8/1.21.10 只有指路句）；Quilt 分支只走 quilt/<ver>/05-events（QSL 无正式版构件，禁止把 Fabric 回调当 QSL）；类名核 search_fabric_docs |
| `mc-rendering` | 渲染工作流（BER / 自定义模型加载器 / 着色器） | 渲染注册入口按平台 + 版本分叉，禁止一条 API 名覆盖全档；先确认平台与精确版本 → session（可 task=mc-new-blockentity / mc-new-entity）；表现层接 `mc-audio-vfx` |
| `mc-profiling` | 性能剖析工作流 | 卡顿 / 内存 / 耗时的独立剖析面；原则「先测量后优化」。是 `mc-crash-triage` 第 5 步与 `mc-build-mod` 第 7 步的完整版 |
| `mc-save-migration` | 存档数据结构迁移工作流 | **强制第一步**：改存档 schema 前必须先让用户整份备份世界目录并回报路径。覆盖 SavedData `.dat`、方块实体 / 实体 / 区块读写格式、跨版本旧世界兼容 |
| `mc-server-multiplayer-test` | 服务端与多人联机测试工作流 | 联机侧验证：专用服务端、多客户端同房、状态同步、权限与延迟下行为。构建走 `mc-build-mod`，单机真机走 `mc-ingame-iterate` |
| `mc-combat-attribute` | 伤害 / 属性 / 战斗工作流 | 伤害种类、实体属性与加成、战斗数值。附魔 / 药水 / 效果走 `mc-enchant-potion`，战利品走 `mc-recipe-data` |
| `mc-multi-loader` | 多加载器（Architectury）工作流 | 一份源码产出 Fabric / NeoForge（或 Forge）多加载器构建；构建与调试成本翻倍属取舍，先与用户确认。已有工程改代码走对应平台 session |
| `mc-modpack` | 整合包集成工作流 | 把第三方 mod 装成可跑的包：依赖闭包、加载顺序、冲突分诊。不做自动发布，不代下载 / 代上传 mod 文件 |
| `mc-datapack-standalone` | 独立数据包工作流（无 Java 代码） | 纯数据包：世界 `datapacks/` 目录或独立 zip，无 `build.gradle`、无 Java 源码。模组附带的配方 / 战利品走 `mc-recipe-data` 与对应平台 session |
| `mc-resourcepack-standalone` | 独立资源包工作流 | 纯资源包：`resourcepacks/` 或独立 zip（模型 / 方块状态 / 纹理 / lang / 音效 / GUI 贴图）。模组内资源走对应平台 session 与该档规则 |


### 知识暴露（MCP Resources）

通过 `registerResource` 注册 `mcskill://` URI（支持 resources 的客户端）；`list_knowledge_resources` / `read_knowledge_resource` 工具兜底。

**实测共 269 条**（as-of 2026-10-02 由 `list_knowledge_resources` 枚举；复核：`node mcp-server/dist/cli.js list_knowledge_resources`）。按 URI 族：

| URI 族 | 条数 | 内容 |
| --- | --- | --- |
| `mcskill://code-patterns/<平台>/<版本>/NN-<主题>-patterns.md` | **116**（forge 61 / fabric 49 / neoforge 6） | 代码模式库正文，按平台 + 版本分档；供 agent 直接 Read 的片段级范式 |
| `mcskill://community/<sourceKind>/<id>` | **99** | `community_knowledge/` 可读条目（authored / permitted / links，见「社区实务知识」一节） |
| `mcskill://workflow/<模板名>` | **49** | 与 Prompt 同名的工作流正文（与 `get_workflow_template` 同一集合） |
| `mcskill://matrix/mixin-support` | 1 | mixin_analyze 支持矩阵（SRG/Yarn/Mojang/readable/descriptor 形态） |
| `mcskill://schema/sqlite` | 1 | yarn-mappings.sqlite v2/v3 字段说明（**须带 `?version=<精确 MC>`**，裸 URI 会被拒） |
| `mcskill://version-changes/1.21` | 1 | 1.21 变更专章（知识库） |
| `mcskill://antipatterns/registry` | 1 | 注册反模式短文 |
| `mcskill://patterns/README` | 1 | 代码模式库索引（`community_knowledge/patterns/`） |

> `code-patterns` 只覆盖 forge / fabric / neoforge 三树（quilt / liteloader / rift / modloader / bedrock 无 `code-patterns/` → 该族 0 条）；其中 6 条是 `archived` 旧档，注册在册但 `read_knowledge_resource` 会回 `found:false` + 存档说明，不再给正文。


### 独立 CLI（`node mcp-server/dist/cli.js`，86 工具全可用）

flags-only（`--key value` / `--key=value` / 裸 `--flag`→true），输出统一 JSON 包装 `{success, tool, result|error}`，退出码 0=成功 / 1=工具错误 / 2=用法错误。全局 flag（不进工具 schema）：`--help`/`-h`、`--version`/`-V`（放在工具名之前、或整条命令没写工具名时打印 CLI 版本；`--version` 跟在工具名后面时是工具字段，而 `-V` 在那个位置会被当未知参数 exit 2）、`--json`（不改变工具输出，仅为兼容保留；只在交互式终端下影响 `--help` 的呈现）、`--compact`、`--fail-on-error`、`--quiet`（静音进度行与心跳，错误 / 警告 / 迁移提示照旧）、`--timeout <ms>`（到点 exit 1 + `errorKind:"timeout"`，退出码仍不越 0/1/2）、`--project <dir>`、`--file field=path`、`--raw [field]`（该字段完全按字面传，裸写则全局关闭 `@` 展开）、`--output-format json`（表达格式意图的规范入口，当前唯一合法值，其它值 exit 2）、`--stdin-json`（从 stdin 一次读入整个参数对象当基座，命令行同名字段恒胜；TTY 下、以及与 `@-` / `=-` / `--file f=-` 同现时一律 exit 2）；所有 string 字段支持文件输入——`--crashReport @./latest.txt` 读文件、`--crashReport=-` / `@-` 读 stdin（全进程一次）、`--file crashReport=./latest.txt` 等价写法，单文件与 `--stdin-json` 载荷共用约 8MB 上限。**加 `--fail-on-error` 时，`found:false` 与 `errors[]` 非空也升为退出码 1**。`--fail-on-error=false` **关闭**该行为（不要把写出 `=false` 当成开启）。布尔 flag 只接受 `true/false/1/0/yes/no/on/off`；`--flag=junk` 拒绝。完整语义见 [mcp-server/README.md](./mcp-server/README.md) §独立 CLI：

> ⚠️ **Windows PowerShell 5.1 控制台坑（E-7）**：PS 5.1 在 GBK 代码页下用管道捕获本 CLI 的 UTF-8 JSON 会引入坏控制字符导致 `JSON.parse` 失败；纯 Node `spawnSync` 管道解析同一输出完全正常。脚本化消费请用 Node 子进程，或先 `chcp 65001`。

```bash
node mcp-server/dist/cli.js status --version 1.20.1            # 服务器状态（含 buildStatus）
node mcp-server/dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node mcp-server/dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F'
node mcp-server/dist/cli.js update --action check
node mcp-server/dist/cli.js list-tools                          # 全部 86 个工具的 schema
```

**通用 dispatch（v0.2+）**：除上述命令外，**任意 MCP 工具名可直接调用**（handler 自动收集，缺参时返回 zod 校验提示）：

```bash
node mcp-server/dist/cli.js search_docs --platform forge --query DeferredRegister --version 1.20.1
node mcp-server/dist/cli.js check_dependencies --buildGradle "..." --fabricModJson "{...}"
node mcp-server/dist/cli.js analyze_mod_jar --jarPath <path>
node mcp-server/dist/cli.js get_community_doc_summary --id authored/lib-curios
```

旧位置参数形式（`query <className>` / `convert ... <memberName>` 等）仍兼容；PowerShell 括号场景用单引号包裹（如 `'--descriptor=()F'`）。


---



## 排障与常见问题（FAQ）

本文没有单独的 FAQ 表——排障数据本来就散在几张专表里，这里只做**索引**，避免你翻 1200 行。

**四类高频症状**

| 症状 | 先查什么 | 去哪 |
| --- | --- | --- |
| MCP 宿主里工具全不可调 | `dist/` 编译了没有？宿主**重载**了没有？ | 下节「工具不可用排查」；`AUTO_SETUP.md` |
| `PLATFORM_DATA_MISSING` / 某平台数据为空 | `MC_SKILL_DATA` 是否指向本仓库 `data/` | `diagnose_data_paths`，或开 `MC_SKILL_DEBUG_PATHS=1` |
| 查不到某个 API / 类 | 索引覆盖外或简名歧义，**≠** 游戏里没有该类 | 本文「工具边界」的误判对照表 |
| 真机起了游戏但驱动没动作 | 授权双开关 / 失焦暂停 / 存档 `session.lock` 被占 | 本文「后半 loop 运维散件」 |

**按症状跳到本文对应专表**

- 工具返回怪结果、崩溃、参数被误解 → 「工具陷阱（实测，同类问题）」
- 拿不准 `found:false` / `CACHE_MISS` / 空 methods 意味着什么 → 「工具边界」误判对照
- 抓取 / 上游查询失败（TLS、超时、404、代理）→ 「工具与网络边界」
- 装了更新却没生效 → `mc_skill_update` 的 `updateHint`（TTL 1h）+ `get_server_status.buildStatus`（`buildRequired`）
- CLI 输出乱码 / `MODULE_NOT_FOUND`（非 ASCII 路径）→ 「独立 CLI」节的 PowerShell 5.1 坑
- 游玩自测：桥超时 / `scan=0` / 世界不加载 / 关不掉客户端 → 「后半 loop 真机矩阵」的「已核实边界」+「运维散件」

**历史台账**：跨轮未收敛问题记在仓库根 `bugfix_list.md`；逐批变更史在 `mcp-server/CHANGELOG.md`。

### 工具不可用排查（clone 后必读）

- **MCP 工具全部调用失败（服务未启动）**：`mcp-server/dist/` 未编译（dist 不入库）。执行 `cd mcp-server && npm ci && npm run build`（Node 需 ≥ 22.5；Yarn 映射可再 `npm run build:yarn-sqlite`）。
- **`get_server_status` 报 `buildStatus.buildRequired=true`**：`src` 比 `dist` 新，需重新 `npm run build`，然后**在宿主里重载 MCP**（只编 dist 不够，宿主进程仍跑旧代码）。
- **反编译类工具报 `TOOLCHAIN_MISSING`**：需 Java 17+（VineFlower / tiny-remapper）；装 Temurin 17+ 后重启 MCP，或按返回指引设置 `JAVA_HOME`。
- **`search_mod_code` 报 `NOT_DECOMPILED`**：源码尚未反编译（按设计不入库）；先按返回指引调 `decompile_mod_jar` / `get_minecraft_source`。
- **无 MCP 客户端**：用独立 CLI `node mcp-server/dist/cli.js <工具名> --参数=值`（86 工具全可用）。

## 术语表

| 词 | 含义 |
| --- | --- |
| 人在环（HITL） | 高风险步骤停在清单 / `dryRun` 等用户确认；见「定位」一节 |
| `dryRun` / 写盘三态 | 预览（不传 `write`）/ 真写（`write+confirmed`+环境变量齐）/ 被拒（`write_blocked`） |
| 证据三态 | `present` / `absent` / `unreadable`；缺件**不得**读成「没有失败」 |
| `resultKind` | 生成类工具的机读结果：`ok` / `generation_failed` / `write_blocked`（两种失败不得混读） |
| `total` | **本次返回条数**，随传的 `limit` 变；**不是**语料命中总数 |
| `totalPool` / `truncated` | 进输出窗口前本面可用的候选数 / 是否还有页没返回 |
| `semantic` | 本次检索是否走了语义索引；`false` = 退化为关键词（`stale` = 索引过期） |
| `verbatim` | 命中是否为「该标识符在页面正文逐字出现」；缺该字段 = 未判定 |
| `sourceKind` | 社区条目来源：`authored` / `permitted` / `links` |
| `verifiedApi` | 库 catalog 里逐条目核过的 API 键（`gameVersion/loader`） |
| `fallback` / `source_version` | 文档回退时：结果实际来自哪一版 / 是否发生回退 |
| 前半 / 后半 loop | 前半 = 写码→构建→自动起游戏→分诊；后半 = 进游戏游玩→取证→回灌 |
| 测试阶梯（L0–L7） | 交付前的最低测试门槛：L0 构建 → L1 结构静态 → L2 数据 → L3 GameTest → L4 真机冒烟 → L5 场景 → L6 服务端 / 多人 → L7 回归；低层红不许跳高层，最低线按改动面取最大者（缺证据即判红，见「证据三态」）。见根 `AGENTS.md`「游玩测试要求（交付门槛）」 |
| 表外版本 | 不在 `PLAYTEST_VERIFIED_TIER` 里的档：真 driver 出不了，**但仍须测** —— 走桥路线或人工游玩，并如实标注「人工验过 / 未验」 |
| 三通道 | 游玩自测执行权的授权通道（A 仓库沙箱 / B 用户 dev 实例 / C 第三方桥） |

## 卸载与回退

- **撤除写进用户工程的规则 / Skill**：`activate_platform_pack action=deactivate`（按写入清单撤写）；先跑 `action=write` 的 `dryRun` 预览看 `planned` / `willDelete`。
- **撤除游玩自测驱动**：按 `generate_playtest_driver` 生成的 `playtest/REVERT.md` 删驱动文件 + 被测工程里的 `PlaytestQaDriver.register();` 调用行；`git status` 自查应零命中（驱动**绝不**提交）。
- **撤除 CLI / MCP 安装**：`npm uninstall -g mc-skill`（或删对应 bin 链接）；仓库 `mcp-server/` 与 `data/` 可直接删（都在仓库内，不影响用户模组工程）。
- **回退自更新**：`mc_skill_update` 只做 git `ff-only` 合并，回退用 `git reset --hard <上一个 commit>`（tooling）或换回上一版 data zip；更新前有未提交改动会被拒（可选 `allowDirty` / `stashDirty`）。
- **缓存与临时产物**：反编译 / MDK / 语义模型产物在 `$MC_SKILL_CACHE`（默认 `%APPDATA%/mc-skill-cache`）；删它不影响仓库与用户工程。

## 阶段里程碑


| 阶段        | 状态    | 内容                                                    |
| --------- | ----- | ----------------------------------------------------- |
| Phase 1   | ✅ 完成  | Forge / Fabric / NeoForge 规则集与多版本扩展                   |
| Phase 1.5 | ✅ 完成  | 模组脚手架 + 校验 CLI                                        |
| Phase 2   | ✅ 完成  | Agent Skills + 代码模式库                                  |
| Phase 3   | ✅ 完成  | MCP Server（文档 + 映射 + 移植 + 社区 + Wave B/C/D 扩展 + 五平台；工具数以 `list-tools` 为准） |
| Phase 4   | ✅ 完成  | 知识库 / 反模式 / 数据审计与 Release 分发 |
| Phase 4.5 | ✅ 完成  | **库模组全覆盖**：48 篇 `lib-*` 短文 + 33 唯一库 Skill（`knowledge/libs` 35 份源稿）+ check_dependencies 增强 + 全量反编译（jar 数**待核**，产物按需生成到 `$MC_SKILL_CACHE` 不入库；→ 1836 verifiedApi 键）+ API 摘要 + manifest + 通用 CLI dispatch **（本行是 Phase 4.5 完成当时的实况登记 ⇒ 数字一律不回改；现行数另扫：库 Skill = 34 唯一 / 36 份源稿（见本文「项目结构」树、下文「库模组知识体系」的「五组」计数行，以及 `knowledge/libs/README.md` §当前规模；as-of 2026-10-02 现扫 `find knowledge/libs -name SKILL.md` = 36 份 / 34 唯一 skillId）；`verifiedApi` 键现行值 = 2632（2026-09-24 复跑，见 `knowledge/libs/README.md:75`），本行的 1836 同为当时实况）** |
| Phase 5   | 📋 部分  | `inspect_runtime` = 日志型 inspector（非 JVM attach）；微调数据集仍暂缓 |


