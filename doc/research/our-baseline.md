# 我们自己的现状基线（MC_skill / mc-ai-coding-assistant-tool v2.3.1）

> 用途：做「对标项目能借鉴什么」的对照基线。
> 口径：**结论一律以 `mcp-server/src/` 为准**，`mcp-server/dist/` 只是编译产物（本文件引用的 dist 只用于 CLI 交叉验证）。
> 凡查不到的写「未核实」，不凭记忆补 API 名 / 工具名 / 版本号。
> 本文件路径均为**仓库相对路径**（正斜杠），行号以本机当前工作副本为准。

---

## 1. 工具面全量清单（89 个）

### 1.1 总数与数它的依据

**总数 = 89。**

数它的依据（两条独立来源，互相印证）：

**① 源码静态计数**（命令与实际输出，`Select-String` 即 grep）：

```powershell
Select-String -Path 'mcp-server/src/tool-registry.ts' -Pattern 'server\.registerTool\(' -AllMatches | Measure-Object   # → 46
Select-String -Path 'mcp-server/src/wave/register.ts'  -Pattern 'server\.registerTool\(' -AllMatches | Measure-Object   # → 43
```
46 + 43 = **89**。

- 索引面 46 个：`mcp-server/src/tool-registry.ts:536` 起至 `:1342` 的 `server.registerTool(...)` 调用；同文件 `:1388` `export const indexToolSchemas` 至 `:1437` 的 `];` 亦为 46 条（`{ name: "..." }` 计数 = 46）。
- wave 面 43 个：`mcp-server/src/wave/register.ts:659` `export function registerWaveExtensions`，注册点 `:661`–`:1181`；`:1260` `export const waveToolSchemas` 亦为 43 条。
- 两处合并的唯一真值函数：`mcp-server/src/tool-registry.ts:1439-1442` `listAllToolSchemas()`。
- 注册完整性断言：`mcp-server/src/tool-registry.ts:1444-1446` 调 `assertToolRegistrationComplete(listAllToolSchemas().map(t => t.name))`；实现在 `mcp-server/src/tool-handlers.ts:86`（收集表 `toolHandlers` 在 `:17`）。
- 该文件 `:1435-1436` 有一条注记：`resolve_lib_skills` 的 schema 条目已移进 wave 面，所以「按 index 清单 = index 注册」读代码会数成 47 vs 46 —— 这是已知易错点。

**② CLI 运行时交叉验证**（走 `dist`，仅作交叉印证）：

```powershell
node mcp-server/dist/cli.js list-tools   # result.tools.Count = 89
```

**③ 包自述**：`mcp-server/package.json:4` 的 description 逐字含「89 个工具」。

> 三者一致（46+43 = 89 = CLI 实测 = package.json 自述）。

### 1.2 按功能域分组（15 组，每组条数之和 = 89，无重复无遗漏）

| # | 功能域 | 数 | 工具名（逐字照抄） |
| --- | --- | --- | --- |
| 1 | 兼容 API / 映射 / 注册表 | 7 | `query_api`, `get_method_params`, `convert_mapping`, `lookup_obfuscated`, `query_registry`, `get_version_info`, `get_server_status` |
| 2 | 文档检索（通用 + Forge/Fabric/NeoForge 专有） | 20 | `list_doc_versions`, `search_docs`, `get_doc_summary`, `get_doc_full`, `get_doc_related`, `list_forge_versions`, `search_forge_docs`, `get_forge_doc_summary`, `get_forge_doc_full`, `get_forge_doc_related`, `list_fabric_versions`, `search_fabric_docs`, `get_fabric_doc_summary`, `get_fabric_doc_full`, `get_fabric_doc_related`, `list_neoforge_versions`, `search_neoforge_docs`, `get_neoforge_doc_summary`, `get_neoforge_doc_full`, `get_neoforge_doc_related` |
| 3 | 社区知识库 | 4 | `list_community_sources`, `search_community_docs`, `get_community_doc_summary`, `get_community_doc_full` |
| 4 | 基岩 Add-On | 7 | `search_bedrock_docs`, `get_bedrock_doc_summary`, `get_bedrock_doc_full`, `get_bedrock_doc_related`, `analyze_bedrock_log`, `generate_addon_manifest`, `generate_bp_entity` |
| 5 | 平台包 / 工程探测 | 2 | `detect_mod_project`, `activate_platform_pack` |
| 6 | 加载器 API 摘要 | 3 | `query_loader_api`, `search_loader_api`, `ingest_loader_api` |
| 7 | 代码 / JSON 生成器 | 11 | `generate_datagen`, `generate_model`, `generate_lang`, `generate_network_packet`, `generate_capability`, `generate_config`, `generate_entity_renderer`, `generate_worldgen`, `generate_paper_plugin`, `generate_playtest_driver`, `generate_playtest_server_driver` |
| 8 | 游玩自测判读 / 桥 / 意图邮箱 | 4 | `inspect_playtest_evidence`, `inspect_playtest_multi`, `playtest_intent`, `playtest_bridge` |
| 9 | 构建 / 日志 / 运行时诊断 | 8 | `diagnose_gradle`, `analyze_build_log`, `analyze_log`, `crash_analyze`, `inspect_runtime`, `get_migration_guide`, `check_dependencies`, `diagnose_data_paths` |
| 10 | 校验 / 静态分析 | 8 | `validate_project`, `validate_at`, `validate_aw`, `validate_datapack_json`, `validate_addon_manifest`, `validate_bp_json`, `audit_resources`, `mixin_analyze` |
| 11 | 反编译 / 源码研究 | 4 | `get_minecraft_source`, `decompile_mod_jar`, `analyze_mod_jar`, `search_mod_code` |
| 12 | 移植 / 发布 / 更新 / MDK | 5 | `analyze_porting_path`, `port_project`, `check_publish_ready`, `mc_skill_update`, `download_official_mdk` |
| 13 | 工作流 / 知识资源 / 库技能 | 4 | `get_workflow_template`, `list_knowledge_resources`, `read_knowledge_resource`, `resolve_lib_skills` |
| 14 | 汉化 | 1 | `localize_mod` |
| 15 | 上游发布查询 | 1 | `query_upstream_releases` |

分区校验（脚本化，非手数）：把上述 15 组展平后 `total = 89`、`unique = 89`，与 §1.1 的 89 个注册名逐个比对 `missing = []`、`extra = []`。

---

## 2. 关键工具的参数字段与语义

### 2.1 文档检索面

**`search_docs`**（通用多平台）schema 真身：`mcp-server/src/docs-platform/forge/index.ts:703-761`。

| 参数 | 语义 | 证据 |
| --- | --- | --- |
| `query` | 关键词；支持 `|` OR 分组与 `class:` / `event:` / `method:` 前缀路由 | forge/index.ts:739 |
| `version` | **必填**，`.min(1)`；先用 `list_doc_versions` | forge/index.ts:740 |
| `platform` | **必填**，枚举 `SEARCH_DOC_PLATFORMS` | forge/index.ts:741-743 |
| `tags` | 可选标签过滤 | forge/index.ts:744 |
| `source` | **仅 `platform=fabric` 生效**：`fabric-docs`（默认）/ `fabric-wiki` / `all` | forge/index.ts:745-748 |
| `limit` | `.int().positive().max(30)`，默认 20 | forge/index.ts:749-759；常量 `:700-701` `SEARCH_DOCS_DEFAULT_LIMIT = 20` / `SEARCH_DOCS_LIMIT_MAX = 30` |

