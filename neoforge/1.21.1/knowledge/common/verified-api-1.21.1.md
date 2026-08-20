# NeoForge 1.21.1 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.21.1/ + 官方 MDK（download_official_mdk 
platform=neoforge minecraftVersion=1.21.1 并传 buildPlugin）。   + **官方 API jar 反编译摘要**（`mcp-server/data/loader-api-summaries/1.21.1-neoforge.json`，`decompile-loader-apis.mjs` / `query_loader_api`）。  
**核实优先级**：jar 摘要与反编译 FQCN **高于**本库 `search_neoforge_docs` 缺页（`DOC_NOT_FOUND` 不得把已入库反编译项标成「未核实」）。  
摘要 JSON **必须**含 `mappingsVersion`，否则不得写进本表。clone-audit：与邻档教程骨架相似是预期，误报不算验收失败。

## 入口

| 符号 | 口径 |
|---|---|
| `@Mod` | 要 |
| `public ExampleMod(IEventBus modEventBus)（可再加 ModContainer，以该版 MDK 为准）` | 要 |
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
| `DirectionalPayloadHandler` | **要**（双向包；jar `1.21.1-neoforge.json`） |
| `IPayloadContext` | **要** |
| `ResourceLocation` | ResourceLocation.fromNamespaceAndPath("mymod", "my_data") |
| StreamCodec / type() | 要 |
| `RegisterClientPayloadHandlersEvent` | **禁止**（本档 jar 无此类；1.21.8+ 才有） |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

## 其它

- DataGen：GatherDataEvent（尚未拆成 Client/Server 子类）
- Java 21；mojmap
- 本档用 ResourceLocation.fromNamespaceAndPath，不是 new ResourceLocation，也不是 Identifier。

## 对照签字

| 编号 | 对照 URL | 抓取日 | 结论 |
| 03 | https://docs.neoforged.net/docs/1.21.1/items/ | 2026-08-16 | 已按该版文档改写（Supplier + 无 setId 必填） |
| 04 | — | — | 无独立 entities 页（DOC_NOT_FOUND）；04-entity 为 stub |
| 08 | https://docs.neoforged.net/docs/1.21.1/concepts/sides/ | 2026-08-16 | 已按该版文档改写（FMLEnvironment.dist + @Mod dist） |

- 1.21.1 起事件名变成复数 Handlers。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。
