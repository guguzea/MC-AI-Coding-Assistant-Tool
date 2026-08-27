# loader-api-summaries

反编译缓存目录：**$MC_SKILL_CACHE**（禁止写仓库根）。
MCP 运行时（resolveCacheRoot）与本脚本都读 `MC_SKILL_CACHE`。不设则可能分家（MCP 默认 APPDATA，脚本默认 os.tmpdir()/mc-skill-cache请设成同一路径。

把加载器 jar 放到 `$MC_SKILL_CACHE/loader-jars` 后重新运行本脚本。

键形如 `1.20.4-neoforge`、`26.1-neoforge`、`1.20.4-fabric-api`。
**不要**把摘要合并进 Parchment query_api。摘要必须含 mappingsVersion。

以 MCP `search_loader_api mode=list` 为准：Fabric 1.14.4–1.21.11 / 26.1.2 已入库；`skipped-ingest.json` 的 `mavenNotIndexed` 现为空。LiteLoader/Rift/ModLoader 多为手摘极小摘要或 sidecar 模板，不是完整 jar ingest。
