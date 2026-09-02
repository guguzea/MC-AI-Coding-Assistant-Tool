# loader-api-summaries

反编译缓存目录：**$MC_SKILL_CACHE**（禁止写仓库根）。
MCP 运行时（resolveCacheRoot）与本脚本都读 `MC_SKILL_CACHE`。不设则可能分家（MCP 默认 APPDATA，脚本默认 os.tmpdir()/mc-skill-cache请设成同一路径。

把加载器 jar 放到 `$MC_SKILL_CACHE/loader-jars` 后重新运行本脚本。

键形如 `1.20.4-neoforge`、`26.1-neoforge`、`1.20.4-fabric-api`。
**不要**把摘要合并进 Parchment query_api。摘要必须含 mappingsVersion。

以 MCP `search_loader_api mode=list` 为准：Fabric 1.14.4–1.21.11 / 26.1.2 已入库；`skipped-ingest.json` 的 `mavenNotIndexed` 现为空。LiteLoader/Rift/ModLoader 多为手摘极小摘要或 sidecar 模板，不是完整 jar ingest。

## NeoForge 覆盖表（实测，生成器 `scripts/decompile-loader-apis.mjs`）

10 档全部 `source: official`、`decompile.fromSourcesJar: true`（来源为 `-sources.jar`，无 `.class`，不需要 JDK / VineFlower / ASM）。
`classCount` == `classes.length`，`fqcnIndexCount` == `javaFileCount`（一个顶层类 = 一个 `.java`）。

| MC 版本 | 键 | classCount | fqcnIndex / javaFile | mappingsVersion | mappingsSource | 供件坐标 |
| --- | --- | --- | --- | --- | --- | --- |
| 1.20.1 | `1.20.1-neoforge` | 1081 | 655 | `parchment-1.20.1-2023.09.03` | `parchment-maven-metadata` | `net.neoforged:forge:1.20.1-47.1.106`（Forge 兼容层） |
| 1.20.4 | `1.20.4-neoforge` | 1174 | 851 | `parchment-1.20.4-2024.04.14` | `gradle.properties-sidecar` | `net.neoforged:neoforge:20.4.251` |
| 1.20.6 | `1.20.6-neoforge` | 1182 | 867 | `parchment-1.20.6-2024.06.16` | `parchment-maven-metadata` | `net.neoforged:neoforge:20.6.141` |
| 1.21.1 | `1.21.1-neoforge` | 1295 | 953 | `parchment-1.21.1-2024.11.17` | `gradle.properties-sidecar` | `net.neoforged:neoforge:21.1.x` |
| 1.21.3 | `1.21.3-neoforge` | 1286 | 947 | `parchment-1.21.3-2024.12.07` | `gradle.properties-sidecar` | `net.neoforged:neoforge:21.3.x` |
| 1.21.5 | `1.21.5-neoforge` | 1291 | 1000 | `parchment-1.21.5-2025.06.15` | `parchment-maven-metadata` | `net.neoforged:neoforge:21.5.98` |
| 1.21.8 | `1.21.8-neoforge` | 1337 | 1039 | `parchment-1.21.8-2025.09.14` | `gradle.properties-sidecar` | `net.neoforged:neoforge:21.8.54` |
| 1.21.10 | `1.21.10-neoforge` | 1407 | 1105 | `parchment-1.21.10-2025.10.12` | `parchment-maven-metadata` | `net.neoforged:neoforge:21.10.64` |
| 1.21.11 | `1.21.11-neoforge` | 1429 | 1126 | `parchment-1.21.11-2025.12.20` | `gradle.properties-sidecar` | `net.neoforged:neoforge:21.11.45` |
| 26.1 | `26.1-neoforge` | 1454 | 1136 | `mojmap-unobfuscated-26.1` | `gradle.properties-sidecar` | `net.neoforged:neoforge:26.1.x`（已去混淆） |

1.20.1 / 1.20.6 / 1.21.5 / 1.21.10 为本轮补齐（此前该目录只有 1.20.4 / 1.21.1 / 1.21.3 / 1.21.8 / 1.21.11 / 26.1）。

### 新四档与兄弟档的两处口径差异（如实记录，不冒充）

1. **无 `modId` / `loaders: []`**：这两个字段由 `analyzeModJar(jarPath)` 从 jar 内 `mods.toml` 派生；`-sources.jar` 里没有 `mods.toml`，所以新四档缺 `modId` 且 `loaders` 为空数组。凡是同样以 sources jar 生成的档都缺，不是新四档独有的漏字段。
2. **`mappingsSource: parchment-maven-metadata`**：`mappingsVersion` 仍写成 `parchment-<MC>-<date>` 形状，但维护者侧 shell 读不到 MDK 的 `gradle.properties`，值取自 parchment maven-metadata，而不是兄弟档的 `gradle.properties-sidecar`。

**1.20.1 额外注意**：该版真实官方坐标是 `net.neoforged:forge:1.20.1-47.1.106`（Forge 47 兼容层），摘要里的类名是 `net.minecraftforge.*` 而非 `net.neoforged.*`；与根 `AGENTS.md` D9（1.20.1 归 Forge 口径）一致。`data/neoforge-versions-manifest.json` 里写的 `20.1.x` 不存在，属治理/文档一致性项。

## 失败不落盘

生成侧 + `mcp-server/test-core.mjs` 的 `testLoaderApiRepoDataHygiene` 门禁共同兜住：空摘要、`classCount` 与 `classes` 不符、缺 `mappingsVersion`、缺 `source`、`source: user_jar` 落进官方目录、`invalid` 残档、`fqcnIndex` 与 `fqcnIndexCount` 不符、`version` 与键名不一致、index↔摘要孤儿行、`status.decompiled` 登记缺失/过期、绝对路径泄漏、反编译产物（`.java`）入库 —— 任一命中即红。
