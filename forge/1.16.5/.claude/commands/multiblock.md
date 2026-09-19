---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-multiblock（1.16.5）

> 一手来源：原语类名 `BlockPos` / `World` / `VoxelShape` 经 `query_api`（version=1.16.5）核实存在（官方命名；`BlockState` 在本档索引 found=false，类名用前先核实）。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（方块实体）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/World 逐格扫描（方法签名先核实）
→ 碰撞/外形 → VoxelShape（query_api 已钉；多方块整体外形用它表达）
→ 注册与生命周期 → mc-registry、01-registry.mdc、02-block.mdc
```

## 本档口径（已核实）

- 原语：`BlockPos` / `World` / `VoxelShape`（query_api found）。
- 控制器方块实体类名本档索引未命中（BlockEntity@1.16.5 found=false）——类名核实后再写。

## 反模式

- 每帧全量扫描结构（结构变更时才重扫）。
- 凭记忆写类链（尤其本档索引未命中的类名）。

## 下一步

- 原语核实：`query_api`（version=1.16.5）；反模式库：`forge/1.16.5/knowledge/antipatterns/`。
