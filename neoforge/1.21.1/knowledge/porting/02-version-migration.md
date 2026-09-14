# NeoForge 1.21.1 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent`。

复数 Handlers 事件名的分界在 **1.20.5 / 1.20.6**，不是本档：本仓语料实测 1.20.4 仍是单数 `RegisterPayloadHandlerEvent`（`data/neoforge_1.20.4/neoforge-docs/1.20.4/processed/networking_payload.md:9`），1.20.6 已改复数 `RegisterPayloadHandlersEvent`（`data/neoforge_1.20.6/neoforge-docs/1.20.6/processed/networking_payload.md:9`，同页 :85 `registrar.playBidirectional(`）；本仓无 `data/neoforge_1.20.5` 主文档语料，故分界只钉到这一档距。本档 1.21.1 沿用复数形态。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。
