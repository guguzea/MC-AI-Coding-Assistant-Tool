# 版本迁移笔记摘要

> 按版本分段的迁移要点。

---

## 1.15.2 → 1.16（重要断裂）

**关键变化**：
- Java 版本：Java 11 → Java 16
- pack_format：5 → 6
- 方块属性 API 基本保持不变

**需要修改的文件类型**：
- `gradle.properties`：升级 `minecraft_version` 和 `forge_version`
- `build.gradle`：升级 ForgeGradle 版本
- 所有 Java 文件中如有用到 Java 16+ 特有语法

---

## 1.16 → 1.17

**关键变化**：
- Java 版本：Java 16 → Java 17
- pack_format：6 → 7
- 基本为增量更新

---

## 1.17 → 1.18

**关键变化**：
- Java 版本：Java 17（必须）
- pack_format：7 → 8
- DeferredRegister 完全可用
- 方块属性：`Properties.create()` → `Properties.of()`

---

## 版本对照表（关键断裂）

| MC 版本 | Forge | Fabric Loader | Java 版本 |
|---------|-------|---------------|-----------|
| 1.15.2 | 31.2.x | — | Java 11 |
| 1.16.5 | 36.2.x | 0.11.x | Java 16 |
| 1.17.1 | 37.1.x | 0.12.x | Java 17 |
| 1.18.2 | 40.1.x | 0.13.x | Java 17 |
| 1.19.4 | 44.1.x | 0.14.x | Java 17 |
| 1.20.1 | 47.2.x | 0.15.x | Java 17 |

---

## 迁移优先级建议

当目标版本不在知识库中时，建议按以下顺序查阅：
1. 目标 Loader 的官方 changelog
2. `query_api` 工具查询具体类的 API 签名变化
3. 社区 Discord / Reddit 的迁移经验贴
