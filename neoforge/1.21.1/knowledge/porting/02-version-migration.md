# NeoForge 1.21.1 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent`。

1.21.1 起事件名变成复数 Handlers。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。