`platform` 枚举真身：`mcp-server/src/docs-platform/platforms.ts:4-27` = `forge` / `neoforge` / `fabric` / `quilt` / `liteloader` / `rift` / `modloader` / `paper` / `spigot` / `paper-api`。
**基岩不在这个枚举里**（`platforms.ts:31` `ALL_DOC_PLATFORMS` 才追加 `bedrock`），基岩走 `search_bedrock_docs`（`platforms.ts:2` 注释）。

**返回字段三件套（本面与平台专有面共用同一口径）**：`total` / `totalPool` / `truncated`。
权威口径写在注册面常量 `TOTAL_SEMANTICS_DESC`：`mcp-server/src/tool-registry.ts:479-485`，逐字要点：

- `total` = **本次返回条数**（等于 `results.length`，随 `limit` 变），**不是语料命中总数**；
- `totalPool` = 进输出窗口之前该面手里可用的候选条数；`truncated` = `(total < totalPool)`；
- 两位**不传 `limit` 也在**（`tool-registry.ts:476-477` 指明 8 个发射点由 `poolFieldsOf` 无条件回填）；
- `totalPool` 只到「本面可得」这一层，不等于语料全量；`total=0` 不说明 API 不存在。

同族还有 `VERBATIM_DESC`：`mcp-server/src/tool-registry.ts:464-468` —— 单标识符查询时每条命中带 `verbatim`（true / false / **无字段 = 未判定**），顶层 `verbatim_summary{term,judged,hits,matchedOn}`。

**平台专有面**（`search_forge_docs` 为例）：schema `mcp-server/src/docs-platform/forge/index.ts:219-268`，入参 = `query` / `version`（必填）/ `tags` / `limit`（上界 `FORGE_SEARCH_LIMIT_MAX`）。**没有 `platform` 参数**（平台由工具名决定）。

**`get_*` 面**：

| 工具 | 入参 | 证据 |
| --- | --- | --- |
| `get_doc_summary` / `get_forge_doc_summary` | `id` + `version`（+通用面 `platform`） | forge/index.ts:995-1007 |
| `get_doc_full` / `get_forge_doc_full` | `id` + `version` + `highlight_key`（`.default(true)`） | forge/index.ts:1065-1083；`:418-437` |
| `get_doc_related` / `get_forge_doc_related` | `id` + `version` + `limit`（默认 5） | forge/index.ts:1147-1161 |

`get_doc_related` 成功载荷形状：`{ok:true,platform,id,version,results[]}`（`results` 恒为数组）—— `forge/index.ts:1151`。

**`list_doc_versions`**：入参只有 `platform`（必填，枚举同上）；返回 `{platform, versions[], notes[]}`，`notes` 说明「本仓库已入库」不等于上游有文档 —— `mcp-server/src/docs-platform/forge/index.ts:628-644`。

**未核实**：各面返回里 `limitWindow` 的完整字段集与 bedrock 面 `demotion.{requestedLimit,resultLimit,candidateLimit,candidates,limitMax}` 的逐键语义（只在描述文本里见到，未逐字段读实现）。

### 2.2 平台包面

**`activate_platform_pack`** schema：`mcp-server/src/wave/register.ts:595-638`；描述常量：`wave/register.ts:364-375`。

| 参数 | 语义 | 证据 |
| --- | --- | --- |
| `action` | 枚举 `list` / `session` / `write` / `deactivate` | wave/register.ts:596 |
| `platform` | `session` / `write` 必填；regex + 枚举双重约束，枚举真身 `PACK_PLATFORMS` | wave/register.ts:597-604；`mcp-server/src/platform-pack/catalog.ts:14-23` = forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock |
| `minecraftVersion` | 精确版本；regex 禁路径穿越 | wave/register.ts:605-608 |
| `hosts` | `write` / `deactivate` **必填**；`cursor|claude|continue|trae|opencode|codex|zcode|pi|dsh` 或 `all`；禁止默认 Cursor | wave/register.ts:609-612；枚举 `mcp-server/src/platform-pack/hosts.ts:1-11`；`expandHosts` 报错文案 `:15-37` |
| `topics` | `session`：**只追加**规则号到底座 00/01/09（并集，永不替换）；**永不注入 skillBodies** | wave/register.ts:613-618 |
| `includeAllRules` | `session`：true 灌 00–10 全文 | wave/register.ts:619 |
| `task` | `session`：只追加其映射规则号（与 topics 并集）；未知 task 仍 `ok`，`rulesMode=base` | wave/register.ts:620-625 |
| `skillNames` | 与 task 建议名去重后注入 `skillBodies`，**总条数上限 8** | wave/register.ts:626-631 |
| `includeSkills` | **deprecated**，仅 `write`；仅当未传 `writeSkillStubs` 时映射为 stub 开关 | wave/register.ts:632 |
| `writeSkillStubs` | `write`：写 Skill stub；两者都传时以本字段为准；未传且未传 includeSkills 时默认 true | wave/register.ts:633 |
| `includeSkillBodies` | `write`：true 才写全文 | wave/register.ts:634 |
| `dryRun` | `.default(true)` | wave/register.ts:635 |
| `confirmed` | 未传 + `dryRun=false` ⇒ `ok:false` + `action.code=CONFIRMATION_REQUIRED`，盘上 0 文件 | wave/register.ts:636；实现 `mcp-server/src/platform-pack/write.ts:587`、`:795` |
| `projectPath` | `write` 真写只认此 allowlist | wave/register.ts:637 |

`rulesMode` 三态（`all` / `extended` / `base`）实现在 `mcp-server/src/platform-pack/session.ts:655-662`，`base` 时另给 `next` 对象：`:689`、`:719`。

**`detect_mod_project`** schema：`mcp-server/src/wave/register.ts:589-594` —— **只有 `projectPath` 一个参数**（CLI `--project` 注入），优先于 `MC_SKILL_PROJECT_ROOT`。实现：`mcp-server/src/platform-pack/detect.ts:97`；错误码 `KNOWLEDGE_REPO_NOT_MOD` 在 `:106`、`PACK_NOT_FOUND` 在 `:231`。描述常量：`wave/register.ts:332-334`（Quilt 在 Fabric 前；知识库根 → `KNOWLEDGE_REPO_NOT_MOD`；对不上规则树 → `PACK_NOT_FOUND`，禁止邻档 00–10）。

### 2.3 生成面：三态语义

**公共写盘字段**（`generate_model` / `generate_lang` / `generate_network_packet` / `generate_capability` / `generate_config` / `generate_entity_renderer` / `generate_worldgen` 共用）：`mcp-server/src/wave/register.ts:107-112`。

- `write`（默认 false）：true 时写入 `projectPath`，**须 `confirmed` + `MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT`**；`projectPath` 不能替代后者（`:109`）。
- `confirmed`：`write=true` 时必填 true（`:110`）。
- `projectPath`：须在 `MC_SKILL_PROJECT_ROOT` 内（`:111`）。

**三态机读判别字段 `resultKind`**：`mcp-server/src/generators/write-helper.ts:27-39` 的类型注释逐字定义：

