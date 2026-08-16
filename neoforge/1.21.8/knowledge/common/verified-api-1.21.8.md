# NeoForge 1.21.8 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.21.8/ + 官方 MDK（download_official_mdk 精确 1.21.8）。  
反编译：`scripts/validate-rules-against-cache.mjs` 从 `$MC_SKILL_CACHE` 抽签名回填。摘要 JSON **必须**含 `mappingsVersion`，否则不得覆盖本表。  
clone-audit：与邻档教程骨架相似是预期（换类名），**误报不算验收失败**；本表即源码/文档签字。

## 入口

| 符号 | 口径 |
|---|---|
| `@Mod` | 要 |
| `public ExampleMod(IEventBus modEventBus, ModContainer modContainer) — 以该版 MDK 为准` | 要 |
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
| `ResourceLocation` | ResourceLocation.fromNamespaceAndPath("mymod", "my_data") |
| StreamCodec / type() | 要 |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

## 其它

- DataGen：GatherDataEvent.Client / GatherDataEvent.Server（已拆分）
- Java 21；mojmap
- 1.21.8 文档 resources 页已用 GatherDataEvent.Client；网络配置任务仍见 ResourceLocation.fromNamespaceAndPath。
- 1.21.8 的关键分界是 DataGen 拆成 GatherDataEvent.Client 与 Server，以及 createDatapackRegistryObjects / createProvider。

## 对照签字

| 编号 | 对照 URL | 抓取日 | 结论 |
| 03 | https://docs.neoforged.net/docs/1.21.8/items/ | 2026-08-16 | 已按该版文档改写（DeferredItem + setNoCombineRepair） |
| 04 | https://docs.neoforged.net/docs/1.21.8/entities/ | 2026-08-16 | 本编号 API 与邻档相同，非未核克隆 |
| 08 | https://docs.neoforged.net/docs/1.21.8/concepts/sides/ | 2026-08-16 | 已按该版文档改写（FMLEnvironment.dist + @Mod dist） |

