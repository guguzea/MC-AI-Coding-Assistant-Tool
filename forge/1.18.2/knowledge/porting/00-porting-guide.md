# Minecraft Mod 跨平台/跨版本移植指南

> 本文档是 MC_skill AGENTS.md 的第四条平台路径，用于指导 Fabric ↔ Forge 跨平台移植以及 Minecraft 1.16 → 1.20.x 跨版本迁移。

---

## 决策入口（Decision Flow）

```
用户要"跨平台"（Fabric ↔ Forge）
  → 确定目标平台
  → 识别 API 差异（见 01-api-cross-loader.md）

用户要"跨版本"（同 Loader 内升级/降级）
  → 1.x 版本内升级（patch/minor）— 增量修复
  → 跨 major 版本升级 — 三重处理（Java + Mappings + API）
  → 1.18.x → 1.19.x — 小幅变更
  → 1.19.x → 1.20.x — pack_format、ForgeGradle 变更
```

---

## 1. Forge 跨版本迁移

### 1.1 从 1.18.x 迁移到 1.19.x

**主要变更：**
- ForgeGradle 5.x → 6.x（部分版本）
- pack_format: 9（数据包）
- 基本 API 一致

```groovy
// build.gradle - 1.19.x
id 'net.minecraftforge.gradle' version '[6.0,6.2)'
```

### 1.2 从 1.19.x 迁移到 1.20.x

**主要变更：**
- pack_format: 9 → 15
- 世界高度：部分版本从 -64~320 变回 0~320
- ForgeGradle 6.x only
- Gradle 8.x

```properties
# gradle.properties - 1.20.x
minecraft_version=1.20.1
forge_version=47.2.0
pack_format=15
```

### 1.3 从 1.18.x 迁移到 1.20.x

**需要处理：**
1. ForgeGradle 5.x → 6.x
2. pack_format: 9 → 15
3. 世界高度相关代码
4. Gradle 7.x → 8.x
5. Java 17（不变）

---

## 2. Fabric → Forge 移植

### 2.1 注册系统对比

| Fabric | Forge |
|--------|-------|
| `Registry.register(Registry.BLOCK, id, block)` | `DeferredRegister.create(ForgeRegistries.BLOCKS, MODID).register()` |

### 2.2 事件系统对比

| Fabric | Forge |
|--------|-------|
| `@Environment(EnvType.CLIENT)` | `@OnlyIn(Dist.CLIENT)` |
| `ServerTickEvents` | `DistExecutor.runWhenOn(Dist.DEDICATED_SERVER, ...)` |

### 2.3 资源加载对比

两者资源目录结构相同：`src/main/resources/assets/<modid>/`

### 2.4 Mixin 对比

| Fabric | Forge |
|--------|-------|
| `fabric.mod.json` 中的 `mixins` | `mods.toml` 或 `META-INF/accesstransformer.cfg` |

---

## 3. 移植检查清单

### 必检项

- [ ] mod ID 全小写、无横杠
- [ ] DeferredRegister 正确使用
- [ ] pack_format 匹配版本
- [ ] Java 版本正确（1.18.2 需要 Java 17）
- [ ] ForgeGradle 版本匹配
- [ ] Mappings 配置正确（Parchment 推荐）

### 可选项

- [ ] 使用 `@OnlyIn` 注解客户端/服务端专用代码
- [ ] Capability 系统替代 Mixin（可选）

---

## 4. 引用链接

| 资源 | 链接 |
|------|------|
| Forge 官方文档 | https://docs.minecraftforge.net/en/1.20.x/ |
| Forge GitHub | https://github.com/MinecraftForge/MinecraftForge |
| ParchmentMC | https://parchmentmc.org/ |
| Fabric Wiki | https://fabricmc.net/wiki/ |
| Architectury 文档 | https://docs.architectury.dev/ |
