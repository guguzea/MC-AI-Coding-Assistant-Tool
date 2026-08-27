---
description: 02 — 方块
---

# 02 — 方块

来源：https://github.com/FabricMC/fabric-docs `versions/26.1.2/develop/blocks/first-block.md`

逐步：`26.1.2/develop_blocks_first-block`、模型 `26.1.2/develop_blocks_block-models`、方块实体 `26.1.2/develop_blocks_block-entities`。

构造用 `BlockBehaviour.Properties`；可 `ofFullCopy` 复制原版方块。注册时可同时生成 `BlockItem`。创造栏用 `Block.asItem()`。物品栏外观需要 **client item**（`assets/<modid>/items/`）。掉落表 `data/<modid>/loot_table/blocks/`。推荐工具标签 `data/minecraft/tags/block/mineable/`。需要正确工具才掉落时追加 `.requiresCorrectToolForDrops()`，并加 `needs_stone_tool` / `needs_iron_tool` / `needs_diamond_tool`。

## Decision Flow

```
→ 普通方块 → first-block 页的 Block + BlockItem 注册
→ 模型/方块状态 → block-models + blockstates JSON
→ 方块实体 → block-entities；缺签名则停，search_fabric_docs
→ 禁止用 Forge DeferredRegister 记忆顶上
```