| 取值 | 含义 | 细因位置 |
| --- | --- | --- |
| `"generation_failed"` | **生成失败**：该输入下没有可交付骨架（版本/平台不支持、参数非法） | `errors[]`；CLI `errorKind:"tool_failure"`（write-helper.ts:31-32） |
| `"write_blocked"` | **写入未完成**：骨架已生成（文本预览完整在 `result`），但写盘没发生；`written` 必然缺失 | `writeError.code` ∈ {CONFIRMATION_REQUIRED, PROJECT_ROOT_REQUIRED, PATH_OUTSIDE_ALLOWLIST, NOTHING_TO_WRITE, WRITE_FAILED}（write-helper.ts:33-35） |
| `"ok"` | 成功：**不传 `write` 即 dry-run**（只吐文本 + suggestedPath，恒 ok，`ok` 不对写盘作任何承诺） | `write=true` 且条件满足时 `written[]` 列实际落盘绝对路径（write-helper.ts:36-37） |

`ok` 是 `resultKind === "ok"` 的**派生**，二者不得各自漂移：`write-helper.ts:48-50`。拒绝态判据单源：`write-helper.ts:67-72` `generatorRejected()`。

**环境变量语义**（写盘沙箱守卫）：`mcp-server/src/utils/project-sandbox.ts:1-13` 头注逐字：`MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT=<absolute allowlist root>`；`resolveWriteAllowRoot()` 在 `:85-103`：未设 ALLOW_WRITE → `WRITE_DISABLED`；`requireEnvRoot` 且未设 PROJECT_ROOT → `PROJECT_ROOT_REQUIRED`（注释明确「projectPath 由调用方/模型给出，与写盘根同义时沙箱形同虚设」）。

**参数名不统一的既成事实**（对比标项目时要小心）：`generate_config` 只有 `loader`（无 `platform`）+ `version`（wave/register.ts:404-411，`library` 默认 `cloth`，枚举 `cloth|yacl` 在 `:408`）；`generate_network_packet` 必填 `platform` 且**没有 `version`**（wave/register.ts:389-396）；`generate_model` / `generate_lang` 两者都没有、只必填 `version`（wave/register.ts:376-388）。

### 2.4 游玩自测面

**授权载体（四个工具共用）**：`MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<绝对路径>`，目标 realpath 必须落在根内。证据：`mcp-server/src/playtest-evidence/index.ts:8-10`（头注）、`:52-70`（`authorize()`：`PLAYTEST_DISABLED` / `AUTHORIZATION_REQUIRED`）。

| 工具 | schema 位置 | 关键参数 |
| --- | --- | --- |
| `generate_playtest_driver` | wave/register.ts:189-218 | `platform` + `version` 必填；`driverMode` 枚举 `external_bridge`（默认）/ `in_jvm_player_agent` / `temporary_client_tick_driver`（`:195-201`）；`capabilityProfile` 默认 `strict_survival`（`:202`）；`scenario` `smoke|village`（`:206`）；`plan[]` DSL（`:207`）；`budgetTicks`（`:208`）；`watchPlan` 默认 true = 长驻热重载（`:209`）；`evidenceDir`（`:216`） |
| `inspect_playtest_evidence` | wave/register.ts:219-229 | `evidenceDir` / `projectPath` / `authorization`（`sandbox|dev_instance`）/ `runId` / `maxEntries`（默认 50，硬顶 500）/ `version` / `logsDir` / `crashReportsDir` / `screenshotsDir` |
| `inspect_playtest_multi` | wave/register.ts:230-243 | `evidenceRoot` 或 `clients[{id,evidenceDir}]`（硬顶 16）；`expectMarkers[]`（相对 `<evidenceRoot>/sync/`）；`authorization` |
| `playtest_intent` | wave/register.ts:278-290 | `action` `read|write`；`evidenceDir` 必填；`intent` / `params` / `overwrite` / `confirmed`（write 必填 true）/ `authorization` |
| `playtest_bridge` | wave/register.ts:258-277 | `action` `status|execute|await`；`command{action,params,delay}`；`condition` 六值 `ready|inventory_contains|health_below|health_above|entity_nearby|chat_message_matches`；`timeoutMs`（默认 30000，硬顶 120000）；`pollIntervalMs`（默认 250）；`port`（默认 38081，host 恒 127.0.0.1）；`authorization`；`confirmed`（execute/await 必填 true） |
| `generate_playtest_server_driver` | wave/register.ts:244-247 | `evidenceDir`（绝对路径，须在授权根内）+ `packageName`（默认 `playtest`） |
| `generate_paper_plugin` | wave/register.ts:248-257 | `pluginName` / `packageName` 必填；`paperApiVersion` / `javaToolchain` / `apiVersion` 不给则留占位（不静默取 latest） |

**证据文件契约（源码实证）**：`inspect_playtest_evidence` 实际读的文件名 —— `mcp-server/src/playtest-evidence/index.ts:131-132` `exit-code.txt`（注释：GameTest 语义 = 退出码即「必需失败的测试数」，0 = 全绿）、`:140-141` `state.json`、`:178-179` `calls.jsonl`；三态类型 `present|absent|unreadable` 定义在 `:17`，纪律「缺件不得塌成没有失败」在 `:10`。
`inspect_playtest_multi` 的判绿三条在 `mcp-server/src/playtest-multi/index.ts:12-18`（① clients ≥ 1；② 每客户端 `exit-code.txt=0` 且 `state.json` 与 `qa.log` 都 present；③ `expectMarkers` 逐个 present），`qa.log` 的实际取法是「证据目录内任意 `.log` 中 mtime 最新的一个」（`:163`），`rounds.jsonl` 只读末轮（`:143`、`:192-194`）；保留目录名 `sync` 跳过但**留痕** `autoSkipped`（`:85`、`:98-99`、`:232`）。
**`plan.txt` / `rounds.jsonl` / `qa.log` 的写侧**在生成器产出的 driver 里（`generate_playtest_driver` 描述：`wave/register.ts:293-294`），判读侧只读。

**桥面契约**：`mcp-server/src/playtest-bridge/index.ts:1-10` 头注逐字：`POST /execute` → `{id,status,message,data}`、HTTP 恒 200；`GET /status` → `{status,version,platform,httpPort,actions,ready}`；桥原生超时 10000ms 映射 `PLAYTEST_TIMEOUT`；**桥无鉴权且通配绑定 ⇒ 工具硬编码只连 127.0.0.1**。常量：`:38-46`。

### 2.5 构建与诊断面

| 工具 | 输入 | 「是否代跑 Gradle」的边界 | 证据 |
| --- | --- | --- | --- |
| `diagnose_gradle` | `buildGradle` / `gradleProperties` / `litemodJson` / `riftmodJson` / `addonManifest` / `quiltModJson` / `projectPath`（显式正文优先） | **静态分析**：只读文本判定插件 id、Java toolchain、映射通道等；输出里的建议是「建议运行 ./gradlew build 验证」，即它自己不跑 | schema `mcp-server/src/tool-registry.ts:179-187`；模块 `mcp-server/src/gradle/index.ts:1-9`；`:347` 建议文案；`:505-509` 只按正则判 `runClient` 任务**是否存在** |
| `analyze_build_log` | `logText` 或 `logPath`（二选一）+ 可选 `platform` / `minecraftVersion` | **明说不执行**：头注逐字「不执行 gradlew，不联网，不写盘」；报错文案「本工具不执行 gradlew」；结论「修完后请用户在本机重跑构建」 | `mcp-server/src/build-log/index.ts:1-3`、schema `:8-16`、`:309`、`:448` |
| `crash_analyze` | `crashReport` 或 `crashReportPath` + 可选 `version` | 纯文本模式库匹配，不执行任何进程 | `mcp-server/src/crash/index.ts:1-6`；窗口常量 `:28` `CRASH_ANALYZE_MAX = 512_000`、`:30` `CRASH_HARD_MAX = 8*1024*1024` |
| `inspect_runtime` | `logsDir`（优先）/ `crashReportsDir` / `projectPath`（有界探测）/ `maxLines`（默认 200，硬顶 2000）/ `maxBytes`（默认 512KiB，硬顶 2MiB）/ `version` | **日志型 inspector，只读文件快照尾部**；明禁 JDWP attach、禁全盘、禁向上走到盘符根 | schema `mcp-server/src/wave/register.ts:646-653`；实现 `mcp-server/src/runtime-inspect/index.ts:1-4`、`:20-36`；`:91` `readTail()`、`:101`/`:134` `readSync`、`:255` `logTail = readTail(...)`；注册描述 `wave/register.ts:1063`「log-based, no JVM attach」、`:1066` |

