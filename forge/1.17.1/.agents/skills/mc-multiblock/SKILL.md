---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

# mc-multiblock（1.17.1）

> 一手来源：原语类名 `BlockPos` / `BlockEntity` / `Level` 经 `query_api`（version=1.17.1）核实存在（官方命名；1.17 起 World 改名 Level）。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（BlockEntity）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/Level 逐格扫描（方法签名先核实）
→ 客户端/服务端分离 → 08-client-server.mdc
→ 注册与生命周期 → mc-registry、01-registry.mdc、02-block.mdc
```

## 本档口径（已核实）

- 原语：`BlockPos` / `BlockEntity` / `Level`（query_api found）。
- 1.17 起世界对象名是 **Level**（不是 World）。

## 反模式

- 写 `World`（1.16 及以前的名字；1.17+ 是 Level）。
- 每帧全量扫描结构。

## 下一步

- 原语核实：`query_api`（version=1.17.1）；反模式库：`forge/1.17.1/knowledge/antipatterns/`。
