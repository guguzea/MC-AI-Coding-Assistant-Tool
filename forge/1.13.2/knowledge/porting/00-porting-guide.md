# Minecraft Mod 跨版本 / 跨平台移植指南（Forge 1.13.2 档）

> 本文件服务 `forge/1.13.2` 包：向下承接 **1.12.2 → 1.13.2「扁平化（flattening）」跃迁**，向上承接 **1.13.2 → 1.14.4+ 迁移**。
> 1.13 是方块/方块状态合并、Item 与 Block 拆分的分水岭版本，**邻档（1.14+ / 1.15+ / 1.16+）的写法不能直接抄进本档**。
> 证据边界：本节每条标识符都出自 1.13.2 官方文档语料（`search_forge_docs --version=1.13.2`，`versionFallback:false`）、`get_migration_guide --route=1.12->1.14`（NeoForge Primer，MIT/williewillus）、本包 `scaffold/`（官方 MDK `forge-1.13.2-25.0.223-mdk`）或本包已核实知识文件。逐条出处见 `temp/` 证据日志。

---

## 决策入口（Decision Flow）

```
用户要移植到 / 移植出 1.13.2
→ IF 源 ≤ 1.12.2（元数据驱动）
    → 三重处理：① blockstate/IProperty 取代 metadata 数字 ② Block 与 Item 拆分（ItemBlock 桥接）
                ③ 资源目录 assets/ ↔ data/ 重划 + lang 改 JSON
→ IF 源 = 1.13.2，目标 = 1.14.4+
    → 注册可切 DeferredRegister（1.14.4 语料实证；本档 1.13.2 语料检索不到该类名）
    → 其余多为增量
→ IF 用户要「同时跨 Loader」（Fabric / Quilt / NeoForge / Architectury）
    → 本仓没有 1.13 时代的其他 Loader 档：data/ 下 fabric 最早 1.14.4、quilt 最早 1.18.2、neoforge 最早 1.20.4
    → 仓内唯一与 1.13.2 同期的其他 Loader 档 = rift/1.13.2
    → 停，先问用户：是否先升 MC 版本再谈多 Loader（1.13.2 上无法照搬现代 MultiLoader 模板）
→ ELSE → 询问用户源/目标精确版本，不要按「邻近版」推断
```

---

## 1.12.2 → 1.13.2 断裂点清单

