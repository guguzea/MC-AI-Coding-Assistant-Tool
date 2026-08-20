# NeoForge 26.1 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/ + 官方 MDK（26.1.1/26.1.2 均同时提供 
ModDevGradle 与 NeoGradle，必须传 buildPlugin。不为 26.1.1 单造规则树。）。 + **官方 API jar 反编译摘要**（`mcp-server/data/loader-api-summaries/26.1-neoforge.json`，`decompile-loader-apis.mjs` / `query_loader_api`）。  
**核实优先级**：jar 摘要与反编译 FQCN **高于**本库 `search_neoforge_docs` 缺页（`DOC_NOT_FOUND` 不得把已入库反编译项标成「未核实」）。  
摘要 JSON **必须**含 `mappingsVersion`，否则不得写进本表。clone-audit：与邻档教程骨架相似是预期，误报不算验收失败。

## 入口

| 符号 | 口径 |
|---|---|
| `@Mod` | 要 |
| `public ExampleMod(IEventBus modEventBus, ModContainer modContainer)` | 要 |
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
| `RegisterClientPayloadHandlersEvent` | **要**（物理客户端 handler 注册） |
| `ClientPacketDistributor.sendToServer` | **要**（C2S） |
| `IPayloadContext` | **要** |
| `Identifier` | Identifier.fromNamespaceAndPath("mymod", "my_data") |
| StreamCodec / type() | 要 |
| `DirectionalPayloadHandler` | **禁止**（本档 jar 无此类） |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

网络类名来源：`26.1-neoforge.json`（mappingsVersion: `mojmap-unobfuscated-26.1`）。

## 其它

- DataGen：GatherDataEvent.Client / GatherDataEvent.Server
- Java 25；mojmap-unobfuscated（游戏 jar 已是 Mojang 名）
- 26.1 去混淆 + Identifier。禁止 Yarn。query_api 无本版索引。
- 26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。官方 /docs/26.2/ 仍 404，禁止克隆本档冒充 26.2。

## 对照签字

| 编号 | 对照 URL | 抓取日 | 结论 |
| 03 | https://docs.neoforged.net/docs/items/ | 2026-08-16 | 已按该版文档改写（setId + unary + ItemStackTemplate） |
| 04 | https://docs.neoforged.net/docs/entities/ | 2026-08-16 | 已按该版文档改写（Identifier + registerEntityType） |
| 08 | https://docs.neoforged.net/docs/concepts/sides/ | 2026-08-16 | 已按该版文档改写（FMLEnvironment#getDist） |

