---
description: 07 — Script API 与实验开关
---

# 07 — Script API 与实验开关

默认 **stable** `@minecraft/server`。用户点名 Beta 才允许。

## Decision Flow（禁止一刀切）

```
→ 未点名 Beta → 只生成 stable；不写 Beta 事件
→ 点名 @minecraft/server-beta 或 Beta 事件
    → 允许生成；回复必须写「须在世界设置打开 Beta APIs」
    → pack：dependencies 声明 beta 模块
    → 需要 eval → capabilities 写法**未核实**（Learn pack-manifest 无 `script_eval`）
    → 禁止 experimentalGameplay、禁止虚构 worldgen/experimental.json
→ min_engine_version < 约 1.19.80：对照该引擎归档，不要倒灌现行 capabilities
→ ≥ 1.19.80：世界实验开关**未核实**（勿写死 `level.dat experiments.gametest`）；pack 不能替玩家打开
→ UI → 只用 stable @minecraft/server-ui（stable/script-server-ui）
```

## 已核实约束

- BP manifest：`modules` 含 `type: script`、`language: javascript`、`entry`（scaffold：`scripts/main.js`）；`dependencies` 含 `module_name: "@minecraft/server"`。
- 版本号读 `data/bedrock-docs-status.json` 的 `scriptApiStable`（不要写死旧 1.x）。`docsStatus.stale` **不是**拒绝令。
- 事件概述：`stable/world-after-events`、`stable/system-after-events`。类/模块：`stable/script-server`、`stable/script-api-intro`。
- 库 Skill：`knowledge/libs/bedrock-only/mc-script-server`、`mc-script-ui`。禁止把 CCA/Trinkets/GeckoLib 当基岩教程。

滞后：`search_bedrock_docs` 的 docsStatus.stale 不是拒绝令。

## 文档

`stable/script-api-intro`、`stable/script-server`、`stable/world-after-events`、`stable/system-after-events`、`stable/script-server-ui`、`stable/experimental-features-toggle`。
