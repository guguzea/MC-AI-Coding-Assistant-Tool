# 跨 Loader / 跨时代 API 对照（Forge 1.13.2 档）

> 本表的 **第一列永远是已核实的 Forge 1.13.2**；其余列只在有仓内证据时填写。
> 与邻档不同之处：1.13.2 **没有**任何同代的其他 Loader 知识档，所以本文件不做 Fabric/NeoForge 逐名对照，而是先给出「同期 Loader 现状」，再给 Forge 系内部的 1.12.2 ↔ 1.13.2 ↔ 1.14.4 对照。
> 出处逐条见 `temp/` 证据日志；DOCS = `data/forge_1.13.2/forge-docs/1.13.2/processed/`，DOCS14 = `data/forge_1.14.4/forge-docs/1.14.4/processed/`。

---

## 0. 同期 Loader 现状（先决条件，别越过硬事实）

```
Decision: 1.13.2 工程要「跨 Loader」
→ 本仓 data/ 中 fabric 最早 = fabric_1.14.4，quilt 最早 = quilt_1.18.2，neoforge 最早 = neoforge_1.20.4
  （ls data 实证；且不存在 fabric/1.13* / quilt/1.13* / neoforge/1.13* / liteloader/1.13* 目录）
→ 与 1.13.2 同期的其他 Loader 档，仓内只有一个：rift/1.13.2（+ data/rift_1.13.2）
→ 结论：任何「1.13.2 + Architectury / MultiLoader / Fabric 同名 API」的写法在本仓都属未核实来源，
  必须先与用户确认是否升 MC 版本；不要拿 1.14.4+ 的 Fabric 列名当 1.13.2 的 Fabric 列名。
```

---

## 1. Forge 系内部对照（本档核心）

| 功能域 | 1.12.2 旧写法（移植时替换掉） | **Forge 1.13.2（本档）** | 1.14.4+（向上迁移目标） |
|--------|------------------------------|--------------------------|--------------------------|
| 包名空间 | `net.minecraftforge` | `net.minecraftforge` | `net.minecraftforge`（NeoForge 的 `net.neoforged` 属 1.20.2+，与本档无关） |
| 元数据 | `mcmod.info`（未在本档语料核实） | `META-INF/mods.toml`：`modLoader="javafml"` + `loaderVersion`（MDK 用 `[25,)`） | 同 `mods.toml` |
| 注册（推荐） | `GameRegistry.register` | `RegistryEvent.Register<T>` + `event.getRegistry().registerAll(...)`（DOCS/concepts_registries.md:9,16-17） | `DeferredRegister` 或 `RegistryEvent.Register`（DOCS14/concepts_registries.md:11,18） |
| 注册（旧法） | `GameRegistry.register` | 语料明确标注「应替换为注册事件」（concepts_registries.md:25） | 同左 |
| 注册结果引用 | 静态字段直引 | `@ObjectHolder` 注入（concepts_registries.md:21） | `@ObjectHolder` + `RegistryObject`（DOCS14/concepts_registries.md:66） |
| 自定义注册表 | — | `RegistryEvent.NewRegistry` + `RegistryBuilder::create`；`GameRegistry.findRegistry(Block.class)`（concepts_registries.md:35） | 同族 API，逐名需 `--version=1.14.4` 复核 |
| 条目接口 | — | `IForgeRegistryEntry`（推荐继承 `IForgeRegistryEntry.Impl`）+ `setRegistryName`（concepts_registries.md:37） | 同族 |
| 方块状态 | metadata int | `IProperty` / `IBlockState` / `BlockStateContainer` + `getMetaFromState` / `getStateFromMeta` / `getActualState`（DOCS/blocks_states.md:28-96） | 同族 |
| 方块 vs 物品 | Block 自带物品形态 | `ItemBlock` 显式注册：`new ItemBlock(block).setRegistryName(block.getRegistryName())`；`Item.getItemFromBlock`（DOCS/blocks_blocks.md:32） | 同族 |
| 创造标签页 | 方块上挂 creativetab | 归物品侧（Primer §Misc Things）；本档类名两侧语料冲突 → **未核实** | — |
| 网络 | `SimpleNetworkWrapper` + `IMessage`，`sendTo` / `sendToAll`（version-changes/1.13.x.md:75-78） | `SimpleChannel`、`NetworkRegistry.newSimpleChannel`、`INSTANCE.registerMessage`(5 参数)、`INSTANCE.sendToServer`、`PacketDistributor.PLAYER.with(...)` / `TRACKING_CHUNK.with(...)` / `ALL.noArg()`、`NetworkDirection.PLAY_TO_CLIENT`（DOCS/networking_simpleimpl.md:3-85） | 同族（后续版本才有 Payload API，与本档无关） |
| 事件总线 | `MinecraftForge.EVENT_BUS` 为主 | 加载阶段事件走 **mod 总线**：`@EventBusSubscriber(bus = Bus.MOD)` 或 `FMLModLoadingContext.get().getModEventBus().registerListener(this::commonSetup)`；全局事件仍用 `MinecraftForge.EVENT_BUS`（DOCS/conventions_loadstages.md:3,12） | 同族 |
| 阶段事件 | `FMLPreInitializationEvent` / `FMLInitializationEvent`（未在本档语料核实） | `FMLCommonSetupEvent` → `FMLClientSetupEvent` / `FMLDedicatedServerSetupEvent`；注册事件早于 `FMLCommonSetupEvent`（DOCS/conventions_loadstages.md:26,33） | 同族 |
| 物理端判定 | `Side` + `@SideOnly`（模型覆盖代码里仍见 `@SideOnly(Side.CLIENT)`，DOCS/models_overrides.md:42） | `DistExecutor`、`FMLEnvironment.dist`、`@OnlyIn(Dist)`（DOCS/concepts_sides.md:35-62） | 同族 |
| 能力 | — | `ICapabilityProvider` + `hasCapability` / `getCapability(Capability<T>, EnumFacing)`、`@CapabilityInject`、`AttachCapabilitiesEvent<Entity>` / `<TileEntity>`；**本档语料无 `LazyOptional`** | 1.14.4 语料仍是 `EnumFacing` 版签名（DOCS14/datastorage_capabilities.md:73） |
| 物品/方块分组 | OreDictionary | `BlockTags.getCollection()` / `ItemTags.getCollection()`、`Tag`、`contains` / `getAllElements`（DOCS/utilities_tags.md:15-28） | 同族 |
| 方块实体 | `TileEntity` | `TileEntity`（本档语料与 version-changes/1.13.x.md:52-59 一致；`BlockEntity` 是 1.17+ mojmap 名，禁抄进本档） | `TileEntity`（1.14.4 语料同） |
| 容器 / GUI | — | `Container` / `ContainerType` / `IGuiHandler` / `GuiScreen` 仅见于 version-changes/1.13.x.md:82-89；**本档官方语料无对应页** → 写码前需 `search_forge_docs --version=1.13.2` 复核 | 同左 |
| 颜色 | — | `IBlockColor` / `IItemColor` + `BlockColors::registerBlockColorHandler` / `ItemColors::registerItemColorHandler`（DOCS/models_color.md:5-18） | 同族 |
| 资源目录 | 玩法资源可放 `assets/` | 客户端资源 `assets/`、玩法资源 `data/`（Primer §Data packs + DOCS/concepts_resources.md:3,7 + DOCS/conventions_locations.md:13-31） | 同族 |
| 语言 | `assets/<ns>/lang/<locale>.lang`，键 `tile.x.name` | `assets/<ns>/lang/<locale>.json`（UTF-8），键 `block.<ns>.<path>` / `item.<ns>.<path>`，由 `getTranslationKey()` 生成（DOCS/concepts_internationalization.md:11,25） | 同族 |
| Mod ID | 全小写、禁 `-` | 全小写、禁 `-`（本包 `AGENTS.md` Mod ID 规范；须与 `mods.toml` 的 `modId` 一致） | 同左 |

