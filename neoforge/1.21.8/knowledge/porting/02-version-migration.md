# NeoForge 1.21.8 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent`。

DataGen 拆成 GatherDataEvent.Client 与 Server（含 createDatapackRegistryObjects / createProvider）的分界**不晚于 1.21.5**、不是本档引入：本仓 raw 计数 `GatherDataEvent.Client` 在 1.21.3 = 0、1.21.5 = 33（`data/neoforge_1.21.5/neoforge-docs/1.21.5/processed/resources.md:92` 已拆；反例 `data/neoforge_1.21.3/neoforge-docs/1.21.3/processed/resources.md:113` 仍是裸 `GatherDataEvent`），与 `neoforge/1.21.5/knowledge/porting/02-version-migration.md` 同值。本档只沿用该已拆形态。
