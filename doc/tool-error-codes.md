# 工具错误码与游玩自测 tier 计数（台账）

> **本文件是什么**：2026-10-11 自根 `README.md` / `README.en.md` / `mcp-server/README.md` **逐字并入**的台账文本（正文未改写；中文两节标题为适配本文件层级降为 `## 1.` / `## 2.`）。落点规范见 `WRITING-FOR-AGENTS.md` §6「台账与实施状态：一史一处」；根 README 系只在文末「指针表」留一行指针。
> **口径**：两节判据 as-of **2026-10-04**；工具数与顺序以 `list-tools` 为准（并入时 = 86）。§1 尾注与 §3 尾注里的「§6b / §9 / §11」= 根 README「MCP/CLI TOOLS」节的对应工具分表。

## 1. 实跑取证：常见错误码与「什么时候别用」（as-of 2026-10-04）


下表每个 `code` 都来自本机 CLI 的**最小失败调用**实跑，不是文档推导：

| 工具（调用形态） | 实测 `code` | 什么时候别用 / 该怎么读 |
|---|---|---|
| `activate_platform_pack action=session`（未建档版本） | `PACK_NOT_FOUND` | 不得用邻档顶替；换已建档版本，或先 `action=list` |
| `search_forge_docs` / `search_*`（未建档版本） | `VERSION_NOT_FOUND` | 先 `list_*_versions`；**不在清单 ≠ 上游没有**（查上游用 `query_upstream_releases`） |
| `query_api`（该版本无 extracted 索引） | `DATA_UNAVAILABLE`（`found:false`） | 26.1+ / 1.14.4 / 1.15.2 无索引；改语义搜索，或 `get_minecraft_source` |
| `diagnose_gradle`（缺 `--project`） | `INVALID_INPUT` | 必须给工程路径；Rift / BaseMod / 基岩仍早退 |
| `generate_lang` / `get_minecraft_source`（缺必填项） | `MISSING_REQUIRED` | 先补齐必填（此码不表示工具故障） |
| `check_dependencies`（无工程 / 无已知依赖） | `ok:false` + `detectedLibraries: []` | **空数组 ≠ 没有依赖** —— 未收录的库会漏（启发式，不是完整 Gradle 解析） |
| `crash_analyze`（缺 version） | `VERSION_REQUIRED` | 传版本；它只覆盖你贴进来的那一段日志 |
| `detect_mod_project`（无 `projectPath` 且未设 env） | `PROJECT_ROOT_REQUIRED` | 先设 `MC_SKILL_PROJECT_ROOT` 或传 `--project`；指向知识库根会判 `KNOWLEDGE_REPO_NOT_MOD` |
| `generate_worldgen`（编造版本 `1.99.9`） | `INVALID_INPUT`（`errorKind: usage`） | 两端版本哨兵直接拒绝，不默默生成；文档称此时点名 `WORLDGEN_MAX_MINOR_1X` |
| `localize_mod` / `port_project` / `query_loader_api` / `generate_lang` / `analyze_mod_jar` / `resolve_lib_skills` / `get_method_params` / `get_version_info` / `search_fabric_docs` / `list_doc_versions` / `search_docs` / `query_registry`（缺必填） | `MISSING_REQUIRED` | 先补齐必填参数（此码不表示工具故障）。**实测这 12 个内置工具的缺参形态统一收敛到这一个码**（此处 12 是**本行列出的子集**，不是服务端工具总数；总数以 `list-tools` 为准） |
| `search_mod_code`（未给 `jarPath` / `decompiledDir`） | `INVALID_INPUT` | 必须先 `decompile_mod_jar`（或已有反编译目录），否则 `NOT_FOUND` |
| `get_workflow_template`（未知名的模板） | `INVALID_ENUM_VALUE` | 工作流名是 enum，Zod 直接拒；模板名以该工具列表为准，不得猜测 |
| `convert_mapping`（该版本无目标层） | `DATA_UNAVAILABLE`（`converted: null`） | 失败默认 `converted:null`；只有 `allow_fallback` 才回传原名并带 `fallbackUsed`（禁止假成功） |

> 取证方式：`node mcp-server/dist/cli.js <工具> <最小失败参数>`，读响应里的 `ok` / `code` / `errorKind`。**没实跑取证到的工具一律不写码** —— 见 §6b / §9 / §11 表下「`—` = 本仓库未记载」的口径。

## 2. 86 个工具的错误码覆盖清单（as-of 2026-10-04，工具数与顺序以 `list-tools` 为准）


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

## 3. English originals (verbatim; merged from `README.en.md`)

### Measured, not derived: common error codes and "when not to use it" (as of 2026-10-04)


Every `code` below came from a **minimum failing call** on this machine's CLI, not from reading the docs:

