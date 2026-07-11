# Minecraft Mod 跨平台/跨版本移植指南

> 本文档是 MC_skill AGENTS.md 的第四条平台路径，用于指导 Fabric ↔ NeoForge ↔ Forge 跨平台移植以及 Minecraft 1.16 → 26.1 跨版本迁移。
>
> **资料来源**：Fabric 官方文档、NeoForge 官方博客、Architectury 官方文档、mc-mod-porter knowledge-base

---

## 决策入口（Decision Flow）

```
用户要"跨平台"（Fabric ↔ NeoForge ↔ Forge）
  → 单 Loader → Architectury 多 Loader 重构
  → 已有 Architectury → 添加/移除 Loader

用户要"跨版本"（同 Loader 内升级/降级）
  → 1.x 版本内升级（patch/minor）— 增量修复
  → 跨 major 版本升级 — 三重处理（Java + Mappings + API）
  → 1.20.1 → 1.20.2 — Forge→NeoForge 分叉年（最大断裂点）
  → 1.21.x → 26.1 — 日历版本（Java 25 / deobfuscated / Mojang Mappings）

用户要"同时跨平台+跨版本"
  → 推荐路线：先平台基座（Architectury），再版本跃迁
```

---

## 1. Architectury 多 Loader 重构标准路径

### 1.1 项目结构

```
my-mod/
├── build.gradle                    # Root: architectury-plugin + loom 配置
├── settings.gradle                 # include("common"), include("fabric"), include("neoforge")
├── gradle.properties               # minecraft_version, loader versions, mappings
├── common/
│   └── src/main/java/net/<modid>/  # 纯逻辑代码（不含 Loader API）
│       └── assets/<modid>/         # 共享资源（blockstates, models, lang, tags）
├── fabric/
│   └── src/main/java/              # Fabric 入口点 + Loader 专属实现
│   └── src/main/resources/
│       └── fabric.mod.json
└── neoforge/
    └── src/main/java/              # NeoForge 入口点 + Loader 专属实现
    └── src/main/resources/META-INF/
        └── neoforge.mods.toml
```

### 1.2 Root build.gradle（architectury-plugin 3.4+）

```groovy
plugins {
    id 'architectury-plugin' version '3.4'
    id 'dev.architectury.loom' version '3.4'
    id 'com.github.johnrengelman.shadow' version '8.1.1' apply false
}

subprojects {
    apply plugin: 'dev.architectury.loom'
    loom { silentMojangMappingsLicense() }
    dependencies {
        minecraft "com.mojang:minecraft:${rootProject.minecraft_version}"
        mappings loom.layered {
            officialMojangMappings()
            // 可选叠加 Parchment：
            parchment("org.parchmentmc.data:parchment-${rootProject.minecraft_version}:2024.01.20@zip")
        }
    }
}
```

### 1.3 common/build.gradle

```groovy
architectury {
    common("fabric", "forge", "neoforge") {
        it.platformPackage "neoforge", "forge"
    }
}
```

### 1.4 loader 子工程 build.gradle

```groovy
// fabric/build.gradle 或 neoforge/build.gradle
architectury { platformSetupLoomIde() neoForge() }
// 或 forge() / fabric() 按实际目标
```

### 1.5 @ExpectPlatform 抽象模式

Common 模块声明接口：

```java
// net/examplemod/ConfigHelper.java（common 模块）
package net.examplemod;

import dev.architectury.injectables.annotations.ExpectPlatform;
import java.nio.file.Path;

public class ConfigHelper {
    @ExpectPlatform
    public static Path getConfigPath(String filename) {
        throw new AssertionError("Platform implementation missing!");
    }
}
```

Fabric 实现（`fabric/src/main/java/net/examplemod/fabric/ConfigHelperImpl.java`）：

```java
package net.examplemod.fabric;

import net.fabricmc.loader.api.FabricLoader;
import java.nio.file.Path;

public class ConfigHelperImpl {
    public static Path getConfigPath(String filename) {
        return FabricLoader.getInstance().getConfigDir().resolve(filename);
    }
}
```

NeoForge 实现（`neoforge/src/main/java/net/examplemod/neoforge/ConfigHelperImpl.java`）：

```java
package net.examplemod.neoforge;

import net.neoforged.fml.loading.FMLPaths;
import java.nio.file.Path;

public class ConfigHelperImpl {
    public static Path getConfigPath(String filename) {
        return FMLPaths.GAMEDIR.get().resolve("config").resolve(filename);
    }
}
```

**Kotlin 注意事项**：Kotlin `object` 单例的 `@ExpectPlatform` 实现与 Java 不同。Kotlin 文件若调用 Loader API，需先抽象为 `companion object` 或顶级函数的 `@ExpectPlatform` 形式。

### 1.6 注册系统抽象（DeferredRegister）

Common 模块使用 Architectury 的 `DeferredRegister`（1.19.4+）：

```java
// 注册在 common 模块，但实际事件总线在 loader 子工程中注册
public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(MOD_ID, Registries.ITEM);
public static final RegistrySupplier<Item> EXAMPLE_ITEM = ITEMS.register("example_item",
    () -> new Item(new Item.Properties()));
// 在 loader 子工程的 ModInit 中调用：ITEMS.register(modEventBus);
```

### 1.7 Mixin 分离

Mixin **不可跨 Loader 共享**，必须在 loader 子工程各维护一份：

```
common/src/main/resources/examplemod-common.json  ← common 用的 AW/interfaces
fabric/src/main/resources/examplemod-fabric.json    ← Fabric mixin
neoforge/src/main/resources/examplemod-neoforge.json ← NeoForge mixin
```

---

## 2. 跨大版本升级 Checklist

### 场景 A：Forge → NeoForge 1.20.2（最大断裂点）

