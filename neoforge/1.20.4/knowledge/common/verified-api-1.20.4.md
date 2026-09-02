# NeoForge 1.20.4 已核实 API

签字：官方文档 https://docs.neoforged.net/docs/1.20.4/ + 官方 MDK（NeoForgeMDKs/MDK-1.20.
4-NeoGradle @ 8cd443623d2fd12ef8a6912d2af1296d8522faac 与 MDK-1.20.4-ModDevGradle @ 
ddfff1d83adca54ac44fe70a6f3b85d3033f0e3a）。  
反编译：`scripts/validate-rules-against-cache.mjs` 从 `$MC_SKILL_CACHE` 抽签名回填。摘要 JSON
**核实优先级**：jar 摘要与反编译 FQCN **高于**本库 `search_neoforge_docs` 缺页（`DOC_NOT_FOUND` 不得把已入库反编译项标成「未核实」）。  
摘要 JSON **必须**含 `mappingsVersion`，否则不得写进本表。clone-audit：与邻档教程骨架相似是预期，误报不算验收失败。

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

网络类名来源：`1.20.4-neoforge.json`（mappingsVersion: `official-1.20.4` / `parchment-1.20.4-2024.04.14`）。本库无 `networking/payload` 文档页时仍以 jar 为准。

## 附加数据（Data Attachments）

来源：`datastorage/attachments`（该版文档页 id，与 1.20.6 档同）+ `1.20.4-neoforge.json`（`parchment-1.20.4-2024.04.14`，1174 类）。

| 符号 | 口径 |
|---|---|
| `AttachmentType` | `net.neoforged.neoforge.attachment.AttachmentType`（摘要，`public,static` 工厂见下） |
| `AttachmentType.builder` | `Builder<T> builder(Supplier<T>)` / `Builder<T> builder(Function<IAttachmentHolder,T>)` |
| `AttachmentType.serializable` | `Builder<T> serializable(Supplier<T>)` / `Builder<T> serializable(Function<IAttachmentHolder,T>)` |
| `AttachmentType.Builder.serialize` | `Builder<T> serialize(IAttachmentSerializer<?,T>)` / `serialize(Codec<T>)` / `serialize(Codec<T>, Predicate<?superT>)` |
| `AttachmentType.Builder.copyOnDeath` | `Builder<T> copyOnDeath()` |
| `AttachmentType.Builder.build` | `AttachmentType<T> build()` |
| `NeoForgeRegistries.ATTACHMENT_TYPES` | 文档页写明；摘要 **无字段**，注册表字段本身 **未核实**，以该页为准 |
| `DeferredRegister.create(NeoForgeRegistries.ATTACHMENT_TYPES, MOD_ID)` + `register(modEventBus)` | 文档页写法 |
| `getData` / `setData` / `hasData` / `hasAttachments` / `getExistingData` / `removeData` | `AttachmentHolder` / `IAttachmentHolder`（摘要） |
| `IAttachmentSerializer` / `IAttachmentCopyHandler` / `IAttachmentComparator` | 摘要 `net.neoforged.neoforge.attachment.*` |
| `AttachmentHolder` / `AttachmentInternals` / `AttachmentUtils` / `LevelAttachmentsSavedData` | 摘要（内部实现，教程不输出） |
| `PlayerEvent.Clone`（`#isWasDeath`）/ `ChunkWatchEvent.Sent` | 文档页；事件同步与死亡复制要自己处理 |
| `AttachmentSerializer.serializable()` | **docs 页写法，摘要内无 `AttachmentSerializer` 类**：真实静态方法是 `AttachmentType.serializable(...)`。禁止输出 `AttachmentSerializer.*` |

## 其它

- DataGen：GatherDataEvent
- Java 17；mojmap / NeoForm 官方名（不是 Forge MCP）
- 本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。
- 1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。

## 对照签字

| 编号 | 对照 URL | 抓取日 | 结论 |
| 03 | https://docs.neoforged.net/docs/1.20.4/items/ | 2026-08-16 | 已按该版文档改写 |
| 04 | — | — | 无独立 entities 页（DOC_NOT_FOUND）；04-entity 为 stub |
| 06 | — | — | payload 页 DOC_NOT_FOUND；网络 API 以 `1.20.4-neoforge.json` jar 反编译为准 |
| 08 | https://docs.neoforged.net/docs/1.20.4/concepts/sides/ | 2026-08-16 | 已按该版文档改写（MDK ClientModEvents；payload 默认网络线程） |

