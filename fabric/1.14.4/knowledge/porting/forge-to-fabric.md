# Forge → Fabric 移植指南

> 本指南帮助将 Forge 模组移植到 Fabric 平台。
> **适用版本：Fabric 1.14.4**（如目标为其他版本，请参考对应版本规则）

## 核心差异概览

| 维度 | Forge | Fabric |
|------|-------|--------|
| 入口注解 | `@Mod` | `ModInitializer` 接口 + entrypoint |
| Mod 配置 | `mods.toml` | `fabric.mod.json` |
| 注册方式 | `DeferredRegister` + modEventBus | `Registry.register()` |
| 注册时机 | `RegisterEvent` 自动触发 | `onInitialize()` 方法中执行 |
| Mixin | `org.spongepowered.mixin` 插件 | Mixin（需要配置 fabric.mixins.json）|
| 事件系统 | `@SubscribeEvent` + Forge 事件总线 | **Fabric 事件回调** |
| Mappings | MCP（`func_XXXXX`） | Yarn（`method_XXXXX`）|
| Java 版本 | Forge 1.14.4 需要 Java 8 | Fabric 1.14.4 需要 **Java 8** |

---
## 步骤 1：项目结构迁移

### build.gradle

```groovy
// Forge → Fabric
plugins {
    // ❌ Forge
    id 'net.minecraftforge.gradle' version '[5.0.12,5.2)'
    // ✅ Fabric（1.14.4 专用 Loom 版本）
    id 'fabric-loom' version '0.4-SNAPSHOT'
}

dependencies {
    // ❌ Forge
    minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
    // ✅ Fabric
    minecraft "com.mojang:minecraft:${project.minecraft_version}"
    mappings "net.fabricmc:yarn:${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:${project.loader_version}"
    // ✅ Fabric API（1.14.x 使用 net.fabricmc.fabric-api）
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

// ✅ fabric.mod.json (Fabric 1.14.4)
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
    "fabricloader": ">=0.4.16",
    "minecraft": ">=1.14.4",
    "java": ">=1.8"
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
// ✅ Fabric 1.14.4
public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";

    @Override
    public void onInitialize() {
        // 所有注册在此执行
        // 1.14.4 使用 Registry（而非 Registries）
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings()));
    }
}
```

> **关键差异**：1.14.4 使用 `Registry.ITEM`（字段），而非 `Registry.ITEM`（枚举，1.17+）。

---
## 步骤 3：注册系统迁移

### DeferredRegister → Registry.register

```java
// Forge
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistry.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.create(Material.STONE)));

// ✅ Fabric 1.14.4
private static final Block MY_BLOCK = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_block"),
    new Block(Block.Settings.copy(Blocks.STONE))  // ✅ 1.14.4 使用 Block.Settings
);
```

> **注意**：
> - 1.14.4 用 `Registry.BLOCK`（VanillaRegistry 静态字段）
> - 1.14.4 用 `Block.Settings`（Minecraft 内置），而非 `FabricBlockSettings`
> - 没有 `Registries` 枚举类

---
## 步骤 4：事件系统迁移

```java
// Forge
@SubscribeEvent
public void onPlayerJoin(PlayerEvent.PlayerLoggedInEvent event) {
    // 处理玩家加入
}

// ✅ Fabric 1.14.4
ServerSidePacketRegistry.INSTANCE.register(new Identifier(MOD_ID, "player_join"),
    (server, handler, buf, responseSender) -> {
        // 处理玩家加入
    }
);
```

---
## 步骤 5：Mixin 迁移（1.14.x 配置）

```java
// ❌ Forge mixin 配置 (build.gradle)
plugins { id 'org.spongepowered.mixin' version '0.7.+' }
mixin { add sourceSets.main, "${mod_id}.refmap.json" }

// ✅ Fabric 1.14.4 mixin 配置
```

```json
// fabric.mixins.json
{
  "required": true,
  "minVersion": "0.3",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_8",
  "client": ["client.MyMixin"],
  "mixins": []
}
```

---
## 常见陷阱

1. **Java 版本**：Fabric 1.14.4 需要 Java 8（Forge 1.14.4 也需要 Java 8，版本一致）
2. **Mixin 包名**：确保 `fabric.mixins.json` 的 `package` 与实际包名一致
3. **客户端/服务端分离**：GUI 和渲染相关必须在 `ClientModInitializer` 中处理
4. **Registry API**：1.14.4 使用 `Registry.ITEM` 而非 `Registry.ITEM`
5. **Fabric API Maven**：依赖路径为 `net.fabricmc.fabric-api` 而非 `net.fabric.sdk`
6. **Block.Settings**：1.14.4 使用 `Block.Settings` 而非 `FabricBlockSettings`
