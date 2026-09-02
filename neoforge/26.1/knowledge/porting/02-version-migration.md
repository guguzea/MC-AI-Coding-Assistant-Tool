# NeoForge 26.1 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent`。

26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。26.2 不是「未发布」：maven 26.2 线已构建到 26.2.0.75（2026-09-02 实读 maven.neoforged.net），官方 Primer 也有 26.2 迁移页（/primer/docs/26.2/ 返回 200，本仓已入库 data/neoforge_primers/26.2.md）。但官方主文档站不按版本分线——/docs/26.2/ 与 /docs/26.1/ 同样 404，现行主文档是未版本化的 /docs/；本仓也没有 26.2 规则树与主文档语料，禁止把本档克隆成 26.2。
