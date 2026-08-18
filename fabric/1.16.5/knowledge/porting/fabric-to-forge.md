# Fabric → Forge 移植指南

> 本指南帮助将 Fabric 模组移植到 Forge 平台。
> **适用版本：Fabric 1.16.5 → Forge 1.16.5**

## 核心差异概览

| 维度 | Fabric | Forge |
|------|--------|-------|
| 入口 | `ModInitializer` + entrypoint | `@Mod` 注解 |
| Mod 配置 | `fabric.mod.json` | `mods.toml` |
| 注册方式 | `Registry.register()` | `DeferredRegister` + modEventBus |
| Mixin | 需要显式 Mixin Plugin（1.16.x）| `org.spongepowered.mixin` 插件 |
| 事件系统 | Fabric 事件回调 | `@SubscribeEvent` + Forge 事件总线 |
| Mappings | Yarn（`method_XXXXX`）| MCP（`func_XXXXX`）|
| Java 版本 | Fabric 1.16.5 需要 Java 16 | Forge 1.16.5 可用 Java 8/11 |

---
## 步骤 1：项目结构迁移

### build.gradle

```groovy
// Fabric → Forge
plugins {
    // ❌ Fabric
    id 'fabric-loom' version '0.10.31'
    // ✅ Forge
    id 'net.minecraftforge.gradle' version '[6.0.16,6.2)'
}
```

### fabric.mod.json → mods.toml

```toml
# ❌ fabric.mod.json (Fabric)

# ✅ mods.toml (Forge)
[[mods]]
modId = "examplemod"
version = "${mod_version}"
displayName = "Example Mod"
description = "A example mod"

[[dependencies.examplemod]]
modId = "forge"
mandatory = true
versionRange = "[36,)"
ordering = "NONE"
side = "BOTH"
```

---
## 步骤 2：入口类迁移

### ModInitializer → @Mod

```java
// Fabric 1.16.5
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        // 1.16.5 使用 Registry（而非 Registries）
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings()));
    }
}
```

```java
// ✅ Forge
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    private static final Logger LOGGER = LogUtils.getLogger();

    public ExampleMod(FMLJavaModLoadingContext context) {
        IEventBus modEventBus = context.getModBus();
        ITEMS.register(modEventBus);
    }
}
```

---
## 步骤 3：注册系统迁移

### Registry.register → DeferredRegister

```java
// Fabric 1.16.5
private static final Item MY_ITEM = Registry.register(
    Registry.ITEM,  // ❗ 1.16.5 使用 Registry 字段，非 Registries 枚举
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings())
);

// ✅ Forge
public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(ForgeRegistry.ITEMS, MOD_ID);

public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()));
```

---
## 步骤 4：事件系统迁移

```java
// Fabric 1.16.5
ServerSidePacketRegistry.INSTANCE.register(new Identifier(MOD_ID, "player_join"),
    (server, handler, buf, responseSender) -> {
        // 处理玩家加入
    }
);

// ✅ Forge
@SubscribeEvent
public void onPlayerJoin(PlayerEvent.PlayerLoggedInEvent event) {
    // 处理玩家加入
}
```

---
## 步骤 5：Mixin 迁移

```json
// fabric.mixins.json (Fabric)

// ✅ mixins.json (Forge) + build.gradle 配置
// build.gradle 中添加
plugins { id 'org.spongepowered.mixin' version '0.7.+' }
mixin { add sourceSets.main, "${mod_id}.refmap.json" }
```

---
## 常见陷阱

1. **Java 版本**：Forge 1.16.5 可用 Java 8/11（Fabric 1.16.5 需要 Java 16）
2. **Mixin 配置**：Forge 需要额外配置 mixin 插件
3. **事件总线**：Forge 使用 `MinecraftForge.EVENT_BUS.register(this)`
4. **Registry API**：Fabric 1.16.5 用 `Registry.ITEM`，Forge 用 `ForgeRegistry.ITEMS`
5. **Mappings 转换**：Fabric 用 Yarn（`method_XXXX`），Forge 用 MCP（`func_XXXX`）
