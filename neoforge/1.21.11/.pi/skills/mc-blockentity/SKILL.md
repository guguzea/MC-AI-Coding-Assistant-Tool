---
name: mc-blockentity
description: NeoForge 1.21.11 mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.11"
dependencies: []
mappings: mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）
---

# mc-blockentity（NeoForge 1.21.11）

本 Skill 只管方块实体。方块侧（`Block` 注册、`BlockBehaviour.Properties`、blockstate）**见同档 `02-block.mdc`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 `BE` = `data/neoforge_1.21.11/neoforge-docs/1.21.11/processed/blockentities.md`。

| 项 | NeoForge 1.21.11 口径 | 出处 |
|---|---|---|
| 类型注册 | `new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))` | BE:46 |
| 方块挂载 | `extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)` | BE:102, BE:116 |
| Ticker | `getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper` | BE:278, BE:266 |
| 存档 | `saveAdditional(ValueOutput)` / `loadAdditional(ValueInput)` | BE:185, BE:171, BE:149 |
| 客户端同步 | chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(ValueInput)`；方块更新：`getUpdatePacket()` | BE:330, BE:342, BE:376 |
| 脏标记 | `setChanged` | BE:199 |

本档与 1.21.8 同为 value I/O 存储，且示例已是 `new BlockEntityType<>(...)` 构造器形态；资源 id 类型 / 去混淆差异看本档 `00-project-setup.mdc`，不在本 Skill 复述。（BE:46, BE:171）

核不到的签名改口 `search_neoforge_docs version=1.21.11 query=BlockEntity`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
