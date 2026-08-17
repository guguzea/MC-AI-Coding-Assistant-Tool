---
name: mc-registry
description: Fabric 26.1.2 mc-registry。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 注册（Fabric 26.1.2）

文档：`26.1.2/develop_items_first-item`、`26.1.2/develop_blocks_first-block`。去混淆官方名。禁止 DeferredRegister。禁止 Yarn。

## Decision Flow

```
→ 物品/方块 → Registry.register(Registries.*, Identifier.fromNamespaceAndPath(MOD_ID, name), object)
→ 创造栏 → CreativeModeTabEvents.modifyOutputEvent
→ Mixin → fabric.mixins.json，不在 onInitialize 里注册
→ 客户端渲染 → ClientModInitializer
```

query_api 对本版无索引。search_fabric_docs version=26.1.2。