| Tool (call shape) | Measured `code` | When not to use it / how to read it |
|---|---|---|
| `activate_platform_pack action=session` (version not indexed) | `PACK_NOT_FOUND` | never substitute a neighbouring version; pick an indexed one, or run `action=list` first |
| `search_forge_docs` / `search_*` (version not indexed) | `VERSION_NOT_FOUND` | run `list_*_versions` first; **not being on the list ≠ upstream has none** (ask upstream with `query_upstream_releases`) |
| `query_api` (no extracted index for that version) | `DATA_UNAVAILABLE` (`found:false`) | 26.1+ / 1.14.4 / 1.15.2 have no index; switch to semantic search or `get_minecraft_source` |
| `diagnose_gradle` (missing `--project`) | `INVALID_INPUT` | the project path is required; Rift / BaseMod / Bedrock still bail out early |
| `generate_lang` / `get_minecraft_source` (missing required field) | `MISSING_REQUIRED` | fill in the required fields first; this is not "the tool is broken" |
| `check_dependencies` (no project / no known libraries) | `ok:false` + `detectedLibraries: []` | **an empty array ≠ no dependencies** — libraries it does not know will be missed (heuristics, not a full Gradle resolution) |
| `crash_analyze` (missing version) | `VERSION_REQUIRED` | pass the version; it only covers the log excerpt you pasted |
| `detect_mod_project` (no `projectPath`, env unset) | `PROJECT_ROOT_REQUIRED` | set `MC_SKILL_PROJECT_ROOT` or pass `--project` first; pointing at the knowledge base root gives `KNOWLEDGE_REPO_NOT_MOD` |
| `generate_worldgen` (invented version `1.99.9`) | `INVALID_INPUT` (`errorKind: usage`) | rejected outright by the two-ended version sentinel, never generated quietly; the docs say this case names `WORLDGEN_MAX_MINOR_1X` |
| `localize_mod` / `port_project` / `query_loader_api` / `generate_lang` / `analyze_mod_jar` / `resolve_lib_skills` / `get_method_params` / `get_version_info` / `search_fabric_docs` / `list_doc_versions` / `search_docs` / `query_registry` (missing required fields) | `MISSING_REQUIRED` | fill in the required arguments first; this is not "the tool is broken". **Measured across 12 tools, the missing-argument shape converges on this single code** |
| `search_mod_code` (no `jarPath` / `decompiledDir`) | `INVALID_INPUT` | run `decompile_mod_jar` first (or point at an existing decompiled directory), otherwise `NOT_FOUND` |
| `get_workflow_template` (unknown template name) | `INVALID_ENUM_VALUE` | the workflow name is an enum and Zod rejects it directly; take names from that tool's list; do not guess |
| `convert_mapping` (target layer missing on that version) | `DATA_UNAVAILABLE` (`converted: null`) | failures default to `converted:null`; only `allow_fallback` returns the original name, with `fallbackUsed` set (a fake success is forbidden) |

> How to reproduce: `node mcp-server/dist/cli.js <tool> <minimum failing args>` and read `ok` / `code` / `errorKind` from the response. **Tools that were not measured get no code here** — see the "`—` = not recorded in this repo" note under the §6b / §9 / §11 tables.

### Error-code coverage for all 86 tools (as of 2026-10-04; the tool list and its order are whatever `list-tools` says)


Three evidence tiers: **measured** = read from a minimum failing call on this machine via `node mcp-server/dist/cli.js <tool> <minimum failing args>`; **documented** = already named in that tool's row in this file; **not recorded** = neither the repo docs nor a measurement gives it a dedicated code (for failures, read `errors[]` / `error.code` in the response).

