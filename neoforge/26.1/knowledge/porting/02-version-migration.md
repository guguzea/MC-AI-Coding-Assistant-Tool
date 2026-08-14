# NeoForge 26.1 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent`。

26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。官方 /docs/26.2/ 仍 404，禁止克隆本档冒充 26.2。
