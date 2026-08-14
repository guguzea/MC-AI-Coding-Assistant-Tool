# NeoForge 1.21.11 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.21.11/ + 官方 MDK（download_official_mdk 精确 1.21.11）。  
反编译：`scripts/validate-rules-against-cache.mjs` 从 `$MC_SKILL_CACHE` 抽签名回填。摘要 JSON **必须**含 `mappingsVersion`，否则不得覆盖本表。  
clone-audit：与邻档教程骨架相似是预期（换类名），**误报不算验收失败**；本表即源码/文档签字。

## 入口

| 符号 | 口径 |
|---|---|
| `@Mod` | 要 |
| `IEventBus + 可选 ModContainer（以 MDK 为准）` | 要 |
| `NeoForgeAddonPlugin` | **不存在，禁止输出** |
| 元数据 | neoforge.mods.toml |

## 注册

| 符号 | 口径 |
|---|---|
| `DeferredRegister.createBlocks/createItems` | MDK |
| `DeferredBlock` / `DeferredItem` / `DeferredHolder` | MDK |
| `RegisterEvent` | 文档备选 |
| Forge `RegistryObject` | 不是本档教程类型 |

## 网络

| 符号 | 口径 |
|---|---|
| `RegisterPayloadHandlersEvent` | **要** |
| `PayloadRegistrar` | **要** |
| `IPayloadContext` | **要** |
| `Identifier` | Identifier.fromNamespaceAndPath("mymod", "my_data") |
| StreamCodec / type() | 要 |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

## 其它

- DataGen：GatherDataEvent.Client / Server
- Java 21；mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）
- 1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。
- 1.21.11 文档把 ResourceLocation 换成 Identifier。Primer 26.1 才是下一跳。
