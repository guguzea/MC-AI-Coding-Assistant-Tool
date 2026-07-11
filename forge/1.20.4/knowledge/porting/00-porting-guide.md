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
  → 1.20.1 → 1.20.4 — Forge 1.20.4 小幅升级（API 一致）
  → 1.21.x → 26.1 — 日历版本（Java 25 / deobfuscated / Mojang Mappings）

用户要"同时跨平台+跨版本"
  → 推荐路线：先平台基座（Architectury），再版本跃迁
```

---

## 1. Forge 1.20.1 → 1.20.4 迁移（小幅升级）

> Forge 1.20.4 继承了 1.20.1 的 API，大部分代码无需修改。

### 关键变更

| 项目 | 1.20.1 | 1.20.4 |
|------|---------|---------|
| Forge 版本 | 47.x | 49.x |
| Parchment 映射 | 2023.09.03-1.20.1 | 2024.11.30-1.20.4 |
| pack_format | 15 | 15（不变） |

### 需要修改的文件

1. `gradle.properties`：
   ```properties
   minecraft_version=1.20.4
   forge_version=49.0.0
   forge_version_range=[49,)
   mapping_version=2024.11.30-1.20.4
   ```

2. `build.gradle`（如使用 Parchment）：
   ```groovy
   mappings channel: 'parchment', version: '1.20.4-2024.11.30'
   ```

3. `mods.toml`（如更新元数据）：
   ```toml
   [[dependencies.examplemod]]
   modId="forge"
   mandatory=true
   versionRange="[49,)"
   ```

---

## 2. Architectury 多 Loader 重构标准路径

### 2.1 项目结构

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

### 2.2 @ExpectPlatform 抽象模式

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

### 2.3 Mixin 分离

Mixin **不可跨 Loader 共享**，必须在 loader 子工程各维护一份：

```
common/src/main/resources/examplemod-common.json  ← common 用的 AW/interfaces
fabric/src/main/resources/examplemod-fabric.json    ← Fabric mixin
neoforge/src/main/resources/examplemod-neoforge.json ← NeoForge mixin
```

---

## 3. 跨大版本升级 Checklist

### 场景 A：Forge → NeoForge 1.20.2（最大断裂点）

> 来源：https://neoforged.net/news/20.2release/ + https://neoforged.net/news/20.2registry-rework/

1. 包名迁移：`net.minecraftforge` → `net.neoforged`
2. `mods.toml` 中 `modId="forge"` → `modId="neoforge"`
3. Gradle 升级为 NeoGradle 7（移除 `fg.deobf` 配置，简化为 Minecraft + NeoForge 版本号）
4. `RegistryObject<T>` → `DeferredHolder<T, T>` 或 `Supplier<T>`
5. 重新注册所有 DeferredRegister 的事件总线
6. 检查 `EventBus` 订阅（mod bus / forge bus 分离逻辑不变）

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

---

## 4. 引用链接

| 场景 | 参考来源 |
| ---- | -------- |
| Fabric 26.1 迁移（官方） | https://docs.fabricmc.net/develop/porting/ |
| NeoForge 1.20.2 发布说明 | https://neoforged.net/news/20.2release/ |
| NeoForge 1.20.2 Registry 重构 | https://neoforged.net/news/20.2registry-rework/ |
| NeoForge 1.21.11→26.1 官方迁移指南 | https://docs.neoforged.net/primer/docs/26.1/ |
| Architectury 官方文档 | https://docs.architectury.dev/ |
| MultiLoader 模板（Java，最流行） | https://github.com/jaredlll08/MultiLoader-Template |
| Larsen's Mods Architectury 完整教程 | https://larsensmods.de/architectury-guide/ |
