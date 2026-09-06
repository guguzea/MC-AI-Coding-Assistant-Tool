---
name: mc-blockentity
description: NeoForge 1.21.3 mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.3"
dependencies: []
mappings: mojmap
---

# mc-blockentity（NeoForge 1.21.3）

本 Skill 只管方块实体。方块侧（`Block` 注册、`BlockBehaviour.Properties`、blockstate）**见同档 `02-block.mdc`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 `BE` = `data/neoforge_1.21.3/neoforge-docs/1.21.3/processed/blockentities.md`。

| 项 | NeoForge 1.21.3 口径 | 出处 |
|---|---|---|
| 类型注册 | `new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))`——**Builder 已不再是本档示例** | BE:46 |
| 方块挂载 | `extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)` | BE:96, BE:110 |
| Ticker | `getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper` | BE:225, BE:213 |
| 存档 | `saveAdditional(CompoundTag, HolderLookup.Provider)` / `loadAdditional(CompoundTag, HolderLookup.Provider)` | BE:179, BE:165 |
| 客户端同步 | chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(CompoundTag, HolderLookup.Provider)`；方块更新：`getUpdatePacket()` | BE:277, BE:293, BE:331 |
| 脏标记 | `setChanged` | BE:193 |

1.21.3 起语料示例直接用构造器建 `BlockEntityType`，不要抄 1.21.1 的 `Builder.of(...).build(null)`。（BE:46）

核不到的签名改口 `search_neoforge_docs version=1.21.3 query=BlockEntity`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
