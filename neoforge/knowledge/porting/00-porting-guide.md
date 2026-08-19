# 跨平台移植指南

> 本指南帮助你在不同模组加载器（Minecraft Forge / NeoForge / Fabric）之间移植模组代码。

## 平台对比

| 特性 | Forge | NeoForge | Fabric |
|------|-------|---------|--------|
| 注册系统 | DeferredRegister / RegistryObject | DeferredRegister / DeferredHolder | Registry#register |
| Mixin 支持 | via ForgeGradle | via NeoGradle | 内置 |
| 事件系统 | @SubscribeEvent + MinecraftForge.EVENT_BUS | @SubscribeEvent + NeoForge.EVENT_BUS | @Environment / Callback |
| 网络通信 | SimpleChannel (`net.minecraftforge.network`) | **不要**抄 SimpleChannel。1.20.4 起走 Payload（官方 menus 页仍可能写 `NetworkHooks.openScreen`；1.21.1 网络页是 `RegisterPayloadHandlersEvent`）。按 `neoforge/<精确版本>/.cursor/rules/06-networking.mdc` | Fabric `PayloadTypeRegistry` / `CustomPayload` |
| 元数据文件 | mods.toml | neoforge.mods.toml | fabric.mod.json |
| Mod ID 依赖 | `modId="forge"` | `modId="neoforge"` | N/A |
| 包名空间 | net.minecraftforge | net.neoforged | net.fabricmc.fabric.* |
| 数据生成 | GatherDataEvent | GatherDataEvent | FabricDataGenerator |

---

## Forge → NeoForge 移植

### 包名空间迁移

```
net.minecraftforge.fml        → net.neoforged.fml
net.minecraftforge.network    → net.neoforged.neoforge.network
net.minecraftforge.api.distmarker → net.neoforged.api.distmarker
```

### 导入语句变更

```java
// Forge 1.20.1
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.Bus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;

// NeoForge 1.20.4
import net.neoforged.api.distmarker.Dist;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.eventbus.api.Bus;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;
// 注意：无 @Mod 注解类，使用 BuildPlugin 模式
```

### Gradle 配置变更

```groovy
// build.gradle
plugins {
    id 'net.neoforged.gradle' version '[7.0.15,7.2)'  // Forge → NeoForge
}

dependencies {
    minecraft "net.neoforged:neoforge:${neoform_version}"
}
```

### mods.toml → neoforge.mods.toml

```toml
# Forge mods.toml
[[dependencies.examplemod]]
modId="forge"  # Forge 依赖使用 "forge"

# NeoForge neoforge.mods.toml
[[dependencies.examplemod]]
modId="neoforge"  # NeoForge 依赖使用 "neoforge"
```

### BuildPlugin 模式（替代 @Mod 注解）

```java
// Forge 1.20.1
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public ExampleMod(FMLCommonSetupEvent event) { ... }
}

// NeoForge 1.20.4
public class ExampleMod {
    public static void init(IEventBus modEventBus) {
        BLOCKS.register(modEventBus);
        NeoForge.EVENT_BUS.register(ExampleMod.class);
    }

    @SubscribeEvent
    public static void onCommonSetup(FMLCommonSetupEvent event) { ... }
}
```

---

## Forge → Fabric 移植

### 入口点变更

```java
// Forge
@Mod(MOD_ID)
public class ExampleMod {
    ExampleMod() { ... }
}

// Fabric
@Mod(MOD_ID)
public class ExampleMod implements InitializingDrawableEvent, CallbackAware {
    @Override
    public void onInitialize() { ... }
}
```

### 事件注册变更

```java
// Forge
MinecraftForge.EVENT_BUS.register(this);

// Fabric
ClientTickEvents.END_CLIENT_TICK.register(this);
```

### Registry 变更

```java
// Forge
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item", Item::new);

// Fabric
public static final Item MY_ITEM = Registry.register(
    Registries.ITEM, new Identifier(MOD_ID, "my_item"), new Item(...)
);
```

---

## NeoForge → Fabric 移植

### 网络通信变更

```java
// NeoForge 1.21.x：不要写 SimpleChannel。用 RegisterPayloadHandlersEvent + CustomPacketPayload
// 全文见该档 neoforge/<ver>/.cursor/rules/06-networking.mdc 与官方
// https://docs.neoforged.net/docs/1.21.1/networking/payload/
```

### DeferredRegister → Registry.register

```java
// NeoForge
public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(NeoForgeRegistries.ITEMS, MOD_ID);
public static final DeferredHolder<Item, Item> MY_ITEM = ITEMS.register("my_item", () -> new Item(...));

// Fabric
public static final Item MY_ITEM = Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), new Item(...));
```

---

## 常见移植陷阱

| 陷阱 | Forge | NeoForge | Fabric |
|------|-------|---------|--------|
| Mod ID 大小写 | 全部小写 | 全部小写 | 全部小写 |
| 包名空间 | net.minecraftforge | net.neoforged | net.fabricmc |
| 事件总线 | MinecraftForge.EVENT_BUS | NeoForge.EVENT_BUS | Callback 接口 |
| Registry 持有类 | ForgeRegistries | NeoForgeRegistries | Registries (Vanilla) |
| Capability 接口 | ICapabilityProvider | ICapabilityProvider | N/A |
| Dist 注解 | @OnlyIn(Dist.CLIENT) | @OnlyIn(Dist.CLIENT) | @Environment(EnvType.CLIENT) |

---

## 工具推荐

- **Mappings**: 推荐使用 ParchmentMC（所有平台）
- **IDE 插件**: ForgeGradle 用户推荐装 Minecraft Development；NeoGradle 用户推荐装对应插件
- **Mixin 验证**: NeoForge 需要在 neoforge.mods.toml 中声明 mixin config
