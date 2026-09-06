---
name: mc-blockentity
description: NeoForge 1.21.8 mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.8"
dependencies: []
mappings: mojmap
---

# mc-blockentity（NeoForge 1.21.8）

本 Skill 只管方块实体。方块侧（`Block` 注册、`BlockBehaviour.Properties`、blockstate）**见同档 `02-block.mdc`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 `BE` = `data/neoforge_1.21.8/neoforge-docs/1.21.8/processed/blockentities.md`。

| 项 | NeoForge 1.21.8 口径 | 出处 |
|---|---|---|
| 类型注册 | `new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))` | BE:46 |
| 方块挂载 | `extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)` | BE:102, BE:116 |
| Ticker | `getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper` | BE:278, BE:266 |
| 存档 | `saveAdditional(ValueOutput)` / `loadAdditional(ValueInput)`——**value I/O，不再是 CompoundTag** | BE:185, BE:171, BE:149 |
| 客户端同步 | chunk 加载：`getUpdateTag(HolderLookup.Provider)` 仍返回 `CompoundTag`，收包侧 `handleUpdateTag(ValueInput)`；方块更新：`getUpdatePacket()` | BE:330, BE:342, BE:376 |
| 脏标记 | `setChanged` | BE:199 |

本档分界是存储换成 value I/O（`ValueInput` / `ValueOutput`）；同步 tag 仍是 `CompoundTag`，别把两侧混成一个签名。（BE:149, BE:330）

核不到的签名改口 `search_neoforge_docs version=1.21.8 query=BlockEntity`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
