# 跨 Loader API 对照表

> 按功能域分类，对比 Fabric / Forge / NeoForge / Architectury 的 API 差异。
> 资料来源：Architectury 官方 API 文档（https://docs.architectury.dev/api/）+ 各 Loader 官方 wiki + mc-mod-porter knowledge-base

---

| 功能域 | Fabric | Forge | NeoForge | Architectury 统一抽象 |
|--------|--------|-------|----------|---------------------|
| **包名空间** | `net.fabricmc` | `net.minecraftforge` | `net.neoforged` | common 层用 `Registries` enum |
| **注册方块** | `Registry.register(Registries.BLOCK, id, block)` | `DeferredRegister.create(ForgeRegistries.BLOCKS, MODID).register()` | 同 Forge | `DeferredRegister.create(MOD_ID, Registries.BLOCK)` |
| **注册物品** | `Registry.register(Registries.ITEM, id, item)` | `DeferredRegister.create(ForgeRegistries.ITEMS, MODID).register()` | 同 Forge | `DeferredRegister.create(MOD_ID, Registries.ITEM)` |
| **注册实体** | `EntityType.Builder.create().build(id)` + `Registry.register()` | `DeferredRegister.create(ForgeRegistries.ENTITIES, MODID).register()` | 同 Forge | `DeferredRegister.create(MOD_ID, Registries.ENTITY_TYPE)` |
| **注册方块实体** | `BlockEntityType.Builder.create(...).build(null)` + `Registry.register()` | `DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPE, MODID).register()` | 同 Forge | `DeferredRegister.create(MOD_ID, Registries.BLOCK_ENTITY_TYPE)` |
| **网络包（发送）** | `ClientPlayNetworking.send(id, buf)` / `ServerPlayNetworking.send(player, id, buf)` | `channel.send(player, msg)` | `channel.send(player, msg)` | `@ExpectPlatform` 抽象 `sendPacket()` |
| **网络包（接收）** | `ClientPlayNetworking.registerGlobalHandler(id, handler)` | `channel.register(MSG_INDEX, MSG_TYPE, (msg, ctx) -> {})` | 同 Forge | common 中声明 handler 接口 |
| **事件订阅** | `@Environment(EnvType.CLIENT)` 注解方法 | `@SubscribeEvent` on `MinecraftForge.EVENT_BUS`（全局）或 `modBus`（mod 级别） | 同 Forge | 统一事件在 common 注册，loader 层传递 |
| **Mixin 配置** | `fabric.mod.json` 中 `mixins` 数组 | `neoforge.mods.toml` 中 `mixins` 或 `clientMixins`/`serverMixins` | 同 Forge | **不可跨 Loader 共享**，必须在 loader 子工程各维护 |
| **配置系统** | 手写 JSON/YAML 或 Forge Config API Port | `ForgeConfigSpec` + `ConfigScreen` | 同 Forge | Forge Config API Port lib 可在 Fabric 中使用同名类 |
| **数据生成** | `DataGenerator` + `FabricDataGenerator` | `DataGenerators.gatherData()` + `GatherDataEvent` | 同 Forge | Datagen 在 loader 子工程处理，common 放 provider 类 |
| **资源（assets）** | `src/main/resources/assets/<modid>/` | `src/main/resources/assets/<modid>/` | 同 Forge | 共享资源放在 `common/assets/`，Loom 自动复制 |
| **Mod ID 元数据** | `fabric.mod.json` | `mods.toml`（或 `neoforge.mods.toml`） | `neoforge.mods.toml` | `architectury.common.json` 在 common 层注入接口/AW |
| **注册时机** | `onInitialize()` 中直接 register | `FMLCommonSetupEvent` / mod constructor 中用 DeferredRegister | 同 Forge | common 层用 `DeferredRegister`，在 loader 层注册事件总线 |
| **服务端检测** | `FabricServer_tickEvents` 或直接检测 | `DistExecutor.runWhenOn(Dist.DEDICATED_SERVER, () -> ...)` | 同 Forge | `@ExpectPlatform` 或 `Env` 类 |
| **客户端检测** | `EnvType.CLIENT` | `DistExecutor.runWhenOn(Dist.CLIENT, () -> ...)` | 同 Forge | Architectury `Environment` 类 |

---

## 注意事项

- **NeoForge 与 Forge 的差异**：NeoForge 1.20.2+ 继承了 Forge 的 API，但包名从 `net.minecraftforge` 改为 `net.neoforged`。大部分 API 调用方式不变。
- **Quilt**：Quilt 与 Fabric 高度兼容，Fabric mod 在 Quilt 上通常可以运行（通过 Quilted Fabric API）。Quilt 有独立的 `Quilted Fabric API` 项目提供 Fabric API 兼容层。
- **Mixin 不可跨 Loader 共享**：Mixin 配置 JSON 必须放在各 loader 子工程中，不能放在 common 模块。
- **Kotlin 项目**：`object` 单例和 `companion object` 中的 Loader API 调用需要额外注意，@ExpectPlatform 的实现方式与 Java 略有不同。