| Group | Tools | Error codes | Evidence |
|---|---|---|---|
| Version / index | `activate_platform_pack` · `search_forge_docs` · `query_api` · `detect_mod_project` · `convert_mapping` · `generate_worldgen` | `PACK_NOT_FOUND` (+`PACK_INCOMPLETE`) · `VERSION_NOT_FOUND` · `DATA_UNAVAILABLE` · `PROJECT_ROOT_REQUIRED` (+`KNOWLEDGE_REPO_NOT_MOD`) · `DATA_UNAVAILABLE` (`converted:null`) · `INVALID_INPUT` | measured |
| Required-argument checks | `get_method_params` · `get_version_info` · `search_fabric_docs` · `list_doc_versions` · `search_docs` · `query_registry` · `localize_mod` · `generate_lang` · `analyze_mod_jar` · `resolve_lib_skills` · `get_workflow_template` | `MISSING_REQUIRED` (11 of them); `get_workflow_template` gives `INVALID_ENUM_VALUE` (the workflow name is an enum) | measured (the missing-argument shape converges on `MISSING_REQUIRED`) |
| Diagnostics | `diagnose_gradle` · `inspect_runtime` · `crash_analyze` | `INVALID_INPUT` · `INVALID_INPUT` · `VERSION_REQUIRED` | measured |
| Index / reverse lookup | `list_forge_versions` · `list_fabric_versions` · `list_neoforge_versions` · `mixin_analyze` · `lookup_obfuscated` · `query_loader_api` · `search_loader_api` · `ingest_loader_api` | `PLATFORM_DATA_MISSING` · `CACHE_MISS` · `UNOBFUSCATED_NO_YARN` · `PLATFORM_SKIPPED` · `LOADER_API_NOT_INDEXED` · `INVALID_INPUT` | documented |
| Porting / writing | `analyze_porting_path` · `port_project` | `NOT_A_MOD_PROJECT` · `UNSUPPORTED_PORT` · `INVALID_INPUT` · `PROJECT_ROOT_REQUIRED` · `PATH_OUTSIDE_ALLOWLIST` | documented |
| Upstream queries | `query_upstream_releases` | `URL_REJECTED` (plus the two states `ok:false` / `available:false`, which mean different things) | documented |
| In-game playtesting | `playtest_intent` · `playtest_bridge` · `inspect_playtest_evidence` | `CONFIRMATION_REQUIRED` · `INTENT_FORBIDDEN` · `INTENT_NOT_IN_MENU` · `PARAM_NOT_DECLARED` · `MISSING_REQUIRED_PARAM` · `MAILBOX_BUSY` · `MENU_NOT_FOUND` · `PLAYTEST_TIMEOUT` · the three states `present\|absent\|unreadable` | documented |
| Decompilation | `get_minecraft_source` · `decompile_mod_jar` · `download_official_mdk` · `search_mod_code` | `TOOLCHAIN_MISSING` · `NOT_FOUND` · `MDK_NOT_PINNED` · `NOT_FOUND` | documented |
| Generators | `generate_datagen` · `generate_model` · `generate_network_packet` · `generate_capability` · `generate_config` · `generate_entity_renderer` · `generate_addon_manifest` · `generate_bp_entity` · `generate_playtest_driver` | the `resultKind` three states `ok` / `generation_failed` / `write_blocked`; when a write does not complete, `writeError.code` ∈ `CONFIRMATION_REQUIRED` / `PROJECT_ROOT_REQUIRED` / `PATH_OUTSIDE_ALLOWLIST` / `NOTHING_TO_WRITE` / `WRITE_FAILED` | documented |
| **No dedicated code (39)** | `get_server_status` · `validate_project` · `check_dependencies` · `mc_skill_update` · `check_publish_ready` · `list_community_sources` · `search_community_docs` · `get_community_doc_summary` · `get_community_doc_full` · `get_forge_doc_summary` · `get_forge_doc_full` · `get_forge_doc_related` · `get_fabric_doc_summary` · `get_fabric_doc_full` · `get_fabric_doc_related` · `get_neoforge_doc_summary` · `get_neoforge_doc_full` · `get_neoforge_doc_related` · `search_neoforge_docs` · `get_doc_summary` · `get_doc_full` · `get_doc_related` · `diagnose_data_paths` · `search_bedrock_docs` · `get_bedrock_doc_summary` · `get_bedrock_doc_full` · `get_bedrock_doc_related` · `analyze_bedrock_log` · `validate_addon_manifest` · `validate_bp_json` · `audit_resources` · `validate_datapack_json` · `validate_at` · `validate_aw` · `list_knowledge_resources` · `read_knowledge_resource` · `analyze_log` · `analyze_build_log` · `get_migration_guide` | **no dedicated code recorded** ⇒ on failure read the response's `errors[]` / `error.code`; **filling them in from memory is forbidden**. Among these, `get_*_doc_*`, `list_*`, `audit_*`, `validate_*`, `analyze_*` and `read_*` have the three shapes "result / empty result / tool failure", and **an empty result never means the target does not exist** | not measured |

> Coverage rule: this list names all **86** tools (6+11+3+8+2+1+3+4+9+39 = 86). "Not recorded" is not a verdict of absence — it is an honest marker of insufficient evidence. Filling those in requires designing, per tool, a call whose arguments are valid but semantically failing (e.g. handing `get_*_doc_full` a well-formed but non-existent `id`) and measuring it; that is a separate round of work.

## 4. 附录：`PLAYTEST_VERIFIED_TIER` 计数快照（as-of 2026-10-04，自 `mcp-server/README.md` 并入）

- 快照：**53** 项 = `fabric` 18 / `neoforge` 14 / `quilt` 10 / `forge` 10 / `liteloader` 1（含去混淆档 `fabric`/`neoforge` 的 `26.1`/`26.1.1`/`26.1.2`/`26.2`/`26.3` 与 forge 早期 `1.12.2`–`1.19.4` 八档）。
- **唯一真源 = 生成器内表**（`mcp-server/src/generators/playtest-driver.ts` 的 `PLAYTEST_VERIFIED_TIER`）。正文**不数档**；本快照仅留档，引用前按生成器现读。
