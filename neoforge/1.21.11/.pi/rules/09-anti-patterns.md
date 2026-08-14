---
description: 09 — 反模式（NeoForge 1.21.11）
---

# 09 — 反模式（NeoForge 1.21.11）

| 错误 | 正确 |
|---|---|
| `NeoForgeAddonPlugin` | `@Mod` + `IEventBus + 可选 ModContainer（以 MDK 为准）` |
| Forge `SimpleChannel` / `IMessage` | `RegisterPayloadHandlersEvent` |
| `RegistryObject` 当本档教程类型 | `DeferredBlock` / `DeferredItem` / `DeferredHolder` |
| `list_forge_versions` | `list_neoforge_versions` |
| 读邻档 00–10 | 只读 `neoforge/1.21.11/` |
| 无 `mappingsVersion` 的反编译摘要 | 视为无效 |
| 把 26.1 Identifier 规则提前灌进本档（仅 1.21.11/26.1 用 Identifier） | 1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。 |

未建档版本 1.20.1/1.20.6/1.21.5/1.21.10：禁止用本档顶上，改口 `search_neoforge_docs`。
