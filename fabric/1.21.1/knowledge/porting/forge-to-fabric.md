# Forge → Fabric 移植指南

## 核心差异

| 方面 | Forge | Fabric |
|------|-------|--------|
| 注册系统 | `DeferredRegister` | `Registry.register()` |
| 事件系统 | `@SubscribeEvent` + EventBus | Event Callback |
| 映射 | MCP / Parchment | Yarn |
| 加载器 | `FMLLoadingPlugin` | `FabricLoader` |
| 入口点 | `@Mod` | `FabricMod`/`ClientModInitializer` |
| Mixin | 单独引入 | 内置 |

## 移植步骤

### 1. 项目结构

**Forge**:
```
src/main/java/com/example/
└── ExampleMod.java      // @Mod
```

**Fabric**:
```
src/main/java/com/example/
├── ExampleMod.java         // implements FabricMod
└── ExampleModClient.java  // implements ClientModInitializer (如需要)
```

### 2. build.gradle

**Forge**:
```groovy
plugins {
    id 'forge'
}
minecraft {
    mappings channel: 'parchment', version: '1.20.1-2023.XX.XX'
}
```

**Fabric**:
```groovy
plugins {
    id 'fabric-loom'
}
minecraft {
    // Yarn 映射
}
```

### 3. mods.toml / fabric.mod.json

**Forge**:
```toml
[[mods]]
modId="examplemod"
version="${file.jarVersion}"
```

**Fabric**:
```json
{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "1.0.0",
  "entrypoints": {
    "main": ["com.example.ExampleMod"]
  }
}
```

### 4. 注册系统

**Forge**:
```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()));
```

**Fabric**:
```java
private static final RegistrySupplier<Item> MY_ITEM =
    Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings()));
```

### 5. 事件系统

**Forge**:
```java
@SubscribeEvent
public static void onPlayerClone(PlayerEvent.Clone event) {
    // 处理
}
```

**Fabric**:
```java
// 直接使用事件回调
PlayerEvents.COPY.register((original, replica, wasDeath) -> {
    // 处理
});
```

### 6. 命名差异

| Forge (MCP) | Fabric (Yarn) |
|-------------|---------------|
| `ServerPlayer` | `ServerPlayerEntity` |
| `ClientPlayerEntity` | `ClientPlayerEntity` |
| `ResourceLocation` | `Identifier` |
| `World` | `World` |
| `BlockPos` | `BlockPos` |
| `ItemStack` | `ItemStack` |

### 7. 常见问题

- **DeferredRegister** vs **Registry.register**：Fabric 更直接，但需要 mod ID 常量
- **@SubscribeEvent** vs **Event Callback**：Fabric 使用 lambda 或静态方法注册
- **@OnlyIn** vs **ClientModInitializer**：Fabric 通过入口点分离实现
- **BlockBehaviour.Properties** vs **FabricBlockSettings**：API 类似但类名不同

### 8. Forge 特有功能

以下 Forge 特有功能在 Fabric 中需要替代方案：

| Forge 功能 | Fabric 替代 |
|-----------|------------|
| Capacitors | Fabric Item API |
| Forge Fluid | Fabric Fluid API |
| Forge Energy (FE) | 不是内置的，需要第三方库或自定义 |
| MinecraftForge.EVENT_BUS | Fabric Event System |

## 参考资源

- [Fabric Wiki](https://fabricmc.net/wiki/documentation)
- [Fabric API 文档](https://fabricmc.net/javadoc/)
- [Fabric MC Discord](https://discord.gg/fabric)
