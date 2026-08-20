# NeoForge 1.21.8 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.21.8/ + 官方 MDK（download_official_mdk 精确 
1.21.8）。  + **官方 API jar 反编译摘要**（`mcp-server/data/loader-api-summaries/1.21.8-neoforge.json`，`decompile-loader-apis.mjs` / `query_loader_api`）。  
**核实优先级**：jar 摘要与反编译 FQCN **高于**本库 `search_neoforge_docs` 缺页（`DOC_NOT_FOUND` 不得把已入库反编译项标成「未核实」）。  
摘要 JSON **必须**含 `mappingsVersion`，否则不得写进本表。clone-audit：与邻档教程骨架相似是预期，误报不算验收失败。

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
| `RegisterClientPayloadHandlersEvent` | **要**（物理客户端 handler 注册） |
| `ClientPacketDistributor.sendToServer` | **要**（C2S） |
| `IPayloadContext` | **要** |
| `ResourceLocation` | ResourceLocation.fromNamespaceAndPath("mymod", "my_data") |
| StreamCodec / type() | 要 |
| `DirectionalPayloadHandler` | **禁止**（本档 jar 无此类；勿从 1.21.5 抄） |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

网络类名来源：`1.21.8-neoforge.json`（mappingsVersion: `parchment-1.21.8-2025.09.14`）。

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

