# 版本迁移笔记摘要

> 按版本分段的迁移要点。

---

## 1.14.4 → 1.15.2

**关键变化**：
- Forge 版本：28.x → 31.x
- pack_format：5 → 6
- ForgeGradle 4.x 引入

**需要修改的文件类型**：
- `gradle.properties` 中的版本号
- `pack.mcmeta` 中的 pack_format
- `build.gradle` 可能需要更新插件版本

---

## 1.15.2 → 1.16.5

**关键变化**：
- Java：8/11 → 11/16
- pack_format：6 → 7
- 部分 API 变更

---

## 1.16.5 → 1.17.1

**关键变化**：
- Java：11/16 → 16（强制）
- pack_format：7 → 8
- `net.minecraft.block.material.Material` 改名

---

## 1.17.1 → 1.18.2

**关键变化**：
- Java：16 → 17（强制）
- pack_format：8 → 9
- 包名：`net.minecraft.util` → `net.minecraft.util.math` 等
- DeferredRegister 完全成熟

---

## 版本对照表（关键分叉）

| MC 版本 | Forge | Java | pack_format |
|---------|-------|------|-------------|
| 1.14.4 | 28.2.x | 11 | 5 |
| 1.15.2 | 31.2.x | 11 | 6 |
| 1.16.5 | 36.2.x | 11/16 | 7 |
| 1.17.1 | 37.1.x | 16 | 8 |
| 1.18.2 | 40.2.x | 17 | 9 |
| 1.19.4 | 45.x | 17 | 12 |
| 1.20.1 | 47.x | 17 | 15 |

---

## 迁移优先级建议

当目标版本不在知识库中时，建议按以下顺序查阅：
1. 目标 Loader 的官方 changelog
2. `query_api` 工具查询具体类的 API 签名变化
3. 社区 Discord / Reddit 的迁移经验贴
