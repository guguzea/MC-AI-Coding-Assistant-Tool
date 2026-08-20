# 跨 Loader API 对照表

> 按功能域分类，对比 Fabric / Forge 的 API 差异。
> 资料来源：Fabric Wiki + Forge 官方文档

---

## 功能域对比

| 功能域 | Fabric | Forge |
|--------|--------|-------|
| **注册方块** | `Registry.register(Registries.BLOCK, id, block)` | `DeferredRegister.create(ForgeRegistries.BLOCKS, MODID).register()` |
| **注册物品** | `Registry.register(Registries.ITEM, id, item)` | `DeferredRegister.create(ForgeRegistries.ITEMS, MODID).register()` |
| **注册实体** | `EntityType.Builder.create().build(id)` + `Registry.register()` | `DeferredRegister.create(ForgeRegistries.ENTITYTYPES, MODID).register()` |
| **注册方块实体** | `BlockEntityType.Builder.create(...).build(null)` + `Registry.register()` | `DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MODID).register()` |
| **网络包（发送）** | `ClientPlayNetworking.send(id, buf)` / `ServerPlayNetworking.send(player, id, buf)` | `channel.send(player, msg)` |
| **网络包（接收）** | `ClientPlayNetworking.registerGlobalHandler(id, handler)` | `channel.register(MSG_INDEX, MSG_TYPE, (msg, ctx) -> {})` |
| **事件订阅** | `@Environment(EnvType.CLIENT)` 注解方法 | `@SubscribeEvent` on `MinecraftForge.EVENT_BUS`（全局）或 `modBus`（mod 级别） |
| **Mixin 配置** | `fabric.mod.json` 中 `mixins` 数组 | `mods.toml` 或 `META-INF/accesstransformer.cfg` |
| **配置系统** | 手写 JSON/YAML | `ForgeConfigSpec` + `ConfigScreen` |
| **数据生成** | `FabricDataGenerator` | `DataGenerators.gatherData()` + `GatherDataEvent` |
| **资源（assets）** | `src/main/resources/assets/<modid>/` | `src/main/resources/assets/<modid>/` |
| **Mod ID 元数据** | `fabric.mod.json` | `mods.toml` |
| **服务端检测** | `ServerTickEvents` 或直接检测 | `DistExecutor.runWhenOn(Dist.DEDICATED_SERVER, () -> ...)` |
| **客户端检测** | `EnvType.CLIENT` | `DistExecutor.runWhenOn(Dist.CLIENT, () -> ...)` |

---

## 注意事项

- **Forge 1.18.2** 使用 `ForgeRegistries` 的字段名如 `BLOCKENTITIES`、`ENTITYTYPES`、`CONTAINERS`、`FLUIDTYPES` 等
- **Mixin 不可跨 Loader 共享**：Mixin 配置 JSON 必须放在各平台子工程中
- **Yarn 映射**：Fabric 使用 Yarn，与 Forge 的 MCP/Parchment 不同
