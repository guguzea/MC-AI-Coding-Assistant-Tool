---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: fabric
version: "1.21.8"
dependencies: []
mappings: yarn
---

# mc-multiblock（1.21.8）

> 一手来源：Yarn 原语类路径 `net/minecraft/util/math/BlockPos`、`net/minecraft/block/BlockState`、`net/minecraft/block/entity/BlockEntity`、`net/minecraft/world/World` 经本档映射库核实存在（`data/fabric_1.21.8/mappings/yarn-mappings.sqlite` 含记录）。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（BlockEntity）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos / World 逐格扫描（方法签名先核实）
→ 状态比对 → BlockState
→ 注册与生命周期 → mc-registry、01-registry.mdc、02-block.mdc
```

## 本档口径（已核实）

- Yarn 全名：`util/math/BlockPos`、`block/BlockState`、`block/entity/BlockEntity`、`world/World`（映射库记录）。

## 反模式

- 把 mojmap 名（如 `Level`）当 Yarn 名用。
- 每帧全量扫描结构。

## 下一步

- 名字核实：`convert_mapping`（to=yarn）/ 本档映射库；反模式库：同档 `knowledge/`。
