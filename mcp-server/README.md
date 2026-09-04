# MC MCP Server

本地 **stdio** MCP Server，供各 MCP 宿主（Cursor / Claude Code / VS Code / Continue / Trae / OpenCode 等）查询 Minecraft 模组开发资料（Forge / Fabric / NeoForge）。配置格式对照见仓库根 [AUTO_SETUP.md](../AUTO_SETUP.md)，不要默认写成 Cursor 的 `mcp.json`。

**要求：Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`；**22.5–22.12 需加 `--experimental-sqlite` 启动参数或 NODE_OPTIONS，22.13+ 无需**）。

仓库与 GitHub Release **均不含 `node_modules`**，需本地编译：

```bash
cd mcp-server
node -v   # 需 v22.5+
npm ci
npm run build
```

## 能力概览

- 共 **80** 个 MCP 工具：`src/tool-registry.ts` **45** + `src/wave/register.ts` **35**
- 依赖仓库根 `data/`（API extracted、parchment/mcp、**yarn-mappings.sqlite**、文档索引、porting 等）
- 官方文档三级：L0 搜索 → L1 摘要 → L2/L2+ 全文
- **禁止**运行时全量加载 `yarn-mappings.json`（>1.5GB，易 OOM）
- T2 反编译工具族：**默认零下载**，仅显式调用时按需下载到 `$MC_SKILL_CACHE`（Java 17+ 前置）

完整分类、降级与**工具边界（避免误判）**见根目录 [README.md](../README.md)。常见误判：`query_api` 1.12.2 空壳 / 26.1+ 无索引；`diagnose_gradle` 覆盖 ForgeGradle+Loom+Neo/MDG；`validate_project` 对 Fabric/Quilt/NeoForge 真检查，LiteLoader/Rift/基岩 skipped；文档 `id` 必须来自搜索结果；`generate_*` 不写盘；改 dist 后须重载 MCP。

**人在环**：模组开发不是确定性流水线（创意、兼容取舍、API、性能、调试由人决定）。写盘 / Gradle / 拷 jar / 上传默认不代跑，须用户确认；不要把 dryRun 与「只吐文本」当成漏做的无人值守编排。

## 近期变更（2026-08 审查修复）

**破坏性 CLI**：`--fail-on-error=false` / `--json=false` / `--compact=false` 现为**关闭**该旗标。旧行为是「只要写出 `--fail-on-error=…` 即开启」，脚本里写 `--fail-on-error=false` 会静默升 exit 1。裸 `--fail-on-error` 仍为开启。非 `true/false/1/0/yes/no/on/off` 的 `--flag=junk` **拒绝**（exit 2），不会静默当 true。

- `mc_skill_update`：进程启动成功后调用 `clearPendingRestart()`，`action=check` 不再永久返回 `PENDING_RESTART`。
- `mc_skill_update apply`：`dataBlocked` 在 tooling 合并**之前**检查；数据阻断时不会先改 tooling HEAD。
- 数据 Release 交换改为**全量快照**（zip 即新树，撤档文件会删除）。

---

## 快速配置

各 IDE / CLI 的配置文件、顶层键名（`mcpServers` vs `servers` vs `mcp` vs TOML）和验收步骤见仓库根 [AUTO_SETUP.md](../AUTO_SETUP.md)。下面只给出规范 stdio 字段；不要默认写成 Cursor 的 `mcp.json`。

### 1. 安装与编译

```bash
node -v
node -e "const [maj,min]=process.versions.node.split('.').map(Number); if(maj<22||(maj===22&&min<5)){console.error('Need Node >=22.5');process.exit(1)} else console.log('OK',process.versions.node)"

cd mcp-server
npm ci
npm run build
# 有 data 且需 Yarn 查询：npm run build:yarn-sqlite
# Vanilla Registry：npm run build:vanilla-registries -- --version=1.20.1
```

### 2. MCP 配置（按宿主翻译）

使用 **绝对路径**，`MC_SKILL_DATA` 指向仓库 `data/`。多数宿主（Cursor / Claude / Trae / Windsurf）顶层键为 `mcpServers`：

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["H:/MC_skill/mcp-server/dist/index.js"],
      "env": {
        "MC_SKILL_DATA": "H:/MC_skill/data"
      }
    }
  }
}
```

