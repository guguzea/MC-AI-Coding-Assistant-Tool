# NeoForge 1.20.4 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.20.4/ + 官方 MDK（NeoForgeMDKs/MDK-1.20.4-NeoGradle @ 8cd443623d2fd12ef8a6912d2af1296d8522faac 与 MDK-1.20.4-ModDevGradle @ ddfff1d83adca54ac44fe70a6f3b85d3033f0e3a）。  
反编译：`scripts/validate-rules-against-cache.mjs` 从 `$MC_SKILL_CACHE` 抽签名回填。摘要 JSON **必须**含 `mappingsVersion`，否则不得覆盖本表。  
clone-audit：与邻档教程骨架相似是预期（换类名），**误报不算验收失败**；本表即源码/文档签字。

## 入口

| 符号 | 口径 |
|---|---|
| `@Mod` | 要 |
| `public ExampleMod(IEventBus modEventBus)` | 要 |
| `NeoForgeAddonPlugin` | **不存在，禁止输出** |
| 元数据 | META-INF/mods.toml（官方 MDK 1.20.4 ExampleMod 注释仍写 mods.toml） |

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
| `RegisterPayloadHandlerEvent` | **要** |
| `IPayloadRegistrar` | **要** |
| `PlayPayloadContext` | **要** |
| `ResourceLocation` | new ResourceLocation("mymod", "my_data") |
| StreamCodec / type() | 不要（本档用 write/id + FriendlyByteBuf 构造器） |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

## 其它

- DataGen：GatherDataEvent
- Java 17；mojmap / NeoForm 官方名（不是 Forge MCP）
- 本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。
- 1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。
