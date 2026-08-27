---
name: mc-entity
description: NeoForge 1.20.4 mc-entity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
docsTool: search_neoforge_docs
---

# mc-entity（NeoForge 1.20.4）

Java 17。资源 id：new ResourceLocation(...)（不是 fromNamespaceAndPath，也不是 Identifier）。核实表：knowledge/common/verified-api-1.20.4.md。

注册：DeferredRegister.Entities / DeferredRegister.create(Registries.ENTITY_TYPE, MODID)。EntityType.Builder 最后 .build(...) 的 ResourceKey 参数以该版 entities 页为准。

渲染只放客户端（@EventBusSubscriber Dist.CLIENT）。不要在服务端加载 Renderer。不要抄 Forge 1.12 EntityRegistry。

生成、属性、生成蛋：必须 search_neoforge_docs query=entities version=1.20.4。核不到则禁止输出。文档：https://docs.neoforged.net/docs/1.20.4/entities/

反面：RegistryObject、SimpleChannel、邻档类名、NeoForgeAddonPlugin。
