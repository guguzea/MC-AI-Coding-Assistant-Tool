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
  → 1.16.5 → 1.17.1 — Java 版本断裂（8 → 16；1.15.2 / 1.16.5 均为 Java 8）

用户要"同时跨平台+跨版本"
  → 推荐路线：先平台基座（Architectury），再版本跃迁
```

---

## 1.15.2 → 1.20.x 迁移要点

### 断裂点分析

| 断裂类型 | 1.15.2 → 1.16 | 1.16 → 1.17 | 1.17 → 1.18+ |
|----------|----------------|--------------|---------------|
| Java 版本 | **Java 8 → Java 8**（不变） | Java 8 → 16 | Java 16 → 17 |
| 方块实体 | `TileEntity` | `TileEntity` | `TileEntity` → `BlockEntity` |
| 方块属性 | `Properties.create()` | `Properties.create()` | `Properties.of()` |
| 工具材料 | `IItemTier` | `IItemTier` | `IItemTier` → `Tier` |
| ForgeGradle | 4.x | 5.x | 6.x |
| Gradle | 7.x | 7.x | 8.x |

### 迁移 Checklist

1. **Java 版本**：1.15.2 与 1.16.5 都按 **Java 8** 编译（`forge_1.15.2/…/gettingstarted.md:14`、`forge_1.16.5/…/gettingstarted.md:14`）；**Java 16 从 1.17.1 起**（`forge_1.17.1/…/gettingstarted.md:14`），**Java 17 从 1.18.2 起**（`forge_1.18.2/…/gettingstarted.md:14`）
2. **Gradle**：升级到 Gradle 8.x
3. **方块属性 API**：从 `Block.Properties.create()` 迁移到 `Block.Properties.of()`
4. **方块实体**：从 `TileEntity` 重命名为 `BlockEntity`（API 基本一致）
5. **工具材料**：从 `IItemTier` 迁移到 `Tier`
6. **build.gradle**：升级 ForgeGradle 版本

### 版本对照表

| MC 版本 | Forge | Java 版本 | Gradle | ForgeGradle |
|---------|-------|-----------|--------|-------------|
| 1.15.2 | 31.2.x | Java 8 | 7.x | 4.x |
| 1.16.5 | 36.2.x | Java 8 | 7.x | 4.x |
| 1.17.1 | 37.1.x | Java 16 | 7.x | 5.x |
| 1.18.2 | 40.x | Java 17 | 7.x | 5.x |
| 1.19.4 | 45.x | Java 17 | 8.x | 6.x |
| 1.20.1 | 47.x | Java 17 | 8.x | 6.x |

> **Java 列有出处**：各版官方 `gettingstarted.md`（1.15.2:14 / 1.16.5:14 / 1.17.1:14 / 1.18.2:14 / 1.19.4:15 / 1.20.1:15），并与官方 MDK 的 toolchain 声明一致（1.15.2 `build.gradle:19` = `'1.8'`、1.16.5 `:19` = `JavaLanguageVersion.of(8)`、1.17.1 `:21` = `of(16)`、1.18.2 / 1.19.4 / 1.20.1 `:16` = `of(17)`）。
> **Forge 列**：为官方 MDK 实测量级 —— 31.2.57 / 36.2.34 / 37.1.1 / 40.3.0 / 45.4.0 / 47.4.10（sha256 钉在 `mcp-server/data/mdk-checksums.json`，`source=official`）。本表原写 1.18.2 = 40.1.x、1.19.4 = 44.1.x、1.20.1 = 47.2.x 与 MDK 不符，已改为量级。
> **Gradle / ForgeGradle 两列不是官方口径**，是本仓 `scaffold/` 实测值：1.15.2 = FG `[4.1,4.2)` + Gradle 7.3.3、1.16.5 = FG `[4.1,4.2)` + 7.6、1.17.1 = FG `5.1.+` + 7.2、1.18.2 = FG `[5.1.2,5.2)` + 7.6、1.19.4 = FG `[6.0,6.2)` + 8.8、1.20.1 = FG `[6.0,6.2)` + 8.5。
> 官方 MDK 的对应组合为：1.15.2 = FG `3.+` + Gradle 4.10.3、1.16.5 = FG `5.1.+` + 7.3.3、1.17.1 = FG `5.1.+` + 7.2、1.18.2 / 1.19.4 / 1.20.1 = FG `[6.0,6.2)` + 8.8。1.15.2 / 1.16.5 / 1.18.2 / 1.20.1 四档 scaffold ≠ MDK（未裁定分歧），移植时以用户工程自己的声明为准。
> （`wrapper` 能启动 ≠ 该组合能完成构建）。
