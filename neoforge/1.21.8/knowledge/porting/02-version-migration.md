# NeoForge 1.21.8 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent`。

1.21.8 的关键分界是 DataGen 拆成 GatherDataEvent.Client 与 Server，以及 createDatapackRegistryObjects / createProvider。
