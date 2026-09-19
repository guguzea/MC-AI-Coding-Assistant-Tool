---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# mc-multiblock（1.15.2）

> 一手来源：本档 docs 语料 `data/forge_1.15.2/forge-docs/1.15.2/processed/blocks_states.md`（:30 BlockState 定义、:36 不可变性、:86 `BlockState#with(IProperty<T>, T)`、:88 `==` 引用相等、:38 复杂状态交 TileEntity）+ `tileentities_tileentity.md:74`（逐字签名 `World#notifyBlockUpdate(BlockPos pos, BlockState oldState, BlockState newState, int flags)`）+ `blocks_blocks.md:34`（世界中方块由 BlockState 表示）。多方块无平台 API——**模式技能**。

## Decision Flow

```
→ 多方块 = 控制器（TileEntity/方块实体）+ 结构校验 + formed 状态
→ 结构探测 → BlockPos/World 逐格扫描（:74 签名可参考）
→ 状态比对 → BlockState 用 == 引用相等（:88 原文）
→ 属性修改 → BlockState#with(IProperty<T>, T)（:86 原文）
→ 注册与生命周期 → mc-registry、01-registry.mdc、02-block.mdc
```

## 本档口径（已核实，均出自本档语料）

- `BlockState` / `World` / `BlockPos` / TileEntity 名与语义在本档 blocks_states / tileentities / blocks_blocks 页逐字在档。
- 世界中方块由 BlockState 表示、行为由其定义（blocks_blocks:34 原文）。

## 反模式

- 用 BlockState 属性表达整个多方块形成状态（blocks_states:38 口径：复杂状态交 TileEntity）。
- 每帧全量扫描结构（结构变更时才重扫 + notifyBlockUpdate）。

## 下一步

- 语料全文：`get_doc_full`（blocks_states / tileentities_tileentity / blocks_blocks，version=1.15.2）；反模式库：`forge/1.15.2/knowledge/antipatterns/`。
