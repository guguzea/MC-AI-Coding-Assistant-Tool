# 跨 Loader API 对照表

> 按功能域分类，对比 Fabric / Forge / NeoForge 的 API 差异。
> 资料来源：各 Loader 官方 wiki + mc-mod-porter knowledge-base

---

| 功能域 | Fabric | Forge | NeoForge |
|--------|--------|-------|----------|
| **包名空间** | `net.fabricmc` | `net.minecraftforge` | `net.neoforged` |
| **注册方块** | `Registry.register(Registries.BLOCK, id, block)` | `DeferredRegister.create(ForgeRegistries.BLOCKS, MODID).register()` | 同 Forge |
| **注册物品** | `Registry.register(Registries.ITEM, id, item)` | `DeferredRegister.create(ForgeRegistries.ITEMS, MODID).register()` | 同 Forge |
| **注册实体** | `EntityType.Builder.create().build(id)` + `Registry.register()` | `DeferredRegister.create(ForgeRegistries.ENTITIES, MODID).register()` | 同 Forge |
| **注册TileEntity** | `BlockEntityType.Builder.create(...).build(null)` + `Registry.register()` | `DeferredRegister.create(ForgeRegistries.TILE_ENTITIES, MODID).register()` | 同 Forge |
| **网络包（发送）** | `ClientPlayNetworking.send(id, buf)` / `ServerPlayNetworking.send(player, id, buf)` | `channel.send(player, msg)` | `channel.send(player, msg)` |
| **网络包（接收）** | `ClientPlayNetworking.registerGlobalHandler(id, handler)` | `channel.register(MSG_INDEX, MSG_TYPE, (msg, ctx) -> {})` | 同 Forge |
| **事件订阅** | `@Environment(EnvType.CLIENT)` 注解方法 | `@SubscribeEvent` on `MinecraftForge.EVENT_BUS`（全局）或 `modBus`（mod 级别） | 同 Forge |
| **Mixin 配置** | `fabric.mod.json` 中 `mixins` 数组 | `META-INF/mods.toml` 中 `mixins` 或 `clientMixins`/`serverMixins` | 同 Forge |
| **数据生成** | `DataGenerator` + `FabricDataGenerator` | `DataGenerators.gatherData()` + `GatherDataEvent` | 同 Forge |
| **资源（assets）** | `src/main/resources/assets/<modid>/` | `src/main/resources/assets/<modid>/` | 同 Forge |
| **Mod ID 元数据** | `fabric.mod.json` | `mods.toml`（或 `neoforge.mods.toml`） | `neoforge.mods.toml` |
| **注册时机** | `onInitialize()` 中直接 register | `FMLCommonSetupEvent` / mod constructor 中用 DeferredRegister | 同 Forge |
| **服务端检测** | `FabricServer_tickEvents` 或直接检测 | `DistExecutor.runWhenOn(Dist.DEDICATED_SERVER, () -> ...)` | 同 Forge |
| **客户端检测** | `EnvType.CLIENT` | `DistExecutor.runWhenOn(Dist.CLIENT, () -> ...)` | 同 Forge |

---

## 注意事项

- **NeoForge 与 Forge 的差异**：NeoForge 1.20.2+ 继承了 Forge 的 API，但包名从 `net.minecraftforge` 改为 `net.neoforged`。大部分 API 调用方式不变。
- **Mixin 不可跨 Loader 共享**：Mixin 配置 JSON 必须放在各 loader 子工程中。
- **Kotlin 项目**：`object` 单例和 `companion object` 中的 Loader API 调用需要额外注意。
