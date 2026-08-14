# MC MCP Server

本地 **stdio** MCP Server，供各 MCP 宿主（Cursor / Claude Code / VS Code / Continue / Trae / OpenCode 等）查询 Minecraft 模组开发资料（Forge / Fabric / NeoForge）。配置格式对照见仓库根 [AUTO_SETUP.md](../AUTO_SETUP.md)，不要默认写成 Cursor 的 `mcp.json`。

**要求：Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。

仓库与 GitHub Release **均不含 `node_modules`**，需本地编译：

```bash
cd mcp-server
node -v   # 需 v22.5+
npm ci
npm run build
```

## 能力概览

- 共 **70** 个 MCP 工具：`src/index.ts` **44** + `src/wave/register.ts` **26**
- 依赖仓库根 `data/`（API extracted、parchment/mcp、**yarn-mappings.sqlite**、文档索引、porting 等）
- 官方文档三级：L0 搜索 → L1 摘要 → L2/L2+ 全文
- **禁止**运行时全量加载 `yarn-mappings.json`（>1.5GB，易 OOM）
- T2 反编译工具族：**默认零下载**，仅显式调用时按需下载到 `$MC_SKILL_CACHE`（Java 17+ 前置）

完整分类、降级与**工具边界（避免误判）**见根目录 [README.md](../README.md)。常见误判：`query_api`  26.1+ 无索引；`diagnose_gradle` / `validate_project` 仅 Forge（`validate_project` 对非 Forge **早退**，不是通用校验器）；文档 `id` 必须来自搜索结果；`generate_*` 不写盘。

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

重载该宿主的 MCP 后，Agent 应调用 `get_server_status`、`diagnose_data_paths`。应出现服务名 **`MC-AI-Coding-Assistant-Tool`**，工具数 **70**。不要只让用户「看设置页」。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | data 根目录（非版本子目录） | `H:/MC_skill/data` |
| `MC_SKILL_COMMUNITY` | 社区知识库根（可选） | `H:/MC_skill/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE` | `1` 允许 `port_project` / `mc_skill_update` 写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 允许写入的根（更新工具须为 **MC_skill 仓库根**） | `H:/MC_skill` |
| `MC_SKILL_UPDATE_REPO` | GitHub `owner/repo`（默认本仓库） | `guguzea/MC-AI-Coding-Assistant-Tool` |
| `MC_SKILL_UPDATE_REMOTE` | 强制 git remote 名；空则扫描匹配 URL | `origin` |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | `get_server_status` updateHint 缓存 TTL | `3600` |
| `MC_SKILL_CACHE` | 反编译/MDK/loader-jar 缓存根。MCP（`resolveCacheRoot`）与脚本都读此变量。不设则分家：MCP 默认 APPDATA/`~/.config/mc-skill-cache`，`decompile-loader-apis.mjs` 默认 `D:\mc-skill-temp`。请设成同一路径。 | `D:/mc-skill-temp` |
| `MC_SKILL_SKIP_DOWNLOAD` | `1` 时反编译工具跳过一切下载并诚实失败（CI 语义） | `1` |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | data zip 下载超时 | `600000` |
| `MC_SKILL_GITHUB_TIMEOUT_MS` | Release API 超时 | `25000` |
| `MC_SKILL_GITHUB_API_BASE` | GitHub API 根（可改镜像） | `https://api.github.com` |
| `HTTPS_PROXY` / `HTTP_PROXY` | Node fetch 代理（Clash 等） | `http://127.0.0.1:7890` |
| `MC_SKILL_GITHUB_TOKEN` / `GITHUB_TOKEN` | 可选，提高 API 限额 | |
| `MC_SKILL_STRICT` | `1` 数据无效则启动失败 | `1` |
| `MC_SKILL_DEBUG_PATHS` | `1` 打印路径解析 | `1` |

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
| 工程 | `diagnose_gradle`、`generate_datagen`、`crash_analyze`、`validate_project` |
| Forge 文档 | `list_forge_versions`、`search_forge_docs`、`get_forge_doc_*` |
| Fabric 文档 | `list_fabric_versions`、`search_fabric_docs`、`get_fabric_doc_*` |
| NeoForge 文档 | `list_neoforge_versions`、`search_neoforge_docs`、`get_neoforge_doc_*`（默认 **26.1**；请求 26.2 可 fallback 到 26.1，不克隆假树；`1.20.1` 可回退 Forge） |
| 跨平台文档 | `list_doc_versions`、`search_docs`、`get_doc_*` |
| 社区 | `list_community_sources`、`search_community_docs`、`get_community_doc_*` |
| 移植 / 数据 | `analyze_porting_path`、`port_project`、`diagnose_data_paths` |
| Wave B | `query_registry`、`mixin_analyze`、`audit_resources`、`validate_datapack_json`、`get_workflow_template`、`list_knowledge_resources`、`read_knowledge_resource` |
| Wave C 生成 | `generate_model`、`generate_lang`、`generate_network_packet`、`generate_capability`、`generate_config`、`generate_entity_renderer`、`generate_worldgen`、`localize_mod` |
| Wave C 诊断 | `analyze_log`、`get_migration_guide`、`check_dependencies` |
| T2 反编译（Wave C） | `get_minecraft_source`、`analyze_mod_jar`、`decompile_mod_jar`、`search_mod_code` |
| T4 字节码校验（Wave D） | `validate_at`、`validate_aw`（+ `mixin_analyze` 的 `deep:true` 深度模式） |
| 自我更新 | `mc_skill_update` |

