---
name: mc-script-server
description: 基岩版 @minecraft/server Script API。触发词：Script API、@minecraft/server、world.afterEvents、system.run
platforms: [bedrock]
mcVersions: []
communityDocId: authored/bedrock-script-api-primer
mappings: hint（基岩 Script API，无 Java 映射层）
---

# @minecraft/server（基岩 Script API）

默认只用 **stable** `@minecraft/server`。用户明确写 `@minecraft/server-beta`（**不存在此发布名**：真实形态 = `@minecraft/server` + `version: "beta"`，npm dist-tag 与 Learn 模块页同口径）、要「最新实验性」、或点名仍属 Beta 的 API 时才允许 Beta。
**Beta 判定法**：下载该 API 的 stable 包（`npm pack @minecraft/server@<latest>`）与 beta 包对照，**只在 beta 包里出现的才是 beta-only**（两个自证读数：stable 包 `index.d.ts` 全域 **0** 条 `@beta`、beta 包 **110** 条；对照臂：`BlockComponentTypes.EntityStorage` 在 beta 包带 `@beta`、stable 包查无）。
⚠️ `BlockExplodeAfterEvent` 属 stable 面（stable 与 beta 包都有）——**不是** Beta API，不要当 Beta 事件生成。

## Decision Flow

```
Decision: 生成 Script 模块
→ 未点名 Beta → dependencies 写 stable 版本（对照 data/bedrock-docs-status.json 的 scriptApiStable）
→ 点名 Beta → 允许；BP manifest dependencies 写 module_name `@minecraft/server` + version `"beta"`；回复必须写：在世界设置打开 Beta APIs
→ 需要 eval → 才写 capabilities: ["script_eval"]
→ 禁止："experimentalGameplay": true、虚构 worldgen/experimental.json
→ 不要用 Java query_api / Yarn / Mixin
```

## 官方文档

- Microsoft Learn Script API：用 MCP `search_bedrock_docs`（带 docsStatus 滞后 Warning）
- 实验开关：Learn Experimental Features Toggle（游戏设置 → Experiments）；NBT 名 `experiments.gametest`

## 常见错误

- 以为 pack JSON 能替玩家打开世界 Beta APIs
- 把 Java Fabric 事件总线套到 Script API
- 未点名就生成 Beta 事件
