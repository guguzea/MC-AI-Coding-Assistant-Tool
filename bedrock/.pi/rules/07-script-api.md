---
description: 07 — Script API 与实验开关
---

# 07 — Script API 与实验开关

默认 **stable** `@minecraft/server`。用户点名 Beta 才允许。

## Decision Flow（禁止一刀切）

```
→ 未点名 Beta → 只生成 stable；不写 Beta 事件
→ 点名 @minecraft/server-beta 或 Beta 事件（如 BlockExplodeAfterEvent）
    → 允许生成；回复必须写「须在世界设置打开 Beta APIs」
    → pack：dependencies 声明 beta 模块
    → 需要 eval 才写 capabilities: ["script_eval"]
    → 禁止 experimentalGameplay、禁止虚构 worldgen/experimental.json
→ min_engine_version < 约 1.19.80：对照该引擎归档，不要倒灌现行 capabilities
→ ≥ 1.19.80：世界实验走 level.dat experiments.gametest；pack 不能替玩家打开
```

滞后：`search_bedrock_docs` 的 docsStatus.stale **不是**拒绝令。
