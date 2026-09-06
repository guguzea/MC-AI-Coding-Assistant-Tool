---
name: mc-blockentity
description: NeoForge 1.21.1 mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-blockentity（NeoForge 1.21.1）

本 Skill 只管方块实体。方块侧（`Block` 注册、`BlockBehaviour.Properties`、blockstate）**见同档 `02-block.mdc`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 `BE` = `data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/blockentities.md`。

| 项 | NeoForge 1.21.1 口径 | 出处 |
|---|---|---|
| 类型注册 | `BlockEntityType.Builder.of(MyBlockEntity::new, ...blocks).build(null)` | BE:46, BE:62 |
| 方块挂载 | `extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)` | BE:95, BE:109 |
| Ticker | `getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper` | BE:224, BE:212 |
| 存档 | `saveAdditional(CompoundTag, HolderLookup.Provider)` / `loadAdditional(CompoundTag, HolderLookup.Provider)` | BE:178, BE:164 |
| 客户端同步 | chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(CompoundTag, HolderLookup.Provider)`；方块更新：`getUpdatePacket()` | BE:276, BE:292, BE:330 |
| 脏标记 | `setChanged` | BE:192 |

`load` 不再是本档覆写点，覆写 `loadAdditional`。（BE:142）

核不到的签名改口 `search_neoforge_docs version=1.21.1 query=BlockEntity`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
