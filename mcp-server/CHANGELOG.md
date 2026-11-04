# mcp-server changelog

## 2.3.1 · 文案与门禁修复（2026-11-04）

### 测试首次跑通，暴露并修掉 5 处既有缺陷

此前 2.0.0 / 2.3.0 的验证受沙箱限制（`spawnSync` 管道捕获 EPERM）**只能跑部分门链**。本次环境恢复后跑完整链，
`test-core` 依次暴露 5 处问题 —— 都是 2.3.0 之前就存在的，不是本版引入：

| # | 症状 | 根因 | 修法 |
|---|---|---|---|
| 1 | `testPortingKbProvenance` 红：「规则树无 KB 键」未登记 `modloader/1.6.2` | 10-03 新建 `modloader/1.6.2` 时漏登记 | `data/porting/knowledge-base/versions.json` 的 `knownRuleTreeGaps` 补条目 |
| 2 | 同上第二处：「0 规则 draft 树」未登记 | 该档只有 scaffold 4 件，无 00–10 规则 | 补进 `knownDraftRuleTrees` 并写明缺什么 |
| 3 | `testScaffoldWrappers` 红：Java scaffold 应为 52 实得 55 | 新增 3 档 playtest 驱动脚手架无 gradle wrapper | `WRAPPER_VERSION_GAPS` + `wrapper-jars.json` 双向补登记；档数钉值 52→55 |
| 4 | `checkScaffoldMeta` 红：`mode="source-only"` 非法 | 该值 `liteloader/1.10.2`、`1.8.9` 早已在用，但它们没有 `scaffold/` 目录 ⇒ 从未被扫到，枚举缺口一直没暴露 | 枚举扩为 `gradle / reference / source-only`，并为 source-only 补判据（不许声明 Gradle 版本 + 必须写原因） |
| 5 | `testAssertionProvenance` 红：5 处「见 temp/」失效引用 | fabric 1.21.1/1.21.3/1.21.4/1.21.8/1.21.10 适配层注释指向不入库的 `temp/port/artifacts/*` | 改指仓库内 `PLAYTEST_VERIFIED_TIER` 与本档 GameBridge 实现 |

**判据**：`node test-core.mjs` → `EXIT=0`、末行 `core regression tests passed`。

### 继续跑完整链，又暴露 7 处（同属「前一条失败把后一条藏起来」）

`test-core` 绿了之后 `npm test` 继续推进，逐层暴露 —— 每一处都是**上一次失败挡住**才没被看见：

| # | 症状 | 根因 | 修法 |
|---|---|---|---|
| 6 | `test-scripts` 门链普查红：`assert-playtest-26x-onmove-shape.mjs` 无任何调用方 | 10-31 配的回归门（26.x driver 不得调 `MouseHandler.onMove`）**从落地起就没挂进任何数组** ⇒ 手跑绿也不进 npm test | 挂进 `REAL_RUN_GATES`（该门 shell out 到本地 CLI，与 intent-gate 同列）；该门实测 5 档全过 |
| 7 | `assert-corpus-semantics` 红：`fabric_26.2` 树未登记进基线 | 10-31 新建语料树，基线停在 10-23（77 棵） | `MC_SKILL_CORPUS_SEMANTICS_RELEDGER=1` 重签 → 78 棵 / 40,922 篇 |
| 8 | 同上第二处：`rift_1.13.2` 有 1 篇真·空页但基线无 `residue` 段 | 具名层被静默关闭（该门 fail-closed） | 按门要求逐条具名 `wiki_home.md`（上游 wiki Home 页正文仅 25 字符，是归档页真实形态） |
| 9 | `assert-scaffold-rules-conflict` 红：台账六项漂移 | 新增 5 棵带 `.cursor/rules` 的规则树 | reledger 重钉：packsChecked 48→**53** / rulesFiles 458→**513** / crossLines 459→**462** / contextualSkipped 3065→**3077** / verdictSkipped 2350→**2386** / banned 69→**73**（conflicts 仍 **0**）；符号台账 `--write` 重生成（19 档 / 73 符号） |
| 10 | `test-semantic` 红：26.2 断言 `sourceIsRequestedVersion=false` | **测试前提过期**：断言写死「26.2 无主文档树、走旁路」，而 10-31 已建 `fabric_26.2` 完整语料（105 页 + index-l0） | 改成分两支按盘上事实选：有主树 ⇒ 断言主树直命；无主树 ⇒ 断言旁路契约。两支都自证「没谎称本版专属正文」 |
| 11 | `test-assistant-gaps` 红：根 AGENTS.md quilt「有树但无语料」清单解析为空 | 那一行只写了「（4 档）」**没点版本号** | 补 `1.21.3` / `1.21.4` / `1.21.8` / `1.21.10` |
| 12 | 同上第二处：quilt「无树」清单匹配不到 | 该清单是二级列表（行首 2 空格），判据写死 `^- \*\*无树\*\*` ⇒ 恒不命中 | 正则加缩进容差 `^\s*- \*\*无树\*\*` |

**共性**：这 7 处没有一处是产品行为退化 —— 5 处是**登记/台账没跟上内容增长**，2 处是**判据前提过期**（写死了当时的事实）。这也说明「跑通一次就绿」不等于门链健康：门与台账本身会腐烂。

**判据**：`npm test` 完整链（含 `test-core` / `test-scripts` / `test-semantic` / `test-assistant-gaps` 等全部子链）。

### npm 页面文案重写

- **`package.json` `description`**：从一句「一站式 MCP」扩到完整表述 —— 89 工具、全流程七段、8 平台 + 服务端面、73 个文档版本档、一条命令自动配置、无需数据包可用。
- **`mcp-server/README.md` 新增四节**：
  - **一条命令自动配置**：9 个宿主的写入路径对照表 + 幂等标记块说明 + `--action=session` 零写盘方案；
  - **平台与版本支持**：逐平台列出 73 个文档版本档与脚手架构档（Forge 14 / NeoForge 10 / Fabric 14 / Quilt 10 / LiteLoader 3 / Rift 2 / ModLoader 3 / 基岩 / Paper 6 / Spigot 9）；
  - **功能详解**：按工程构建 / 代码生成 / 文档查询 / 反编译 / 校验 / 排错 / 游玩自测 / 移植 / 发布 / 知识库分十组逐工具点名；
  - **人在环与自动化边界**：改成三段式（默认自动 / 需要点头 / 永不代劳），把「默认自动」的范围写清楚，不再让整份文档读起来像处处要人工确认。

### 说明

本次是**纯文案 + 门禁修复**，不改任何工具行为。
`package.json` 版本未变（仍 2.3.0 已发布版本）；若要发到 npm 需另行 bump。

---
## 2.3.0 · npm 发版（2026-11-04）

### 发版口径

上一版 npm 是 **2.0.0**（2026-10-21），此后累计 47 条提交未发布到 npm（git tag 只到 V2.2.0，且 tag 不触发 npm publish）。
本版把这些改动一并发出，并按 SemVer 定 **2.3.0**：破坏面只落在两个 related 工具的返回形状上，见下。

同时按 npm 页面的实际问题重写了 `mcp-server/README.md` 的开头：旧版把本包写成一个「查文档的 server」，
与仓库 README 的一站式定位差距很大，且正文里的数据体量读数已过期。

### 破坏性变更（2 条）

| # | 变更 | 影响面 |
|---|---|---|
| B1 | `get_doc_related`（含 `platform=quilt` 分支）成功返回值从**裸数组**改为对象 `{ok,platform,id,version,results[]}` | 直接把返回值当数组遍历的脚本 |
| B2 | `get_forge_doc_related` 旧形状**本身不稳定**（无版本回退时裸数组、有回退时对象），现恒为对象 | 同上 |

**不破的**（容易误传成「四个都变了」）：`get_fabric_doc_related` / `get_neoforge_doc_related` 基线就是对象，
本版只补 `ok`/`platform`/`version` 字段；`get_bedrock_doc_related` 完全未变（字段名是 `related` 不是 `results`）。

出处：`src/docs-platform/forge/index.ts:1186-1202`；基线物证 = 已发布 2.0.0 的
`dist/docs-platform/forge/index.js:961,989` 注释「成功时 JSON 根仍是数组」。

### 其他用户可见变更

- **CLI 失败信道收紧**：`isToolFailure` 增读 `action.code` / 顶层 `code` / 字符串 `error`。
  `decompile_mod_jar` / `get_minecraft_source` / `convert_mapping` / `search_mod_code` 等工具
  **失败时终于 exit 1**（此前 exit 0，把失败伪装成成功）。`--fail-on-error` 默认仍为 `false`，
  旗标语义未变。物证：基线 `dist/cli-parse.js` 无 `NON_FATAL_ACTION_CODES` 符号。
- **`npx` 可用**：新增与包名同名的 bin（指向 MCP 入口 `dist/index.js`）+ 给该文件补 shebang，
  修掉 `npx -y mc-ai-coding-assistant-tool` 的 `could not determine executable to run`。
  注意它是 stdio 服务、**不解析 `--version`**；看版本号用 `mc-skill --version`。
- **`license` 字段**：`"MIT"` → `"SEE LICENSE IN LICENSE"`（PolyForm Noncommercial 1.0.0 + 作者强 Copyleft，
  2026-10-29 换）。`LICENSE` 第 88 行明确豁免「用本软件创作的模组文件」——用户写的模组不算衍生作品。
