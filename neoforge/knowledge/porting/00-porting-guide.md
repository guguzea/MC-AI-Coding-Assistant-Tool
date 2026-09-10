# 跨平台移植指南

> 本指南帮助你在不同模组加载器（Minecraft Forge / NeoForge / Fabric）之间移植模组代码。

## 平台对比

| 特性 | Forge | NeoForge | Fabric |
|------|-------|---------|--------|
| 注册系统 | DeferredRegister / RegistryObject | DeferredRegister / DeferredHolder | Registry#register |
| Mixin 支持 | 不由构建插件提供：老档（1.8–1.12.2）用 MixinBooter，1.16–1.20.x dev 期插件出 refmap + 运行时 loader 装载 config（见 `community_knowledge/authored/mixin-practices-crossplatform.md`） | 同属加载器能力，与 Gradle 插件无关。1.21.1+ 语料有 `[[mixins]]` + `config="examplemod.mixins.json"`（`data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/gettingstarted_modfiles.md:209-216`）；1.20.4 / 1.20.6 语料 `grep -i mixin` 零命中 → 写前按精确版本核实 | Loader 原生：`fabric.mod.json` 的 `mixins` 数组 + `*.mixins.json`，无需额外依赖 |
| 事件系统 | @SubscribeEvent + MinecraftForge.EVENT_BUS | @SubscribeEvent + NeoForge.EVENT_BUS | @Environment / Callback |
| 网络通信 | SimpleChannel (`net.minecraftforge.network`) | **不要**抄 SimpleChannel。1.20.4 起走 Payload（官方 menus 页仍可能写 `NetworkHooks.openScreen`；1.21.1 网络页是 `RegisterPayloadHandlersEvent`）。按 `neoforge/<精确版本>/.cursor/rules/06-networking.mdc` | Fabric `PayloadTypeRegistry` / `CustomPayload` |
| 元数据文件 | mods.toml | `META-INF/mods.toml`（≤1.20.4）→ `META-INF/neoforge.mods.toml`（1.20.6 起） | fabric.mod.json |
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
net.minecraftforge.eventbus   → net.neoforged.bus      # 例外：事件总线是独立制品，不在 net.neoforged.neoforge.* 下
```

### 导入语句变更

```java
// Forge 1.20.1
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;

// NeoForge 1.20.4
import net.neoforged.api.distmarker.Dist;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.bus.api.IEventBus;                 // 事件总线换到 net.neoforged.bus
import net.neoforged.neoforge.registries.DeferredRegister;
import net.minecraft.core.registries.Registries;
```

> 两边都**没有** `eventbus.api.Bus` 这个类。上表取自本仓 scaffold 实测 import：
> `forge/1.20.4/scaffold` 用 `net.minecraftforge.eventbus.api.IEventBus`，
> `neoforge/<ver>/scaffold` 用 `net.neoforged.bus.api.IEventBus` / `net.neoforged.bus.api.SubscribeEvent`。

### Gradle 配置变更

```groovy
// build.gradle —— Forge（ForgeGradle）→ NeoForge（ModDevGradle）
plugins {
    id 'java-library'
    id 'maven-publish'
    id 'net.neoforged.moddev' version '2.0.144'   // 实测 plugins.gradle.org 最新 2.0.146
    id 'idea'
}

neoForge {
    version = project.neo_version        // 取代 Forge 的 minecraft "net.minecraftforge:forge:..."
    parchment {                          // 可选：参数名 + Javadoc 层
        mappingsVersion = project.parchment_mappings_version
        minecraftVersion = project.parchment_minecraft_version
    }
    runs {
        client { client() }
        server { server() }
    }
}
```

> Forge 侧的 `minecraft { mappings channel: 'parchment', version: '...' }` 与
> `minecraft "net.neoforged:neoforge:${neoform_version}"` 在 MDG 里都**没有**对应写法：
> MDG 用 `neoForge { version = ... }`，不需要 `minecraft` 依赖行。
> NeoForge 侧当前在用的插件 id 是 `net.neoforged.moddev`（MDG）与 `net.neoforged.gradle.userdev`（NeoGradle，最新 7.1.38）两套；
> 裸 `net.neoforged.gradle` 是旧 Forge 时代的 NeoGradle，版本停在 6.0.21，写 `[7.0.15,7.2)` 解析不到。
> 上面的骨架取自 `neoforge/1.21.1/scaffold/build.gradle:1-6,41-48`（1.20.6 起的 8 份 scaffold 同形，只有钉值不同；`1.20.4` 钉 `2.0.143`）。移植到具体档时以该档 `neoforge/<精确版本>/scaffold/build.gradle` 为准。

### mods.toml → neoforge.mods.toml

```toml
# Forge mods.toml
[[dependencies.examplemod]]
modId="forge"  # Forge 依赖使用 "forge"

# NeoForge neoforge.mods.toml
[[dependencies.examplemod]]
modId="neoforge"  # NeoForge 依赖使用 "neoforge"
```

> 文件名分叉：**只有 1.20.6 起**才叫 `neoforge.mods.toml`（`data/neoforge_1.20.6/.../gettingstarted_modfiles.md:71`）；
> `1.20.4` 及更早仍是 `META-INF/mods.toml`（实测 `neoforge/1.20.4/scaffold/src/main/templates/META-INF/mods.toml`）。
> 但 `modId="neoforge"` 从 1.20.4 起就已成立——别因为文件名没改就把工程判成 Forge。

### 入口类（Forge ≤1.20.1 与 NeoForge）

```java
// Forge 1.20.1
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public ExampleMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        BLOCKS.register(modEventBus);
    }

    @SubscribeEvent
    public void onCommonSetup(FMLCommonSetupEvent event) { ... }
}

// NeoForge 1.20.4
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public ExampleMod(IEventBus modBus) {
        BLOCKS.register(modBus);
        NeoForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void onCommonSetup(FMLCommonSetupEvent event) { ... }
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
public class ExampleMod implements ModInitializer {
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
public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(Registries.ITEM, MOD_ID);
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
| Registry 持有类 | ForgeRegistries | Registries / BuiltInRegistries | Registries (Vanilla) |
| Capability 接口 | ICapabilityProvider | ICapabilityProvider | N/A |
| Dist 注解 | @OnlyIn(Dist.CLIENT) | @OnlyIn(Dist.CLIENT) | @Environment(EnvType.CLIENT) |

---

## 工具推荐

- **Mappings**: 推荐使用 ParchmentMC（所有平台）
- **IDE 插件**: ForgeGradle 用户推荐装 Minecraft Development；NeoGradle 用户推荐装对应插件
- **Mixin 验证**: NeoForge 需要在 neoforge.mods.toml 中声明 mixin config
