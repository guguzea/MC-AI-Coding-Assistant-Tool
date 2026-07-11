# Forge → Fabric 移植指南

> 本指南帮助将 Forge 模组移植到 Fabric 平台。
> **适用版本：Fabric 1.16.5**（如目标为其他版本，请参考对应版本规则）

## 核心差异概览

| 维度 | Forge | Fabric |
|------|-------|--------|
| 入口注解 | `@Mod` | `ModInitializer` 接口 + entrypoint |
| Mod 配置 | `mods.toml` | `fabric.mod.json` |
| 注册方式 | `DeferredRegister` + modEventBus | `Registry.register()` |
| 注册时机 | `RegisterEvent` 自动触发 | `onInitialize()` 方法中执行 |
| Mixin | `org.spongepowered.mixin` 插件 | **需要显式配置 Mixin Plugin**（1.16.x）|
| 事件系统 | `@SubscribeEvent` + Forge 事件总线 | **Fabric 事件回调** |
| Mappings | MCP（`func_XXXXX`） | Yarn（`method_XXXXX`）|
| Java 版本 | Forge 1.16.5 需要 Java 8/11 | Fabric 1.16.5 需要 **Java 16** |

---
## 步骤 1：项目结构迁移

### build.gradle

```groovy
// Forge → Fabric
plugins {
    // ❌ Forge
    id 'net.minecraftforge.gradle' version '[6.0.16,6.2)'
    // ✅ Fabric（1.16.5 专用 Loom 版本）
    id 'fabric-loom' version '0.10.31'
}

dependencies {
    // ❌ Forge
    minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
    // ✅ Fabric
    minecraft "com.mojang:minecraft:${project.minecraft_version}"
    mappings "net.fabricmc:yarn:${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:${project.loader_version}"
    // ✅ Fabric API（1.16.x 使用 net.fabricmc.fabric-api）
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

### mods.toml → fabric.mod.json

```json
// mods.toml (Forge)
// [[mods]]
// modId = "examplemod"
// version = "${mod_version}"
// displayName = "Example Mod"
// description = "A example mod"

// ✅ fabric.mod.json (Fabric 1.16.5)
{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "1.0.0",
  "name": "Example Mod",
  "description": "A example mod",
  "authors": ["YourName"],
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"]
  },
  "depends": {
    "fabricloader": ">=0.11.2",
    "minecraft": ">=1.16.5",
    "java": ">=16"
  }
}
```

> **注意**：`fabric.mod.json` 中 `depends` 应使用 `"fabric": "*"` 而非 `"fabric-api": "*"`（1.14-1.16.x 规范）。

---
## 步骤 2：入口类迁移

### @Mod → ModInitializer

```java
// Forge
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public ExampleMod(FMLJavaModLoadingContext context) {
        IEventBus modEventBus = context.getModBus();
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
```

```java
// ✅ Fabric 1.16.5
public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";

    @Override
    public void onInitialize() {
        // 所有注册在此执行
        // 1.16.5 使用 Registry（而非 Registries）
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings()));
    }
}
```

> **关键差异**：1.16.5 使用 `Registry.ITEM`（字段），而非 `Registries.ITEM`（枚举，1.17+）。

---
## 步骤 3：注册系统迁移

### DeferredRegister → Registry.register

```java
// Forge
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(BlockBehaviour.Properties.of(Material.STONE)));

// ✅ Fabric 1.16.5
private static final RegistrySupplier<Block> MY_BLOCK = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_block"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE))
);
```

> **注意**：
> - 1.16.5 用 `Registry.BLOCK`（VanillaRegistry 静态字段）
> - 1.16.5 用 `FabricBlockSettings`（Fabric API 提供）
> - 没有 `Registries` 枚举类

---
## 步骤 4：实体迁移（EntityCategory）

```java
// Forge
public static final RegistryObject<EntityType<MyPig>> MY_PIG =
    ENTITIES.register("my_pig", () ->
        EntityType.Builder.create(MobCategory.CREATURE, MyPig::new)
            .size(0.9f, 1.4f)
            .build("")
    );

// ✅ Fabric 1.16.5
public static final RegistrySupplier<EntityType<MyPig>> MY_PIG = Registry.register(
    Registry.ENTITY_TYPE,
    new Identifier(MOD_ID, "my_pig"),
    EntityType.Builder.create(EntityCategory.CREATURE, MyPig::new)  // ❗ EntityCategory 而非 MobCategory
        .size(0.9f, 1.4f)  // ❗ 1.16.x 用 size() 而非 dimensions()
        .build()
);
```

> **关键差异**：Fabric 1.16.5 使用 `EntityCategory.CREATURE`（Fabric API），而非 `MobCategory.CREATURE`（Minecraft 内核）。两者 `CREATURE` 值相同，可混用但推荐使用 `EntityCategory`。

---
## 步骤 5：事件系统迁移

```java
// Forge
@SubscribeEvent
public void onPlayerJoin(PlayerEvent.PlayerLoggedInEvent event) {
    // 处理玩家加入
}

// ✅ Fabric 1.16.5
ServerSidePacketRegistry.INSTANCE.register(new Identifier(MOD_ID, "player_join"),
    (server, handler, buf, responseSender) -> {
        // 处理玩家加入
    }
);
```

---
## 步骤 6：Mixin 迁移（1.16.x 特殊要求）

```java
// ❌ Forge mixin 配置 (build.gradle)
plugins { id 'org.spongepowered.mixin' version '0.7.+' }
mixin { add sourceSets.main, "${mod_id}.refmap.json" }

// ✅ Fabric 1.16.5 mixin 配置
// 需要显式 Mixin Plugin（1.16.x 特殊要求）
```

```json
// fabric.mixins.json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_16",
  "client": ["client.MyMixin"],
  "mixins": []
}
```

```java
// ExampleMixinPlugin.java（1.16.x 必需）
public class ExampleMixinPlugin {
    public static void init() {
        MixinBootstrap.init();
        MixinLauncher.addPrimaryMixin("com.example.examplemod.mixin.ExampleMixin");
    }
}
```

---
## 常见陷阱

1. **Java 版本**：Fabric 1.16.5 需要 Java 16（Forge 1.16.5 可用 Java 8）
2. **Mixin 包名**：确保 `fabric.mixins.json` 的 `package` 与实际包名一致
3. **客户端/服务端分离**：GUI 和渲染相关必须在 `ClientModInitializer` 中处理
4. **Registry API**：1.16.5 使用 `Registry.ITEM` 而非 `Registries.ITEM`
5. **Fabric API Maven**：依赖路径为 `net.fabricmc.fabric-api` 而非 `net.fabric.sdk`
