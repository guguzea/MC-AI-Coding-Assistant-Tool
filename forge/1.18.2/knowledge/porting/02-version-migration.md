# 版本迁移笔记摘要

> 按版本分段的迁移要点。资料来源：Forge 官方 changelog + Forge Discord 迁移指南

---

## 1.18.x → 1.19.x（小幅升级）

**关键变化：**
- ForgeGradle 5.x → 6.x（部分版本）
- pack_format: 9（数据包）
- 基本 API 一致

**需要修改的文件：**
- `build.gradle`：ForgeGradle 版本
- `gradle.properties`：Minecraft / Forge 版本

---

## 1.19.x → 1.20.x（中等升级）

**关键变化：**
- pack_format: 9 → 15
- 世界高度部分版本变化
- ForgeGradle 6.x only
- Gradle 7.x → 8.x

**需要修改的文件：**
- `build.gradle`：ForgeGradle 版本、Gradle 配置
- `gradle.properties`：Minecraft / Forge 版本、pack_format
- 世界生成代码：检查 Y 坐标范围

---

## 1.18.x → 1.20.x（大幅升级）

**需要处理所有上述变更：**
1. ForgeGradle 5.x → 6.x
2. pack_format: 9 → 15
3. Gradle 7.x → 8.x
4. 世界高度相关代码
5. Java 17（不变）

---

## 版本对照表

| MC 版本 | Forge | Fabric Loader | pack_format（数据包） |
|--------|-------|--------------|-------------|
| 1.18.2 | 40.x | — | 9 |
| 1.19.4 | 45.x | — | 12 |
| 1.20.1 | 47.x | — | 15 |

> Forge / pack_format 列为官方 MDK 实测：1.18.2-40.3.0（本包 scaffold 钉 `40.1.80`）、1.19.4-45.4.0、1.20.1-47.4.10；sha256 见 `mcp-server/data/mdk-checksums.json`。pack_format 是**数据包**号，对应资源包号为 8 / 13 / 15（1.18 起两类包分家）。

---

## 迁移优先级建议

当目标版本不在知识库中时，建议按以下顺序查阅：
1. 目标 Loader 的官方 changelog
2. `query_api` 工具查询具体类的 API 签名变化
3. 社区 Discord / Reddit 的迁移经验贴