| 领域 | 1.12.2 侧（禁抄进本档） | 1.13.2 侧 | 证据 |
|------|------------------------|-----------|------|
| 方块状态 | 裸 metadata `switch(meta)` 0–15 | `IProperty<?>` + `IBlockState` 三元组；`createBlockState` / `setDefaultState` / `withProperty` / `getValue`；仍要覆写 `getMetaFromState` + `getStateFromMeta`（必须一一对应）；非存档属性走 `getActualState`（跨线程读 TileEntity 需判 `ChunkCache`） | blocks_states.md:10-101 |
| 属性类型 | 无 | `PropertyInteger.create(name,min,max)`、`PropertyBool.create(name)`、`PropertyEnum.create(name,cls)`、`PropertyDirection.create(name, EnumFacing.Plane.HORIZONTAL / EnumFacing.Axis.X)` | blocks_states.md:40-44 |
| Block / Item | 一个 Block 自带物品形态 | 世界内是 `IBlockState`+`Block`，背包内是 `ItemStack`+`Item`；需显式 `new ItemBlock(block).setRegistryName(block.getRegistryName())`；取回用 `Item.getItemFromBlock`（可能返回 null） | blocks_blocks.md:32 |
| 创造标签页 | 方块自带 creativetab | 「Blocks no longer have a creativetab, that belongs on their ItemBlocks」；本档具体类名两侧冲突（见 §冲突表） | Primer §Misc Things |
| 方块属性写法 | 构造后 setter 链 | 「builder/POJO 传入构造器且为 final」；本档官方语料页仍是 1.12 风格 setter，`Block.Properties.create(Material)` 仅见于邻档记录 → **未核实** | Primer §Misc Things + blocks_blocks.md:13-17 |
| 资源目录 | 玩法资源混在 `assets/` | advancements / functions / loot tables / recipes / structures 移到 `data/`；`assets/` 回到「只放客户端资源」；`data/<domain>/recipes`、`data/<domain>/structures` 被原版按全域名保留，自定义子目录要带 modid | Primer §Data packs + concepts_resources.md:3 |
| 语言文件 | `.lang` `key=value`、前缀 `tile.`、追加 `.name` | JSON 单对象；键用注册名（`:`→`.`）；前缀 `block.`；不再追加 `.name`；`getTranslationKey()` 默认给 `block.`/`item.` 前缀，`ItemBlock` 继承方块键；文件 `assets/<ns>/lang/<locale>.json`，UTF-8 | Primer §Lang changes + concepts_internationalization.md:11,25 |
| 物品/方块标签 | OreDictionary | Tags：`BlockTags.getCollection()` / `ItemTags.getCollection()` → `TagCollection` → `Tag`；`tag.contains(x)` / `tag.getAllElements()`；`getOrCreateTag(id)` 或 `getTag(id)`+null 检查；reload 后集合会失效，别缓存 | utilities_tags.md:15-28 |
| 网络 | `SimpleNetworkWrapper` + `IMessage`、`sendTo`/`sendToAll` | `SimpleChannel`（`NetworkRegistry.newSimpleChannel`）、`INSTANCE.registerMessage`（5 参数，discriminator 建议 `id++`）、`INSTANCE.sendToServer`、`INSTANCE.send(PacketDistributor.PLAYER.with(playerMP), msg)` / `TRACKING_CHUNK.with(chunk)` / `ALL.noArg()`；底层方向枚举 `NetworkDirection.PLAY_TO_CLIENT` | networking_simpleimpl.md:3-85 + version-changes/1.13.x.md:73-79 |
| 注册 | `GameRegistry.register` 直调 | 官方推荐 `RegistryEvent.Register<T>`（`event.getRegistry().registerAll(...)`）；`GameRegistry.register` 被标注为「旧法，应替换」；自定义注册表用 `RegistryEvent.NewRegistry` + `RegistryBuilder::create`；条目实现 `IForgeRegistryEntry`（推荐继承 `IForgeRegistryEntry.Impl`）；字段注入用 `@ObjectHolder` | concepts_registries.md:9-37 |
| 事件总线 | 全局总线为主 | 加载阶段事件走 **mod 总线**，不是 `MinecraftForge.EVENT_BUS`；`@EventBusSubscriber(bus = Bus.MOD)` 或 `FMLModLoadingContext.get().getModEventBus().registerListener(this::commonSetup)`；`FMLCommonSetupEvent` → `FMLClientSetupEvent` / `FMLDedicatedServerSetupEvent` | conventions_loadstages.md:3-33 |
| 物理端 | `Side` / `@SideOnly` | `DistExecutor`、`FMLEnvironment.dist`、`@OnlyIn(Dist)`（官方建议少用注解，优先 `DistExecutor` / `FMLEnvironment.dist` 判断）；单机世界的逻辑服务端仍属 `Dist.CLIENT` | concepts_sides.md:35-62 |
| 能力系统 | — | `ICapabilityProvider` 的 `hasCapability` / `getCapability` **第二参是 `EnumFacing`**；`@CapabilityInject`、`CapabilityItemHandler.ITEM_HANDLER_CAPABILITY`、`ItemStackHandler`、`AttachCapabilitiesEvent<Entity>` / `<TileEntity>`（5 种合法泛型）。本档语料 **没有** `LazyOptional`（grep 零命中）→ 1.13.2 勿写 `LazyOptional` | datastorage_capabilities.md:21-91 |
| 空气判定 | `== Blocks.AIR` | 1.13 有 air / void_air / cave_air 多种空气 → 用 `IBlockState.isAir` | Primer §Misc Things |
| 整数 ID | 到处用 int id | 注册名↔int 映射仅为网络通信性能保留，**不得**用于存档/跨世界；实体、BiomeProvider、ChunkGenerator、ParticleType、Stat、Painting 等更多对象进注册表 | Primer §Misc Things |
| 结构方块 | — | 1.12 的结构 NBT 必须在 1.13 世界载入并重存才可用 | Primer §Misc Things |
| 生物群系 ID | byte（上限 255） | 内部改 int | Primer §Misc Things |
| 模型/颜色 | — | tint index + `IBlockColor` / `IItemColor`，注册 `BlockColors::registerBlockColorHandler` / `ItemColors::registerItemColorHandler`（客户端 initialization 阶段）；`ItemBlock` 需另注册 `IItemColor` | models_color.md:5-18 |
| 物品模型覆盖 | icon 由 `ItemMeshDefinition`/metadata 决定 | 模型 JSON `overrides` + `predicate`（`>=` 语义）；代码侧 `item.addPropertyOverride(new IItemPropertyGetter(){ @SideOnly(Side.CLIENT) float apply(ItemStack, @Nullable World, @Nullable EntityLivingBase) })` | models_overrides.md:20-47 |

