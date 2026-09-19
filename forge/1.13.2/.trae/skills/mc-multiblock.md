---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-multiblock（1.13.2）

> 一手来源：原语类名 `BlockPos` / `BlockState` / `World` 经 `query_api`（version=1.13.2）核实存在。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（方块实体）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/World 逐格扫描 + BlockState 比对（具体方法签名先核实再写）
→ 1.13.2 注意 → Block 才有物品形态需另注册 ItemBlock（见 mc-resourcepack 反模式）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 原语：`BlockPos` / `BlockState` / `World`（query_api found）。
- 控制器方块实体类名本档语料无专页——写前核实。

## 反模式

- 每帧全量扫描结构（结构变更时才重扫）。
- 凭记忆写方块实体类链。

## 下一步

- 原语核实：`query_api`（version=1.13.2）；反模式库：`forge/1.13.2/knowledge/antipatterns/`。
