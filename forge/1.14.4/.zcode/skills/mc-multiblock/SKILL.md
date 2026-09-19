---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-multiblock（1.14.4）

> 一手来源：本档 docs 语料 `data/forge_1.14.4/forge-docs/1.14.4/processed/blocks_states.md`（:30 「This unique triple is called a `BlockState`」、:36 不可变性、:86 `BlockState#with(IProperty<T>, T)`、:88 可用 `==` 引用相等比较、:38 「any other situation is better off with having a TileEntity」）+ `tileentities_tileentity.md:74`（逐字签名 `World#notifyBlockUpdate(BlockPos pos, BlockState oldState, BlockState newState, int flags)`）。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（TileEntity，:38 语料口径：复杂状态交给 TileEntity 而非 BlockState 属性）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/World 逐格扫描（:74 的 notifyBlockUpdate 签名含三参形态可参考）
→ 状态比对 → BlockState 用 == 引用相等即可（:88 原文：所有组合启动期生成、不可变）
→ 属性修改 → BlockState#with(IProperty<T>, T)（:86 原文）
→ 注册与生命周期 → mc-registry、01-registry.mdc、02-block.mdc
```

## 本档口径（已核实，均出自本档语料）

- `BlockState` 不可变、组合启动期全生成、可用 `==` 比较（blocks_states:36/86/88）。
- 复杂状态应放 TileEntity 而不是堆 BlockState 属性（:38 口径——正是多方块控制器的选型依据）。
- `World#notifyBlockUpdate(BlockPos, BlockState, BlockState, int)` 逐字在档（tileentities:74）——结构变更后同步用。

## 反模式

- 用 BlockState 属性表达整个多方块的形成状态（:38 口径：交给 TileEntity）。
- 每帧全量扫描结构（结构变更时才重扫，变更后 notifyBlockUpdate）。

## 下一步

- 语料全文：`get_doc_full`（blocks_states / tileentities_tileentity，version=1.14.4）；反模式库：`forge/1.14.4/knowledge/antipatterns/`。
