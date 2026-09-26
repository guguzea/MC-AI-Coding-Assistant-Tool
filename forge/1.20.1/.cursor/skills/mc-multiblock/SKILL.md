---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.20.1"
dependencies: []
mappings: parchment
---

# mc-multiblock（1.20.1）

> 一手来源：原语类名 `BlockPos` / `BlockEntity` / `Level` / `BlockEntityType` / `VoxelShape` 经 `query_api`（version=1.20.1）核实存在。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（BlockEntity，经 BlockEntityType 注册）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/Level 逐格扫描（方法签名先核实）
→ 整体外形/碰撞 → VoxelShape
→ 客户端/服务端分离 → 08-client-server.mdc
```

## 本档口径（已核实）

- 原语：`BlockPos` / `BlockEntity` / `Level` / `BlockEntityType` / `VoxelShape`（query_api found 全命中）。

## 反模式

- 每帧全量扫描结构（结构变更时才重扫）。
- 凭记忆写扫描/注册方法链。

## 下一步

- 原语核实：`query_api`（version=1.20.1）；反模式库：`forge/1.20.1/knowledge/antipatterns/`。
