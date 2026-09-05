# 版本迁移笔记摘要

> 按版本分段的迁移要点。

---

## 1.15.2 → 1.16（重要断裂）

**关键变化**：
- Java 版本：Java 8 → Java 8（**不变**；`forge_1.15.2/…/gettingstarted.md:14` 与 `forge_1.16.5/…/gettingstarted.md:14` 都是「按 Java 8 编译」）
- pack_format：5 → 6
- 方块属性 API 基本保持不变

**需要修改的文件类型**：
- `gradle.properties`：升级 `minecraft_version` 和 `forge_version`
- `build.gradle`：升级 ForgeGradle 版本
- 所有 Java 文件：1.16.5 仍只许 Java 8 语法（`primer_1_16_5.md:614`「You must only use Java 8 code」），Java 16 语法要到 1.17.1 才可用

---

## 1.16 → 1.17

**关键变化**：
- Java 版本：Java 8 → Java 16（1.17.1 `gettingstarted.md:14`「Obtain a Java 16 Development Kit」）
- pack_format：6 → 7
- 基本为增量更新

---

## 1.17 → 1.18

**关键变化**：
- Java 版本：Java 16 → Java 17（1.18.2 `gettingstarted.md:14`「Minecraft and MinecraftForge both compile against Java 17」）
- pack_format：7 → 8
- DeferredRegister 完全可用
- 方块属性：`Properties.create()` → `Properties.of()`

---

## 版本对照表（关键断裂）

| MC 版本 | Forge | Fabric Loader | Java 版本 |
|---------|-------|---------------|-----------|
| 1.15.2 | 31.2.x | — | Java 8 |
| 1.16.5 | 36.2.x | 0.11.x | Java 8 |
| 1.17.1 | 37.1.x | 0.12.x | Java 16 |
| 1.18.2 | 40.x | 0.13.x | Java 17 |
| 1.19.4 | 45.x | 0.14.x | Java 17 |
| 1.20.1 | 47.x | 0.15.x | Java 17 |

> Java 列出处：各版官方 `gettingstarted.md`（1.15.2:14 / 1.16.5:14 / 1.17.1:14 / 1.18.2:14 / 1.19.4:15 / 1.20.1:15）。
> **Forge 列已按官方 MDK 核实**：1.18.2 = 40.3.0、1.19.4 = **45**.4.0（本表原写 44.1.x 错 —— 44.x 是 1.19.2/1.19.3）、1.20.1 = 47.4.10；1.15.2 = 31.2.57、1.16.5 = 36.2.34、1.17.1 = 37.1.1。sha256 见 `mcp-server/data/mdk-checksums.json`（`source=official`），并与本包 `1.19.4/scaffold/gradle.properties:9 forge_version=45.4.0` 一致。
> TODO(未核实) **Fabric Loader 列**：上游语料未给出各版对应值，勿当官方口径抄用。
> pack_format 各版实测（官方 MDK `pack.mcmeta`）：1.15.2 = 5、1.16.5 = 6、1.17.1 = 7、1.18.2 = 数据 9 / 资源 8、1.19.4 = 数据 12 / 资源 13、1.20.1 = 15（**1.18 起两类包分家**，不是 5 → 6 → 7 → 8 的单调序列）。

---

## 迁移优先级建议

当目标版本不在知识库中时，建议按以下顺序查阅：
1. 目标 Loader 的官方 changelog
2. `query_api` 工具查询具体类的 API 签名变化
3. 社区 Discord / Reddit 的迁移经验贴