- **`files[]` 新增 `"data"`**：随包发布 7 项小数据（128 文件 / 约 139 MB），
  使 `query_loader_api` / `search_loader_api` 等在没有平台语料时仍可用。
- **配套修复（关键）**：`postinstall` 的 `--data` 判据从「`data/` 非空即跳过」改成「**有没有平台目录**」。
  否则包自带数据会让该目录天然非空 ⇒ 平台数据永远下不来（`scripts/postinstall.mjs:718-736`）。

### 新功能与数据（摘要，明细见 Unreleased 各节）

- **服务端面（Paper / Spigot）**：`generate_paper_plugin`、`generate_playtest_server_driver`、
  `paper` / `spigot` / `paper-api` 三个文档平台 id、13 个签名面版本档、5 份 `paper/<ver>/rules/00-applicability.md`。
- **MC 26.2 / 26.3**：`fabric/26.2` 完整建档（105 页语料 + 411 文件规则树）；`neoforge/26.2` `26.3` 各有规则树
  （无本版文档语料，属预期）；`fabric 26.3` 只有博客旁路。
- **`rift/1.13` 原生档**新建；`KNOWN_VERSIONS.rift` 改为 `["1.13","1.13.2"]`。
- **`generate_datagen` 新增 `mapping: "mojmap" | "yarn"`**：Fabric Yarn 骨架覆盖 11 档，其余档 fail-closed 并给拒因。
- **游玩自测二合一 mod 形态**（rift 1.13 + modloader 1.2.5/1.5.2/1.6.2）；`BRIDGE_MOD_TARGETS` 8 → 9（多 `rift 1.13`）。
- **`mcskill://knowledge/` URI 族**（4 类）；`mc_skill_update` 的 `dryRun` 明说下载代价。
- 仓库根新增 `dsh-plugin/`（DSH 原生插件）。

### 文档

- `mcp-server/README.md` 开头重写：从「查资料 server」改为**一站式全流程**定位（阶段表 + 「离开数据包仍可用」实测表）；
  校正过期读数：平台目录 76 → **73**、1.8 GiB / 4.2 万 → **2.31 GiB / 8.3 万**、`data/` 127 → **128** 文件。
- `package.json` 的 `description` 与 `keywords` 重写，覆盖一站式 / 全流程 / 8 平台 + 服务端面。

### 未核实（发布时诚实披露）

- 本机沙箱 `spawnSync` 管道捕获被拒（EPERM），`npm test` 整条链**未能在本机跑通**；
  `test-core.mjs` 挂在 `testMdkUnpackFixtures`（`UNPACK_FAILED` vs 期望 `ZIP_SLIP`，根因是 bsdtar 输出捕获不了）。
  以 CI 记录为准。
- 已跑通的本地检查：`npm run build`（tsc）、`npm pack --dry-run`、`npm publish --dry-run`、
  `assert-archive-pointers` / `assert-authoring-lint` / `assert-doc-absence-claims`、
  `test-path-guards` / `test-localize` / `test-analyze-build-log`。

---
## Unreleased · 第三方 MCP 目录收录准备（2026-11-03）

### 收录准备：修好两处「发不出去 / 发出去也起不来」，并补上立项手册

**背景**：官方 MCP Registry 的发布是 `mcp-publisher publish`（README 明文：合并进仓库的 `server.json` 不会被收录）。
仓库根的 `server.json` 早已在，但**用官方 `POST /v0.1/validate` 实测原件会被拒**，且即便修好，用户 `npx` 也拉不起服务。

**四处落点**：

| 落点 | 改前 | 改后 | 为什么 |
|---|---|---|---|
| `server.json` `description` | 115 字 | **97 字**（英文一行） | schema 硬上限 `maxLength:100`，实测回执 `expected length <= 100` |
| `server.json` `_meta` | 三层嵌套 `io → modelcontextprotocol → "registry/publisher-provided"` | **单个扁平键** `"io.modelcontextprotocol.registry/publisher-provided"` | schema 只声明这一个**带点号的字面 key**；嵌套实测 `unexpected property`，且未声明 key 官方静默丢弃 ⇒ 原来的 `dataDistribution` 说明根本没被存下来 |
| `mcp-server/package.json` `bin` | 两个 bin 指向不同文件 | **增加** `"mc-ai-coding-assistant-tool": "./dist/index.js"`（原两项未动） | npm `libnpmexec/lib/get-bin-from-manifest.js`：无同名 bin 且多目标 ⇒ 抛 `could not determine executable to run`。实测 `npx -y mc-ai-coding-assistant-tool@2.0.0` 正是此错 |
| `mcp-server/src/index.ts` | 无 shebang | 首行 `#!/usr/bin/env node` | 该文件成了 bin 目标，必须可执行；tsc 保留 shebang（`dist/index.js` 首行已验）。`node-sqlite-guard` 仍是第一条 **import**（`test-cli.mjs:1751` 的判据按 `^import` 取首行，不受影响） |

**新增件**：`glama.json`（仓库根，只写官方 schema 声明的 `maintainers`）、`doc/mcp-registry-publishing.md`（协议件 / 发布链 / 不代发声明 / 未核实清单；`README.md` 指针表已挂）。

**判据（本轮现取）**：`tsc` 干净（`EXIT=0`）；官方 `POST /v0.1/validate` 对改后的 `server.json` 回 `{"valid":true,"issues":[]}`（`HTTP 200`）；
`dist/index.js` 首行 = `#!/usr/bin/env node`；MCP `initialize` 握手仍正常（`serverInfo.name=MC-AI-Coding-Assistant-Tool`）；
npm 自家 `getBinFromManifest()` 对改后的 manifest 解析出 `mc-ai-coding-assistant-tool`；
`assert-archive-pointers` / `assert-authoring-lint`（J2 指针 30 枚）全绿；`git diff` 面限上述四改 + 两新增。

**未核实**：`mcp-publisher` 下载与 `login/publish` 全链**未跑过**（本机 `github.com` TLS 被拦，见手册 §五）；
Glama 对本项目这类「本地 stdio + 无 Dockerfile + 数据外挂」的推断构建成功率未知。

---

## Unreleased · 游玩自测口径纠偏（2026-10-31）

### 游玩自测口径纠偏：26.2 / 26.3 早已在 `PLAYTEST_VERIFIED_TIER`（2026-10-31）

**症状**：agent 跑测试时读到的表述是「26.2 / 26.3 不在 `PLAYTEST_VERIFIED_TIER`（该表只到 1.20.6 一线）」，而实际这两档**出的是真 driver**。

**根因（不是表错，是正文过期）**：表本身自 2026-10-04（`sweep123`）起就有 10 条 26.x 条目（`fabric`/`neoforge` × `26.1`/`26.1.1`/`26.1.2`/`26.2`/`26.3`，现共 **53** 条），但**消费者最先读到的那几处措辞没跟着改**：

| 落点 | 过期形态 | 改成 |
|---|---|---|
| `src/wave/register.ts` 的 `driverMode` 参数 `.describe`（模型每轮看工具清单都读到） | 「其余模式**只出结构壳**」 | 「在 `PLAYTEST_VERIFIED_TIER` 列出的档出真 driver / 真执行器（唯一真源、正文不数档；含 26.x 全代）」，表外档才是结构壳 |
| `playtest-driver.ts` 的 `in_jvm_player_agent` 结构壳 warning | 硬编码「要真执行器请换已验证档（`fabric 1.20.4 / 1.21.1 / 1.21.3 / 1.21.11 / quilt 1.21.11`）」——**停在 1.21.11 一线、没有 26.x** | 改成指向同一轮由数组现算的那条清单（此处不数档） |
| `community_knowledge/authored/ingame-playtest-automation.md`「已验证档」行 | 「as-of 2026-10-03 共 **32** 项」+ 逐平台枚举（与现表 53 项不符） | 改成「唯一真源 = 数组，正文与本节都不数档」，并点名 26.x 十档在表内 |
| 同上「平台降级矩阵」行 | 「driver 现覆盖 `fabric/quilt 1.21.11`，其余待取证」 | 覆盖 = `PLAYTEST_VERIFIED_TIER` 现读（含 26.x 十档与 1.14.4–1.21.11） |
| `AGENTS.md` 工具表 `playtest_bridge` 行 / `doc/glob-search-discipline.md` / `mcp-server/README.md` / `playtest-bridge-mod.ts` 注释 | 「**8 目标** = forge 六档 + `rift 1.13.2` + modloader 1.6.4」（数组实为 **9**：还含 `rift 1.13`） | 覆盖 = `BRIDGE_MOD_TARGETS` 现读、正文不数档，并补上 `rift 1.13` |
| `README.md` 指针表 / `mcp-server/README.md` | 指「根 `AGENTS.md`「人在环例外：游玩自测」的**已核实边界**」——该小节**已不存在**（已搬进 `doc/glob-search-discipline.md`）⇒ 悬空指针 | 改指实际落点，并写明「逐版本清单读生成器内数组」 |

**顺带同步的相邻档位表述**（同一类腐烂）：

- `neoforge/AGENTS.md` + `neoforge/CLAUDE.md`：版本分发表**漏 26.2 / 26.3**（两档规则树 2026-10-31 已建、`activate_platform_pack session` 实测 `ok:true`），且仍写「本仓无 26.2 树」⇒ 改成「26.2 / 26.3 各有规则树；缺的是 `data/neoforge_26.2`/`26.3` 文档语料，`search_neoforge_docs` 查不到本档正文属预期」。
- 根 `AGENTS.md` 第 3 步的 session 版本清单补 `26.2` / `26.3`。
- `src/prompts/templates.ts` 的 `mc-events-neoforge` 模板：建档清单漏后两档；第 6 步仍写「本仓无 26.2 规则树」⇒ 一并改准。

