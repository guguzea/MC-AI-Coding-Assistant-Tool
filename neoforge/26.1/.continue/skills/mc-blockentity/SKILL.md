---
name: mc-blockentity
description: NeoForge 26.1 mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap-unobfuscated（游戏 jar 已是 Mojang 名）
---

# mc-blockentity（NeoForge 26.1）

本 Skill 只管方块实体。方块侧（`Block` 注册、`BlockBehaviour.Properties`、blockstate）**见同档 `02-block.mdc`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 `BE` = `data/neoforge_26.1/neoforge-docs/26.1/processed/blockentities.md`。

| 项 | NeoForge 26.1 口径 | 出处 |
|---|---|---|
| 类型注册 | `new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))`，经 `DeferredRegister.create(Registries.BLOCK_ENTITY_TYPE, MOD_ID)` 注册 | BE:38, BE:46 |
| 方块挂载 | `extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)` | BE:102, BE:116 |
| Ticker | `getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper` | BE:278, BE:266 |
| 存档 | `saveAdditional(ValueOutput)` / `loadAdditional(ValueInput)` | BE:185, BE:171, BE:149 |
| 客户端同步 | chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(ValueInput)`；方块更新：`getUpdatePacket()` → `ClientboundBlockEntityDataPacket.create(this)` | BE:330, BE:342, BE:376, BE:382 |
| 脏标记 | `setChanged` | BE:199 |

本档语料的文档链接无版本前缀（现行主文档未版本化），所以核签名只能 `search_neoforge_docs version=26.1`，不要拿邻版页顶替。（BE:32）

核不到的签名改口 `search_neoforge_docs version=26.1 query=BlockEntity`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