---

## 迁移 Checklist（1.12.2 → 1.13.2）

1. 先做资源面：`assets/` 里的 recipes / loot_tables / advancements / functions / structures 全量搬到 `data/<modid>/`；自定义配置类数据放带 modid 前缀的子目录，避开原版保留目录名。
2. lang：`.lang` → `lang/<locale>.json`；键从 `tile.foo.name` 改为 `block.modid:foo` 对应的 `block.modid.foo`（`:`→`.`）。
3. 方块：删掉 metadata `switch`，声明 `IProperty` → `createBlockState` → `setDefaultState`，并补 `getMetaFromState`/`getStateFromMeta`（一一对应），纯渲染属性改 `getActualState`。
4. 每个需要可放置形态的 `Block` 补一个 `ItemBlock` 注册（同注册名），创造标签页挂在物品侧。
5. 网络：`SimpleNetworkWrapper` → `SimpleChannel` + `registerMessage`（5 参数）+ `PacketDistributor`。
6. 注册：`GameRegistry.register` → `RegistryEvent.Register<T>`；需要跨条目引用时用 `@ObjectHolder`（本档**没有** `DeferredRegister` / `RegistryObject`）。
7. 加载阶段事件挪到 mod 总线（`@EventBusSubscriber(bus = Bus.MOD)` 或 mod 构造器里 `registerListener`）。
8. Tag 取代 OreDictionary；不要缓存 `Tag` 实例（reload 会失效）。
9. 构建面：按官方 MDK 组合走（下表），**不要**把邻档 Gradle / FG 版本号覆盖进来。
10. 每步之后：`search_forge_docs --version=1.13.2` 复核类名，`validate_project` 查结构；跨线程/跨端问题查 `knowledge/antipatterns/`。

---

## 1.13.2 → 1.14.4（向上）

| 项 | 1.13.2（本档实证） | 1.14.4（该档语料实证） |
|----|--------------------|------------------------|
| 注册 | 只有 `RegistryEvent.Register`（语料无 `DeferredRegister`） | `concepts_registries.md:11,18,23`：两种正规写法，`new DeferredRegister<>(ForgeRegistries.BLOCKS, MODID)` + `RegistryObject` |
| 能力签名 | `getCapability(Capability<T>, EnumFacing)` | 1.14.4 语料 `datastorage_capabilities.md:73` **同为** `EnumFacing`（`LazyOptional` 属更晚版本，本仓未核实到 1.13/1.14 有） |
| 方块/物品 | 见上表 | 增量为主；具体差异需 `search_forge_docs --version=1.14.4` 逐条核 |

