---
name: mc-script-server
description: 基岩版 @minecraft/server Script API。触发词：Script API、@minecraft/server、world.afterEvents、system.run
platforms: [bedrock]
mcVersions: []
communityDocId: ""
---

# @minecraft/server（基岩 Script API）

默认只用 **stable** `@minecraft/server`。用户明确写 `@minecraft/server-beta`、要「最新实验性」、或点名仍属 Beta 的事件（如 `BlockExplodeAfterEvent`）时才允许 Beta。

## Decision Flow

```
Decision: 生成 Script 模块
→ 未点名 Beta → dependencies 写 stable 版本（对照 data/bedrock-docs-status.json 的 scriptApiStable）
→ 点名 Beta → 允许；BP manifest dependencies 用 beta 模块；回复必须写：在世界设置打开 Beta APIs
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