另：`analyze_log` / `get_migration_guide` / `check_dependencies` 注册在 `mcp-server/src/wave/register.ts:855` / `:861` / `:867`。

### 2.6 联网面：`query_upstream_releases` 的缓存策略

schema：`mcp-server/src/tool-registry.ts:259-282`；output schema（含 `cache` 块）：`:289-327`；实现：`mcp-server/src/upstream/releases.ts:469`。

| 项 | 值 | 证据 |
| --- | --- | --- |
| `source` | 10 值枚举 `forge` / `neoforge` / `fabric-loader` / `fabric-yarn` / `quilt-loader` / `parchment` / `modrinth` / `legacyfabric-loader` / `maven` / `mojang-manifest` | tool-registry.ts:260-266；`mcp-server/src/upstream/releases.ts:28-44` |
| `minecraftVersion` | `fabric-loader` / `fabric-yarn` / `quilt-loader` / `parchment` / `legacyfabric-loader` **必填**；其余可选 | tool-registry.ts:267-271 |
| `slug` | `modrinth` 用 project slug；`maven` 用 `<alias>:<group>/<artifact>`（别名表写死在 releases.ts） | tool-registry.ts:272；`releases.ts:51-78` |
| `limit` | `.int().min(1).max(200).default(12)`；`total` 始终是过滤后总条数 | tool-registry.ts:273 |
| `refresh` | true = 跳过磁盘缓存强制打上游（结果照旧回写） | tool-registry.ts:274-281 |
| **TTL** | `available:true` → **6 小时**；`available:false`（上游确实没有）→ **2 小时**；`ok:false`（没查到）→ **不缓存** | `mcp-server/src/upstream/cache.ts:19-22` `UPSTREAM_TTL_MS`；`:1-9` 三条硬规矩；`:67-70` `tierForResult` |
| **缓存根** | 只许 `$MC_SKILL_CACHE/upstream-cache/`（子目录常量 `UPSTREAM_CACHE_SUBDIR`）；解析结果落在仓库内**一律拒写** | cache.ts:24；`:38-46` `upstreamCacheDir()` 用 `isResolvedInside(repo, dir)` 拒写 |
| 关缓存 | `MC_SKILL_UPSTREAM_CACHE=0` 整体关掉 | cache.ts:72-74 |
| 缓存键 | `source` + `minecraftVersion` + `slug` + `limit` 的 sha256 前 24 位 | cache.ts:52-65（注释说明 `limit` 必须进键，否则 `limit=3` 会截断后来的 `limit=50`） |
| 响应披露 | 每次响应带 `cache{hit,tier,ttlMs,ageMs?,wrote?,note?}` | tool-registry.ts:316-326；`cache.ts:26-35` |

---

## 3. 架构要点（带文件指针）

### 3.1 双入口（同一 core）

- **MCP stdio 入口**：`mcp-server/src/index.ts` —— 第一个 import 是 `./utils/node-sqlite-guard.js`（`:2`，Node 22.5–22.12 未带 `--experimental-sqlite` 时先给指引再退出）；`:38` `isMainModule()` 判定；`:85` `warmupApi([DEFAULT_VERSION])`；`:88-89` `new StdioServerTransport()` + `server.connect(transport)`；`:64-65` SIGINT/SIGTERM 关库。
- **CLI 入口**：`mcp-server/src/cli.ts` —— 头注 `:1-13` 逐字：「flags-only（--key value / --key=value / 裸 --key→true），参数类型按各工具的 zod inputSchema 驱动转换。输出 JSON 包装 {success, tool, result|error}。**退出码 0=成功 / 1=工具失败 / 2=用法错误**」；失败信封另有 `errorKind`（usage / validation ↔ exit 2，tool_failure / timeout ↔ exit 1）。
- **bin 三入口**：`mcp-server/package.json:44-48` = `mc-skill`（`./dist/cli.js`）、`mc-skill-scripts`（`./bin/mc-skill-scripts.mjs`，维护侧批量线，**不属 MCP 工具面**）、`mc-ai-coding-assistant-tool`（`./dist/index.js`）。
- **handler 收集表**：`mcp-server/src/tool-handlers.ts:17` `export const toolHandlers = new Map(...)`；`:20` `patchToolCollection()` 包装 `server.registerTool`；`:86` `assertToolRegistrationComplete()`（CLI 通用 dispatch 与 schema 清单不一致就立刻抛错，防「CLI 全部报未知命令而 MCP 正常」的静默劣化）。
- CLI 另有一条本地子命令通道 `descriptor`（不经 MCP registry）：`cli.ts:11-12`；批量子进程桥 `mcp-server/src/cli/index.ts:259` `spawnSync(opts.nodeBin ?? process.execPath, [scriptPath, ...args])`。

### 3.2 数据目录与缓存根

- `MC_SKILL_DATA`：解析优先级 env → `import.meta.url` 推导 → `cwd/data` —— `mcp-server/src/utils/path.ts:1-9`（策略）、`:137-151` `resolveDataDir()`。**注意 `:60-66`**：env 已设但目录暂不存在时**不再回退**（半交换态恰恰是「存在性检查」失效的场景），只告警一次。
- 数据根围栏：`path.ts:144-149` —— 子路径逃出 `data/` 即抛，且**错误信息不回显路径**（防文件系统布局泄露）。
- 社区目录：`MC_SKILL_COMMUNITY` → `dirname(MC_SKILL_DATA)/community_knowledge` → 仓库根 → `cwd/community_knowledge`，同一把围栏 —— `path.ts:161-187`。
- `MC_SKILL_CACHE`：`mcp-server/src/utils/path.ts:107-116` `resolveCacheRoot()` —— 优先级 `MC_SKILL_CACHE` → Win `%APPDATA%/mc-skill-cache` → `~/.config/mc-skill-cache`；注释逐字「不写仓库 data/」。
- 本机 `data/` 顶层目录 84 个（实测 `Get-ChildItem data -Directory`）；`mcp-server/package.json:4` 自述「73 个文档版本档」。

### 3.3 写盘沙箱守卫

- 文件：`mcp-server/src/utils/project-sandbox.ts`（327 行）。
- 反 Junction/symlink 逃逸的判据（`:1-13` 头注逐字）：**不依赖 `lstatSync().isSymbolicLink()`**（Windows Junction 常报 false），一律 `realpathSync.native` 解析写目标的**父目录**再与 allowlist realpath 前缀比对（win32 大小写不敏感）。
- 关键函数：`:38-44` `nativeReal()`；`:47-57` `isInsideReal()`；`:64-76` `realOfNearestExistingAncestor()`（ENOENT-safe）；`:85-103` `resolveWriteAllowRoot()`。
- 与 generate_* 的接线：`mcp-server/src/generators/write-helper.ts:9-14` 导入 `assertCreatableDir` / `assertWritablePath` / `ProjectPathError` / `resolveWriteAllowRoot`。

