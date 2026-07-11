# 版本迁移笔记摘要

> 按版本分段的迁移要点。资料来源：mc-mod-porter knowledge-base（https://github.com/reqsery/mc-mod-porter）+ NeoForge 官方博客 + Fabric 官方文档
>
> **当前知识库覆盖范围**：1.19.4 → 26.1。1.16 ~ 1.19.3 版本暂未覆盖，缺失时 `analyze_porting_path` 会输出提示，建议使用 `query_api` 工具逐类对比 API 签名。

---

## 1.17.1 → 1.18.2（重大断裂：ForgeGradle 升级 + Mappings 切换）

**关键变化**：
- ForgeGradle 升级到 6.x（FG5 → FG6）
- Mappings 从 MCP 切换为 official/Parchment
- DeferredRegister 成为推荐注册方式（1.18+）
- `BlockBehaviour.Properties` API 变化（`create()` 移除，使用 `of()` 静态工厂）
- Java 版本：Java 16 → Java 17+

**需要修改的文件类型**：
- `build.gradle`：ForgeGradle plugin 版本升级
- `gradle.properties`：minecraft_version、forge_version 更新
- 所有 Java 文件中的 `BlockBehaviour.Properties.create()` → `BlockBehaviour.Properties.of()`
- `mods.toml` 保持格式兼容

---

## 1.18.2 → 1.19.4（增量升级）

**关键变化**：
- Forge 44.x → 45.x
- EntityType 注册方式保持一致
- DeferredRegister API 完全一致
- DataGen API 基本一致

---

## 1.19.4 → 1.20.1（增量升级）

**关键变化**：
- Forge 45.x → 47.x
- Java 版本均为 Java 17+
- Registry API 完全一致
- DataGen API 完全一致

---

## 1.20.1 → 1.20.2（Forge 分叉点，重大断裂）

**关键变化**：
- Forge 1.20.2 之后不再更新，社区分叉为 NeoForge
- `net.minecraftforge` 包 → `net.neoforged` 包（全局替换）
- `mods.toml` 中 `modId="forge"` → `modId="neoforge"`
- `RegistryObject<T>` → `DeferredHolder<T, T>`（泛型参数收紧）
- NeoGradle 7 引入，build.gradle 配置大幅简化，移除 `fg.deobf`

**需要修改的文件类型**：
- 所有 `import net.minecraftforge.*` → `import net.neoforged.*`
- `build.gradle`：升级 NeoGradle plugin 版本，移除 deobfuscate 配置
- `mods.toml`：modId 字段
- 所有 Java 文件中的 RegistryObject 引用

---

## 1.20.2 → 1.20.4（NeoForge 内小幅升级）

- NeoForge 版本号格式：`20.2.xxx` → `20.4.xxx`
- 无重大 API 断裂，大部分依赖升级即可
- 如需迁移到 1.20.4，建议先完成 1.20.2 的 Forge→NeoForge 迁移，再做版本升级

---

## 1.21.11 → 26.1（2026 日历版本，三重断裂）

> 来源：https://docs.neoforged.net/primer/docs/26.1/ + https://docs.fabricmc.net/develop/porting/

### 断裂 1 — Java Toolchain

- Minecraft 26.1 要求 **Java 25**（之前版本用 Java 21）
- 工具链要求：`java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }`
- IDEA 最低版本：IntelliJ 2025.2+（不能用 2024.x）

### 断裂 2 — Mappings 切换

- 26.1 是首个官方 deobfuscated（不混淆）版本
- Fabric：如果还在用 Yarn Mappings，必须先迁移到 Mojang 官方映射

```bash
# 使用 Ravel 插件（IntelliJ）：Refactor → Remap Using Ravel
# 或使用 Loom task：
./gradlew migrateMappings --mappings "net.minecraft:mappings:1.21.11"
```

- Forge/NeoForge：Parchment 仍可叠加使用（已有官方参数名），但建议移除简化

### 断裂 3 — Vanilla API 重构

**ItemStack 构造**：`new ItemStack(item, count)` 在数据文件加载时不可用 → 改用 `ItemStackTemplate`

```java
// Before
ItemStack stack = new ItemStack(Items.DIAMOND_SWORD, 1);
// After（26.1 数据文件场景）
ItemStackTemplate template = new ItemStackTemplate(
    Items.DIAMOND_SWORD.builtInRegistryHolder(), 1, DataComponentPatch.EMPTY);
ItemStack stack = template.create();
```

**Loot 类型解包**：`LootItemFunctionType` 的 codec 注册方式改变（需要解包为 `MapCodec` + `Registry.register`）

**ChunkPos 构造**：`new ChunkPos(x, z)` / `ChunkPos.asLong()` 替换为 `ChunkPos.containing()` / `ChunkPos.pack()`

---

## 版本对照表（关键分叉）

| MC 版本 | Forge | NeoForge | Fabric Loader | Yarn Mappings |
|--------|-------|----------|---------------|---------------|
| 1.17.1 | 37.1.x | — | — | — |
| 1.18.2 | 40.x | — | — | 可用 |
| 1.19.4 | 45.x | — | 0.14.x | 可用 |
| 1.20.1 | 47.2.0 | — | 0.15.0 | 可用 |
| 1.20.2 | — | 20.2.x | 0.15.0 | 可用 |
| 1.20.4 | — | 20.4.x | 0.15.7 | 可用 |
| 1.21.x | — | 21.x | 0.16.x | 可用 |
| 26.1 | — | 26.1.x | 0.16.x | 需迁移到 Mojang |

---

## 迁移优先级建议

当目标版本不在知识库中时，建议按以下顺序查阅：
1. 目标 Loader 的官方 changelog
2. `query_api` 工具查询具体类的 API 签名变化
3. 社区 Discord / Reddit 的迁移经验贴
