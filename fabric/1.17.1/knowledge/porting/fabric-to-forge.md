# Fabric → Forge 移植指南

> 本指南帮助将 Fabric 模组移植到 Forge 平台。

## 核心差异概览

| 维度 | Fabric | Forge |
|------|--------|-------|
| 入口 | `ModInitializer` + `onInitialize()` | `@Mod` 注解 |
| Mod 配置 | `fabric.mod.json` | `mods.toml` |
| 注册方式 | `Registry.register(Registry.ITEM, id, item)` | `DeferredRegister` + modEventBus |
| Mixin | Loom 原生支持 | `org.spongepowered.mixin` 插件 |
| 事件系统 | Fabric 事件回调 | `@SubscribeEvent` + Forge 事件总线 |
| Mappings | Yarn（`method_XXXXX`）| MCP（`func_XXXXX`）|

---

## 步骤 1：项目结构迁移

### build.gradle

```groovy
// Fabric → Forge
plugins {
    // ❌ Fabric
    id 'fabric-loom' version '0.11-SNAPSHOT'
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

### ModInitializer → @Mod

```java
// Fabric
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        // 使用 Registry.register(Registry.ITEM, ...)
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
// Fabric
private static final Item MY_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings())
);

// ✅ Forge
public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);

public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()));
```

> ⚠️ **Fabric → Forge 映射注意**：
> - Fabric 的 `Registry.ITEM` → Forge 的 `ForgeRegistries.ITEMS`
> - Fabric 的 `Registry.BLOCK` → Forge 的 `ForgeRegistries.BLOCKS`
> - Fabric 的 `Identifier` → Forge 的 `ResourceLocation`（但 `new Identifier(id, name)` 仍然兼容）

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

## 常见陷阱

1. **Java 版本**：Forge 1.17.1 需要 Java 16-17
2. **Mixin 配置**：Forge 需要额外配置 mixin 插件
3. **事件总线**：Forge 使用 `MinecraftForge.EVENT_BUS.register(this)`
4. **RegistryObject vs RegistrySupplier**：API 略有不同
5. **`Registries` 类**：Forge 使用 `ForgeRegistries`，Fabric 使用 `Registry.XXX` 静态字段