VS Code 项目级配置顶层键是 `servers`（不是 `mcpServers`）。Continue 用 YAML 列表。OpenCode 用 `command` 数组且建议 `timeout` ≥ 60000。完整对照表与合并/验收流程见 [AUTO_SETUP.md](../AUTO_SETUP.md)。

`port_project` 真写盘时追加：

```json
"env": {
  "MC_SKILL_DATA": "H:/MC_skill/data",
  "MC_SKILL_ALLOW_WRITE": "1",
  "MC_SKILL_PROJECT_ROOT": "H:/path/to/your/mod"
}
```

`MC_SKILL_PROJECT_ROOT` 须为绝对路径；写盘目标须在项目根内（`realpathSync.native`，含 Windows Junction）。

### 3. 验收

重载该宿主的 MCP 后，Agent 应调用 `get_server_status`、`diagnose_data_paths`。应出现服务名 **`MC-AI-Coding-Assistant-Tool`**，工具数 **80**。不要只让用户「看设置页」。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | data 根目录（非版本子目录） | `H:/MC_skill/data` |
| `MC_SKILL_COMMUNITY` | 社区知识库根（可选） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE` | `1` 允许 `port_project` / `mc_skill_update` / `generate_*`（`write=true`）写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 允许写入的根（更新工具须为 **MC_skill 仓库根**）。`generate_*` 写盘必须设它——单次调用的 `projectPath` 只能在其内选子目录，不能替代它 | `H:/MC_skill` |
| `MC_SKILL_UPDATE_REPO` | GitHub `owner/repo`（默认本仓库） | `guguzea/MC-AI-Coding-Assistant-Tool` |
| `MC_SKILL_UPDATE_REMOTE` | 强制 git remote 名；空则扫描匹配 URL | `origin` |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | `get_server_status` updateHint 缓存 TTL | `3600` |
| `MC_SKILL_CACHE` | 反编译/MDK/loader-jar 缓存根。MCP（`resolveCacheRoot`）与脚本都读此变量。不设则分家：MCP 默认 APPDATA/`~/.config/mc-skill-cache`，脚本默认 `os.tmpdir()/mc-skill-cache`。请设成同一路径。 | `%APPDATA%/mc-skill-cache` |
| `MC_SKILL_SKIP_DOWNLOAD` | `1` 时反编译工具跳过一切下载并诚实失败（CI 语义） | `1` |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | data zip 下载超时 | `600000` |
| `MC_SKILL_GITHUB_TIMEOUT_MS` | Release API 超时 | `25000` |
| `MC_SKILL_GITHUB_API_BASE` | GitHub API 根（可改镜像） | `https://api.github.com` |
| `HTTPS_PROXY` / `HTTP_PROXY` | Node fetch 代理（Clash 等） | `http://127.0.0.1:7890` |
| `MC_SKILL_GITHUB_TOKEN` / `GITHUB_TOKEN` | 可选，提高 API 限额 | |
| `MC_SKILL_STRICT` | `1` 数据无效则启动失败 | `1` |
| `MC_SKILL_DEBUG_PATHS` | `1` 打印路径解析 | `1` |

### MDK 解压依赖（`download_official_mdk`）

`dryRun=false` 时把官方 MDK zip 解压到 `$MC_SKILL_CACHE/mdk/…/unpacked/`。解压器探测顺序：**unzip → 7z → bsdtar**（`tar --help` 含 libarchive/bsdtar，或 Windows 自带 tar）。**不要**假定 GNU tar 能解 zip；Linux CI 若只有 GNU tar，工具返回 `UNZIP_TOOL_MISSING`，请安装 `unzip`。禁止整仓 `MinecraftForge/MinecraftForge` 引擎 zip；Forge 用 `files.minecraftforge.net` / `maven.minecraftforge.net` 的 **MDK zip**。成功解析 `entryClass` 后才把 sha256 写回 `mcp-server/data/mdk-checksums.json`。`generate_network_packet` 的 `platform` **必填**（与 `NETWORK_PACKET_PLATFORMS` 同步：`forge_1.20.1` / `forge_1.20.4` / `forge_1.19.4` / `forge_1.18.2` / `forge_1.17.1` / `forge_1.16.5` / `forge_1.15.2` / `forge_1.14.4` / `forge_1.12.2` / `neoforge_1.20.1` / `neoforge_1.20.4` / `neoforge_1.21` / `neoforge_1.21.1` / `neoforge_1.21.3` / `neoforge_1.21.5` / `neoforge_1.21.8` / `neoforge_1.21.10` / `neoforge_1.21.11` / `neoforge_26.1` / `fabric_1.21` / `fabric_1.21.3` / `fabric_1.21.4` / `fabric_1.21.8` / `fabric_1.21.10` / `fabric_1.21.11` / `fabric_26.1` / `fabric_26.1.2` / `quilt_1.21.3` / `quilt_1.21.4` / `quilt_1.21.8` / `quilt_1.21.10` / `quilt_1.21.11`）。**无** `neoforge_1.20.6`（有规则、无已核实 payload 页）。省略返回 error。

