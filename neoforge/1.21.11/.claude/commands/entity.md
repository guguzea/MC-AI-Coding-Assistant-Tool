---
name: mc-entity
description: NeoForge 1.21.11 mc-entity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.11"
dependencies: []
mappings: mojmap
docsTool: search_neoforge_docs
---

# mc-entity（NeoForge 1.21.11）

Java 21。资源 id：Identifier.fromNamespaceAndPath（不要再写 ResourceLocation.fromNamespaceAndPath）。核实表：knowledge/common/verified-api-1.21.11.md。

注册：DeferredRegister.Entities / DeferredRegister.createEntities。EntityType.Builder.build 用 ResourceKey.create(Registries.ENTITY_TYPE, Identifier.fromNamespaceAndPath(...))；可走 registerEntityType 捷径（以该版 entities 页为准）。

渲染只放客户端（@EventBusSubscriber Dist.CLIENT）。不要在服务端加载 Renderer。不要抄 Forge 1.12 EntityRegistry。

生成、属性、生成蛋：必须 search_neoforge_docs query=entities version=1.21.11。核不到则禁止输出。文档：https://docs.neoforged.net/docs/1.21.11/entities/

反面：RegistryObject、SimpleChannel、邻档类名、NeoForgeAddonPlugin。