### 3.4 playtest 授权根

- `mcp-server/src/playtest-evidence/index.ts:52-70`：`MC_SKILL_PLAYTEST_ALLOW !== "1"` → `PLAYTEST_DISABLED`；缺/非法 `MC_SKILL_PLAYTEST_ROOT` → `AUTHORIZATION_REQUIRED`；根 `nativeReal(resolve(envRoot))` 后目标目录再 realpath 判定。
- 多客户端是**整体拒**而非逐客户端放行：`mcp-server/src/playtest-multi/index.ts:9-10`。
- 桥侧授权门做在本侧、且只连 127.0.0.1：`mcp-server/src/playtest-bridge/index.ts:8-9`、`:38`。
- 授权根复用同一套 realpath 原语：`playtest-evidence/index.ts:15`、`playtest-multi/index.ts:22`、`playtest-bridge/index.ts:14`、`playtest-intent/index.ts:16` 全部 `import { isInsideReal, nativeReal } from "../utils/project-sandbox.js"`。

### 3.5 worker 预热机制

- `mcp-server/src/api/index.ts:1-17` 头注逐字：「Worker Thread 预加载 JSON（避免主线程阻塞）」「v8 内部序列化传输大对象（比 JSON.stringify → JSON.parse 快 10x）」「Trie 索引加速模糊搜索」「FIFO 版本缓存：插入序驱逐最旧项（不是 LRU）」「**15s 硬超时保护**：Worker 超时则降级到惰性加载」「Per-version 缓存」。
- 入口常量 `DEFAULT_VERSION = "1.20.1"`：`api/index.ts:36`；启动预热 `mcp-server/src/index.ts:85`；`warmupApi` 实现 `api/index.ts:1134-1137`；状态机 `getApiPreloadStatus` `:1139-1165`（`idle` / `missing_data` / `error` / `loading` / `lazy` / `ready`）。
- worker 入口：`mcp-server/src/workers/preloader.ts` —— 头注 `:1-12`；入站契约 `{type:"start", timeout, dataDir}` 在 `:30-36`；数据目录解析三策略在 `:44-59`；Trie 结构 `:70-74`。
- 工具面入口：`get_server_status` 的 `warmup` 参数（`mcp-server/src/tool-registry.ts:165-168`：「仅当为 true 时预热该版本；缺省不预热」）。

### 3.6 语义检索索引

- 引擎与融合：`mcp-server/src/docs-platform/semantic/search.ts:1-8` 头注逐字：「**FTS5 BM25（全文关键词）+ 余弦相似度（语义向量），RRF k=60 融合**」；三条设计约束：`semanticSearch` 永不该抛异常（失败返回 null，调用方保持纯 L0）、FTS5 可独立兜底、无嵌入的库跳过模型加载。
- schema 单源：`search.ts:36` `SEMANTIC_DDL`（meta / docs / chunks / chunks_fts）。
- 库位置：`search.ts:75-81` `semanticDbPath()` → `<dataRoot>/<platform>_<version>/<source>/<version>/semantic/db.sqlite`（即**每棵文档树旁一份**）。
- 嵌入模型：`mcp-server/src/docs-platform/semantic/embeddings.ts:11-12` `EMBEDDING_DIM = 384` / `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`；懒加载单例按 dataRoot 分键 `:19-28`；**运行时禁止静默联网**：`:32-34` `env.allowRemoteModels = false`（模型缺失直接失败并降级 FTS5）。
- 状态面：`mcp-server/src/docs-platform/semantic/status.ts:26`（注释：本仓库语义库实测 57 个 db）、`:342`（扫描各文档树旁 db.sqlite）、`:180`（`dbOpens` 恒 ≤ `SEMANTIC_DB_LRU_CAP`）。

---

## 4. 工程门与质量体系

### 4.1 组织方式

- 门脚本目录：`mcp-server/scripts/`；盘上 `assert-*.mjs` **86 道**（`glob mcp-server/scripts/assert-*.mjs` = 86）。
- 测试脚本：`mcp-server/test-*.mjs` **22 个**；`node --test` 的 `*.test.mjs` **10 个**（`mcp-server/scripts/_lib/*.test.mjs`）；`scripts/_lib/` 共 31 个 `.mjs`。
- 总链在 `mcp-server/package.json:55` 的 `"test"`，顺序逐字为：`assert-scripts-parse.mjs`（对每个被 Git 跟踪的 `.mjs/.js/.cjs` 跑 `node --check`）→ `assert-powershell.mjs` → `assert-sync-normalizers.mjs` → `assert-java-spawn-cwd.mjs` → `npm run build` → 一串 `test-*.mjs` → `node --test` 的 10 个 `.test.mjs` → 一长串 `assert-*.mjs`（含 `--selftest` 与主流程两腿）。
- **门链四数普查**（把「可达性」本身钉成断言）：`mcp-server/test-scripts.mjs:2588-2608` 的 `censusChain()` —— 口径 `K` 盘上 / `P` 可达（名字出现在任一 `test-*.mjs` 或 `package.json`）/ `N` 真跑 / `M` selftest / `Z` 由本文件其它块 spawn / `Y` 本文件源码零出现；只留 `P === K` 一条等式，其余取下界。地板常量在 `:2610-2612`：`FLOOR_REAL_RUN = 30`、`FLOOR_SELFTEST = 15`、`FLOOR_UNREF = 6`（**下界，非等式**，合法加门不该红）。

### 4.2 REAL_RUN_GATES 是什么

`REAL_RUN_GATES` 是 `mcp-server/test-scripts.mjs:2235-2434` 定义的数组，**当前 62 条**（脚本化计数：在该数组区间内匹配 `"./scripts/<name>"`）。它的定位（`:2232-2234` 注释）：「两条数组的真身提到模块作用域，唯一读者是下方 §S18/S19 与 W1-2 两个 `for` 与 §S4 四数普查」；「四数普查的 N/M 必须**从数组本身取长度**，在别处重抄一遍名单 = 第二个真值源，必然随加门漂」。

配套 `SELFTEST_GATES`（`:2436-2585`，**当前 52 条**）—— 这些门各自带 `--selftest`（内存投毒臂），证明**判据本身是活的**（断言写歪/被改软时必须当场红）。

关键读数（脚本化）：`REAL_RUN_GATES` 62 条去重 62；`SELFTEST_GATES` 52 条去重 52；地板分别 30 / 15 ⇒ 现状远高于地板。

### 4.3 门清单（86 道 `assert-*.mjs`，名字 + 一句话作用）

> 作用句取自各门文件头的首行注释（逐字摘，未改写）。

