---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.20.4"
dependencies: []
mappings: parchment
---

# mc-multiblock（1.20.4）

> 一手来源：原语类名 `BlockPos` / `Level` 经 `query_api`（version=1.20.4）核实存在；`BlockEntity` / `BlockEntityType` 已在 1.20.1 档钉（同代机制，本档引用前再核一次）。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（BlockEntity）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/Level 逐格扫描（方法签名先核实）
→ 客户端/服务端分离 → 08-client-server.mdc
→ 注册与生命周期 → mc-registry、01-registry.mdc、02-block.mdc
```

## 本档口径（已核实）

- 原语：`BlockPos` / `Level`（query_api found 本档）；`BlockEntity` 系同代在档（1.20.1 已钉）。

## 反模式

- 每帧全量扫描结构（结构变更时才重扫）。
- 凭记忆写扫描/注册方法链。

## 下一步

- 原语核实：`query_api`（version=1.20.4）；反模式库：`forge/1.20.4/knowledge/antipatterns/`。