### 安全边界说明（2026-08 审计 A-2/A-5 残余面，接受现状）

- **解压双视图防护**：解压交给外部工具（unzip/7z/bsdtar）按本地文件头落盘；工具已在解压后复核「落盘集合 == 中央目录清单 + realpath 在根内」（CD/LFH 分裂即拒绝）。但检查与写入之间无原子原语（TOCTOU 窗口为同用户本机竞态残余，F-B02 复检已缓解）。
- **写盘 tmp 残留**：Windows 锁文件场景下 `write.ts` 的 unlinkSync 失败被忽略后 rename 由外层回滚兜住，`.tmp` 文件可能残留（可手工删）。
- **磁盘启发式**：data 更新前要求 2.5×zip 大小空闲是保守估计；极端 deflate 膨胀受 SHA256 强制门保护（需 GitHub Release 被攻破才可利用）。

### 5. 开发

```bash
npm run build
npm test
node test-wave-bcd.mjs
node dist/index.js
```

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 工具索引（按模块）

| 模块 | 工具 |
|------|------|
| API / 映射 / 状态 | `query_api`、`get_method_params`、`convert_mapping`、`lookup_obfuscated`、`get_server_status`、`get_version_info` |
| 工程 | `diagnose_gradle`、`generate_datagen`、`crash_analyze`、`validate_project`、`check_publish_ready`、`inspect_runtime` |
| Forge 文档 | `list_forge_versions`、`search_forge_docs`、`get_forge_doc_*` |
| Fabric 文档 | `list_fabric_versions`、`search_fabric_docs`、`get_fabric_doc_*` |
| NeoForge 文档 | `list_neoforge_versions`、`search_neoforge_docs`、`get_neoforge_doc_*`（默认 **26.1**；请求 26.2 可 fallback 到 26.1，不克隆假树；`1.20.1` 可回退 Forge） |
| 跨平台文档 | `list_doc_versions`、`search_docs`、`get_doc_*` |
| 社区 | `list_community_sources`、`search_community_docs`、`get_community_doc_*`（索引实测 109 条（authored 94/links 11/permitted 4，带 generatedAt）；含 48 篇 `lib-*` 库集成短文；规则见仓库根 `community_knowledge/AGENT_USAGE.md`） |
| 移植 / 数据 | `analyze_porting_path`、`port_project`、`diagnose_data_paths` |
| Wave B | `query_registry`、`mixin_analyze`、`audit_resources`、`validate_datapack_json`（1.21+ recipe `result` 可为对象）、`get_workflow_template`、`list_knowledge_resources`、`read_knowledge_resource` |
| Wave C 生成 | `generate_model`（kind 默认 block）、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`（Fabric/Quilt 为 Cloth 骨架）、`generate_entity_renderer`、`generate_worldgen`、`localize_mod` |
| Wave C 诊断 | `analyze_log`、`get_migration_guide`、`check_dependencies` |
| T2 反编译（Wave C） | `get_minecraft_source`、`analyze_mod_jar`、`decompile_mod_jar`、`search_mod_code` |
| MDK | `download_official_mdk` |
| T4 字节码校验（Wave D） | `validate_at`、`validate_aw`（+ `mixin_analyze` 的 `deep:true` 深度模式） |
| Loader API / 平台包 | `query_loader_api`、`search_loader_api`、`ingest_loader_api`、`detect_mod_project`（知识库根 → `KNOWLEDGE_REPO_NOT_MOD`）、`activate_platform_pack` |
| 基岩 Add-On | `search_bedrock_docs`、`get_bedrock_doc_*`、`validate_addon_manifest`、`validate_bp_json`、`generate_addon_manifest`、`generate_bp_entity`、`analyze_bedrock_log` |
| 自我更新 | `mc_skill_update` |

补充文档：`docs/vanilla-registries.md`、`docs/registry-data-source.md`、`docs/prompts-client-compat.md`、`docs/mc-skill-update.md`、`docs/query-api-classname-case.md`（`query_api` suggestions 大小写还原的维护注意）。

### 社区知识与库模组（与官方文档分离）

- **社区实务**：`community_knowledge/`（`MC_SKILL_COMMUNITY`）。MCP 四工具见上表「社区」行；**不替代** `search_*_docs`。依据短文写代码前须遵守 [`community_knowledge/AGENT_USAGE.md`](../community_knowledge/AGENT_USAGE.md)。
- **库模组**：`knowledge/libs/` 下 **35** 份 Skill 源稿（**33** 唯一 skillId，五组含 `bedrock-only`），按仓库根 `AGENTS.md`「库模组 Skill」解析，**不落盘**平台 `.cursor/skills`。路由：`knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`。
- **数据链**：`library-catalog.ts`（50 条）+ `data/lib-manifests/all.json`（45 slug）+ `data/lib-api-summaries/`（44 库）→ `check_dependencies`。完整说明见仓库根 [`README.md`](../README.md)「社区知识与库模组」与 MCP 工具 §7 / §7.5。

### 字段映射（`convert_mapping`）

- SQLite **schema v3** 含 `fields` / `searge_fields`；查询时设 `memberKind: "field"`（建议 `ownerClass`）。
- v2 库读字段 → `SCHEMA_FIELDS_UNAVAILABLE`（重建：`npm run build:yarn-sqlite`）。
- CLI：`npx mc-skill convert --kind field ...`（见 `src/cli.ts`）。

### 独立 CLI（`mc-skill`）

一条执行路径：短名只做 alias（`query`→`query_api`、`convert`→`convert_mapping`、`update`→`mc_skill_update`、`status`/`warmup`→`get_server_status`；`warmup` 会注入 `warmup=true`，用户显式 `--warmup=false` 优先）。`descriptor` 是本地命令，不加载 MCP 工具注册表。

全局 flag（不进工具 schema）：`--help`/`-h`、`--version`、`--json`、`--compact`、`--fail-on-error`、`--project <dir>`、`--file field=path`、`--raw [field]`。

kebab-case 会转到 camelCase（`--dry-run`→`dryRun`、`--highlight-key`→`highlight_key`）；另有 `--name`→`memberName`、`--confirm`→`confirmed`、`--class`→`className` 等语义别名（仅当目标字段存在于该工具 schema 时）。只有分隔符/大小写之差的名字（`--allow-fallback`、`--allowFallback`、`--ALLOW_FALLBACK`→`allow_fallback`）由通用归一化接管，不再逐个写进别名表；归一化只在候选唯一时接受，命中多个则报歧义并列出候选写法。未知 flag **exit 2**，报错里带近似名和 `node mcp-server/dist/cli.js <工具> --help` 指针。

文件输入（只作用于**可承载文本**的字段：非 enum 的 `string`、`object` / record、元素为前两者的 `array`、含前两者的 union；`number` / `boolean` / `enum` / `tuple` 一律原样传，不当路径读）：

- `--crashReport @./latest.txt` 读文件（`@@` 转义成字面 `@`）
- `--crashReport=-` 或 `@-` 读 stdin（全进程只能一次，与文件同受 8MB 上限）
- `--file crashReport=./latest.txt` 或 `--file crash-report=./latest.txt` 等价（字段名走 kebab/别名）
- `--raw <field>` 让该字段完全按字面传（连 `@-` 也不读 stdin）；裸 `--raw` 或 `--raw=true` 全局关闭展开，`--raw=false` 恢复；与同名字段的 `--file` 同时出现 → 报冲突 exit 2
- 未知 flag 的值不做任何文件读取，直接按未知参数 exit 2
- 单文件上限约 8MB
- `--project <dir>`：若工具有 `projectPath` 则注入；否则不传，stderr 警告「该工具不支持 --project」

输出统一 JSON `{success, tool, result|error}`。`--compact` 时所有 stdout JSON 都不 pretty。TTY 且未加 `--json` 的 `--help` 用人读摘要。

退出码（`errorKind` 是失败信封上只增不改的分类键，与退出码一一对应，不引入第三种码）：

| 码 | 含义 | errorKind |
|----|------|-----------|
| 0 | 工具跑完且非失败（`query_api` 的 `found:false` 默认仍为 0） | 无（成功信封不带该键） |
| 1 | 抛错、`isError`、`ok===false`、`passed===false`、`error.code` 存在 | `tool_failure` |
| 2 | 用法 / 未知命令 / 未知 flag / 缺参 / 读文件失败 | `usage`；schema 校验失败为 `validation` |

`timeout` 类随 `--timeout` 落地时再加入。失败信封另有 `nearFlags` / `knownFlags`（仅未知 flag 且能给出建议时出现）。

`--fail-on-error` 再把 `found===false` 以及 `errors[]` 非空升为 1。`--fail-on-error=false` **关闭**（旧：写出即开启）。

```bash
node dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F'
node dist/cli.js convert --from obfuscated --to yarn --name er --version 1.20.1
node dist/cli.js mc_skill_update --action apply --dry-run=false --confirm
node dist/cli.js crash_analyze --crashReport @./crash-reports/latest.txt
node dist/cli.js validate_project --project .
node dist/cli.js query --help
node dist/cli.js descriptor --descriptor '()F' --name getHealth
node dist/cli.js update --action check
node dist/cli.js list-tools
```

- 旧位置参数（`query <className> [methodName]`、`convert ... <memberName>`、`descriptor <jniDescriptor>`、`update check|apply`）仍兼容，stderr 提示改用 `--key value`。
- PowerShell 括号：单引号包裹，如 `'--descriptor=()F'`。
- 全局 `--help`/`--version` 不加载工具注册表。`MC_SKILL_DATA` 仅在真正调用依赖 data 的工具时提示。

### obfuscated / intermediary 层（T5）

- `obfuscated` = Tiny official 混淆短名（`er`）；`intermediary` = `method_6032` 类。`MappingQuery.from/to` 均支持这两层。
- `yarn/mcp→obfuscated` 与 `to=mojang` 同值；`obfuscated/intermediary→yarn/mcp` 支持**无 ownerClass 全局反查**（崩溃日志单 token，如 `method_6032` → `er`/`getHealth`）。
- `to=mojang` 保持旧行为，notes 提示改用 `to=obfuscated`；可读名请用 `query_api`。
- `lookup_obfuscated`：单 token（`method_6032` / `er` / `func_110143_aJ` / `field_100013_f`）反查 → `{obfuscated, intermediary, yarn, mojang, ownerClass, descriptor, readableSignature}`；方法→字段→类，多命中 `AMBIGUOUS`。
- **26.1+ 无混淆层**：obfuscated/intermediary 请求返回 `UNOBFUSCATED_NO_YARN`（仅 1.14–1.21.11 可用）。

### T2 反编译工具族（Wave C，`src/decompile/`）

**默认零下载**：无预热/预取，仅用户显式调用时按需下载到 `$MC_SKILL_CACHE`（默认 `%APPDATA%/mc-skill-cache` / `~/.config/mc-skill-cache`）。缓存布局：`{jars,mappings,remapped,decompiled,decompiled-mods,registry,resources}/` + `cache.db`（元数据/产物索引）+ `locks/`（同版本并发互斥）。**绝不写项目目录**（`project-sandbox.ts` 不变）。

**Java 17+ 前置**：VineFlower（LGPL-3.0）与 tiny-remapper（Apache-2.0）均为 Java 17+ 工具，按需下载到 `$CACHE/resources/`（版本固定 + SHA256 常量校验）。Java 缺失/过旧 → `TOOLCHAIN_MISSING` + Adoptium 安装指引（`https://adoptium.net/temurin/releases/?version=17`），进程不崩溃。`MC_SKILL_SKIP_DOWNLOAD=1` → 下载类工具返回 `DOWNLOAD_DISABLED` 可操作错误（CI 语义）。

