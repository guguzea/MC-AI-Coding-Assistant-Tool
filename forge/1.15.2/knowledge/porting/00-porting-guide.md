# Minecraft Mod 跨平台/跨版本移植指南

> 本文档是 MC_skill AGENTS.md 的第四条平台路径，用于指导 Fabric ↔ NeoForge ↔ Forge 跨平台移植以及 Minecraft 1.15.2 → 1.20.x 跨版本迁移。

---

## 决策入口（Decision Flow）

```
用户要"跨平台"（Fabric ↔ NeoForge ↔ Forge）
  → 单 Loader → Architectury 多 Loader 重构
  → 已有 Architectury → 添加/移除 Loader

用户要"跨版本"（同 Loader 内升级/降级）
  → 1.x 版本内升级（patch/minor）— 增量修复
  → 跨 major 版本升级 — 三重处理（Java + Mappings + API）
  → 1.15.2 → 1.16 — Java 版本断裂（11 → 16）

用户要"同时跨平台+跨版本"
  → 推荐路线：先平台基座（Architectury），再版本跃迁
```

---

## 1.15.2 → 1.20.x 迁移要点

### 断裂点分析

| 断裂类型 | 1.15.2 → 1.16 | 1.16 → 1.17 | 1.17 → 1.18+ |
|----------|----------------|--------------|---------------|
| Java 版本 | **Java 11 → 16** | Java 16 → 17 | Java 17 |
| 方块实体 | `TileEntity` | `TileEntity` | `TileEntity` → `BlockEntity` |
| 方块属性 | `Properties.create()` | `Properties.create()` | `Properties.of()` |
| 工具材料 | `IItemTier` | `IItemTier` | `IItemTier` → `Tier` |
| ForgeGradle | 4.x | 5.x | 6.x |
| Gradle | 7.x | 7.x | 8.x |

### 迁移 Checklist

1. **Java 版本**：1.15.2 需要 Java 11，升级到 1.16+ 需要 Java 16+
2. **Gradle**：升级到 Gradle 8.x
3. **方块属性 API**：从 `Block.Properties.create()` 迁移到 `Block.Properties.of()`
4. **方块实体**：从 `TileEntity` 重命名为 `BlockEntity`（API 基本一致）
5. **工具材料**：从 `IItemTier` 迁移到 `Tier`
6. **build.gradle**：升级 ForgeGradle 版本

### 版本对照表

| MC 版本 | Forge | Java 版本 | Gradle | ForgeGradle |
|---------|-------|-----------|--------|-------------|
| 1.15.2 | 31.2.x | Java 11 | 7.x | 4.x |
| 1.16.5 | 36.2.x | Java 16 | 7.x | 5.x |
| 1.17.1 | 37.1.x | Java 17 | 7.x | 5.x |
| 1.18.2 | 40.1.x | Java 17 | 7.x | 5.x |
| 1.19.4 | 44.1.x | Java 17 | 7.x | 6.x |
| 1.20.1 | 47.2.x | Java 17 | 8.x | 6.x |