**判据（本轮现取，全部 rc=0）**：`npm run build`（tsc）干净；`assert-playtest-intent-gate` **ok**（53 档清单原样打印，含 26.x 十档）；`assert-authoring-lint` ok（J2 指针 24 枚全在盘）；`assert-workflow-hitl` ok（61 模板 / 41 条路径引用全在盘）；`assert-doc-absence-claims` ok；`assert-skill-mirrors` ok（AGENTS 漂移 0 档）；`assert-cross-layer-names` ok；`assert-archive-pointers` ok。**行为面复核**：`fabric`/`neoforge` × `26.1`/`26.1.1`/`26.1.2`/`26.2`/`26.3`，两种 driverMode 各出 **108–115 KB 真代码、`TODO(未核实)` = false**；反向控制 `quilt 26.3`（表外）仍出结构壳。

**未跑（说明白）**：`test-core` / `assert-total-semantics-wording` / `assert-legacy-isolation` 三只在**本沙箱内会 spawn 子进程的门**红，红因是 `spawnSync → EPERM`（`assert-legacy-isolation` 报的正是 `rc=null`、`found=undefined`，即 CLI 子进程根本没起来），**与本批改动无关**；需在非沙箱环境复跑。


## Unreleased · R2 审计修复补丁（2026-10-31）

### forge/1.16.5 实体示例：改完类名仍编译不过（真构件 `javac` 定位，已修）

