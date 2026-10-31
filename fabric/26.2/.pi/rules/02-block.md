---
description: 02 — 方块（26.2）
---

# 02 — 方块（26.2）

逐步：`26.2/develop_blocks_first-block`、方块状态 `26.2/develop_blocks_blockstates`、模型 `26.2/develop_blocks_block-models`、方块实体 `26.2/develop_blocks_block-entities`、容器菜单 `26.2/develop_blocks_container-menus`。

**26.2 的 id 类**（26.1.2 只有一个 id 类，别照抄）：

- `ModBlockIds`：方块 `ResourceKey`（`26.2/develop_blocks_first-block:45-47`）
- `ModBlockItemIds`：对应 BlockItem 的 `ResourceKey`（同页 `:30-32`）
- 新增方块时两边都要加（`26.2/develop_blocks_block-entities:58` 明写「add a key to `ModBlockItemIds`」）

构造用 `BlockBehaviour.Properties`；可 `ofFullCopy` 复制原版方块。注册时可同时生成 `BlockItem`。创造栏用 `Block.asItem()`。物品栏外观需要 **client item**（`assets/<modid>/items/`）。掉落表 `data/<modid>/loot_table/blocks/`。推荐工具标签 `data/minecraft/tags/block/mineable/`。需要正确工具才掉落时追加 `.requiresCorrectToolForDrops()`，并加 `needs_stone_tool` / `needs_iron_tool` / `needs_diamond_tool`。

## Decision Flow

```
→ 普通方块 → first-block 页的 ModBlockIds + ModBlockItemIds + Block/BlockItem 注册
→ 模型/方块状态 → block-models + blockstates JSON
→ 方块实体 → block-entities；缺签名则停，search_fabric_docs
→ 禁止用 Forge DeferredRegister 记忆顶上
```
