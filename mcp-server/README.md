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

- 共 **82** 个 MCP 工具：`src/tool-registry.ts` **46** + `src/wave/register.ts` **36**
- 依赖仓库根 `data/`（API extracted、parchment/mcp、**yarn-mappings.sqlite**、文档索引、porting 等）
- 官方文档三级：L0 搜索 → L1 摘要 → L2/L2+ 全文
- **禁止**运行时全量加载 `yarn-mappings.json`（>1.5GB，易 OOM）
- **薄档合法（2026-09-20 裁定）**：部分 `data/fabric_<ver>/mappings/` 按设计**只有 `yarn-mappings.sqlite` + `*-tiny.gz`、没有 `yarn-mappings.json`**（实测 `1.21.4` / `1.21.8` / `1.21.10` 三档同形）。`yarn-mappings.json` 是 legacy 中间产物、**不是运行时不变量**：sqlite 档可由 tiny 直建（见 `build-yarn-sqlite.mjs` 头注释与 `build-yarn-mappings.test.mjs` 的「薄档 json=null」用例）；`audit-data-consistency` 也只在 json 存在时才要求 sqlite 存在，反之不要求。⇒ 发现某档缺 json **不要**当漏建去补。
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

使用 **绝对路径**，`MC_SKILL_DATA` 指向仓库 `data/`。多数宿主（Cursor / Claude / Trae / Windsurf）顶层键为 `mcpServers`。下文示例里的 `<仓库根>` = 本仓库实际部署根的绝对路径（Windows 用正斜杠，如 `D:/MC_skill`）：

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["<仓库根>/mcp-server/dist/index.js"],
      "env": {
        "MC_SKILL_DATA": "<仓库根>/data"
      }
    }
  }
}
```

VS Code 项目级配置顶层键是 `servers`（不是 `mcpServers`）。Continue 用 YAML 列表。OpenCode 用 `command` 数组且建议 `timeout` ≥ 60000。完整对照表与合并/验收流程见 [AUTO_SETUP.md](../AUTO_SETUP.md)。

`port_project` 真写盘时追加：

```json
"env": {
  "MC_SKILL_DATA": "<仓库根>/data",
  "MC_SKILL_ALLOW_WRITE": "1",
  "MC_SKILL_PROJECT_ROOT": "<你的模组工程绝对路径>"
}
```

`MC_SKILL_PROJECT_ROOT` 须为绝对路径；写盘目标须在项目根内（`realpathSync.native`，含 Windows Junction）。

### 3. 验收

重载该宿主的 MCP 后，Agent 应调用 `get_server_status`、`diagnose_data_paths`。应出现服务名 **`MC-AI-Coding-Assistant-Tool`**，工具数 **82**。不要只让用户「看设置页」。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | data 根目录（非版本子目录） | `<仓库根>/data` |
| `MC_SKILL_COMMUNITY` | 社区知识库根（可选） | `<仓库根>/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE` | `1` 允许 `port_project` / `mc_skill_update` / `generate_*`（`write=true`）写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 允许写入的根（更新工具须为 **MC_skill 仓库根**）。`generate_*` 写盘必须设它——单次调用的 `projectPath` 只能在其内选子目录，不能替代它 | `<仓库根>` |
| `MC_SKILL_UPDATE_REPO` | GitHub `owner/repo`（默认本仓库） | `guguzea/MC-AI-Coding-Assistant-Tool` |
| `MC_SKILL_UPDATE_REMOTE` | 强制 git remote 名；空则扫描匹配 URL | `origin` |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | `get_server_status` updateHint 缓存 TTL | `3600` |
| `MC_SKILL_CACHE` | 反编译/MDK/loader-jar 缓存根。MCP（`resolveCacheRoot`）与脚本都读此变量。不设则分家：MCP 默认 APPDATA/`~/.config/mc-skill-cache`，脚本默认 `os.tmpdir()/mc-skill-cache`。请设成同一路径。 | `%APPDATA%/mc-skill-cache` |
| `MC_SKILL_SKIP_DOWNLOAD` | `1` 时反编译工具跳过一切下载并诚实失败。**须显式设成逐字 `1`** 才生效（实现 = `src/decompile/java/java-process.ts:168` 的 `=== "1"` 严格比较；不设、或设 `true`/`yes` 一律不生效）。**供 CI/离线环境显式设置；本仓 `.github/workflows/*` 目前未设**（实测 `grep -rn MC_SKILL_SKIP_DOWNLOAD .github` = 0 命中）⇒ 属用户 CI 面，见仓库根 `CONTRIBUTING.md` 未排期清单 `L23` | 未设（默认按需下载） |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | data zip 下载超时 | `600000` |
| `MC_SKILL_GITHUB_TIMEOUT_MS` | Release API 超时 | `25000` |
| `MC_SKILL_GITHUB_API_BASE` | GitHub API 根（可改镜像） | `https://api.github.com` |
| `HTTPS_PROXY` / `HTTP_PROXY` | Node fetch 代理（Clash 等） | `http://127.0.0.1:7890` |
| `MC_SKILL_GITHUB_TOKEN` / `GITHUB_TOKEN` | 可选，提高 API 限额 | |
| `MC_SKILL_STRICT` | `1` 数据无效则启动失败 | `1` |
| `MC_SKILL_DEBUG_PATHS` | `1` 打印路径解析 | `1` |

### MDK 解压依赖（`download_official_mdk`）

`dryRun=false` 时把官方 MDK zip 解压到 `$MC_SKILL_CACHE/mdk/…/unpacked/`。解压器探测顺序：**unzip → 7z → bsdtar**；每一档都**逐条试全部命中**（`where` / `which` 的 PATH 顺序全表，不是只看第一条），每个路径只 `--help` 证明一次。**不要**假定 GNU tar 能解 zip：`tar --help` 不含 libarchive/bsdtar 的一律不采信；Windows 的 `%SystemRoot%\System32\tar.exe` 按路径直接认定是 bsdtar。PATH 之外另有不吃环境变量的绝对兜底：7-Zip 取 `%ProgramFiles%` / `%ProgramFiles(x86)%` / `%ProgramW6432%`（`C:\Program Files` 只作末位保底），tar 取 `%SystemRoot%` / `windir` / `WINDIR`。这一条是 2026-09-12 补的：Git Bash 起 Node 时 PATH 以 `Git\usr\bin` 打头，旧实现只取第一条命中 ⇒ 撞上解不了 zip 的 GNU tar 就返回 `null`，本机明明有 bsdtar 却报 `UNZIP_TOOL_MISSING`（死路）。Linux CI 若只有 GNU tar，工具仍返回 `UNZIP_TOOL_MISSING`，请安装 `unzip`。禁止整仓 `MinecraftForge/MinecraftForge` 引擎 zip；Forge 用 `files.minecraftforge.net` / `maven.minecraftforge.net` 的 **MDK zip**。成功解析 `entryClass` 后才把 sha256 写回 `mcp-server/data/mdk-checksums.json`。`generate_network_packet` 的 `platform` **必填**（与 `NETWORK_PACKET_PLATFORMS` 同步：`forge_1.20.1` / `forge_1.20.4` / `forge_1.19.4` / `forge_1.18.2` / `forge_1.17.1` / `forge_1.16.5` / `forge_1.15.2` / `forge_1.14.4` / `forge_1.12.2` / `neoforge_1.20.1` / `neoforge_1.20.4` / `neoforge_1.21` / `neoforge_1.21.1` / `neoforge_1.21.3` / `neoforge_1.21.5` / `neoforge_1.21.8` / `neoforge_1.21.10` / `neoforge_1.21.11` / `neoforge_26.1` / `fabric_1.21` / `fabric_1.21.3` / `fabric_1.21.4` / `fabric_1.21.8` / `fabric_1.21.10` / `fabric_1.21.11` / `fabric_26.1` / `fabric_26.1.2` / `quilt_1.21.3` / `quilt_1.21.4` / `quilt_1.21.8` / `quilt_1.21.10` / `quilt_1.21.11`）。**无** `neoforge_1.20.6`（有规则、无已核实 payload 页）。省略返回 error。

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
| 库 Skill 解析 | `resolve_lib_skills`（platform + mcVersion 必填；按平台 + 精确 MC 版本解析 `knowledge/libs` 库 skill 源稿，只解析不返回正文；与 CLI `lib resolve` 同一 core） |
| 基岩 Add-On | `search_bedrock_docs`、`get_bedrock_doc_*`、`validate_addon_manifest`、`validate_bp_json`、`generate_addon_manifest`、`generate_bp_entity`、`analyze_bedrock_log` |
| 自我更新 | `mc_skill_update` |

补充文档：`docs/vanilla-registries.md`、`docs/registry-data-source.md`、`docs/prompts-client-compat.md`、`docs/mc-skill-update.md`、`docs/query-api-classname-case.md`（`query_api` suggestions 大小写还原的维护注意）。

### 社区知识与库模组（与官方文档分离）

- **社区实务**：`community_knowledge/`（`MC_SKILL_COMMUNITY`）。MCP 四工具见上表「社区」行；**不替代** `search_*_docs`。依据短文写代码前须遵守 [`community_knowledge/AGENT_USAGE.md`](../community_knowledge/AGENT_USAGE.md)。
- **库模组**：`knowledge/libs/` 下 **36** 份 Skill 源稿（**34** 唯一 skillId，五组含 `bedrock-only`），按仓库根 `AGENTS.md`「库模组 Skill」解析，**不落盘**平台 `.cursor/skills`。路由：`knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`。计数以 `find knowledge/libs -name SKILL.md | wc -l` 实测为准。
- **数据链**：`library-catalog.ts`（**50** 条，口径 = 源文件 `{ id: '` 对象字面量计数）+ `data/lib-manifests/all.json`（**49** slug，该文件顶层是数组、`length` = 49；**2026-09-25 现扫更新**，旧值 45→48 都是翻页修复前的首页截断面）+ `data/lib-api-summaries/`（**48** 库，口径 = 该目录 `*.json` 文件数）→ `check_dependencies`。**构件快照那一数随每次重抓失效，引用前现扫**（机械复算口径见下节「数据来源与边界」）。完整说明见仓库根 [`README.md`](../README.md)「社区知识与库模组」与 MCP 工具 §7 / §7.5。

### 字段映射（`convert_mapping`）

- SQLite **schema v3** 含 `fields` / `searge_fields`；查询时设 `memberKind: "field"`（建议 `ownerClass`）。
- v2 库读字段 → `SCHEMA_FIELDS_UNAVAILABLE`（重建：`npm run build:yarn-sqlite`）。
- CLI：`node mcp-server/dist/cli.js convert --kind field ...`（仓库根执行；见 `src/cli.ts`）。

### 独立 CLI（入口 `src/cli.ts` → `dist/cli.js`）

`package.json` 的 `bin` 键叫 `mc-skill`，但本包没有发布到 registry，clone 后该命令不可解析；下面的示例一律按可运行形式书写。本文档代码块里的短形式以 `mcp-server/` 为 cwd，仓库根请在前面补上目录（`node mcp-server/dist/cli.js …`）。

**第二入口 `mc-skill-scripts`（仓库线，2026-09-17 提级）**：`package.json` 的 `bin` 同时声明 `mc-skill-scripts` → `bin/mc-skill-scripts.mjs`（同样未发布，clone 后按 `node mcp-server/bin/mc-skill-scripts.mjs …` 调用）。它把散装维护脚本收成 **9 个子命令**：`lib resolve|summary|ownership`、`corpus decompile|emit|merge`、`cloth project`、`gate list|run`（薄壳转发 `scripts/` 与 `mcp-server/scripts/` 的既有脚本，参数与退出码原样透传）。与工具线同一 core、互不分叉；其 `lib resolve` 与 MCP 工具 `resolve_lib_skills` 为同一份实现。冒烟门 `scripts/assert-cli-smoke.mjs`（接 `test-core` §S16）。

一条执行路径：短名只做 alias（`query`→`query_api`、`convert`→`convert_mapping`、`update`→`mc_skill_update`、`status`/`warmup`→`get_server_status`；`warmup` 会注入 `warmup=true`，用户显式 `--warmup=false` 优先）。`descriptor` 是本地命令，不加载 MCP 工具注册表。

全局 flag（不进工具 schema）：`--help`/`-h`、`--version`/`-V`（放在工具名之前、或整条命令没写工具名时打印 CLI 版本；`--version` 跟在工具名后面时是工具字段，而 `-V` 在那个位置会被当未知参数 exit 2）、`--json`（不改变工具输出，仅为兼容保留；只在交互式终端下影响 `--help` 的呈现）、`--compact`、`--fail-on-error`、`--quiet`、`--timeout <ms>`、`--project <dir>`、`--file field=path`、`--raw [field]`、`--output-format json`、`--stdin-json`。`--quiet`、`--timeout` 与 `--stdin-json` 与全部工具字段名零碰撞（连字符/大小写归一化后同样复检），所以它们不需要进 `FIELD_OWNED_GLOBALS`；将来任何工具新增 `timeout` / `quiet` / `stdinJson` 字段都会让该门转红。

同名让位（字段优先）：目标工具 schema 里存在与全局 flag 同名的字段时，这个名字归**工具字段**所有，全局剥离让位。当前唯一一例是 `validate_bp_json` 的 `json`——`--json '<BP 全文>'`、`--json=<全文>`、`--json=@file`、`--file json=path` 都是传待校验内容，不是输出开关；该工具的 `--json` 缺值时按 schema 报校验错（exit 2 `validation`），而不是「未知/缺参」。这份冲突清单显式写在 `FIELD_OWNED_GLOBALS`，`test-cli-parse` 的枚举门断言它恒等于「全部工具 schema 字段名 ∩ 全局 flag 名」，将来新增同名字段而不改清单会让 CI 转红。

kebab-case 会转到 camelCase（`--dry-run`→`dryRun`、`--highlight-key`→`highlight_key`）；另有 `--name`→`memberName`、`--confirm`→`confirmed`、`--class`→`className` 等语义别名（仅当目标字段存在于该工具 schema 时）。只有分隔符/大小写之差的名字（`--allow-fallback`、`--allowFallback`、`--ALLOW_FALLBACK`→`allow_fallback`）由通用归一化接管，不再逐个写进别名表；归一化只在候选唯一时接受，命中多个则报歧义并列出候选写法。未知 flag **exit 2**，报错里带近似名和 `node mcp-server/dist/cli.js <工具> --help` 指针。

文件输入（只作用于**可承载文本**的字段：非 enum 的 `string`、`object` / record、元素为前两者的 `array`、含前两者的 union；`number` / `boolean` / `enum` / `tuple` 一律原样传，不当路径读）：

- `--crashReport @./latest.txt` 读文件（`@@` 转义成字面 `@`）
- `--crashReport=-` 或 `@-` 读 stdin（全进程只能一次，与文件同受 8MB 上限）
- `--file crashReport=./latest.txt` 或 `--file crash-report=./latest.txt` 等价（字段名走 kebab/别名）
- `--raw <field>` 让该字段完全按字面传（连 `@-` 也不读 stdin）；裸 `--raw` 或 `--raw=true` 全局关闭展开，`--raw=false` 恢复；与同名字段的 `--file` 同时出现 → 报冲突 exit 2
- 未知 flag 的值不做任何文件读取，直接按未知参数 exit 2
- 单文件上限约 8MB
- `--project <dir>`：若工具有 `projectPath` 则注入；否则不传，stderr 警告「该工具不支持 --project」

输出统一 JSON `{success, tool, result|error}`。工具输出始终为 JSON；`--json` 不改变工具输出，仅为兼容保留；它只在交互式终端下影响 `--help` 的呈现（人读摘要 → 机器可读 schema），非 TTY（管道 / `spawnSync`）下带与不带 `--json` 的 stdout 逐字节相同。`--compact` 时所有 stdout JSON 都不 pretty。`--output-format` 是表达格式意图的规范入口，当前唯一合法值是 `json`（CLI 只有 JSON 输出）；其它值 exit 2 报「尚未实现」，漏取值的裸写法同样 exit 2。`--output-format=json` 与 `--json` 一样把 `--help` 推向机器可读 schema。Windows PowerShell 5.1 在 GBK 代码页下用管道捕获这份 UTF-8 JSON 会引入坏控制字符导致 `JSON.parse` 失败——先 `chcp 65001` 或设 `[Console]::OutputEncoding`，或改用 Node 子进程读；CLI 不做运行时代码页探测（探测要起子进程，正落在启动路径上，误报还会变成新的 stderr 噪声）。

退出码（`errorKind` 是失败信封上只增不改的分类键，与退出码一一对应，不引入第三种码）：

| 码 | 含义 | errorKind |
|----|------|-----------|
| 0 | 工具跑完且非失败（`query_api` 的 `found:false` 默认仍为 0） | 无（成功信封不带该键） |
| 1 | 抛错、`isError`、`ok===false`、`passed===false`、`error.code` 存在；以及 `--timeout` 到点 | `tool_failure`；超时为 `timeout` |
| 2 | 用法 / 未知命令 / 未知 flag / 缺参 / 读文件失败 | `usage`；schema 校验失败为 `validation` |

失败信封另有 `nearFlags` / `knownFlags`（仅未知 flag 且能给出建议时出现）。

`--timeout <ms>` 到点后 CLI **放弃等待**而不是截断进程：信封先落（`success:false` + `errorKind:"timeout"`，文案明写「这是超时，不是工具失败」），`disposeApiData()` / `closeAllYarnDbs()` 照旧跑完，退出码仍是 1 而非新造第三种码；信封之后走**空写 flush 屏障 + 强制退出**（`process.exit(1)`，审计 M1），**不再等被放弃的那次 IO 自己收尾** —— 否则悬挂句柄会把进程挂住；强退前还会同步收掉在跑的 java 子进程（审计 NP-7：`process.exit` 会销毁 runJava 自己的 kill timer）。

`--fail-on-error` 再把 `found===false` 以及 `errors[]` 非空升为 1。`--fail-on-error=false` **关闭**（旧：写出即开启）。

进度与心跳：默认 stderr 只有一行 `running <工具>…`；`--timeout` 生效时按预算的一半（夹在 50ms–5s）追加心跳行，所以「真的超时」必然至少留过一行进度。`--quiet` 把这两种输出一起静音，但**不吞诊断**——迁移提示、`警告: …` 与错误信封一概照旧。超时/心跳定时器都 `unref()` 且在 `finally` 里 `clear`，`--timeout` 关闭时一个都不建；`test-cli.mjs` 的退出滞后门实测「末行 stdout → 进程退出」8 条路径：5 条普通命令与 2 条「定时器建了又用完」8–36ms（上限 500ms），`--timeout` 超时那档因被放弃的异步仍要落地实测 ~250ms（上限放宽到 1500ms，只用来抓常驻句柄泄漏）。给任一路径注入常驻句柄（不 `unref`、不 `clear`、超时分支遗留定时器）都会转红。

```bash
node dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F' --version 1.20.1
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
- `list-tools` 裁剪三档（与全量共用同一渲染，信封仍是 `{success, tool, result}`，`--compact` 照旧）：`--names-only` 只回名字清单（2 KB 量级，约为全量 schema 的 2%）；`--filter <kw>` 按工具名/描述做忽略大小写子串过滤，命中项回完整 schema，**无匹配 → exit 1 `tool_failure`** 并指向 `--names-only`（不静默给空数组）；`--tool <name>` 只吐单个工具的 schema，短名一样解析。多余位置参数、`--tool` 与 `--names-only`/`--filter` 并用、空 `--filter=`、漏取值的 `--filter` 一律 **exit 2**。
- `help <工具>` 在 TTY 下逐参数列「名字 (类型) — 一行描述」（枚举标 `enum`、数组标 `T[]`、tuple 标 `tuple`、union 用 `|` 连接），不灌完整 schema；要 schema 用 `--help --json`。
- `--stdin-json` 是第三条输入通道：从 stdin 一次读入**整个参数对象**当基座，命令行显式写的同名字段恒胜——`echo '{"className":"Item","version":"1.20.1"}' | node mcp-server/dist/cli.js query_api --stdin-json --className=Block` 查的是 Block。载荷的键与命令行同规格过归一化与 schema 校验（`class-name` 一样解析成 `className`；未知键 exit 2 点名该键），但**载荷的值不再做 `@` 展开**（已经是结构化 JSON，再展开等于把「值里恰好有 @」那个老问题复活）。与 `@-` / `=-` / `--file f=-` 同现 → **exit 2「stdin 只能有一个所有者」**，绝不静默二选一；坏 JSON、顶层非对象、空输入、超过 8MB（与文件同上限）一律 exit 2 且写明错误来自 stdin 载荷；TTY 下不挂起，直接 exit 2；`list-tools` 没有参数对象，带 `--stdin-json` 也 exit 2。这条与上面的「同名让位（字段优先）」是两层不同规则：那条管**全局 flag 与工具字段**争同一个名字，本条管**命令行值与 stdin 载荷**争同一个字段的值。
- PowerShell 括号：单引号包裹，如 `'--descriptor=()F'`。
- 全局 `--help`/`--version` 不加载工具注册表，也不加载 update 链（该链静态可达 `node:sqlite`，否则连 `--version` 都要吐一行 `ExperimentalWarning`）；这两条只读路径的 stderr 因此是干净的，`test-cli.mjs` 的只读启动门按「stderr 只允许 `[mc-mcp-server] WARN:` 行」判定。**随之而来的刻意变更**：`--version` / `--help` / `help <tool>` 不再清 `pendingRestart` marker（只有真跑命令的分发路径清）。`MC_SKILL_DATA` 仅在真正调用依赖 data 的工具时提示：提示语写出**本进程实际查阅的目录**（`resolveDataDir()`：`MC_SKILL_DATA` → 安装位置推导 → cwd 推导），不硬编码盘符；未设置该变量时会说明这一点。覆盖面即 `src/cli-parse.ts` 的 `DATA_DIR_TOOLS`，`activate_platform_pack` / `detect_mod_project` 不在其中（它们读仓库根规则树，与 data 目录无关）。

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
| `decompile_mod_jar` | `{jarPath, version?, mapping?, force?}` → VineFlower 反编译到 `$CACHE/decompiled-mods/<modId>/<version>-<jarSha512_12>/`（身份段来自 jar 字节内容；解析不出 modId 的 jar 判 `MOD_ID_UNKNOWN` 失败，不再写 `unknown-mod` 共享目录），返回源码树摘要；可选 remap（1.14–1.21.11 + 匹配版本）。身份优先级：jar 自身元数据 → **它自己声明的**内层件（`META-INF/jars|jarjar/*.jar`，只在无歧义时采信，多义返回候选不猜第一个）→ 调用方标签（须被该 jar 自己的条目路径证实，外部证据不绕过归属）；来源随结果回传 `modIdEvidence ∈ jar \| jarjar-self \| jarjar-labeled \| external`。**输入选择已收口（S35 实现 · S5c 离线回归门，2026-09-14）**：`modIdSource`（身份出自哪个内层件）现已被消费 —— `evidence ∈ {jarjar-self, jarjar-labeled}` 时 remap 与 VineFlower 的输入换成该内层件（`pickDecompileInput`：条目名含 `..` 段 / 绝对路径 / UNC / 盘符一律守卫拒绝且不去读字节；取字节或落盘抛错则静默维持外壳并回传 `reason`），内层件落盘到 `$CACHE/…/remapped/embedded-<jarIdentity>-<条目名展平>.jar`，并 push 一条「实际反编译的是内层件」warning；`evidence ∈ {jar, external}` 时即使递来 `modIdSource` 也原样用外壳。jarjar 胖壳（Modrinth 的 `kotlinforforge-*-all.jar`：4527 条目里 `thedarkcolour.kotlinforforge` 只占 13 条）不再解成被 shade 进来的 Kotlin stdlib。回归面 = `test-decompile.mjs` section `jarjar fat-jar decompile input (S5c · F57)` 共 10 条门，零联网、零 JDK。**2026-09-14 已收口（本窗口真机执行）**：把 `-all` 壳里的 `thedarkcolour.kfflib` / `kfflang` / `kffmod` 三个内层件逐个反编译（`modIdEvidence=external`，不传 `version` ⇒ 不 remap，避免把 MC 整包卷进产物），再按 `mcp-server/data/lib-manifests/all.json` 里该 jar 的 `gameVersion` 集合（按 sha12 / 发布版本号 join）**逐 MC 版本展开归属**，重建后的 `data/lib-api-summaries/kotlin-for-forge.json`：**47 个版本键**（1.14 → 26.2，全部来自发布清单）、**无 `versions.unknown`**、`thedarkcolour.*` 去重 **26** 个类（含 `thedarkcolour.kotlinforforge{,.eventbus,.forge.vectorutil.v2d/v3d/v4d,.neoforge.*,.kotlin}`）；`assert-lib-ownership` 复跑 GREEN（类别合计已按 S5 惯例签字 12583 → 16975，成因写在门内 LEDGER 注释里）。**注意「185」的真相**：那是**旧摘要唯一版本键（1.14.4）下的类名总数**，其中 `thedarkcolour.*` 仅 13、其余 172 是 `kotlin.*`/`kotlinx.*` 外壳产物 ⇒185 **从来不是** KFF 的 API 规模，只是「被 stdlib 污染的计数」；要读真名不必再「把内层 jar 单独喂给本工具」（已入库）。**2026-09-14 已打通（同一窗口第二步）**：新增 `scripts/emit-verified-api-from-summaries.mjs` 把**摘要**（已按发布清单归属的部分）转成写入器认的记录（`status/slug/modId/gameVersion/loader/packages/entrypoints`；`<mcVersion>/<loader>` 的 loader 一律取自 `lib-manifests`，不猜），再走既有 `merge-verified-api.mjs --write --force` 落盘 —— 归属判定、冒领剔除、缩进重排全部复用既有实现，不写第二份。结果：`authored/lib-kotlin-for-forge` 的 `verifiedApi` 由 **4 键 → 67 键**（`1.14/forge` … `26.2/neoforge`，含 `1.16.5/forge`、`26.2/neoforge`），catalog 总键 **1830 → 1893**、已证实包根 **42 → 47**（`assert-lib-ownership` 已按 S5 惯例两处显式签字，`冒领 0`）。注意门读的是**编译产物**（`dist/diagnostics/library-catalog.js`）⇒ 改完 catalog 必须 `npm run build` 再跑门。 |
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
| MCP Prompt | 与 `WORKFLOW_TEMPLATES` 等量注册（当前 **48 个**：`mc-new-block` / `mc-new-entity` / `mc-new-gui` / `mc-crash-triage` / `mc-port-mod` / `mc-build-mod` / `mc-ingame-iterate` / `mc-localize-mod` / `mc-decompile-mod` / `mc-villager` / `mc-multiblock` / `mc-ai` 等；完整清单以 `get_workflow_template` 列表为准） |
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
| `mcskill://code-patterns/<平台>[/<版本>]/<文件>.md` | 各档 `code-patterns/` 正文（实测 18 个档目录 / 116 篇）；编号集合按档不同，文件名一律以 `list_knowledge_resources` 返回为准 |
| `mcskill://workflow/<模板名>` | 与 Prompt 同名的工作流正文（与 `WORKFLOW_TEMPLATES` 等量，当前 48 个；含构建、真机循环、模组汉化、反编译、村民/多方块/实体 AI 等） |

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
- **静态字段名不在摘要能力范围内**：`query_loader_api` / `search_loader_api` 的摘要只收**类 + 方法签名**，`fields` 恒为 0。实测 `mcp-server/data/loader-api-summaries/1.18.2-forge.json`（2026-09-24 复测：node 直接读该 json 累加）：`classCount` 988（`classes` 实数 988）、methods 4950、**fields 0**、`fqcnIndex` 617 条，且 `ForgeRegistries` 在 `classes` 与 `fqcnIndex` 里**都没有条目**——所以加载器/模组 API 的**字段名**（例：`ForgeRegistries.ENTITIES` vs `ENTITY_TYPES`）即便类已入库也核不到。字段名按**四档出处**落笔，四档不得混称（口径真值 = 根 `AGENTS.md`「工具边界」里那条「静态字段名不在 `query_loader_api` 能力内」，两处必须同步改）：**① 语料逐字**（本仓 `data/**` 上游正文可复核）——**仍然只有** `BLOCKS` / `ITEMS`（`data/forge_1.18.2/forge-docs/1.18.2/processed/concepts_registries.md:24,96`、1.19.4 同名页 `:24,106`）；**①b 官方构件逐字**（2026-09-24 新增档；自备 jar 可复核、构件不入库）：1.18.2 的 `ENTITIES` / `BLOCK_ENTITIES` / `SOUND_EVENTS` / `PARTICLE_TYPES` / `CONTAINERS` / `PAINTING_TYPES` / `FLUIDS` 由官方 1.18.2-40.1.80 源码（157 行）＋ 1.18.2-40.3.12 universal jar `javap -p`（41 行 / 注册表字段 32 个）两 build 两机制互证；**② 处方-only**（只有本档 rules/skills 自撰、无外部出处）：forge/1.18.2 面**现已清空**；**③ 外部-only**（仓内不可复核）：`ENTITY_TYPES`@1.19.4 —— **1.19.4 侧字段名与 1.20.x 的 `MENU_TYPES` 本次未取证，禁止拿 ①b 外推**；**④ 证伪（不是未核实）**：`FLUIDTYPES` 与 `FLUID_TYPES`@1.18.2 —— 1.18.2 没有流体类型注册表，流体走 `FLUIDS`（`FluidType` + `FLUID_TYPES` 自 1.19 才有），修法是删/改表行、**不是**改名成 `FLUID_TYPES`。复核入口两条（需自备 jar + JDK 17+，只读不写库）：`unzip -p <forge-1.18.2-40.1.80-sources.jar> net/minecraftforge/registries/ForgeRegistries.java` ＋ `javap -p -classpath <forge-1.18.2-40.3.12-universal.jar> net.minecraftforge.registries.ForgeRegistries`。⚠️ **禁止把本仓规则行当外部出处（那是循环引证）**：`forge/1.18.2/.cursor/rules/01-registry.mdc:27`、`forge/1.19.4/.cursor/rules/01-registry.mdc:27` 属**处方实况**（也正是裁定自己改过的行），只说明「现状长什么样」。四档都给不出的名字留 `// TODO(未核实)`，禁止凭训练记忆补。

- **库模组构件快照 `mcp-server/data/lib-manifests/all.json`（边界与 as-of 口径，2026-09-25 现扫复测）**：本节此前只覆盖 `loader-api-summaries`，**构件快照没有任何边界说明**，本条补上。
  - **真身路径从仓库根算起带 `mcp-server/` 前缀**：根 `data/lib-manifests` **不存在**（本轮实测：根 `data/` 68 个条目里 0 个匹配 `lib-manifest`），而 `mcp-server/data/lib-manifests/` 目录里**只有 `all.json` 一个文件**（无 `_meta.json` / `fingerprints.json` 之类兄弟件。**2026-09-25 现扫更正**：该目录现有 **2** 个文件 —— `all.json` 与生产者 `--write` 自动留下的 `all.json.bak`（旧面备份，`??` 未纳管 ⇒ 一次 `git add .` 就会把 1.4 MB 旧面提进仓库，已登记在 `CONTRIBUTING.md` 未排期清单 `L52`））。本 README 其他处把它写成相对形态 `data/lib-manifests/all.json` 时，指的都是这个 `mcp-server/` 下的目录，不是仓库根的 `data/`。
  - **快照形状（2026-09-25 现扫 node 直读；本节数字随每次重抓失效，引用前现扫 —— 机械复算口径 = 顶层数组 `length` 给 slug 数、`Σ entries[].length` 给构件行数，一条命令：`node -e "const j=require('./mcp-server/data/lib-manifests/all.json');console.log(j.length, j.reduce((a,e)=>a+e.entries.length,0))"` ⇒ 现值 `49 3003`）**：1,519,506 B、mtime **2026-09-25T06:21:20Z**、顶层是**裸数组**（`isArray=true`，`length` = 49）；slug 对象的键只有 `slug` 与 `entries`；entry 键 **8** 个 = `gameVersion` · `loader` · `modId` · `fileName` · `url` · `sha512` · `versionType` · `versionNumber`；**49 slug / Σentries 3,003**（含 quilt 行的 slug **25** 个、quilt 行 **513** 条）。**历史值（不回改，只在此归位）**：本 bullet 首版写的是 **1,450,852 B / mtime 2026-09-16T15:00:38Z / 48 slug / Σentries 2,870** —— 那是**翻页修复前被静默截断的首页面**，第 44 轮重抓后已被上面的现值取代（新增的唯一 slug = `rei`；`jei` 撞 `MAX_PAGES=30` 帽、以 slug 级 `captureState=capped` 键继承 73 行）。
  - **快照不自带 as-of**：全文扫 `generatedAt` / `asOf` / `as_of` / `fetchedAt` = **0 : 0 : 0 : 0** 次命中。⇒ 想知道「这份快照是哪一刻的」只有三个**代理**口径，三者都**不是**快照字段，不得写成 manifest 自带：① 文件 mtime **2026-09-25T06:21:20Z**（2026-09-25 现扫；**旧值 `2026-09-16T15:00:38Z` 属第 44 轮重抓前的截断面**，该值仍写在历史叙述里、不得再当现值抄。⚠️ 现在 mtime **领先**代理 ② 的最后一次提交 —— 工作树里的 `all.json` 是 ` M` 未提交态、`.bak` 是 `??`，所以「mtime = 提交时刻」这条隐含等式在本日不成立）；② 该文件最后一次提交 **`d3d266d2` · 2026-09-17T10:17:13+08:00（sweep76）**（`git ls-files` 确认该件受纳管，口径 = `git log -1 --format=%h %cI %s -- <该路径>`）；③ 同日 `mcp-server/data/lib-api-summaries/*.json` 的 `generatedAt`（48 份全部带该字段；**47 份 = 2026-09-16、1 份 = 2026-08-12）。⚠️ 代理 ③ 的目录是 **`lib-api-summaries`**，**不是**上面那条 bullet 讲的 `loader-api-summaries`——本轮实测后者的 47 份 json 里 `generatedAt` **0 命中**（只有 4 份 `*-qsl.json` 带 `fetchedAt`），两个目录名差一个词、别混。
  - **「快照无该行」≠「上游无该构件」**：本文件只是生产者脚本在某一刻的一份快照，某 loader / 某版本在快照里 0 行，只说明**这次没抓到或抓到被丢弃**，不构成「Modrinth 上没有该发布」。已知两类静默失配来源：其一，**每个版本只取 `files` 里 `primary` 那一个构件**（无 `primary` 时退回首件，现 `scripts/build-lib-manifest.mjs:265`）⇒ 多构件发布只留一行；**但这条丢的是「同一发布的备用构件」，不是「别的加载器」**（第 43 轮实测：48 个 slug / 13,608 个版本对象里 1,722 个（12.7%）带 >1 个 file，而 Modrinth 给这些 file 对象的 `file_extensions.loaders` **全部为空**（0/13,608），逐 filename 加载器词（forge / neoforge / fabric / quilt）比对 page0 采样的 510 个多构件版本，**0 个**指向不同加载器 —— 多出来的都是 `-sources.jar` / `-api.jar` / `_SOURCE_` 变体；按 (gameVersion × loader × filename) 展开会把 2,927 行放大到 27,853 行（×9.52）而**不增加任何加载器覆盖**）。其二，**要求真 sha512**（`sha512: SHA512_RE.test(hashes.sha512) ? … : ""`，随后 `buildEntries()` 把 `sha512` 为空的条目剔出清单、只 `console.warn`「丢弃 N 个无 sha512 的构件」）⇒ 无校验和的发布不进快照。生产者脚本 = **仓库根 `scripts/build-lib-manifest.mjs`**（`mcp-server/scripts/` 下**没有**同名件）。该脚本**不写任何时间戳**：`:427` 就是落盘那一行 `writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2))`，全部统计（库数 / 条目数 / 版本数 / 页数 / 逐 slug 明细）只在 `:431-448` 走 `console.log`，跑完即失；`--write` 时另在 `:424` 把旧件复制成 `all.json.bak`（第 43 轮现扫该目录只有 `all.json`，无 `.bak` 残留）。⚠️ 这些行号是**易碎锚点**：本轮加分页前它们分别是 `:339` / `:341-356` / `:336`（第 42 轮记录），改动生产者后必须同步复算。重抓要写 `mcp-server/data/**`，属维护侧授权动作；只想出不碰真面的候选：`node scripts/build-lib-manifest.mjs --out=temp/<x>.json --force`（`--only=slug,slug` 可点名）。
  - **抓取范围口径（决定「截断」风险）——第 43 轮已现读证实「确被截断」**：旧写法是每个非空 slug 只发一次 `https://api.modrinth.com/v2/project/<slug>/version`（不带 `limit`/`offset`、不翻页，15s 超时），而该端点默认页 = **100 个版本** ⇒ 上游 >100 个版本的 slug 被**静默截断**且不留记号。第 42 轮本条写的是「单 slug 最大不同 `versionNumber` = 86 < 100 ⇒ **未见**越页证据」——**那是错的安全感**：它的分母取自**被截断的件本身**，而截断从快照内部根本看不见。第 43 轮现读 48 个 slug（探针 `temp/ralph-20260922/_v43-truncation-census.mjs` 与 `_v43-census-rerun.mjs`，后者额外逐条打印 HTTP 状态码；as-of 2026-09-25，**要梯子**：`curl.exe --proxy http://127.0.0.1:7897`，两条腿都实测过——Modrinth 本身 200 直连也能通，但探针按梯子传）：**31/48 被截断**（page0 满 100 且 page1 非空；这 31 个 slug **全部**在快照里 ⇒ 快照确实只收了第一页），其中 **21 个 page1 也满 100 ⇒ ≥200 版本**（再读 page2：其中 **17 个 page2 仍满 100 ⇒ ≥300 版本**，另 4 个在 page2 收口：forge-config-api-port 229、pehkui 225、polymer 273、resourceful-lib 237）；14 个不足一页；**3 个 page0 直接 HTTP 404**（`libgui` / `server-translations` / `spruceui-obsidianui`——是 **404 不是 429 限流**，且这三个 slug 已不在今日生产者的 slug 全集里）。被截断的 31 个 slug 占快照 **2052 / 2870** 行。⇒ **判据（不得复发）**：「截断从快照内部不可见，不得用快照自身行数 / 自身最大版本数反证没截断」；要给某个「快照 0 行」的档下「上游没有」的结论，必须翻页重抓或回上游页面人工核。生产者已在本轮改为翻页（`offset += 100` 直到某页 < `PAGE_SIZE=100`；`MAX_PAGES=30` 触顶即**打日志并把该 slug 判为失败**、绝不静默截断；实测 `jei` 就撞在该帽上 ⇒ 本轮候选里没有 `jei`，上游确有 ≥3000 个版本，6 个深 offset 采样 600 个 id 零重复）。翻页带来的行数变化**很小**（两侧都在的 44 个 slug：**2,794 → 2,843 行（+49）**，每 slug 最多 +4；候选总量 45 slug / 2,927 行 vs 快照 48 slug / 2,870 行——差的 3 个 slug 是上面那三个 404、外加 `jei` 撞帽未入，新增的 1 个是 `rei`），因为 `entries` 是 (gameVersion × loader) 去重后的组合数、不是版本数；**但被改写的「哪个构件胜出」很大**：同一 (gameVersion × loader) 组合里 `fileName`/`versionNumber` 换了 **185** 行 ⇒ 按快照读 release 上界/构件坐标的结论，翻页后必须以新面重算。**本条是历史叙述（第 43 轮在截断面上的普查，其 48 slug / 2,870 行 / 31 个截断 slug 都是**当时那份件**的数，按第 41 轮裁定不回改数字）；重抓后的现面见上面「快照形状」bullet（as-of 2026-09-25 = 49 slug / 3,003 行），逐 slug 的上界结论一律按现面重算，不得抄本条的分母。**

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
