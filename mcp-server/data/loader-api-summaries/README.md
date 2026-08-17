# loader-api-summaries

反编译缓存目录：**$MC_SKILL_CACHE**（禁止写仓库根）。
MCP 运行时（resolveCacheRoot）与本脚本都读 `MC_SKILL_CACHE`。不设则可能分家（MCP 默认 APPDATA，脚本默认 D:\\mc-skill-temp）。请设成同一路径。

把加载器 jar 放到 `$MC_SKILL_CACHE/loader-jars` 后重新运行本脚本。

键形如 `1.20.4-neoforge`、`26.1-neoforge`、`1.20.4-fabric-api`。
**不要**把摘要合并进 Parchment query_api。摘要必须含 mappingsVersion。