| 工具 | 说明 |
|------|------|
| `get_minecraft_source` | `{version, className, mapping?: yarn\|mojmap\|auto, lines?: [start,end], force?}` → 下载 client jar（Mojang manifest，SHA1 校验）→ 映射（yarn v2 jar / client_mappings.txt）→ tiny-remapper 重映射 → VineFlower 反编译（`--only` 定向）→ 类源码片段。首次 3–10 分钟，缓存命中 <1s。 |
| `analyze_mod_jar` | `{jarPath}`（本地绝对路径）→ 纯 Node zip 解析：fabric.mod.json / mods.toml / neoforge.mods.toml、mixins 引用、entrypoints、依赖、AW/AT。无 Java、零下载。 |
| `decompile_mod_jar` | `{jarPath, version?, mapping?, force?}` → VineFlower 反编译到 `$CACHE/decompiled-mods/<modId>/<version>/`，返回源码树摘要；可选 remap（1.14–1.21.11 + 匹配版本）。 |
| `search_mod_code` | `{jarPath\|decompiledDir, query, pattern?, maxResults?}` → 已反编译源码行级 grep（子串/正则），返回 file:line 命中。 |

**版本支持矩阵**：

| 版本区间 | Yarn | Mojmap | 说明 |
|---|---|---|---|
| 1.14 – 1.21.11 | ✅ | ✅ | 两步 remap（official→intermediary→named） |
| 26.1+ | ❌（已停更） | ✅ | 去混淆，免 remap |

