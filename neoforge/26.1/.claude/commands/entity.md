---
name: mc-entity
description: NeoForge 26.1 mc-entity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap-unobfuscated（游戏 jar 已是 Mojang 名）
docsTool: search_neoforge_docs
---

# mc-entity（NeoForge 26.1）

Java 25。资源 id：Identifier.fromNamespaceAndPath（禁止 Yarn；query_api 无本版索引）。核实表：knowledge/common/verified-api-26.1.md。

注册：DeferredRegister.Entities / DeferredRegister.createEntities。EntityType.Builder.build 用 ResourceKey.create(Registries.ENTITY_TYPE, Identifier.fromNamespaceAndPath(...))；可走 registerEntityType 捷径。

渲染只放客户端（@EventBusSubscriber Dist.CLIENT）。不要在服务端加载 Renderer。不要抄 Forge 1.12 EntityRegistry。

生成、属性、生成蛋：必须 search_neoforge_docs query=entities version=26.1。核不到则禁止输出。文档：https://docs.neoforged.net/docs/entities/

反面：RegistryObject、SimpleChannel、邻档类名、NeoForgeAddonPlugin。
