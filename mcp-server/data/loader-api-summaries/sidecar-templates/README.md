# 用户自备 loader jar 的 sidecar 模板

官方 **不会** 下载这些 jar（许可 / 无 Gradle 坐标）。把已合法取得的 jar 放到：

`$MC_SKILL_CACHE/loader-jars/<key>.jar`

并在旁边写 `<key>.jar.sidecar`（优先 JSON；也可兼容 `<key>.jar.mappings.json`）。

`mappingsVersion` **必填**，禁止猜 Yarn/MCP。然后：

```bash
node dist/cli.js ingest_loader_api --platform=… --minecraftVersion=… --jarPath=<abs> --mappingsVersion=…
```

摘要只写 `$MC_SKILL_CACHE/loader-api-summaries/` overlay，**禁止**提交进仓库 `data/`。