---

## 2. 移植时的硬约束

- **注册时序**：1.13.2 的 `RegistryEvent.Register` 在 preinit 之后触发，事件顺序按字母但 `Block` 必先、`Item` 次之（concepts_registries.md:21）；因此不要在其他 mod 的注册事件里假设自己的条目已就绪。
- **`@ObjectHolder` 刷新点**：`Register<Block>`、`Register<Item>` 以及全部 `Register` 事件后各刷新一次（concepts_registries.md:21）——想早拿引用要放到对应事件之后。
- **能力面**：向 1.13.2 工程写 Capability 代码时，签名必须是 `EnumFacing` 版；`LazyOptional` 与 `Direction` 属后续版本，本档语料零命中，禁止顺手写。
- **Tag 缓存**：`TagCollection` 及其中 `Tag` 在资源 reload 后会失效，每次重新查询，或注册 reload 监听刷新（utilities_tags.md:22）。
- **Mixin 不跨 Loader**：任何 Loader 的 Mixin 配置留在各自工程内；1.13.2 的 AT/AW 与 Mixin 差异请按本包 `09-anti-patterns.mdc` / `mixin_analyze` 处理。
- **不要向 1.13.2 回填 1.16+ 习惯**：`Block.Properties.of()` / `Tier` / `BlockEntity` / `MobEffect` / `RecordItem` 等都不属本档。

---

## 3. 相关邻档（仅作方向，不当 API 规范）

- 若最终要上多 Loader：先升到本仓有档的版本（`forge/1.14.4` 起、`fabric/1.14.4` 起），再读 `forge/1.15.2/knowledge/porting/01-api-cross-loader.md` 或 `forge/1.16.5/knowledge/porting/01-api-cross-loader.md`。
- 1.13.2 同期其他 Loader：`rift/1.13.2`（该档方法名只能来自其核实表，禁止用 Fabric 记忆填写）。