`04-entity.mdc` 上一轮把 `Mob`→`MobEntity` 改对了，但**整段仍编译不过**。用 `G:\graalvm-jdk-21` + `F:\MOD_TEST\caches\forge_gradle\` 的 mapped 构件逐条真编，定位到 4 处：

- **`extends MobEntity` 不够** —— `MeleeAttackGoal` / `WaterAvoidingRandomWalkingGoal` 的构造器形参是 `CreatureEntity`（`javap` 实证），`MobEntity` 传不进去，编译期报「不兼容的类型: MyEntity 无法转换为 CreatureEntity」。改 `extends CreatureEntity`。
- **`FloatGoal` / `LookAtPlayerGoal` / `RandomLookAroundGoal` 在 1.16.5 不存在** —— 真名分别是 `SwimGoal` / `LookAtGoal` / `LookRandomlyGoal`（1.16.5 goal 包 71 个类全量比对）。这三个名是 **1.17+** 的写法；`FloatGoal` 在 1.17.1–1.20.4 五档都真实存在，**只有 1.16.5 要改**（那 5 档 `code-patterns/03` 保持不动）。
- **`stepHeight` 在 1.16.5 不存在** —— 真名 `maxUpStep`（1.17+ 才叫 `stepHeight`）。
- **`DataSerializers.VARINT` / `entityData.register` 不存在** —— 1.16.5 只有 `INT`，注册方法是 `entityData.define(...)`（`javap` 实证：`EntityDataManager.define(DataParameter<T>, T)`，无 `register` 重载）。同一对错误在 **`rules/08-client-server.mdc:152,156`** 也各出现一次（SynchedEntityData 示例），一并改掉。

改动落 `forge/1.16.5/.cursor/{rules/04-entity.mdc,rules/08-client-server.mdc,skills/mc-entity/SKILL.md}` + `code-patterns/03-entity-patterns.md`，再 `sync-skills.ps1 -TargetDir forge/1.16.5` 刷 7 面镜像（6 面 sha256 与源稿一致，`.pi` 为格式差异、内容已同步）。**验收**：`04-entity.mdc` 与 `mc-entity/SKILL.md` 的围栏**真编 EXIT=0**；`code-patterns/03` 的实体类段真编 EXIT=0。

### paper 适用性：两类假否定（生成器 + 门同时修）

- **枚举常量假否定**：`paper-api_1.12.2` 的 `EventPriority` / `PermissionDefault` 页**上游 javadoc 不列枚举常量**（只有 `getSlot`/`valueOf`/`values`），生成器据此判 `LOWEST`/`TRUE`「成员名不在本版」。同页在 1.16.5+ 都列 ⇒ 这是**语料面边界**不是成员被删。新增 `isEnumConstantPointer()`：源行是枚举常量形态 ∧ 目标页整页无任何 `public static final` 行 ⇒ 记 `member-unresolved`（原 token 落 `note` 留痕），不进「不得照用」表。
- **范围描述指针误当成员指针**：`<file>.md:<n>` 后紧跟「之后 / 以上 / 起 / 往后」等范围词时，抽同行末尾标识符只会得到无关名字。新增判据 → `memberUnresolved`。
- **门补真伪判据（⑩a）**：`assert-server-rules-integrity.mjs` 原判据 ⑩ 只做「重算 == json」自洽对拍，**同一份错误逻辑重算两次当然一致** ⇒ 假否定恒绿。新增：每条 `no-member` 回本版页面**按 token 搜一次**，搜到即判红。投毒自证：手工把一条 `ok` 改成 `no-member` ⇒ 门正确报「假否定（应记 ok）」并 exit 1。

结果：1.12.2 的 `memberMissing` 3 → **1**（剩 `setDamageType` 是**真缺失**：26.3 有、1.12.2 无）；5 档字面 `null` 全 0；`assert-server-rules-integrity` plain + `--selftest`（15/15 畸变必红、7 例干净必绿）全绿。

## Unreleased（2026-09 全仓库审查修复轮；工作树，未发版）

- **测试链自退化修护（2026-10-30，R2 审计 WP9 收口）** —— 全属「测试自己烂掉但没人发现」类，产品行为未变。
  - **`test-cli.mjs` 的 nullish 陷阱**：`jm.result?.code ?? jm.code` 把生成器**显式**返回的 `code: null` 当 nullish 落到信封上不存在的 `jm.code` ⇒ `undefined !== null` 恒真，「1.16.5 + mapping=yarn 必须 fail-closed」这条断言从写下起就必然抛。改成 `jm.result ? jm.result.code : jm.code`（显式 null 与「没有 code 键」必须分开判）。
  - **`test-cli.mjs` 三条陈旧断言（依次暴露：前一条的 throw 把后一条藏住）**：① `mcp-server/README.md` 的「安装后校验」用 `npx mc-skill …` —— npm 包名是 `mc-ai-coding-assistant-tool`，`mc-skill` 只是 `bin` 名，克隆上 `npx` 会去 registry 找。改 `./node_modules/.bin/mc-skill …` 并补一句为什么不写 `npx`。② 同文件 `node dist/cli.js` 行数钉值 15 与实况 16 不符 —— 2026-10-21 的 dsh 示例（`--hosts=dsh`）把它推到 16，钉值没跟上；按实况重钉，注释写明现算口径（total 16 / 行首 15）。③ `--json` 措辞门原先要求**根 `AGENTS.md`** 也带三句关键说法，而该文件在 2026-10-24 的重构里已把 CLI `--json` 说明整段搬走（现 0 处提及 `--json`）⇒ 判据退化成「要求一份不讨论该旗标的文档也带这三句」。改成：三句关键措辞只要求 `--help` 与 `mcp-server/README.md`（真正定义该旗标的两处），**反向声明**（「`--json` 切换／改成文本输出」）仍扫全部 5 份用户面文档，覆盖面不减。
  - **`registerTool` 描述 ↔ CLI 静态表漂移 5 处**：related 工具那轮只改了 `tool-registry.ts` 的 `indexToolSchemas`（CLI 静态表）一侧，补 `{ok,platform,id,version,results[]}` 合同，**同一文件里的 `registerTool` 调用点（`:836` / `:969` / `:1080`）与 `getForgeDocRelatedSchema` 的 schema 描述没跟** ⇒ 漂移腿必红。补齐这三处 + forge schema 描述，并顺手修掉两处**先于本轮就存在**的漂移（`get_workflow_template` 静态表缺「，不要先调工作流。」、`mc_skill_update` 缺 data 侧 dryRun 的注意段）。
  - **`loader-api` 的平台枚举放错层（本轮自引入、门链抓到）**：枚举被塞进内部读路径 `candidateKeys()`（`store.findSummary()` 用它拼键），于是**已合法 ingest 的任意平台摘要读不出来** —— `findSummary("probe","9.9.9")` 返 null，`test-loader-api` 报 `undefined !== 'AAA'`。枚举只属于**用户输入边界**（`candidateKeysSafe`，query / ingest 用），内部读路径改回「字符白名单 + 拼键」。同批把 `test-decompile` 的 `error === "DOWNLOAD_DISABLED"` 断言改成按归一后的 `error.code` 取码（兼容字符串形态）。
  - **`assert-fabric-transcludes` 的孤儿扫描跳过构建输出**：`.gradle/` / `build/` 是 `.gitignore:2` 忽略的本机构建残渣，13 档共 102 条孤儿全落在 `reference/**/.gradle/**`，把「盘上每件文件都要在 provenance 里」这条判据顶成开发机恒红，也把真信号埋掉。改成只跳过这两个目录并打印跳过数，其余孤儿照旧判红。
  - **根 `AGENTS.md` 的 fabric 建档面补回「每档 11 条」与 14 个档位名单**：2026-10-24 的重构把那条 bullet 压成散文时丢了这两项，`test-assistant-gaps` 的 A-43（登记面 ↔ 磁盘逐档对拍）从那时起就红；因为「档数」还在，肉眼看不出少了东西。

- **失败信道 + related 形状统一（2026-10-30，R2 审计修复）**
  - **`isToolFailure` 增读 `action.code` / 顶层 `code` / 字符串 `error`**：此前只认 `error.code`（对象），而 `decompile_mod_jar` / `get_minecraft_source` / `convert_mapping` / `search_mod_code` 等只用 `found:false + action.code` 报错 ⇒ CLI 仍 `exit 0`。新块只在 `found===false && ok!==true` 时判，两支 OR。豁免表：action 侧 6 码（`PLATFORM_SKIPPED` / `LOADER_API_NOT_INDEXED` / `FALLBACK_IDENTITY` / `AMBIGUOUS` / `CSV_NO_OWNER` / `PICK_PLATFORM`），顶层侧 3 码（另有 `INDEXED_WITHOUT_BODY`）。顶层 `code` 加 `^[A-Z][A-Z0-9_]*$` 形状守卫（`generate_model` 的 `code` 是生成的源码字符串）。**不改任何生产码**：`VERSION_REQUIRED` / `WRONG_TOOL` / `PICK_PLATFORM` 的既有 `ok:true` 与 `status:"skipped"` 约定由 `test-cli-failure-channel.mjs` 运行时锁定。
  - **`mod-decompile.ts` 12 处 `error:"CODE"` 改 `error:{code,message?}`**（`ModDecompileResult.error` 类型同步）；`localize/jar.ts` 的 5 个内部解析哨兵保持字符串（不进入顶层返回）。
  - **`query_loader_api` 补平台枚举**：`platform=bogus` 原先拼出 `1.20.1-bogus` 无命中 ⇒ `LOADER_API_NOT_INDEXED` + exit 0（把输入写错伪装成「本档没摘要」）。`candidateKeysSafe` 现只认 8 个平台，未知平台 `INVALID_INPUT`。
  - **四个 related 工具统一为对象**：`get_forge_doc_related` / `get_fabric_doc_related` / `get_neoforge_doc_related` / `get_doc_related` 成功恒返回 `{ok,platform,id,version,results[]}`（`results` 恒为数组；fabric 保留 `source`；quilt 回退把 `sourcePlatform`/`warning` hoist 到顶层）。**破坏性变更**：按裸数组解析的消费者需改读 `.results`（仓内 test-core / limit-monotony 已同步）。
  - **新增测试**：`test-cli-failure-channel.mjs`（红 9 / 绿 12，逐条真跑 CLI）、`test-path-guards.mjs`（5 族）；`assert-playtest-intent-gate` 矩阵 15 例。`test-core` 的工具表锚点同步 AGENTS.md 现标题（`## MCP Server / CLI 工具`）。

- **门与数据链补强（2026-10-30，R2 审计 WP8）**
  - **`assert-rules-match-tool` / `assert-scaffold-selfcheck` 补 `--selftest` 并接进 `SELFTEST_GATES`**：此前只有真跑腿，假根投毒钩子（`MC_SKILL_*_TEST_ROOT`）没人为它写夹具 ⇒ 判据被改软时主流程照常绿。现各带内存夹具（rules-match 1 正控 + 4 投毒；selfcheck 1 正控 + 5 投毒，A1–A5 各一记），spawn 自己跑假根、断言「红在预期原因上」。
  - **新增 `assert-scaffold-pin-claims.mjs`**（同时进 `REAL_RUN_GATES` 与 `SELFTEST_GATES`）：版本档自述的钉值声明（`forge_version=` / `loader_version=` / `loom_version=` …）必须等于本档 `scaffold/gradle.properties` 实钉值；只扫档内自述面、只咬肯定句（反例/引用/历史行按 `NOT_A_CLAIM` 跳过）。立门即抓到两处真漂移：`forge/1.13.2` `25.0.219→25.0.223`、`forge/1.14.4` `28.2.0→28.2.26`（两条 `loader_version` 键原本在 MDK 里不存在，改回 `loader_version_range`）。
  - **`assert-pack-meta-coverage` 加计数声明复核**：`gaps.*` 里的「processed N 篇」「全文实扫 = N 篇」按盘上递归计数复算（现 59 档 / 10 条声明全中；突变一条即红）。
  - **`assert-skill-mappings-key` 扩面到 `knowledge/libs/<组>/<库>/SKILL.md`**：库 Skill 源稿此前完全不过本门。`hint` 入册为合法值（17 件跨平台 Skill 的刻意声明），自检反例换 `bogus`；同时给 12 件无键库 Skill 补 `mappings: hint`、7 件散文值改成 `hint（…）` 体例（信息不丢）。
  - **`assert-doc-absence-claims` 加「显式路径不存在」通用腿**：正文点名仓内路径并说它不存在而盘上在 ⇒ 红；精度靠否定词与 token 紧邻（放宽版本在真树上 100/101 是假阳性），裸目录名（`data/` / `assets/`）按歧义表不判。带 4 记新自检臂（含 `data/` 歧义对照）。
  - **两道 playtest 编译腿共用 `scripts/_lib/find-javac.mjs`**（JAVA_HOME → PATH → 已知安装根；JDK 8 的 `1.8.0_x` 主版本解析修正）。`--require` 首次有消费者：`.github/workflows/release-mcp-server.yml` 新增「Playtest compile legs」步骤，资产在则强口径、不在则打 `::warning::` 落发布日志。
  - **`assert-parser-availability` A4 判据放宽成「字符串码或 `{code}` 对象都收」**（WP1 的失败信道归一让旧判据红在干净根上）。
  - **台账重钉**：`assert-scaffold-rules-conflict` 的 `crossLines 455→459 / banned 67→69 / fabric/1.14.4 1→3`（WP5 把 `AbstractBlock.Settings.create` / `Block.Properties.create` 具名进 ❌ 块）与 `verdictSkipped 2354→2350`，`scaffold-banned-symbols.json` 已按门重生成（18 档 / 69 符号）。
  - **`test-scripts.mjs` 两处自退化修复**：门链四数普查的引用判据从裸子串改词边界（`assert-a.mjs` 不再被 `assert-a.mjs.bak` 认成「已引用」）；§#22 的绝对墙钟 `ms < 2000` 改成相对同机空 node 启动的预算（WP8 加腿后实测 380–406ms，12.7× 基线）。


- **服务端面补 13 棵版本档 + 两个真机探针（2026-10-23/24，接「Paper/Spigot 能不能加热门版本」与「做 paper 那样的真机探针」）** —— 数字全部本轮实扫，不引旧账。

  - **Spigot 历史档 ×8**（`data/spigot_<ver>/spigot-javadoc/<ver>/`）：`1.21.8` 1352 类 / `1.21.4` 1335 / `1.21.1` 1282 / `1.20.6` 1251 / `1.20.1` 1186 / `1.19.4` 1173 / `1.16.5` 1027 / `1.12.2` 779（成员签名 15284 / 15018 / 12784 / 12496 / 9440 / 9311 / 7875 / 6213）。**走构件的 `javap`、不是 javadoc 页**：`hub.spigotmc.org/javadocs/spigot/1.21.4/` 实测 **404**（`/javadocs/bukkit/` 与 `/javadocs/spigot/` 是同一份当前文档），而 maven 的 `org/spigotmc/spigot-api` metadata 实测 **83 个版本**。生成器 `extract-spigot-api-surface.mjs`（默认 dry-run；`data/` 下全走 `emit`，构件落 `temp/spigot-jars/` 不入库；每页 `sourceType: javap` + `jarMd5`）。
  - **Paper 历史档 ×5**（`data/paper-api_<ver>/paper-javadoc/<ver>/`）：`1.21.4` 1871 / `1.21.1` 1702 / `1.20.1` 1496 / `1.16.5` 1254 / `1.12.2` 877 —— 走 javadoc 页（`jd.papermc.io/paper/<ver>/` 实测 8 个版本首页全 200）。
  - **`fetch-spigot-javadoc.mjs` 修了一处「代码与盘上不符」**：它按**嵌套目录**落盘（`org/bukkit/...`），而既有两档盘上是**扁平**（`org_bukkit_...md`）⇒ index 的 id 与 `processedFileFor` 对不上，`assert-corpus-faithfulness` 的 `dup` 非 0（首轮 13/38/55/62/65）、store 读空。改成扁平唯一名（`pkg_path_ClassName`）后五档实测 `dup: 0`。
  - **`paper-api_1.12.2` 原本 877/877 全是空壳**：该版 javadoc 是 **10.0.2** 的老式结构，整站无 `member-signature`，签名在成员摘要表的 `colFirst`（类型）+ `colSecond`（名/参数）两格。回落判据取「`member-signature` 为 0 **且** `colFirst > 0`」—— 新式的纯类型声明页两者都是 0（实测 1.16.5 的 `JSONUtil.JSONPair` / `Barrel`：`member-signature=0, colFirst=0, h4=0, pre=0`），故不受这条回落影响。效果：空壳 **100% → 10.1%**，chunks 864→945、embedded 0→**359**，`DEBT_FTS_ONLY` 里 `paper-api|1.12.2|paper-javadoc` 据此**显式清出**。
  - **两个真机探针**：`playtest-paper-server.mjs`（Paper 五档，服务端件来自官方 `fill.papermc.io/v3`，sha256 逐字核过）与 `playtest-spigot-server.mjs`（**纯 Spigot** 三档，件来自 **getbukkit 第三方镜像** —— Spigot 官方只发 BuildTools 源码，`.../org/spigotmc/spigot/maven-metadata.xml` 实测 404）。两者同纪律：默认 dry-run、**EULA 不代接受**（缺 `--accept-eula` 就停）、只写 `--root` 沙箱、已登记 `NON_WRITERS`。
  - **真机读数（口径 = 各档 `logs/qa-run.log`，as-of 2026-10-23）**：Paper `1.21.4`/`1.21.1`/`1.20.1`/`1.16.5` 各 **8/8**（`Done` 10.428 / 15.306 / 2.965 / 2.467s，含控制台命令派发），`1.12.2` **5/5**（它不认 `--nogui`、只能 `--noconsole`，而后者关掉控制台 ⇒ 命令那条**不适用**，非失败）；纯 Spigot `1.21.8`/`1.20.6`/`1.19.4` 各 **8/8**。三份 Spigot 件的字节数与上游 `content-length` 逐一一致（84,523,129 / 76,012,205 / 71,219,629）。
  - **`paper/<ver>/rules/00-applicability.md` ×5**：26.3 规则的**版本适用性核查**，**不复制**那 10 条正文（Paper 教程面不分版本，复制等于声称"该版成立"而没核）。每篇两节：「26.3 指针在本版的存活」+「**该版 Bukkit 核心 vs Paper 扩展**」（成员级判据 —— Paper 会往 `org.bukkit.*` 类上加方法）。后者实测抓到 1 条真差异：`ItemMeta#setDamageType` 只在 paper-api 面，纯 Spigot 服会 `NoSuchMethodError`。
  - **同批的门改动（都是「面清单扩容 / 参数化」，判据未放松）**：`assert-signature-face-integrity.mjs` 的 `FACES` 从 2 面扩到 **7 面**（paper api 五档），并把写死的 `stable/` id 前缀改成按 `versionDir` 末段取；`assert-server-rules-integrity.mjs` 的 `buildCorpusIndex` 动态纳入 `paper-api_<ver>` 与 `spigot_<ver>` 面（版本档指针指本版面）；`assert-corpus-semantics.mjs` 对 `*-javadoc/` 面改用「有没有签名行」判 stub（一行签名的标记接口 bodyChars 天然 <40）。
  - **`liteloader` 三档升到构件级**（同批）：`api-surface.md` 从源码树抽取改为**构件 `javap` 直读**（1.12.2 73 类/249 签名、1.10.2 72/230、1.8.9 70/209），并新增「嵌套类型只列名」一节（15 / 8 / 2 个，含 `Outer$Inner`，匿名类已排除、**可见性未逐个核**）。`detectVanilla` 从「出现过 `net.minecraft.` 就算 MCP 可读」改成比例判据 —— 1.10.2 因此从误判的 `mcp` 修正为 `mixed-or-obfuscated`（该件里 `net.minecraft.` 只 3 处、裸混淆短名 36 处）。
  - **`rift` 侧两条真机结论**（同批）：`rift/1.13` 原生档新建（件内 `profile.json` 的 `inheritsFrom` 现读 = `1.13`），Gradle 4.9 + JDK 8 构建 **BUILD SUCCESSFUL in 1m 32s**；但 **Gradle `runClient` 里 listener 不派发**（8 条 `InvalidMixinException`）—— 根因是 dev 环境 deobf（MCP 名）而 Rift 的 target 是 notch 短名，**别用 `runClient` 验 Rift**；真实 client jar + launchwrapper 才有 `[QA] registerBlocks`。

- **第 9 个宿主 · dsh（DeepSeek Harness）接入 + 文档面补全**：`activate_platform_pack` 的 `hosts` 增 `dsh`（与 `codex` 同形：`entryFile=AGENTS.md` + `skillsDir=.agents/skills`，无 `rulesDir`，共用同一棵树）；文档面把 `AUTO_SETUP.md`（Step 0 识别表 / Step 4 宿主速查 / Step 5 重载表 / Step 6 两张表 + 新增 4.12 DSH 小节）、`README.md` / `README.en.md` / `README_human.md` / `README_human.en.md` / `mcp-server/README.md` / `CONTRIBUTING{,.en}.md` / `knowledge/libs/README.md` 的宿主列举与镜像说明补上 `dsh`。本批为纯文档改动（未动 `src/**` / `scripts/**`），门链验证由维护者统一跑。

- **第九十四批 · 只读审查（`temp/audit-20261011`）非版本面修复 · 批 B（P1）+ 批 C（P2/P3）**
  - **范围**：承第九十三批（批 A）继续修**非版本面**。版本面（`fabric|forge|neoforge|quilt|bedrock|liteloader|rift|modloader/<档>/**`）仍**只出移交清单、不改文件**。用户裁定「更改文件时只更改对应的段落」+「只采纳有益的」，全程外科式改动。
  - **B1 · `src` P1**：① `lib-skills/index.ts` 去掉根级 `.refine(...)`（ZodEffects 让 MCP SDK 的 `normalizeObjectSchema→getObjectShape` 读到空 `.shape` ⇒ `resolve_lib_skills` 在 MCP 面 inputSchema 空、收 `{}` 永远失败；约束改由 handler 的 `!mcVersion` 分支兜底）；② `loader-api/extract.ts` 参数名/类型取 `variableArityParameter`（varargs）+ dims 取 `variableDeclaratorId` 子级（C 数组维）；③ `mappings/yarn-sqlite.ts` 的 SRG 反查：正则放宽到 `/^(?:func|m)_\d+_[a-zA-Z0-9]*_?$/`（收 1.16.5 尾下划线形 `func_227860_a_` 与 1.17+ `m_46859_` 形）+ `getMappingEra(version, isSrg?"forge":null)` + `getCsvDb(version,"forge")`（六档同有 fabric/forge 库，不传 prefer 会取到 yarn-tiny 标签自相矛盾）；同批 `lookup-obfuscated.ts`（反查文案「m_/f_ 名不在 yarn sqlite 中」是**假事实** —— 它们就在 Forge 库 `named` 列）、`mixin/method-string.ts`、`mixin/access-transformer.ts`、`mixin/resolve.ts`（`mojang_hashed` 改走 `from="mcp"` + `preferPlatform="forge"`）；④ `prompts/templates.ts` 三处 Quilt entrypoint 引用反向（改指 `quilt.mod.json entrypoints.main` + `net.fabricmc.api.ModInitializer#onInitialize()`，与 `quilt/1.21.1/.cursor/rules/05-events.mdc` 对齐）、`mixin/index.ts` `SUPPORT_MATRIX[0]`、`prompts/index.ts` mixin 支持说明同步；⑤ `porting/index.ts` `init_architectury` 的 `parchment(...)` 行按 `isMcVersion26OrAbove` 条件化（26.x 已去混淆，写 parchment 会编译失败）。
  - **B2 · `scripts` 生产者 P1（数据安全）**：① `parchment-extractor.js` 排除 `*provenance*` 工件 + 空索引 `process.exit(1)`（防空产物覆盖在线索引）；② `process-neoforge-docs.js` 空 `rawDir` / 读失败守卫 + `if (failed > 0) process.exitCode = 1`；③ `forge-javadoc-indexer.js` 加 `walkErrors` 计数、目录读不动时拒绝收窄写；④ `tsrg-extractor.js` **恒等 `CL:` 行也登记**（`obfName===mappedName` 不再 `continue`，否则丢类与成员）。**数据重建**：`node scripts/tsrg-extractor.js --version=1.13.2` 重出 `data/forge_1.13.2/extracted/`（键 3993→4027 / 非空 3827→3861 / 成员 40635 / 类名 3993→4027）。
  - **B3 · 门脚本 P1（8 道）**：`assert-test-harness.mjs`（R-2 窗口锚改从 `LOCAL_HARNESS.match.index` 取，与入检面同源；R-4 加两条恒真模式：等号两侧同字面量 / `assert.ok(<非零字面量/非空串>)`）；`assert-registry-limit-window.mjs`（两条 argv 臂前移进计分前 + `cases.length<12` 地板 + `sqlCount===undefined` 报错）；`assert-rule-ledger.mjs`（`isMounted` 判据：`assert-*` 要求 `scripts/<gate>` 路径段、`test-*` 要求注释剥离后的独立 token，**裸子串/注释不再算「被真跑」**；`--verify` spawn 加 env 封闭，断 `MC_SKILL_LEDGER_VERIFY` 递归自调用）；`assert-rule-java-shapes.mjs`（字符串感知 `argCount`）；`assert-scaffold-mixin-shape.mjs`（注解配对剥离 + `%/simpleClass` LIKE + 混合 kinds UNRESOLVED）；`assert-glossary-mojmap-face.mjs`（否定限同子句）；`assert-cross-layer-names.mjs`（`noClientTxt`/`noEraSrc` 计数 + `--require-pairs` 响亮红，clean clone 无 client.txt 不再静默空绿）；`assert-skill-mappings-key.mjs`（前缀族 `declaredBase`）。
  - **B4/B5 · 文档与计数块**：`mcp-server/README.md`（工具数 82→**86**、工作流 49→**61**、fabric 语料补 1.21.4/1.21.8/1.21.10）；根 `README.md`/`README.en.md`（工作流模板 49→**61** 且补 `mcskill://skill/` 族 12 条、知识资源 269→**293**、yarn schema v3→**v4**、semantic 库 60→**61**、脚本 33→**35**、版本 1.0.4→**2.0.0**、删空表头、Rift 行与路线①行 en 补齐）；`server.json`（`data/` 137M→**~1.8 GiB**）；`AGENTS.md`（quilt 语料 15→**14** 篇英文页、selftest 24→**40**、`sync-skills` 「只写不删」→「会同步写入并**删除**多余镜像」）；`THIRD_PARTY_NOTICES.md`（loader-api 件数/字节 56/83,019,237→**73/99,512,010**、类 44,567 / 方法 200,450 / official 55 槽 48）；`doc/tool-error-codes.md` 4 行；`mcp-server/docs/mc-skill-update.md` 覆盖语义。
  - **C1 · `src` P2（~20）**：`validate/index.ts` 跨文件收集（同文件收集致系统性假 warning）+ 死支删除；`wave/register.ts` 2× `NOT_FOUND`→`NOT_DECOMPILED`；`docs-platform/fabric/index.ts` 补 `poolFieldsOf`；`generators/index.ts` `generateCapability` 加上界哨兵 `eraUpperBoundError`（见「未做/边界」关于 `assert-generator-rejection-codes` 地板 4→5）；`bedrock/index.ts` 兜底版本措辞；`playtest-bridge/index.ts`（`await` 轮询上限、calls.jsonl `CALLS_MAX_BYTES=512KiB` 截断披露、`clipJson`、命中先于截断、`waitedMs`/`pollsCapped`、`PLAYTEST_TIMEOUT` 可判达、`data` 不丢）；`playtest-evidence/index.ts` 超时双判据；`update/github.ts` `.assets` 数组校验；`build-log/index.ts` `LOG_HARD_MAX=32MiB` 前置拒绝；`audit-resources/index.ts` `rootIsAssetsDir` 默认 ns；`cli-parse.ts` `union-number`（含 number 成员且**不含 string** 成员的 union 才把裸数字串转 number —— `packFormat` 可达，`string|number` 保持原样）；`platform-pack/detect.ts` liteloader_forge hybrid warning；`platform-pack/write.ts` `rollback(): string[]` + `rolledBack`/`rollbackFailed`；`gradle/index.ts` 死析取删除；`datapack/index.ts` 去 `/i`；`diagnostics/index.ts` 注释。
  - **C2 · `scripts` P2（~55）**：生产者覆盖保护族（`process-fabric-docs.js` 空覆盖守卫 / `process-fabric-wiki.js` exitCode + 早退 / `process-forge-docs.js` `return false` + okCount 聚合 / `provision-26x-docs.mjs` 按 `wantWrite` 门住 fetch / `probe-forge-versions.js` `freshUsable`+空壳地板 / `probe-neoforge-versions.js` suspicious 信号）；`_lib`（`api-name-collector.mjs` 成员腿 `unreadable` + 缩进围栏 `^\s*` / `build-yarn-sqlite.mjs` rename 失败 throw 不 unlink / `import-mcp-csv.mjs` throw + `skipped` 计数 / `import-forge-srg.mjs`+`import-tsrg.mjs` `skipped`+`buildWarnings` / `build-semantic-index.mjs` 死条目剪枝 + `mergedMode=embedMode`）；`postinstall.mjs` sha256 下载加 AbortController；`pin-mdk-checksums.mjs` `!e.sha256` 时传 `allowUnpinned`；`project-cloth-skill.mjs` 真写不计 bad；`validate-rules-against-cache.mjs` `parseFailed` 计数；`build-api-summaries.mjs` `badLines` 计数；`generate-porting-breakdown.js` index null 不写 + available/knownLoadFailed。
  - **C3 · 其余 P2**：`knowledge/libs/README.md`（`_oneoff/` 前缀 / `communityDocId` 多数 `lib-*` / 段内换行吞条目）；`mc-architectury`（`net.architectury`→`dev.architectury`）；`mc-cloth-config`（举证 jar `11.1.106`→`11.1.136` + 表首加「取值以 `versions.json` 为准」）；`mc-spruceui`/`mc-server-translations`（删「catalog 无 verifiedApi」的自相矛盾）；`mc-moonlight-lib`（核对记录标「摘要未入库该版本」）；`mc-trinkets`（补 `4.2.0.0+26.3`）；`common_skill/mc-router/SKILL.md` 路由表补 5 行（handoff/retro/research/prototype/review）+ `README.md` 安装段补 `mkdir`；`.github/SECURITY.md`（删「不严重的也可以提交 issue」+ 改私密通道口径）/ `CODE_OF_CONDUCT.md`（删待办式提示 + 去 MPL 归属）/ `dependabot.yml` 空 `ignore:` 键 / `release-mcp-server.yml` 交叉引用行号 / `bug_report.md` §取证指针；`community_knowledge/ATTRIBUTION.md`（permitted 页「入库提炼正文」→「仅指针页」）；`Minecraft 社区常用库模组全览` 外链仓库改正；`CONTRIBUTING.md`/`CONTRIBUTING.en.md`（`set`→`export`、`AGENTS.md:410`→`REPORT-FORMAT.md:19`、台账体量 297 KB→484 KB）。
  - **C4 · P3（可操作项）**：`mcp-server/docs/mcmap-linkie-absorption.md`（工具数 82→86 ×3、`resource_link` 0→1 处注释、§3⑦ 状态回写、AW `inject-interface` 已做）；`mixin-support.md`（header 补 `classTweaker vN`、条目补 `inject-interface`/`extend-enum`、jar 定位改述为「三目录并集排序 + 无 vanilla jar ⇒ CACHE_MISS」）；`query-api-classname-case.md` 行锚；`evidence-forge-registries-all-versions.md` 补 `BLOCK_PLACER_TYPES`；`community_knowledge`（`mapping-fields-v3` 行号 `:27`→`:29`、`profiling-performance` `/debug tick`→`/debug start / stop`、`creative-tabs-1.20` 版本边界、`fabric-networking-payloads` 映射口径披露、3 个 links 补 `mcHint`、`README.md` 表前空行）；`README_human*.md`（徽章「8 个加载器与基岩版」→「8 个平台（含基岩版）」、删杂散行）。
  - **判据与反证**：`assert-rule-ledger` 新 `isMounted` 实测把「注释/console.log 串里点名」与「真挂进数组」分开（旧裸子串判据会让 Y=10 未引用清单里的门假绿）；`assert-test-harness` 新锚实测抓出 `test-mdk-npm-form.mjs` 的同步 harness 未处理 thenable（该文件已补 thenable 检测）；`test-core` 的 `m_46859_` 断言由「NOT_FOUND」改为「解析为 Forge SRG（`isEmptyBlock`）」+ 另加一个真·不存在 token 保留否证意图（旧断言编码的是修前缺陷行为）。
  - **验证台账**（2026-10-12，串行，全 exit 0）：`npm run build`（tsc）；`node test-scripts.mjs`（§S18/S19 真跑 52 道 · W1-2 selftest 42 道）；`npm test`；`npm run test:cli:quick`；`npm run test:cli:full`；两新门（`assert-prose-name-roster` / `assert-registry-field-existence`）`--selftest` + 真跑；`assert-authoring-lint`。社区索引按 frontmatter 变更重建（`community_knowledge/indexes/index-l0.json`，110 条）。
  - **未做 / 边界**：① **`assert-generator-rejection-codes.mjs` 的 `UNJUDGED_CEILING` 4→5** —— `generateCapability` 补上界哨兵多出一个「errors 正文由变量/函数调用组成」位点（与既有四兄弟同形），为保守棘轮**显式抬一次并写明理由**（该门自述「只许降」，此抬动已在门内注释与 `DELIVERY_LOG` 「要拍板」块双记）；② `assert-rule-ledger` 的 `evidenceRefs` 仍允许 `temp/`（gitignored）引用（fresh clone 必红，属 audit 记的独立项，未在本批处理）；③ `CORPUS_PROVENANCE.md` 7 处「原 `AGENTS.md:NNN`」历史行号漂移未改（需 commit 锚或章节名，未做）；④ 版本面移交清单见 `temp/audit-20261011/HANDOVER-VERSION-FACE.md`。

- **第九十三批 · 只读审查（`temp/audit-20261011`）非版本面修复 · 批 A：P0 三条 + 三条反向检测门腿**
  - **起因**：用户令「做一个计划去彻底修复这些问题」，范围裁定 = **只修非版本面**（版本面 `fabric|forge|neoforge|quilt|bedrock|liteloader|rift|modloader/<档>/**` 只出移交清单），并按裁定**连数据一起重建**、**三条门腿全加**。本批 = 批 A（其余批 B/C 未做，见 DELIVERY_LOG 本轮 §5）。
  - **A1 · P0-A「legacy Forge 六档 api-index 全员错挂」**（`scripts/forge-srg-extractor.js`）：
    - **判据**：`FD:`/`MD:` 行原本挂「最后一条 `CL:` 行」（`currentClass`），而盘上 `joined.srg` 是**严格分段**（`PK:`→`CL:`→`FD:`→`MD:`）⇒ 六档全文件成员被并进最后一个类（**非空类恒为 1**，成员数与 `FD+MD` 行数逐位相等）。
    - **改动**：① owner 改从**本行自带的 mapped 全名**取前缀（`FD:` 恒 2 token → `tokens[1]`；`MD:` 恒 4 token → `tokens[2]`）；② 成员行 owner 缺位时**先建** `apiIndex[owner]`；③ **恒等/同名 `CL:` 行也登记**（原先 `tokens[0] !== tokens[1]` 把整行跳过 ⇒ 该类既不进 `classNames` 也不建位，六档各 21/34/33/31/31/31 个恒等类、挂 1.8–2.3% 的成员；现 api-index 键数 = CL 总数 − 恒等类数，1.12.2 实测 3344−3313=31 ✓）；④ 新增「owner 不在 `classNames`」计数告警。
    - **数据重建**：六档各跑一次，重出 `data/forge_<v>/extracted/` 四件（24 个受控 JSON）；顺带修好 1.8.9/1.9.4 原为 6 字节的 `class-names.json` 空壳。
    - **验收（四值全量对拍，不是抽样）**：`temp/audit-20261011/tools/c-srg-fingerprint-verify.mjs` 对**抽取器产物**现算 `classes / nonEmpty / total / hash` 与 `expected-srg-fingerprints.json` 逐档比对 ⇒ **六档四值全中**（1.7.10 1836/1780/20163/26f08b1f4697a5c2 … 1.12.2 3344/3256/32732/42d303369c9a0fec）；`hash` 口径 = sha256 前 16 位 over 排序后 `owner:count` 行（生产者 `tools/c-plan-preflight2.mjs:23`）。
    - **连带（同批一并改）**：`src/api/index.ts` **整条退休** `QUERY_API_SHELL_INDEX` 与其 `:833` 版本正则分支（修好后无档再是「类名空壳」）；`src/api/index.ts:5` 头注 + `:759` 无方法条目文案去陈旧括注；`src/tool-registry.ts` 的 `query_api` 边界句；`test-core.mjs` 原「1.12.2 空壳警告必须保留」断言语义**反转**为「数据健康（无空壳警告 + 方法清单非空）」；文档面按症状词 grep 枚举改成 zh+en 成对（`README.md` 8 处 / `README.en.md` 6 处 / `AGENTS.md:408,455` / `AUTO_SETUP.md:599` / `mcp-server/README.md:25,344,361`）。
  - **A2 · P0-B「remap 中间 jar 缓存键缺版本与构件身份」**（`src/decompile/services/mod-decompile.ts`）：原 `remapStem` 只含 `mod-<id>-<modVersion>-<mapping>`，复用门仅 `existsSync`，与同文件 `outDir`（含 `jarIdentity`）口径不一致 ⇒ 同声明 `id+version` 的不同构建 / 不同 MC 版本会命中同一 remapped jar，静默复用错误字节。现抽出纯函数 `remapCacheStem(modId, modVersion, version, jarIdentity, kind)`（含 MC 版本 + sha512 前 12 位内容身份），最终件与中间步（`yarn-intermediary`）共用；`test-decompile.mjs` 增一条钉键用例（换版本 / 换内容身份 / 换映射层 / 换步各必须换键，同参必须稳定）。
  - **A3 · P0-C「test-cli 的死臂」**（`test-cli.mjs`）：`diagnose_gradle --fail-on-error` 臂写成条件式（`errors.length > 0 && status !== 1`），而夹具（单行 `plugins { id 'net.minecraftforge.gradle' }`）实测判档落 `unknown`、`errors=[]` ⇒ 臂**从不触发**（真空绿）。现改为**无条件**断言 + 钉住夹具前提（改用会真出两条 error 的夹具：有 `minecraft_version` 但 build.gradle 缺 Forge 依赖/插件），并新增「夹具前提不成立即红」的守卫。
  - **A4 · 三条反向检测腿（审计 §6.5 的盲区补丁）**：
    - ③ **成员分布地板**（落进 `scripts/assert-index-channel-layout.mjs`）：`mappingInput` **按档分叉**（旧六档用 `mappings/joined.srg`，1.16.5 仍 `obf_to_srg.tsrg`）；六档登记类数钉 1836/2541/2941/2980/3122/3344；新增 A5 = 非空类占比 ≥ 0.9 且单类成员占比 ≤ 0.05（**比例阈值，非等值钉**：1.12.2 是 3256/3344≈97%，等值钉会让合法增长假红）；`MC_SKILL_INDEX_LAYOUT_TEST_INDEX_PACK` 让投毒夹具可绑到指定档。
    - ① **`scripts/assert-prose-name-roster.mjs`**（新门）：技能源稿**围栏外**的「清单行」（顿号串 / 表格行 / 列表项）里形如 `<Name>Registry` 的名，**既不在**本档 FAPI 真构件名册（`loader-api-summaries/<v>-fabric-api.json` 的 `simpleName`）**也不在**本档 vanilla 映射（`yarn-mappings.sqlite` 的 `classes.named` 末段）⇒ 违规。补 `assert-skill-yarn-attest` 只看围栏内（`scope:"fence"`）的盲区；F18 的 `mc-item/SKILL.md:15` 正是围栏外散文行。
    - ② **`scripts/assert-registry-field-existence.mjs`**（新门）：`Registries.<MEMBER>` / `RegistryKeys.<MEMBER>` 的**字段级存在性** —— member 在本档确实存在（`fields`/`methods.name_named`）但 owner 不是该类即违规。补 `assert-rules-api-names` 只判**类名**的盲区（`Registries` 类在各档都在，而 `Registries.ENCHANTMENT` 自 1.21.1 起已改挂 `RegistryKeys`）。
    - 两门均带**棘轮基线**（`scripts/data/prose-name-roster-baseline.json` 36 条 / `scripts/data/registry-field-baseline.json` 27 条；判据 = 现值必须是基线子集，**新增即红**，陈旧只提示）+ **扫描面地板**（采集器空转不得判绿）+ `--selftest`（纯函数夹具 + 真库/真名册活性腿）+ `--measure`；两条都进 `test-scripts.mjs` 的 `REAL_RUN_GATES` 与 `SELFTEST_GATES`，另在 §A5/§idx 投毒块加「旧档成员分布折成一类必红」一记。
  - **判据与反证**：A1 的指纹对拍即反证（修前六档非空类恒 1、hash 必不等）；A5 地板投毒实测双红（`非空类占比 0.000 < 0.9` + `单类成员占比 1.000 > 0.05`）；两新门 `--selftest` 各 4 组夹具 + 活性腿全过；`--measure` 产出的基线即机读的版本面修复清单（见 `temp/audit-20261011/HANDOVER-VERSION-FACE.md`）。
  - **验证台账**（2026-10-12，串行，全 exit 0）：四值指纹对拍 `ALL MATCH`（6 档）；`node dist/cli.js query_api --className=net.minecraft.world.World --version=1.12.2` ⇒ `found=true` + **80 条 `func_*` 方法**（修前 `methods=0`）；`node test-scripts.mjs` **rc=0**（§S4 门链四数 盘上 77 / 可达 77 · §S18/S19 真跑 52 道 · W1-2 selftest 42 道 · 末行 `script helper regression tests passed`）；`npm test` **exit 0**（含 `test-core.mjs` 反转后的 1.12.2 断言、`test-decompile.mjs` 新钉键用例、`test-cli.mjs` 新夹具臂）；`npm run test:cli:quick` / `npm run test:cli:full` 各 **exit 0**。
  - **未做 / 边界**：批 B（~27 P1：`loader-api/extract.ts` varargs / `lib-skills` root `.refine()` 使 MCP schema 空 / SRG 反查偏好库 / `prompts/templates.ts` Quilt 条目反向 / 四个生产者覆盖保护 / 8 道门脚本 P1 / 计数与元信息）与批 C（~115 P2 + P3 清扫）**未做**；版本面 94 单元 / 2,255 文件**未判**（按裁定移交，落点清单见上）；`data/forge_<v>/extracted/*` 的 `critical-classes.json` 名册仍按 mojmap/1.16+ 写（旧 SRG 档必大面积 null，属批 C 的 P2，本批未动）。不 commit / 不 push（提交归用户）。

- **第九十二批 · `as-of` 术语与取证日期戳全仓清扫 + 规范本体删除**
  - **起因**：用户指令（2026-10-11）——「as-of 以及日期全部清理；并找找那个规则写了这个规范，删除」。两件事：(a) 沿既定判定刀清我方取证动作时间戳与 as-of 标注；(b) 定位并删掉「计数必须带 **分母 + 口径 + as-of**」这条规范**本体**。
  - **A. 规范本体删除（义务句统一改为「分母 + 口径」）**：`WRITING-FOR-AGENTS.md:96`（§7 出处形状）/ `REPORT-FORMAT.md:43`（§维护档 · 3 验证台账）/ `.codebuddy/rules/实施计划要求.mdc:16` / `.github/PULL_REQUEST_TEMPLATE.md:26` / `bugfix_list.md:232`（追加规则③）/ `CONTRIBUTING.md:232-233` + `CONTRIBUTING.en.md:232-233`（库数据链计数口径 A/B 的「（2026-09-24 复跑）」）/ `CONTRIBUTING.en.md:487,492`（未排期清单列规）/ `CONTRIBUTING_LIST.md:5,10`（列规与表头）/ `common_skill/mc-research/SKILL.md:8,31,35`。装机副本 `~/.agents/skills/mc-research/SKILL.md` 重拷闭合；`src/prompts/templates.ts:668`（mc-research 工作流产出行）同步去 as-of。
  - **B. 面文清戳**：`README.md` / `README.en.md`（en 40 对，修 6 锚后 `clean-readmes-asof.cjs en` 全命中；残留仅「2026-09-08 裁定」落款 + parchment `2023.09.03` 格式例）；`AUTO_SETUP.md:455`；`mcp-server/README.md`（22 对）；`forge/1.18.2/scaffold/README_AI.md`（3 对）；社区短文 8 篇（lib-bookshelf / lib-curios / lib-fabric-language-kotlin / lib-modern-ui / lib-patchouli / lib-satin / lib-yacl / library-integration-jei-emi）。
  - **C. 脚本 / 代码注释与消息串清戳**：注释级 50 行（24 文件，含 `src/generators/playtest-driver.ts` 4 / `src/generators/index.ts` 2 / `test-scripts.mjs` 1 等）；错误消息串 26 对（`assert-doc-absence-claims` 5 / `assert-rule-ban-vs-example` 4 / `assert-backlog-table-shape` 1 / `assert-forge-blockshape-family` 2 / `assert-lib-session-resolve-parity` 14 含 10 条 `basis:` 台账尾标）；`assert-forge-blockshape-family.mjs:298,324` 的 `asof` 两个死字段删除（消息串已不再读）。
  - **边界（按判定刀保留，DELIVERY_LOG 本轮 §5 未做清单逐条点名）**：台账落点（本 CHANGELOG / `DELIVERY_LOG` / `CORPUS_PROVENANCE` / `NIGHT_BATCH` / `doc/tool-error-codes` / `ingame-playtest-automation` / `mcp-server/docs/*` / `V2.0.0-RELEASE-NOTES` / `CONTRIBUTING_LIST` 正文）；机器载荷（`assert-community-attribution` 的 `asOf`/`asOfRe`/三地板、`mcmod-dev-tutorials.md` 82 行、`assert-bedrock-script-api-pin` 的 `asOf` 钉值、`external-apis-signoff.tsv` 的 `asof` 列、`assert-backlog-table-shape` 的 `PROSE_RE`、四份基线 json 的 `asOf` 键）；上游事实（`As of Minecraft 1.20.2 …` 引文、parchment `2023.09.03`）。`THIRD_PARTY_NOTICES.md`（3 处 as-of 2026-09-27）**未动** —— `.codebuddy/rules/实施计划要求.mdc:19` 列为禁区。
  - **判据与反证**：en 40 对全 x1（`ALL OK`）；脚本层三前缀重扫 = **0 行**（`left.cjs`）；改动过的 .mjs 全 `node --check` OK；`npm run build`（tsc）通过；装机副本逐行 diff 仅 3 行差、拷回后 `identical:true`。量具「不匹配就不动盘」这条腿本轮被真实走过（en 首跑 6 锚 MISS ⇒ 整文件 SKIP 未写）。
  - **验证台账**（as-of 2026-10-11）：`node --check` 全 OK；`npm run build` 成功；**第 8 步 `node test-scripts.mjs` rc=0**（§S4 门链四数 盘上 75 / 可达 75 · §S18/S19 真跑 50 道 · W1-2 selftest 40 道 · `本轮未执法腿=0`；消息串清理与死字段删除后复跑仍 rc=0）；`test-cli.mjs` = `test-cli: ok`（DOC_SCAN 覆盖改过的 `mcp-server/README.md` / `AUTO_SETUP.md`）；`test-core.mjs` = `core regression tests passed`；三条被改门直跑全 ok（`assert-backlog-table-shape` 124 行 × 3 列号序连续 / `assert-lib-session-resolve-parity` 6 组双链路同答 + 35 组窗口口径 / `assert-forge-blockshape-family` 13 档被扫 917 文件禁用形态 0）；`assert-authoring-lint` ok（13 目标 / 12 技能 / 23 指针 / J3=0）。触因 = 改了 `mcp-server/scripts/**` 与 `src/**`（故第 8 步必跑）；README / 面文 / 规范本体那几批按用户令「小范围改文档不用跑门」未逐批跑。
  - **自我更正**：`clean-comments-asof.cjs` 初版误伤 ASCII 括号（把注释里 `getX()` 改成 `getX(`，在 `playtest-driver.ts` 放大 diff 时暴露）—— 三度收紧（只清全角括号 + 只动含 as-of 的行 + 保留前导空白）后定稿；`CONTRIBUTING.md:232-233` 初次误归「台账数据」未动，后改判为规范本体并清。
  - **C2. 第二批残留（同轮续清，`clean-residual-asof.cjs` 精确对、不符即整文件 SKIP）**：11 文件 19 对 —— `src/generators/playtest-driver.ts`(3：`八处 javap` / `COMPILE_OK` 的 `as-of 2026-10-04` + 两处 `真机跑通 = 2026-10-04` 去日期) / `src/generators/playtest-bridge-mod.ts`(1) / `src/bedrock/index.ts`(1：`npm dist-tags，as-of 2026-09-18` → `npm dist-tags`) / `src/generators/index.ts`(2) + `src/generators/common.ts`(1)（`本仓 as-of 2026-09-19/21 只核到 …` → `本仓只核到 …`）/ `assert-lib-session-resolve-parity.mjs`(4：5 处 `。as-of 2026-09-25` 尾标 + 一条地板消息 + `as-of mtime` 词 + `。复核 as-of 2026-09-26`）/ `assert-doc-absence-claims.mjs`(2) + `assert-rule-ban-vs-example.mjs`(1)（地板消息去 `；as-of 2026-09-23`）/ `assert-bedrock-script-api-pin.mjs`(2：`钉值必须带依据与 as-of 日期` → `…与日期`，字段名 `asOf` 不动）/ `CONTRIBUTING_LIST.md`(2：`新增条目的规矩` 与 `L43` 行括号 `分母 + 口径 + as-of` → `分母 + 口径`）/ `.github/CODE_OF_CONDUCT.md`(1：`as-of 日期` → `日期`）。**另清两处「口径声明」残留**：`V2.0.0-RELEASE-NOTES.md:5` 与 `mcp-server/docs/mcmap-linkie-absorption.md:7` 的 `分母 + 口径 + as-of` → `分母 + 口径`。**C2 保留边界**：`${tier.asOf}` / `${apiPin.asOf}` 机器渲染、`asOf` / `asOfRe` / `FLOOR_ASOF` / `PROSE_RE` / 四份基线 `asOf` 键 / pin JSON `asOf` 值、attribution 门按行读取的 `mcmod-dev-tutorials.md` 与 `forge-event-system-practices.md`、gitignored 的 `.codebuddy/plans` + `.workbuddy/memory`。
  - **追加 · 部分回退（用户令「agent/机器向的规范不必跟清，只管人类可见面」，2026-10-12）**：按新口径回退 4 处 —— **#1** `WRITING-FOR-AGENTS.md:96` 复原「计数带分母 + 口径 **+ as-of**」；**#2** `REPORT-FORMAT.md:43` 复原「数字须带**分母 + 口径 + as-of**」；**#5** `mcp-server/src/prompts/templates.ts:668` 复原「证据表（论断/出处/状态**/as-of**）」（src 改动 ⇒ `npm run build` 已跑、`dist/prompts/templates.js` 含该串）；**#4** `common_skill/mc-research/SKILL.md:8/31/35` 回退**并限定标注范围**：as-of 只标**外部来源读数**（「读到它的时点」），同段明写「本仓内部文档与自己的动作**不标** as-of」，证据表列写作「as-of（**仅外部来源行**）」；装机副本 `~/.agents/skills/mc-research/SKILL.md` 重拷闭合（源稿与副本 sha256 前 12 均为 `04817d4da54d`）。**未回退**（人类可见面 / 已判定落点）：`.github/PULL_REQUEST_TEMPLATE.md:26`、`CONTRIBUTING{,.en}.md:232-233`、`CONTRIBUTING_LIST.md`、README 系、`doc/tool-error-codes.md`、`V2.0.0-RELEASE-NOTES.md`（`THIRD_PARTY_NOTICES.md` 禁区不动）。按免跑门口径**未跑门链**（仅 `npm run build` + 装机副本一致性核）。
  - **C2 验证台账**（as-of 2026-10-11，单次）：4 个被改 .mjs 全 `node --check` OK；`npm run build`（tsc）无输出；**第 8 步 `node test-scripts.mjs` 复跑绿**（日志 `temp/backup-ledger-20261011/ts-residual.log`：末行 `script helper regression tests passed` · `本轮未执法腿=0` · 0 处 `✗` / `FAIL`）。C2 后另有 3 处纯文档文本改动（`CONTRIBUTING_LIST.md:54`、`V2.0.0-RELEASE-NOTES.md:5`、`mcmap-linkie-absorption.md:7`）落在门跑之后，三者均不在任何门读面内（`test-cli.mjs` 的 `DOC_SCAN` = `README.md` / `mcp-server/README.md` / `AGENTS.md` / `AUTO_SETUP.md` / `CONTRIBUTING.md`），故未再跑门。复扫：`mcp-server/(scripts|src)` 剩 22 行 as-of 类命中，逐行核过全是机器载荷或 `alias of` 误伤；规范短语 `分母 + 口径 + as-of` 全仓剩 13 行 = 本批自身记录 3 行 + gitignored 计划/记忆 10 行。

- **第九十一批 · README 系残余 as-of 台账（错误码两节 + tier 计数副本）入住新落点 `doc/`；两语文末立「指针表」；受管面清单与归档指针门同步**
  - **起因**：用户指令（2026-10-11）——「清掉，东西放到 doc 文件夹里面去记得留下指针；readme 的所有指针全部放到最后面做一个指针表；`README.en.md` 同步」。清点对象 = 第九十批「不做/未跑」里点名的三处同类台账：`README.md` / `README.en.md` 的「实跑取证：常见错误码」「86 个工具的错误码覆盖清单」两节，与 `mcp-server/README.md:171` 的 `PLAYTEST_VERIFIED_TIER` 计数副本。