| 门 | 一句话作用 |
| --- | --- |
| `assert-archive-pointers.mjs` | 档案指针守卫 —— 「档案/历史/证据搬走 + 留指针」的执法面 |
| `assert-authoring-lint.mjs` | 作者规范（`WRITING-FOR-AGENTS.md`）的机器可判子集 |
| `assert-backlog-table-shape.mjs` | 给 `CONTRIBUTING_LIST.md` §未排期清单**这张表的形状**立门 |
| `assert-bedrock-genre-demote.mjs` | 基岩「版本更新说明」体裁：打标签 + 检索降权 |
| `assert-bedrock-script-api-pin.mjs` | bedrock 模板 `@minecraft/server` 钉值的真值源门 |
| `assert-bedrock-scriptapi-members.mjs` | scriptapi 树的「成员条数」必须挂在可核对的计数源上 |
| `assert-cli-full.mjs` | CLI 全量档 |
| `assert-cli-quick.mjs` | CLI 快速档 —— 覆盖主要模块与三个零覆盖分支 |
| `assert-cli-smoke.mjs` | CLI 双入口冒烟门 |
| `assert-community-attribution.mjs` | 禁区矛盾豁免门 + 用户裁定面的活性断言 |
| `assert-config-platform-face.mjs` | 「配置」口径的平台面一致性门 |
| `assert-corpus-faithfulness.mjs` | G3 · 语料保真门 |
| `assert-corpus-semantics.mjs` | `data/**` **全树语义读**门 |
| `assert-cross-layer-names.mjs` | 跨层类名（档位类名层 ↔ 正文实名） |
| `assert-doc-absence-claims.mjs` | 「文档缺页断言 vs 检索实况」一致性门 |
| `assert-doc-cache-bounds.mjs` | docs-platform 每个 store 的 Map 缓存都必须有硬条数上界 |
| `assert-fabric-transcludes.mjs` | Fabric 语料 transclude 展开的离线自证 |
| `assert-forge-1182-registry-consts.mjs` | forge/1.18.2 注册表常量下划线审计 |
| `assert-forge-1204-material.mjs` | forge/1.20.4 档源稿不得再引用已移除的方块 `Material` |
| `assert-forge-at-example.mjs` | Forge 各档 `mc-mixin` 的 AT 示例行必须与该档映射库现产答案逐字同答 |
| `assert-forge-blockshape-family.mjs` | `BlockBehaviour.Properties` 形态族 × 版本区间门 |
| `assert-forge-srg-ingest.mjs` | Forge 1.16.5–1.20.4 SRG 成员层的**离线**门 |
| `assert-generator-java-symbols.mjs` | 生成物里的 Java 符号必须在产物内可解析 |
| `assert-generator-rejection-codes.mjs` | `generate_*` 的拒绝必须落**具名**机读码 |
| `assert-generator-template-safety.mjs` | 吐 Java 的生成器必须能通过 TypeScript 语法检查 |
| `assert-glossary-mojmap-face.mjs` | glossary「mojang = mojmap」口径门 |
| `assert-index-channel-layout.mjs` | api-index 类名必须与本档实钉的 Forge `official` 通道一致 |
| `assert-index-consistency.mjs` | G4 · 索引与映射自洽门 |
| `assert-iserror-anchor.mjs` | `isError: true` 位点锚门 |
| `assert-java-spawn-cwd.mjs` | Java 子进程沙箱 gate —— 防「跑起来在用户仓库里拉垃圾」 |
| `assert-javadoc-build-provenance.mjs` | `data/forge_javadoc/**` 的「出处可核 + 落盘形状」门 |
| `assert-javadoc-index-parity.mjs` | forge_javadoc 族「盘上 ↔ 索引」双向差门 |
| `assert-javadoc-orphan-record.mjs` | forge_javadoc 孤儿对账/删除留痕必须是真的、且不过期 |
| `assert-legacy-isolation.mjs` | NeoForge LEGACY 共享归档树的检索隔离门 |
| `assert-lib-census-counts.mjs` | 库 SKILL「N 条实测」计数必须能由其所引文件机械复算 |
| `assert-lib-coord-snapshot.mjs` | 库坐标 ↔ 离线 maven-metadata 快照对账（**零网络**） |
| `assert-lib-ownership.mjs` | G1 · 库摘要的身份与归属门 |
| `assert-lib-session-resolve-parity.mjs` | 库 Skill 的「双链路同答」一致性门 |
| `assert-limit-monotony.mjs` | `L56` 甲′：limit 变大「只增不减 + 前缀不变」 |
| `assert-link-forge-1.20.4.mjs` | （头注无独立描述句；文件名语义 = forge 1.20.4 链接面） |
| `assert-mapping-candidate-total.mjs` | 歧义候选清单必须自带「同条件真池条数」且样本次序可复现 |
| `assert-no-invalid-api-shapes.mjs` | 已证编译不过的 API 形状的回归门 |
| `assert-no-recursive-cpsync.mjs` | 目录级递归 `cpSync` 必须走 `copyTree` |
| `assert-no-yarn-json-slurp.mjs` | runtime src 永不 slurp `yarn-mappings.json` |
| `assert-pack-meta-coverage.mjs` | 每个版本档都有 `pack.meta.json` 且元数据自洽 |
| `assert-parser-availability.mjs` | G2 · 解析器可用性门 |
| `assert-playtest-26x-onmove-shape.mjs` | 26.x driver「不得调用已删除 API」回归门 |
| `assert-playtest-driver-compiles.mjs` | 游玩自测 driver 生成物的**真构件编译腿** |
| `assert-playtest-intent-gate.mjs` | `in_jvm_player_agent` + `playtest_intent` 邮箱的执法门 |
| `assert-playtest-server-driver-compiles.mjs` | 服务端面 driver 生成物的**真构件编译腿** |
| `assert-powershell.mjs` | Windows PowerShell 5.1 gate |
| `assert-prose-name-roster.mjs` | 技能/规则**散文里的类名清单**必须落在真构件名册里 |
| `assert-qsl-verified-sync.mjs` | qsl-verified 语料派生件必须与其声明复制源一致 |
| `assert-quilt-unversioned-wiki.mjs` | quilt「未版本化现行页」拷贝事实与页内标注必须同时成立 |
| `assert-registry-field-existence.mjs` | 注册表「字段级存在性」 |
| `assert-registry-limit-window.mjs` | `query_registry` 的取件窗修法 + limit schema 钳制 |
| `assert-rule-ban-vs-example.mjs` | 同档「禁令 vs 活围栏示范」一致性门 |
| `assert-rule-internal-refs.mjs` | 规则文件「见本文件「X」」内引文必须能定位 |
| `assert-rule-java-shapes.mjs` | 规则树里 Java 代码块示例的「形状」门 |
| `assert-rule-ledger.mjs` | 审计结论「机读清单 + 逐条销账」门 |
| `assert-rules-api-names.mjs` | Fabric 规则树面的「API 名跟丢版本」闸 |
| `assert-rules-match-tool.mjs` | 「规则自述的检索行为」vs「CLI 实测载荷」一致性门（quilt 侧） |
| `assert-scaffold-mixin-shape.mjs` | scaffold「注入 void 方法却声明 `CallbackInfoReturnable`」形状门 |
| `assert-scaffold-pin-claims.mjs` | 版本档自述的「钉值声明」必须等于该档 `scaffold/gradle.properties` 实钉值 |
| `assert-scaffold-rules-conflict.mjs` | scaffold 不得使用「同档规则里以 ❌ 标注」的符号 |
| `assert-scaffold-selfcheck.mjs` | Fabric scaffold 自洽门 |
| `assert-scaffold-wrappers.mjs` | scaffold wrapper 面门（W5-4 stage ②） |
| `assert-script-write-guard.mjs` | S20 的**第 8 步链**入口（scripts 写盘必须走 write-guard） |
| `assert-scripts-parse.mjs` | 语法闸门：对被 Git 跟踪的每个 `.mjs/.js/.cjs` 跑 `node --check` |
| `assert-server-rules-integrity.mjs` | 服务端面规则载体（`paper/<ver>/rules/**`）的出处门 |
| `assert-signature-face-integrity.mjs` | 服务端面签名层（Javadoc）的出处 / 索引差 / 孤儿留痕门 |
| `assert-skill-mappings-key.mjs` | 含围栏代码的 Skill 正文必须声明非空 `mappings:` 且与正文实名一致 |
| `assert-skill-mirrors.mjs` | `.cursor/skills|rules` 与各 IDE 镜像规范化后哈希一致 |
| `assert-skill-skeleton-census.mjs` | 空壳 Skill 口径 2 普查棘轮 |
| `assert-skill-yarn-attest.mjs` | Fabric/Quilt Skill 正文类名的「第二出处」门 |
| `assert-sync-normalizers.mjs` | PS ⇄ JS 归一化差分 gate |
| `assert-test-chain-coverage.mjs` | `node --test` 链必须覆盖盘上全部 `*.test.mjs` |
| `assert-test-harness.mjs` | 手搓测试 harness 不得把 async 用例当同步用例「假绿」 |
| `assert-total-semantics-wording.mjs` | 「total 语义」这句话必须真的到消费者眼前 |
| `assert-upstream-chapters.mjs` | 文档语料的「期望页面清单」必须来自上游，不得来自本仓产物 |
| `assert-upstream-limit-shape.mjs` | `query_upstream_releases` 的「有界 + total/truncated 披露 + 甲′ 单调」 |
| `assert-verbatim-support.mjs` | verbatim 逐字支撑位门 |
| `assert-vendored-attribution.mjs` | 原样收录的第三方技能树必须可追溯 |
| `assert-w55-hygiene-rulings.mjs` | W5-5 卫生件的用户裁定钉 |
| `assert-workflow-hitl.mjs` | 工作流模板「人在环」语义门 |
| `assert-yarn-named-integrity.mjs` | yarn tiny 的 named 列完整性 ratchet |

