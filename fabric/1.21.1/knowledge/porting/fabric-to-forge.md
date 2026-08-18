# Fabric → Forge 移植指南

## 核心差异

| 方面 | Fabric | Forge |
|------|--------|-------|
| 注册系统 | `Registry.register()` | `DeferredRegister` |
| 事件系统 | Event Callback | `@SubscribeEvent` + EventBus |
| 映射 | Yarn | MCP / Parchment |
| 加载器 | `FabricLoader` | `FMLLoadingPlugin` |
| 入口点 | `ModInitializer`/`ClientModInitializer` | `@Mod` |
| Mixin | 内置 | 单独引入 |

## 移植步骤

### 1. 项目结构

**Fabric**:
```
src/main/java/com/example/
├── ExampleMod.java          // implements ModInitializer
└── ExampleModClient.java    // implements ClientModInitializer
```

**Forge**:
```
src/main/java/com/example/
├── ExampleMod.java          // @Mod
└── ExampleMod.java         // @Mod.EventBusSubscriber
```

### 2. 注册系统

**Fabric**:
```java
private static final Item MY_ITEM =
    Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings()));
```

**Forge**:
```java
private static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()));
```

### 3. 事件系统

**Fabric**:
```java
ServerTickEvents.END_SERVER_TICK.register(server -> {
    // 不要编造 PlayerTickEvents
});
```

**Forge**:
```java
@SubscribeEvent
public static void onPlayerTick(PlayerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        // 处理
    }
}
```

### 4. 网络系统

**Fabric**:
```java
// CustomPayload + PayloadTypeRegistry
```

**Forge**:
```java
// SimpleChannel + @Nullable annotation + FriendlyByteBuf
```

### 5. 命名差异

| Fabric (Yarn) | Forge (MCP) |
|---------------|-------------|
| `ServerPlayerEntity` | `ServerPlayer` |
| `ClientPlayerEntity` | `ClientPlayerEntity` |
| `Identifier` | `ResourceLocation` |
| `World` | `World` |
| `BlockPos` | `BlockPos` |
| `ItemStack` | `ItemStack` |

### 6. 常见问题

- **RegistryEvent.register** vs **DeferredRegister**：Forge 需要在 mod 构造器中初始化 DeferredRegister
- **FabricLoader.getInstance()** vs **FMLLoader**：获取 mod 信息的方式不同
- **@Environment** vs **@OnlyIn**：环境注解不同
- **FabricBlockSettings** vs **BlockBehaviour.Properties**：方块属性构建器不同

## 参考资源

- [Forge 官方文档](https://docs.neoforged.net/)
- [Fabric Wiki](https://fabricmc.net/wiki/documentation)
- [Ender IO Forge 移植示例](https://github.com/SleepyTrousers/EnderIO)（部分模块）
