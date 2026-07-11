# Fabric → Forge 移植指南

> 本指南帮助将 Fabric 模组移植到 Forge 平台。适用于 **Fabric 1.21.11 / Minecraft 1.21.11**。

## 核心差异概览

| 维度 | Fabric | Forge |
|------|--------|-------|
| 入口 | `FabricMod` + entrypoint | `@Mod` 注解 |
| Mod 配置 | `fabric.mod.json` | `mods.toml` |
| 注册方式 | `Registry.register()` in `onInitialize()` | `DeferredRegister` + modEventBus |
| Mixin | Loom 原生支持 | `org.spongepowered.mixin` 插件 |
| 事件系统 | Fabric 事件回调 | `@SubscribeEvent` + Forge 事件总线 |
| Mappings | Yarn（`method_XXXXX`）| MCP（`func_XXXXX`）|
| 网络通信 | `CustomPayload` + `PayloadTypeRegistry`（1.21.x）| Forge 网络 API |
| 数据存储 | Attachment API（1.21.x）| Capability API |

---

## 步骤 1：项目结构迁移

### build.gradle

```groovy
// Fabric → Forge
plugins {
    // ❌ Fabric
    id 'fabric-loom' version '1.4-SNAPSHOT'
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
versionRange = "[47,)"
ordering = "NONE"
side = "BOTH"
```

---

## 步骤 2：入口类迁移

### FabricMod → @Mod

```java
// Fabric
public class ExampleMod implements FabricMod {
    @Override
    public void onInitialize() {
        Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"),
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
// Fabric
private static final RegistrySupplier<Item> MY_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings())
);

// ✅ Forge
public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);

public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()));
```

---

## 步骤 4：事件系统迁移

### Fabric 事件 → Forge 事件

```java
// Fabric
PlayerConnectEvents.JOIN.register((player, sender, server) -> {
    // 处理玩家加入
});

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

## 步骤 6：网络通信迁移

### Fabric CustomPayload → Forge 网络

```java
// Fabric 1.21.x
public record MyPayload(int data) implements CustomPayload { ... }

// ✅ Forge
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ModMessages {
    public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(...);
    public static int ID = 0;
    public static void register() { INSTANCE.registerMessage(ID++, MyMessage.class, ...); }
}
```

---

## 步骤 7：Attachment → Capability

```java
// Fabric 1.21.x
public static final Key<MyData> MY_DATA = Key.create(
    Registries.ATTACHMENT_TYPE,
    new Identifier(MOD_ID, "my_data")
);

// ✅ Forge
public interface MyCapability { int getValue(); void setValue(int value); }
public static final Capability<MyCapability> MY_CAP = Capability.get(...);
```

---

## 常见陷阱

1. **Java 版本**：Forge 1.20.x 需要 Java 17，Fabric 1.21.11 需要 Java 21
2. **Mixin 配置**：Forge 需要额外配置 mixin 插件
3. **事件总线**：Forge 使用 `MinecraftForge.EVENT_BUS.register(this)`
4. **RegistryObject vs RegistrySupplier**：API 略有不同
5. **网络 API**：Fabric 1.21.x 使用 `CustomPayload`，Forge 使用 `SimpleChannel`
6. **数据存储**：Fabric 1.21.x 使用 Attachment，Forge 使用 Capability