### 4.4 根测试脚本（22 个 `test-*.mjs`）

`test-core.mjs`（核心 §S* 块）、`test-scripts.mjs`（门链普查，见 §4.2）、`test-cli.mjs` / `test-cli-parse.mjs` / `test-cli-failure-channel.mjs`（CLI 面）、`test-mcp.mjs`（MCP server）、`test-platform-pack.mjs`（session / detect / write dryRun / 标记块 / 回滚 / deactivate）、`test-loader-api.mjs`、`test-semantic.mjs`、`test-decompile.mjs`、`test-deep-mixin.mjs`、`test-audit-resources.mjs`、`test-analyze-build-log.mjs`、`test-audit-data.mjs`、`test-wave-bcd.mjs`、`test-w3-low.mjs`、`test-localize.mjs`、`test-update.mjs`、`test-path-guards.mjs`、`test-checkdeps.mjs`、`test-assistant-gaps.mjs`（契约：VERSION_REQUIRED、`get_version_info` 仅 Forge、Architectury PICK_PLATFORM 等）、`test-mdk-npm-form.mjs`（不进 npm test 主链，见 package.json:83 单独脚本）。

---

## 5. 明确的缺口清单（逐条标「源码实证」或「文档口径」）

### 缺口 1｜**没有**「在游戏进程内直接执行并拿真实回执」的工具面能力（源码实证）

- 全仓 `mcp-server/src/` 内**没有任何工具启动游戏或 JVM 进程**：`runClient` / `runServer` 的出现处只有 ① 静态判定 Gradle 任务是否存在（`mcp-server/src/gradle/index.ts:505-509`）、② 生成物文本与文档（`mcp-server/src/generators/paper-plugin.ts:124` 生成 `tasks.register('runServer', JavaExec)`；`:16`/`:197` 对照表）。
- `spawn` / `spawnSync` 的全部落点只有：`decompile/java/java-process.ts:128`（`java -version` 探针）、`:275`（反编译 java 子进程）、`:240`（`taskkill`）、`mdk/index.ts:274,322,435,439,455,463,501,513,522`（tar / 7z）、`cli/index.ts:259`（子脚本）。**没有 gradle 落点。**
- 三条游玩自测路线的执行体都**不在工具里**：`generate_playtest_driver` 只吐文本（`mcp-server/src/wave/register.ts:293` 逐字「只吐文本，默认不写盘」）；桥是**外部 HTTP**（`mcp-server/src/playtest-bridge/index.ts:1-10`）；`playtest_intent` 只写邮箱文件（`mcp-server/src/playtest-intent/index.ts:1-13`，头注逐字「**不装桥、不跑游戏、不碰正式实例**」）。
- 结论口径：**有「游戏进程内执行」的产物（driver / in_jvm 执行器源码），没有「工具侧进程内执行 + 实时回执」**。回执一律靠事后读证据文件。

### 缺口 2｜**没有**实时日志流；`inspect_runtime` 是**文件快照尾部**（源码实证）

- `inspect_runtime` 的实现是「打开文件 → `fstatSync` → `readSync` 读尾部 → 关闭」：`mcp-server/src/runtime-inspect/index.ts:91` `readTail()`、`:101` 与 `:134` `readSync`、`:255` 调用点。没有流式/长连接/增量推送。
- **全仓 `mcp-server/src/` 零 `fs.watch` / `fs.watchFile` 命中**（grep `watch\(|watchFile` → 0 匹配）。
- 工具面自述即为「日志型」：注册描述 `mcp-server/src/wave/register.ts:1063`「log-based, no JVM attach」、`:1066`「默认只读文件尾部 N 行并设字节上限……不做 JDWP attach」；实现头注 `runtime-inspect/index.ts:1-4` 逐字「禁止 JDWP attach、禁止改游戏、禁止全盘」、`:304`「不要把本工具当 JVM attach」。
- 唯一的「准实时」是 **driver 侧的长驻热重载**（改 `plan.txt` 在同一进程内开新一轮）：`mcp-server/src/wave/register.ts:209` `watchPlan` 默认 true；那是**生成的 Java 产物**在看文件，**不是 MCP 工具在流式接收**。

### 缺口 3｜假玩家 / 客户端控制的**能力天花板：桥 = 命令级，driver = 玩家级但有档位限制**（源码 + 文档口径）

- 桥（`driverMode=external_bridge`）天花板 = **命令级**：`mcp-server/src/generators/playtest-bridge-mod.ts:677` 逐字「**「命令级操控 + 观察」通了，「玩家级操控」没通。**生存模式下没有 op / 没开作弊时，`chat_command` 基本只能读、改不动世界——能不能改世界取决于实例权限，不取决于本桥」。
- driver（`temporary_client_tick_driver` / `in_jvm_player_agent`）天花板 = **玩家级**（真按键原语 forward/jump/sneak/attack/use + move/goto/break/gui），**但只在已验证档**：`mcp-server/src/generators/playtest-driver.ts:1794` `PLAYTEST_VERIFIED_TIER`（注释 `:1793` 逐字「javap 实测过签名的档（temporary_client_tick_driver 可出真代码）；**其余档一律结构壳**」）；表外档的分支在 `:5447-5451`（只发契约 + 结构壳）。
- 桥模板自身的可用档位另有硬边界：`mcp-server/src/generators/playtest-bridge-mod.ts:86-99` `BRIDGE_MOD_TARGETS`（forge 1.7.10/1.8.9/1.9.4/1.10.2/1.11.2/1.12.2 + rift 1.13/1.13.2 + modloader 1.6.4）；其中 **modloader 1.6.4 只出骨架、`/execute` 一律 fail-closed**（`:72-77` 逐字「MC 半边集中在一个 `Mc` 内部类里逐条 `throw UnsupportedOperationException`」）。
- 文档口径（根 `AGENTS.md`）另称 driver = 玩家级 / 桥 = 命令级 —— 与源码一致（此处源码为准）。

### 缺口 4｜**没有**「真实构建结果回灌」的工具面闭环（源码实证）