**与 `query_api` 的分工**：`query_api` / `get_method_params` 查签名（快、离线）；以上 4 工具仅在**确实需要完整源码/反编译**时使用。各工具 description 均带 ⚠️ 提示防止 Agent 滥触发下载。工作流模板：`mc-decompile-mod`（与 Prompt 同名）。

测试：`node test-decompile.mjs`（无需 Java 17 / 无网络的单元用例；fixture jar 在测试内构造）。

### T4 字节码级校验（Wave D，`src/mixin/` 扩展）

`mixin_analyze` 新增 `deep?: boolean`（默认 **false**，静态路径零回归；`deepResult` 纯附加字段）与
`jarPath?: string`；新增工具 `validate_at` / `validate_aw`（wave 25–26）。校验基于 T2 缓存的
**remapped 客户端 jar**（`jarPath` 参数 > `$MC_SKILL_CACHE` 扫描），jar 未缓存 → `CACHE_MISS`
引导先调 `get_minecraft_source`（**不自动下载**）。

| 模块 | 能力 |
|---|---|
| `src/mixin/bytecode.ts` | 零依赖 classfile 解析（常量池/字段/方法/record/Code 反汇编/调用点）+ jar 索引 |
| `src/mixin/access-transformer.ts` | AT 解析与校验：继承成员、record、内部类、映射层不匹配、跨文件冲突 |
| `src/mixin/access-widener.ts` | AW 解析与校验：header/namespace、transitive、同类冲突 |
| `src/mixin/deep-validate.ts` | mixin 深度校验（目标类/选择器/@At 调用点）+ 工具 handler + jar 定位 |

