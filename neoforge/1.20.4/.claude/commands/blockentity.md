---
name: mc-blockentity
description: NeoForge 1.20.4 mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap / NeoForm 官方名（不是 Forge MCP）
---

# mc-blockentity（NeoForge 1.20.4）

本 Skill 只管方块实体。方块侧（`Block` 注册、`BlockBehaviour.Properties`、blockstate）**见同档 `02-block.mdc`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 `BE` = `data/neoforge_1.20.4/neoforge-docs/1.20.4/processed/blockentities.md`。

| 项 | NeoForge 1.20.4 口径 | 出处 |
|---|---|---|
| 类型注册 | `BlockEntityType.Builder.of(MyBE::new, validBlocks).build(null)`（Builder + `build(null)`） | BE:26 |
| 方块挂载 | `EntityBlock` 接口必须在你的 `Block` 上实现 | BE:40 |
| Ticker | `getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`（`BaseEntityBlock` 上有 protected static 版） | BE:95, BE:81, BE:79 |
| 存档 | `saveAdditional(CompoundTag tag)` / `load(CompoundTag tag)` | BE:48, BE:50 |
| 客户端同步 | chunk 加载：`getUpdateTag()`（**无参**）→ `IForgeBlockEntity#handleUpdateTag(CompoundTag)`；方块更新：`getUpdatePacket()` → `ClientboundBlockEntityDataPacket.create(this)` | BE:155, BE:134, BE:167, BE:171 |
| 脏标记 | `BlockEntity#setChanged`（漏调则该 `LevelChunk` 会被跳过） | BE:60 |

本档语料的「Custom Network Message」一节仍写 Forge 口径，自定义包按 06 的 Payload 写。（BE:196）

核不到的签名改口 `search_neoforge_docs version=1.20.4 query=BlockEntity`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
