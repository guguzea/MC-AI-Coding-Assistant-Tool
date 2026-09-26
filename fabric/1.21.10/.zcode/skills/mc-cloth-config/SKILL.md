---
name: mc-cloth-config
description: Fabric 1.21.10 mc-cloth-config。坐标见 cloth-version-inject 标记行（versions.json 1.21.10 槽）；签名核不到则 search_fabric_docs version=1.21.10，禁止输出。
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---
<!-- cloth-version-inject v=1.21.10 coord=20.0.149+fabric state=active textApi=literal -->

# mc-cloth-config（Fabric 1.21.10）

本 Skill **尚未用本版文档核到可执行步骤**，禁止输出方法名与示例代码。依赖坐标**有** slot：`knowledge/libs/fabric-only/mc-cloth-config/versions.json` 的 `1.21.10` 槽（该档实况以 frontmatter 后的 `cloth-version-inject` 标记行为准，现 `coord=20.0.149+fabric state=active`；依据 = Modrinth `cloth-config` 构件行的 `game_versions` 逐字含 `1.21.10`，as-of 2026-09-24）。写 `build.gradle` 前直接读标记行，禁止从中心稿「版本映射表」抄坐标；`state != active` 时该坐标一律不采纳。

改口：`search_fabric_docs`（`version=1.21.10`）。核不到就停。

要签名：先 `query_loader_api`；无摘要则用户自备 jar 走 `ingest_loader_api`。