补充文档：`docs/vanilla-registries.md`、`docs/registry-data-source.md`、`docs/prompts-client-compat.md`、`docs/mc-skill-update.md`。

### 字段映射（`convert_mapping`）

- SQLite **schema v3** 含 `fields` / `searge_fields`；查询时设 `memberKind: "field"`（建议 `ownerClass`）。
- v2 库读字段 → `SCHEMA_FIELDS_UNAVAILABLE`（重建：`npm run build:yarn-sqlite`）。
- CLI：`npx mc-skill convert --kind field ...`（见 `src/cli.ts`）。

### 独立 CLI（`mc-skill`）

flags-only（`--key value` / `--key=value` / 裸 `--key`→true），参数按各工具的 zod `inputSchema` 驱动类型转换；输出统一 JSON 包装 `{success, tool, result|error}`，退出码 0=成功 / 1=工具错误 / 2=用法错误：

```bash
node dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F'
node dist/cli.js descriptor --descriptor '()F' --name getHealth
node dist/cli.js update --action check
node dist/cli.js list-tools            # 全部 70 个工具的 schema（parameters=inputSchema）
```

- 旧位置参数形式（`query <className> [methodName]`、`convert ... <memberName>`、`descriptor <jniDescriptor>`、`update check|apply`）**仍兼容**，结果 JSON 与 flags-only 一致，stderr 输出迁移提示 `⚠️ 旧位置参数用法将在未来移除，请改用 --key value 形式`。
- PowerShell 括号场景：单引号包裹即可，如 `'--descriptor=()F'`。
- `list-tools` 从 `src/index.ts` 的 `listAllToolSchemas()` 读取（`indexToolSchemas` 36 + `waveToolSchemas` 26），导入该模块不会启动 MCP 服务（bootstrap 有 `isMainModule()` 守卫）。

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
| MCP Prompt | `mc-new-block` / `mc-new-entity` / `mc-new-gui` / `mc-crash-triage` / `mc-port-mod` / `mc-build-mod` / `mc-ingame-iterate` / `mc-localize-mod` / `mc-decompile-mod` |
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
| `mcskill://workflow/<模板名>` | 与 Prompt 同名的工作流正文（9 个；含构建、真机循环、模组汉化与反编译） |

**客户端兼容结论**：Cursor 等仅 tools 客户端主走 `get_workflow_template` / `list_knowledge_resources` / `read_knowledge_resource` 兜底；Claude Desktop 等支持 prompts/resources 的客户端可直接使用注册的 Prompt 与 Resource。

---

## FAQ

**Q: NeoForge 1.20.1 文档？**  
A: 查询会回退 Forge 1.20.1 视图（`forgeCompatible`），属预期。

**Q: Release 没有 node_modules？**  
A: 在 `mcp-server/` 执行 `npm ci && npm run build`。

**Q: Yarn 查询 OOM？**  
A: 使用预建 `yarn-mappings.sqlite`，勿加载整份 JSON。
