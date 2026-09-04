---
description: 00 — Quilt 项目结构
---

# 00 — Quilt 项目结构

> 适用：Quilt 1.18.2。方块/物品细节读 `fabric/1.18.2/.cursor/rules/02-block.mdc` 等。

## 约束

- Java **17**；`id 'org.quiltmc.loom'`（不要混用 `fabric-loom` 当主插件）
- 元数据：`src/main/resources/quilt.mod.json`，id 在 `quilt_loader.id`，全小写无 `-`
- 入口：Quilt Loader `org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（`entrypoints.init`）。禁止用 Fabric `onInitialize()` 记忆冒充 QSL 专用 API
- 官方 Loom 版本对照 maven `org.quiltmc:loom`（`https://maven.quiltmc.org/repository/release/org/quiltmc/loom/`，`<release>` = 1.15.1，核对日期 2026-09-04）与官方模板，禁止臆造 snapshot 号；旧链接 `docs.quiltmc.org` 已无法解析（DNS 失败），文档站在 `wiki.quiltmc.org`
- `diagnose_gradle` 对 Quilt Loom 做真诊断（toolchain / 插件 id）；QSL API 仍用 `search_docs({platform:"quilt"})`

## Decision Flow

```
→ IF 只有 fabric.mod.json 且无 quilt.mod.json / quilt-loom → 这是 Fabric，去 fabric/1.18.2
→ IF quilt.mod.json 或 quilt-loom → 本规则集
```
