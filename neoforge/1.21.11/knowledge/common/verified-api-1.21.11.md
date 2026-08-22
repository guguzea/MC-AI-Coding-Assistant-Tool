# NeoForge 1.21.11 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.21.11/ + 官方 MDK（download_official_mdk 精
确 1.21.11）。   + **官方 API jar 反编译摘要**（`mcp-server/data/loader-api-summaries/1.21.11-neoforge.json`，`decompile-loader-apis.mjs` / `query_loader_api`）。  
**核实优先级**：jar 摘要与反编译 FQCN **高于**本库 `search_neoforge_docs` 缺页（`DOC_NOT_FOUND` 不得把已入库反编译项标成「未核实」）。  
摘要 JSON **必须**含 `mappingsVersion`，否则不得写进本表。clone-audit：与邻档教程骨架相似是预期，误报不算验收失败。

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
| `RegisterClientPayloadHandlersEvent` | **要**（物理客户端 handler 注册） |
| `ClientPacketDistributor.sendToServer` | **要**（C2S） |
| `IPayloadContext` | **要** |
| `Identifier` | Identifier.fromNamespaceAndPath("mymod", "my_data") |
| StreamCodec / type() | 要 |
| `DirectionalPayloadHandler` | **禁止**（本档 jar 无此类） |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

网络类名来源：`1.21.11-neoforge.json`（mappingsVersion: `parchment-1.21.11-2025.12.20`）。

## 其它

- DataGen：GatherDataEvent.Client / Server
- Java 21；mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）
- 1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。
- 1.21.11 文档把 ResourceLocation 换成 Identifier。Primer 26.1 才是下一跳。

## 对照签字

| 编号 | 对照 URL | 抓取日 | 结论 |
| 03 | https://docs.neoforged.net/docs/1.21.11/items/ | 2026-08-16 | 已按该版文档改写（unary operator + DeferredItem） |
| 04 | https://docs.neoforged.net/docs/1.21.11/entities/ | 2026-08-16 | 已按该版文档改写 |
| 08 | https://docs.neoforged.net/docs/1.21.11/concepts/sides/ | 2026-08-22 | 已按该版文档改写（FMLEnvironment#getDist() + @Mod dist） |

