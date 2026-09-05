# 跨 Loader API 对照表

> 按功能域分类，对比 Fabric / Forge 的 API 差异。
> 适用于 Forge 1.14.4。

---

| 功能域 | Fabric | Forge |
|--------|--------|-------|
| **包名空间** | `net.fabricmc` | `net.minecraftforge` |
| **注册方块** | `Registry.register(Registry.BLOCK, id, block)` | `new DeferredRegister<>(ForgeRegistries.BLOCKS, MODID).register()` |
| **注册物品** | `Registry.register(Registry.ITEM, id, item)` | `new DeferredRegister<>(ForgeRegistries.ITEMS, MODID).register()` |
| **注册实体** | `EntityType.Builder.create().build(id)` + `Registry.register()` | `new DeferredRegister<>(ForgeRegistries.ENTITIES, MODID).register()` |
| **网络包** | `ClientPlayNetworking.send(id, buf)` / `ServerPlayNetworking.send(player, id, buf)` | `SimpleChannel` + `PacketDistributor` |
| **事件订阅** | `@Environment(EnvType.CLIENT)` 注解方法 | `@SubscribeEvent` on `MinecraftForge.EVENT_BUS` |
| **Mixin** | `fabric.mod.json` 中 `mixins` 数组 | `mods.toml` 中 `mixins` 或事件总线 |
| **服务端检测** | 直接检测 | `DistExecutor.runWhenOn(Dist.DEDICATED_SERVER, () -> ...)` |
| **客户端检测** | `EnvType.CLIENT` | `DistExecutor.runWhenOn(Dist.CLIENT, () -> ...)` |

---

## 注意事项

- **Forge 1.14.4**：DeferredRegister 已可用，是推荐方式
- **Fabric**：在 `onInitialize()` 中直接调用 `Registry.register()`
- **Mixin**：Mixins 在两平台都需要单独配置
- **Java 版本**：1.14.4 Forge = **Java 8**（官方 28.2.26 MDK `'1.8'`，语料与 MDK 均无 Java 11 依据）。TODO(未核实) Fabric 侧的 JDK 口径本仓 1.14.4 语料未覆盖，按 Fabric 工程自备文档核实后再写