测试：`node test-deep-mixin.mjs`（fixture class 在测试内手工构造，无 javac 依赖）。
支持矩阵详见 [`docs/mixin-support.md`](./docs/mixin-support.md)。

### 语义索引 / 混合检索（T1）

离线语义库路径：`data/{platform}_{ver}/{source}/{ver}/semantic/db.sqlite`（跳过 `forge_javadoc`）。

| 步骤 | 命令 |
|------|------|
| 拉嵌入模型（唯一允许远程拉模型的入口） | `npm run fetch:embedding-model` → `data/_models/Xenova/all-MiniLM-L6-v2/` |
| 构建索引 | `npm run build:semantic-index -- --all`（可 `--platform`/`--version`/`--source`/`--no-embed`/`--force`） |

- **运行时** `allowRemoteModels=false`：缺模型时检索降级为 FTS5，再缺库则纯 L0。单次查询看返回的 `semantic` / `warning`，不要只看全局 `modeHint`。数据缺口与「不要克隆冒充」见仓库根 [README.md](../README.md)「诚实降级」。
- **构建期**缺模型：警告并降级 **FTS5-only**（不因缺模型整次 exit 1）；`--all` 可中断续跑（已有完整 meta 的 db 默认跳过）。
- **检索**：有语义库时对 L0 排行 ∪ 语义 RRF 排行再做 RRF；命中附带 `matches[]`（来自 **chunks** 表 top-K，含 `sectionHeading`/`snippet`/`score`）。
- **状态**：`get_server_status.semanticIndex.modeHint` ∈ `hybrid` | `fts5-only` | `l0-only`；`diagnose_data_paths.semantic` 报告各树旁 db 存在性。
- 预计耗时：全平台嵌入可达**数十分钟**（视机器与文档量）；产物清单见 `data/semantic-index-manifest.json`。