- 我们能**诊断** Gradle 日志，但**不代跑**：`mcp-server/src/build-log/index.ts:1-3` 头注逐字「不执行 gradlew，不联网，不写盘」、`:309` 错误文案「本工具不执行 gradlew」、`:448`「本工具不执行 gradlew；修完后请用户在本机重跑构建」；`diagnose_gradle` 只做文本静态分析（`mcp-server/src/gradle/index.ts:347` 建议用户自己跑）。
- 工作流模板把「Agent 不代跑 Gradle」写成人在环条款：`mcp-server/src/prompts/templates.ts:85` 逐字「构建（用户确认后执行，Agent 不代跑）」、`:241`、`:393`。
- **真编译只发生在仓库自己的门里**，不发生在工具调用里：`mcp-server/scripts/assert-playtest-driver-compiles.mjs:1-31`（真 `javac` 编 driver 产物）、`assert-playtest-server-driver-compiles.mjs`（JDK + 真 paper-api 件做一次真 javac），两者都登记在 `mcp-server/test-scripts.mjs:2239` / `:2247`。
- 因此「构建结果回灌给 AI」的现有路径 = 用户粘贴日志 → `analyze_build_log` / `analyze_log`；**没有**「工具跑构建 → 自动读回结果」的闭环。

### 缺口 5｜多客户端 / 多会话：**有联合判读，没有编排器**（源码实证）

- 有：`inspect_playtest_multi` 做**联合判绿**（`mcp-server/src/playtest-multi/index.ts:1-18` 头注逐字「多客户端联合判读器」「任一客户端缺件/判红，整轮就是红」「任一客户端目录 realpath 越出授权根 ⇒ 整体拒」）；会合原语 `touch` / `waitfile` 在 **driver 侧**（`:18` 逐字「会合原语在 driver 侧」），`sync/` 保留目录 `:98-99`。
- 没有：**没有任何工具负责起 N 个客户端 / 并发调度**。工具面只有「生成 driver 文本」「写意图邮箱」「读证据」「判读」四件事；多实例的启动与并发仍由宿主 Agent 在授权根内自行操作（属根 `AGENTS.md` 三通道授权模型，**非工具能力**）。
- 判绿口径里 `clients` 硬顶 16（`mcp-server/src/wave/register.ts:240`），但那是**判读上限**，不是编排上限。

### 缺口 6｜`authorization` 参数在 3 个 playtest 工具里**声明了但实现不消费**（源码实证）

- `inspect_playtest_evidence`：schema 有 `authorization`（`mcp-server/src/wave/register.ts:222`），类型定义在 `mcp-server/src/playtest-evidence/index.ts:22`，但全文**只有这一处**（grep `authorization` 命中 1 次）；`authorize()`（`:52-70`）只读 `MC_SKILL_PLAYTEST_ALLOW` + `MC_SKILL_PLAYTEST_ROOT`。
- 同理 `inspect_playtest_multi`（声明 `mcp-server/src/playtest-multi/index.ts:61`，全文 1 次）与 `playtest_intent`（声明 `mcp-server/src/playtest-intent/index.ts:27`，全文 1 次；它消费的是 `confirmed`，见 `:176-177`）。
- 只有 `playtest_bridge` 真消费：`mcp-server/src/playtest-bridge/index.ts:64-65` 逐字「execute / await 须带 authorization:\"sandbox\"|\"dev_instance\"」，缺失回 `AUTHORIZATION_REQUIRED`。
- 另：根 `AGENTS.md` 提到把授权原文写 `$MC_SKILL_CACHE/playtest-authorizations.json` —— **源码里零命中**（grep `playtest-authorizations` in `mcp-server/src` → 0 匹配）⇒ 那是**文档口径的记账约定**，工具侧不读它、也不校验它。

### 缺口 7｜一道门自述「不进 npm test」，但它已在门链数组里（源码实证，口径不一致）

- `mcp-server/scripts/assert-playtest-driver-compiles.mjs:24` 逐字「⚠ **本脚本不进 `npm test`**：它依赖本机 JDK 与 `~/.gradle` 缓存，在无此环境的机器/CI 上必然 exit 2。按需手动跑（或作为夜间批的一腿）」。
- 但它已被登记进 `REAL_RUN_GATES`（`mcp-server/test-scripts.mjs:2239`），而 `npm test` 链包含 `node test-scripts.mjs`（`mcp-server/package.json:55`）⇒ **头注与门链口径不一致**。
- 可解释的一半：该门缺件时**降级并吼**（`assert-playtest-driver-compiles.mjs:16-22`：缺件打 `SKIP(缺件)`、exit 0，并逐字强调「缺件的 **0 不是通过**」），所以它确实能挂进默认链而不在 CI 上恒红。**结论只陈述事实：注释与数组两处口径不一致**，谁对需人工裁定。

### 缺口 8｜文档检索面「拿不到语料全量」是设计边界（源码实证）

- `totalPool` 只到「本面可得」这一层：`mcp-server/src/tool-registry.ts:484` 逐字「残余口径：totalPool 只到「本面可得」这一层，不是语料全量（fusion 输入与 L0 检索各有上限，无语义库时池就等于 L0 命中）」。
- 各面 limit 上界也各不相同：通用 `search_docs` 30（`docs-platform/forge/index.ts:701`）、`search_forge_docs` 走 `FORGE_SEARCH_LIMIT_MAX`（`:261`）、`query_registry` 200（`wave/register.ts:68`）、`query_upstream_releases` 200（`tool-registry.ts:273`）、`search_loader_api` 超封顶**静默截到上界**（`wave/register.ts:559-564` 逐字「超封顶按现实现**静默截到上界**，不报错」）。
- ⇒ 想「一次拿全语料」在工具面上**不可达**，这是刻意设计（省 token），不是缺陷；但对比对标项目时要注意「我们的检索面不提供全量导出」。

---

## 6. 未核实清单（禁止据此下结论）

1. `limitWindow` 与 bedrock `demotion` 的完整字段语义 —— 只在描述文本见过，未逐字段读实现。
2. `generate_lang` 空 `entries` 时的 `emptyEntries:true` 机读位 —— 根 `AGENTS.md` 有述，本次未在 `src/` 里逐行核到。
3. `PLAYTEST_VERIFIED_TIER` 的**完整档位清单**（`playtest-driver.ts:1794` 起的长数组）—— 本次只读到前若干条（fabric 1.21.11 / quilt 1.21.11 / forge 1.20.1 / forge 1.20.4 / neoforge 1.20.1 / neoforge 1.20.4 / neoforge 1.20.6 / neoforge 1.21.1 / fabric 1.20.1 / 1.21.1 / 1.21.3 / 1.20.4 / 1.21.4 / 1.21.8 / 1.21.10…），**未读到数组末尾**，故不给出总数。
4. `mcp-server/scripts/` 下 **86 道门之外**的维护脚本（`fetch-*.js` / `process-*.js` / `build-*.mjs` / `repair-*.js` 等）本次未逐个读，故不在 §4.3 内给作用句。
5. 对标两仓（`temp/peer-recon/minecraft-mod-mcp`、`temp/peer-recon/mcp-rogal`）本次**未读**（本任务只做我方基线）。

---

## 附：本文件引用的证据指针统计

- 相对路径 + 行号级指针：**120+ 条**（§1 约 10、§2 约 60、§3 约 30、§4 约 15、§5 约 25）。
- 每节均标注判定性质（源码实证 / 文档口径）；查不到的进 §6「未核实」。