> 来源：https://neoforged.net/news/20.2release/ + https://neoforged.net/news/20.2registry-rework/

1. 包名迁移：`net.minecraftforge` → `net.neoforged`
2. `mods.toml` 中 `modId="forge"` → `modId="neoforge"`
3. Gradle 升级为 NeoGradle 7（移除 `fg.deobf` 配置，简化为 Minecraft + NeoForge 版本号）
4. `RegistryObject<T>` → `DeferredHolder<T, T>` 或 `Supplier<T>`
5. 重新注册所有 DeferredRegister 的事件总线
6. 检查 `EventBus` 订阅（mod bus / forge bus 分离逻辑不变）

```java
// Forge 37.x
public static final RegistryObject<Enchantment> MAGIC = ENCHANTMENTS.register("magic", () -> new MagicEnchantment());

// NeoForge 1.20.2+
public static final DeferredHolder<Enchantment, MagicEnchantment> MAGIC = ENCHANTMENTS.register("magic", () -> new MagicEnchantment());
// 或：
public static final Supplier<MagicEnchantment> MAGIC = ENCHANTMENTS.register("magic", () -> new MagicEnchantment());
```

### 场景 B：Minecraft 1.21.x → 26.1（日历版本，三重断裂）

> 来源：https://docs.neoforged.net/primer/docs/26.1/ + https://docs.fabricmc.net/develop/porting/

**断裂 1 — Java Toolchain**：Java 21 → Java 25，IntelliJ IDEA 需 2025.2+

**断裂 2 — Mappings 切换**：26.1 是首个 deobfuscated 版本
- Fabric：如用 Yarn，先迁移到 Mojang（`./gradlew migrateMappings`）
- Forge/NeoForge：Parchment 可选保留，建议移除简化

**断裂 3 — Vanilla API 重构**

ItemStack 迁移（数据文件场景）：
```java
// Before
ItemStack stack = new ItemStack(Items.DIAMOND_SWORD, 1);
// After
ItemStackTemplate template = new ItemStackTemplate(
    Items.DIAMOND_SWORD.builtInRegistryHolder(), 1, DataComponentPatch.EMPTY);
ItemStack stack = template.create();
```

Loot 类型解包：`LootItemFunctionType` 的 codec 注册 → `MapCodec` + `Registry.register`

ChunkPos 构造：`new ChunkPos(x, z)` → `ChunkPos.containing(x, z)`，`ChunkPos.asLong()` → `ChunkPos.pack()`

### 场景 C：1.x 内 patch 升级（最小风险）

1. 升级 `gradle/wrapper/gradle-wrapper.properties`
2. 更新 `gradle.properties` 依赖矩阵
3. 逐文件对比 API 签名（`query_api` 工具查询新版本签名）
4. 编译 + 收集错误 → 逐一修复

---

## 3. 移植风险分类

| 风险域 | 识别方式 | 影响说明 | 缓解方案 |
|--------|---------|---------|---------|
| Registry | 搜索 `DeferredRegister`/`Registry.register`/`FabricRegistry` | Forge→NeoForge 包名变更有风险 | 使用 Architectury `DeferredRegister` 统一抽象 |
| 网络层 | 搜索 `SimpleChannel`/`ClientPlayNetworking`/`PacketByteBuf` | 各 Loader 网络 API 差异最大 | 在 common 中用 `@ExpectPlatform` 抽象分层 |
| 配置层 | 搜索 `ForgeConfigSpec`/`Configuration`/`ConfigScreen` | Forge Config API Port 可跨 Loader 统一 | 引入 Forge Config API Port lib |
| Mixin | 搜索 `mixin.json` | Mixin 必须在 loader 子工程各维护一份 | 拆分到子工程，避免 common 引用 mixin 包 |
| 数据生成 | 搜索 `DataGenerator`/`DataProvider` | 各 Loader Datagen 注册方式不同 | Datagen 尽量在 loader 子工程处理 |
| 客户端分离 | 搜索 `@OnlyIn(Dist.CLIENT)` | 混淆服务端/客户端边界 | Architectury Loom 自动处理 remap |

---

## 4. 引用链接

| 场景 | 参考来源 |
| ---- | -------- |
| Fabric 26.1 迁移（官方） | https://docs.fabricmc.net/develop/porting/ |
| Fabric Mappings 迁移（Yarn→Mojang） | https://docs.fabricmc.net/develop/porting/mappings/ |
| NeoForge 1.20.2 发布说明 | https://neoforged.net/news/20.2release/ |
| NeoForge 1.20.2 Registry 重构 | https://neoforged.net/news/20.2registry-rework/ |
| NeoForge 1.21.11→26.1 官方迁移指南 | https://docs.neoforged.net/primer/docs/26.1/ |
| NeoForge 26.1 发布说明 | https://neoforged.net/news/26.1release/ |
| Architectury 官方文档 | https://docs.architectury.dev/ |
| Architectury @ExpectPlatform | https://docs.architectury.dev/plugin/expect_platform |
| Architectury 项目生成器 | https://generate.architectury.dev |
| Architectury 插件（含 Gradle 配置） | https://github.com/architectury/architectury-plugin |
| MultiLoader 模板（Java，最流行） | https://github.com/jaredlll08/MultiLoader-Template |
| Larsen's Mods Architectury 完整教程 | https://larsensmods.de/architectury-guide/ |
| Quilt 官方模板 | https://github.com/QuiltMC/quilt-template-mod |
| Quilted Fabric API（兼容性层） | https://github.com/QuiltMC/Quilted-Fabric-API |
| Forge Config API Port | https://www.curseforge.com/minecraft/mc-mods/forge-config-api-port |
| mc-mod-porter（知识库+auto porter） | https://github.com/reqsery/mc-mod-porter |