### 工作流 / 知识曝露（Prompts + Resources + 工具兜底）

| 入口 | 说明 |
|------|------|
| MCP Prompt | 与 `WORKFLOW_TEMPLATES` 等量注册（当前 **36 个**：`mc-new-block` / `mc-new-entity` / `mc-new-gui` / `mc-crash-triage` / `mc-port-mod` / `mc-build-mod` / `mc-ingame-iterate` / `mc-localize-mod` / `mc-decompile-mod` / `mc-villager` / `mc-multiblock` / `mc-ai` 等；完整清单以 `get_workflow_template` 列表为准） |
| 工具兜底 | `get_workflow_template`（同名正文） |
| MCP Resource | `mcskill://…`（见 `listKnowledgeResources`） |
| 工具兜底 | `list_knowledge_resources` → `read_knowledge_resource` |

`mcskill://patterns/README` 读取 **`community_knowledge/patterns/README.md`**（`MC_SKILL_COMMUNITY`）。客户端兼容表见 `docs/prompts-client-compat.md`。

**资源 URI 列表**（`list_knowledge_resources` 可列出全部）：

| URI | 内容 |
|-----|------|
| `mcskill://matrix/mixin-support` | mixin_analyze 支持矩阵 |
| `mcskill://schema/sqlite` | yarn-mappings.sqlite v2/v3 字段说明 |
| `mcskill://version-changes/1.21` | 1.21 变更专章（知识库） |
| `mcskill://antipatterns/registry` | 注册反模式短文 |
| `mcskill://patterns/README` | 代码模式库索引（community_knowledge/patterns/） |
| `mcskill://workflow/<模板名>` | 与 Prompt 同名的工作流正文（与 `WORKFLOW_TEMPLATES` 等量，当前 36 个；含构建、真机循环、模组汉化、反编译、村民/多方块/实体 AI 等） |

**客户端兼容结论**：Cursor 等仅 tools 客户端主走 `get_workflow_template` / `list_knowledge_resources` / `read_knowledge_resource` 兜底；Claude Desktop 等支持 prompts/resources 的客户端可直接使用注册的 Prompt 与 Resource。

---

## Loader API 摘要与平台包

### 工具对照

| 工具 | 用途 |
|------|------|
| `query_api` | Vanilla/Parchment **游戏** API（约 1.16.5–1.20.4）。不含 Forge/Fabric 类。**1.12.2 类名空壳**（`found:true` + `methods:[]`）；**26.1+ 无索引**。 |
| `query_loader_api` | 加载器/模组 API 摘要（Neo/Forge/Fabric-API/QSL）。必填 `platform`+`minecraftVersion`。1.12.2-forge 已索引。Fabric 精选档以 `search_loader_api mode=list` / 下节枚举为准（不是连续区间；无 1.21.4/8/10），不要再当成 maven 404。 |
| `activate_platform_pack` | 把该档规则送进**当前会话**，或写入**用户模组工程**的 IDE 目录。**不能**改 Cursor/Claude 等扫描器。 |

CLI 与现行全局 flag 对齐：`--project` / `--file` / `--dry-run` / `--confirm`。不要写 `--projectRoot=`。ingest 的 jar 用 `--jarPath=`，不要用 `--file`。

```bash
# 当前对话加载规则（默认 00/01/09 + Skill 索引；不写盘）
node dist/cli.js activate_platform_pack --action=session --platform=fabric --minecraftVersion=1.20.1
node dist/cli.js activate_platform_pack --action=session --platform=forge --minecraftVersion=1.12.2 --includeAllRules=true
# 写入用户模组工程（hosts 必填；默认 dryRun）
node dist/cli.js activate_platform_pack --action=write --platform=neoforge --minecraftVersion=1.21.1 --hosts=cursor --project <abs> --dry-run=false --confirm
node dist/cli.js ingest_loader_api --platform=liteloader --minecraftVersion=1.12.2 --jarPath=<abs> --mappingsVersion=mcp-1.12.2
```