向上迁移前请先读本包 `knowledge/version-changes/1.13.x.md`（`TileEntity`、`NBTTagCompound`、`Container`/`ContainerType` 等命名在该文件里按 1.13–1.16.5 / 1.17+ 分段）。

---

## 版本对照表（本仓实证，未列出的号 = 本档不声明）

| MC | 资源包 pack_format | Java（source/target） | MDK / Forge | 构建插件 / Gradle | mappings |
|----|--------------------|------------------------|-------------|-------------------|----------|
| 1.12.2 | 3 | 见 `forge/1.12.2/AGENTS.md` | — | — | — |
| **1.13.2** | **4** | **1.8** | `forge-1.13.2-25.0.223-mdk`（`mdk-checksums.json:545-552` 钉 URL） | ForgeGradle `3.+` / Gradle `4.9` wrapper | `channel=snapshot`、`version=20180921-1.13` |
| 1.14.4 | 5 | — | — | — | — |
| 1.15.2 | 6 | — | — | — | — |

1.13.2 行全部来自本包 `scaffold/`（`pack.mcmeta:4`、`build.gradle:2,10,22,25`、`gradle.properties:5-13`、`gradle/wrapper/gradle-wrapper.properties:6`）。其他行只填本仓已核实的 pack_format。

---

## 本包语料冲突（已知，按证据强度取舍）

| 冲突 | A（本包规则/知识） | B（本包实证工件/官方语料） | 采舍 |
|------|--------------------|-----------------------------|------|
| ~~pack_format~~（已消解） | `.cursor/rules/00-project-setup.mdc`（原 6；`.pi/rules/00-project-setup.md:238,243` 为其投影） | `scaffold/.../pack.mcmeta:4` = 4、`knowledge/common/datapack-format.md:39` = 4、官方 1.13.2-25.0.223 MDK `pack.mcmeta` = 4 | **4**（规则原稿已按 MDK 改正，两侧一致；投影待 `sync-skills` 重生成） |
| mappings | `version-changes/1.13.x.md:105-107` = `mcp` / `1.13.2` | `scaffold/gradle.properties:12-13` = `snapshot` / `20180921-1.13` | 官方 MDK 为 snapshot（A 写法对应 `data/forge_1.13.2/mappings/mcp-1.13.2.zip`，二者皆存在，需按工程实际读 `build.gradle` 判定） |
| ~~Gradle~~（已消解） | `AGENTS.md` 基本信息 = Gradle 4.9 + FG `3.+` | `scaffold/build.gradle:2` + wrapper = 4.9；官方 MDK `gradle-wrapper.properties:5` = `gradle-4.9-bin.zip` | 两侧一致，原「AGENTS.md 写 6.x」已按 MDK 改正 |
| 方块属性 / 创造标签页 | `version-changes/1.13.x.md:38-48,91-98`（`Block.Properties.create(Material)`、`ItemGroup`） | 官方语料 `blocks_blocks.md:13-17`、`items_items.md:13` 仍写 1.12 setter（`setHardness`/`setCreativeTab`/`CreativeTabs`） | 两侧互斥 → **未核实**，写码时以 IDE 补全 / 反编译核实，禁止硬套 |

---

## 工具边界（1.13.2 专用）

- `get_migration_guide` **没有** `1.12.2->1.13.2` 路线；可用最近路线是 `1.12->1.14`（含 1.13 扁平化章节，本文件即其 1.13 相关部分）。
- `query_api` 的索引范围约 1.16.5–1.20.4（见根 `AGENTS.md`），1.13.2 平台 API 请用 `search_forge_docs --version=1.13.2` + `get_forge_doc_full`。
- `data/forge-porting/breaking-changes/1.12.2-1.14.4.json` 的 `structuralChanges` 自述是「基于文档章节结构变化的自动检测，不代表完整 API breaking changes」→ 只能当线索，不能当 API 规范。
- 跨 Loader（Fabric / Quilt / NeoForge / Architectury）在 1.13.2 无仓内档 → 见 `01-api-cross-loader.md`。
