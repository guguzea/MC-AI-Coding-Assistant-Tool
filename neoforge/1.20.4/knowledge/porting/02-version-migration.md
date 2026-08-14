# NeoForge 1.20.4 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlerEvent`。

1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。