`session` 参数：`topics`（只追加规则号到底座，不注入 Skill 正文）、`task`（同样追加规则；建议名可进 skillBodies）、`skillNames`（与 task 建议名去重后注入正文，skillBodies 总条数上限 8）、`includeAllRules`（灌 00–10 规则全文）。库 Skill 不进 nextReads。ok=true 且带「仅底座」warning = 包可用但规则未按任务扩展（`rulesMode=base`，含 `next`）。包存在但缺 00/01/09 → `ok:false` + `PACK_INCOMPLETE`（与无规则树的 `PACK_NOT_FOUND` 区分）。`write` 不要再用 `includeSkills`，改用 `writeSkillStubs`（默认 true，只写 stub）；`includeSkillBodies` 才写知识库 Skill 全文。细节见仓库根 [README.md](../README.md)「规则包加载」。Quilt 本档磁盘 Skill 为 QSL 差异 3 个（`mc-registry` / `mc-events` / `mc-networking`）+ Fabric overlay。Neo 薄档（1.20.6 / 1.21.5 / 1.21.10）本档 Skill 与主档同名集合，不再是 6 个。

Forge 官方文档：先 `list_forge_versions`，再 `search_forge_docs --version=1.12.2`（或 `search_docs --platform=forge --version=1.12.2`）。**不要**用 `query_api` 核 1.12.2 Vanilla 签名（空壳）。查询 `constructor` 等词已用 `ownGet` 避开 `Object.prototype`；改代码后须 **重载 MCP**，或用本 CLI 验证。

### 数据来源与边界（用户必读）

- **官方索引**：`mcp-server/data/loader-api-summaries/`（维护者构建，随仓分发：Neo/Forge/Fabric/Quilt 精选档）。
- **用户 ingest**：只写 `$MC_SKILL_CACHE/loader-api-summaries/`，**不入库、不共享给他人**。
- **查询顺序**：官方先，本地 overlay 后，同 key 本地覆盖官方。
- LiteLoader / Rift / ModLoader **不是内置全集**；未 ingest 时 `PLATFORM_SKIPPED`。Bedrock 与 Forge 1.7.10–1.11.2 无 Java ingest。空 sidecar 模板见 `mcp-server/data/loader-api-summaries/sidecar-templates/`。手摘极小摘要（如 `1.12.2-liteloader` 6 类、`1.13.2-rift` 8 类、`1.6.4-modloader` 2 类）**不是**完整 loader javadoc。
- **Fabric loader 摘要**：以 `search_loader_api mode=list` 为准。`1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.20.4` / `1.21.1` / `1.21.3` / `1.21.11` / `26.1.2` 均已入库。`skipped-ingest.json` 的 `mavenNotIndexed` 现为空；不要再把这些档写成 `LOADER_API_NOT_INDEXED`。

### ingest 实战

1. 自备已合法取得的 jar（须含 `.java`；纯 class 先 `decompile_mod_jar`）
2. dryRun：`node dist/cli.js ingest_loader_api --platform=… --minecraftVersion=… --jarPath=<abs> --mappingsVersion=…`
3. `--dry-run=false --confirm`
4. `query_loader_api` 验证

### index.json schema（贡献者）

现有 `cache` + `jars[]`（`file` / `mappingsVersion` / `mappingsSource` / `classCount` / `fromSourcesJar` / `invalid`）上补充 `sourceJarSha256`、`source`（`official` | `user_jar`）。

新增官方档 checklist：许可允许再分发 → `WANTED_KEYS`/坐标解析加条目 → fetch + decompile 校验 JSON → 更新 `index.json` → PR **不要**带 `$MC_SKILL_CACHE`。

---

## FAQ

**Q: NeoForge 1.20.1 文档？**  
A: 查询会回退 Forge 1.20.1 视图（`forgeCompatible`），属预期。

**Q: Release 没有 node_modules？**  
A: 在 `mcp-server/` 执行 `npm ci && npm run build`。

**Q: Yarn 查询 OOM？**  
A: 使用预建 `yarn-mappings.sqlite`，勿加载整份 JSON。

**Q: ingest 后仍 `PLATFORM_SKIPPED`？**  
A: 查 `$MC_SKILL_CACHE/loader-jars/<key>.jar.sidecar` 的 `mappingsVersion`；确认 overlay JSON 在 `$MC_SKILL_CACHE/loader-api-summaries/`。

**Q: `methods` 空 / `parseError`？**  
A: jar 须含 `.java`。纯 class 先 `decompile_mod_jar` 再 ingest。解析失败不回退正则。

**Q: `AMBIGUOUS`？**  
A: 改用含 `$` 的 FQCN（如 `Outer$Inner`）。
