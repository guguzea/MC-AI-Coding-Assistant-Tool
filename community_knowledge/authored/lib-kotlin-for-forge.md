---
id: authored/lib-kotlin-for-forge
title: Kotlin for Forge 语言加载器集成要点
tags: [kotlin-for-forge, kotlin, language-loader, coroutines, forge, neoforge]
summary: Forge/NeoForge 的 Kotlin 语言加载器（4410 万下载，**Forge 线 1.14-1.21.11 / NeoForge 线 1.19.3-26.2**）：让模组用 Kotlin 编写，提供 Kotlin 标准库与协程运行时；Fabric 平台用 Fabric Language Kotlin。
mcHint: 1.14-26.2
minecraftVersions: "1.14-26.2"
sourceKind: authored
modIds: [kotlinforforge]
loaders: [forge, neoforge]
modrinthSlug: kotlin-for-forge
role: api
skillId: mc-kotlin-for-forge
---

> 数据读取日期：2026-09-14（源：Modrinth project/kotlin-for-forge 定向查询 game_versions=26.2 / 1.21.11：6.3.0 release（2026-06-28）只标 neoforge 且 gameVersions 含 26.2；6.0.0 是最后标 forge 的构建，最高 1.21.11）
> 复核：curl.exe --ssl-no-revoke -sS "https://api.modrinth.com/v2/project/kotlin-for-forge/version?limit=100" 后按 game_versions + loaders + version_type 重取上界（本轮 limit=100 覆盖不到低界时改定向 game_versions 查询）

# Kotlin for Forge 语言加载器集成要点

自写短文。版本与 API 细节以 [Kotlin for Forge](https://github.com/thedarkcolour/KotlinForForge) 当前 README 与示例为准。

## 何时用 / 何时不用

用：Forge / NeoForge 模组想用 **Kotlin 编写**。它作为语言加载器（Lazy Language Loader 生态）把 Kotlin 标准库、kotlinx-coroutines 等运行时带进游戏，玩家装它即可运行 Kotlin 模组（全览 §二.10）。

不用：

- Fabric 平台 → 用 Fabric Language Kotlin（见 `lib-fabric-language-kotlin`）
- 团队/代码库坚持 Java → 不引，避免给玩家加装依赖
- 只想用某个 Kotlin 工具类/协程 → 直接引 kotlin-stdlib 也行，但语言加载器场景 KFF 更省心

## Decision Flow

```
Decision: Forge 系用不用 Kotlin
→ 平台 Fabric → Fabric Language Kotlin（见 lib-fabric-language-kotlin）
→ 团队/代码库用 Java → 不引
→ 要用 Kotlin 写 Forge/NeoForge 模组 → Kotlin for Forge
→ 已选：
   ├─ 平台分支：Forge / NeoForge 装对应构建（NeoForge 侧支持以 KFF 发布说明为准）
   ├─ 依赖：mods.toml 声明 kotlinforforge 为依赖，玩家需装语言加载器
   ├─ 标准库/协程：由 KFF 打包提供，避免自引冲突版本
   └─ 版本：分 loader —— Forge 1.14-1.21.11（最后仍声明 forge 的构建是 6.0.0）、NeoForge 1.19.3-26.2（6.1.0 起纯 Neo 构建）；Modrinth 实读 2026-09-13，取用前按下方复核指令重跑
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按 README 配置 Kotlin 插件 + KFF 依赖（坐标照 README 抄）
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 kotlinforforge（玩家侧缺装会启动报错，见 `authored/soft-deps-modlist`）
3. 版本核对：Kotlin 语言版本与 KFF 发布的 Kotlin 运行时匹配，以 GitHub Releases / Modrinth 文件页为准

## 集成要点（伪代码级）

```kotlin
// 主类用 Kotlin 写，注解与 Java 版一致（@Mod 等，类名/包名以项目模板为准）
// KFF 提供 kotlinx-coroutines 等运行时，可直接用协程写异步逻辑
// 与 Forge/NeoForge 事件、注册 API 的混用方式与 Java 一致
// 初始化写法以 KFF README + 示例项目为准，勿照抄 1.14 时代旧教程
```

- 主类与入口结构与 Java 模组等价，只是语言不同
- 协程作用域由你自己管理，别在客户端线程做阻塞操作

## 常见坑

- 玩家未装 KFF → 启动报"缺语言加载器/缺依赖"，`depends` 声明必须写
- **手动把 KFF 装进 `run/mods` 时，maven 坐标给的**不是** mod 件（2026-10-02 实测定因，最易踩）**：`thedarkcolour:kotlinforforge-neoforge:<ver>` 与 `thedarkcolour:kotlinforforge:<ver>` **逐字节相同**（实测 5.8.0 两坐标同为 `sha256 A5024435…` / 6 269 705 B），包内**只有** `META-INF/jarjar/*.jar`（kotlin stdlib / reflect / coroutines / serialization）＋ `metadata.json`，`MANIFEST.MF` 只写 `FMLModType: LIBRARY`，**没有任何 `META-INF/services/`** ⇒ 它提供不了 `kotlinforforge` 语言加载器，装上后 FML 直接拒启：`Missing language loader kotlinforforge wanted by jar(mods/<某 Kotlin 模组>.jar)` → `Failed to start FML`。**真正给玩家的分发件在 Modrinth，命名 `<artifact>-<ver>-all.jar`**（实测 `kotlinforforge-6.3.0-all.jar`，7 279 413 B，`sha256 263D24B2…`；Modrinth 文件元数据的 `sha512` 前 24 位 `0092fc7b4db1e35e53e7ddb5` 可逐字核对），包内含 `META-INF/jarjar/thedarkcolour.kfflang-<ver>.jar`（**语言加载器就在这个嵌套件里**）＋ `kffmod` ＋ `kfflib`。载入成功后日志出现 `Found language provider kotlinforforge, version <ver>`。Modrinth slug 是 **`kotlin-for-forge`**（不是 `kotlinforforge` —— 按后者查项目 API 会得 `available:false / total:0`）。
- **判「这个 jar 是不是 mod 件」看包内，不看文件名**：名称里带 `neoforge` / 平台词**不代表**是可加载 mod。两条硬判据 —— ① 有没有 `META-INF/services/`（语言加载器靠它注册）；② 有没有 `META-INF/<loader>.mods.toml`（NeoForge 1.20.6+ 叫 `neoforge.mods.toml`，且通常伴随 `<modid>.mixins.json`）。两个都没有 ⇒ 它只是把运行时 jar 套了一层的库件。PowerShell 免解压核对：`Add-Type -A System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead('<jar>'); $z.Entries | % { $_.FullName }; $z.Dispose()`（注意：同一台机器上 `tar -tf` 对这种含嵌套 jar 的包会给 `Damaged Zip archive` 或漏列，别拿它当权威）。
- 自引 kotlin-stdlib / coroutines 版本与 KFF 打包版本冲突 → 以 KFF 提供为准
- 平台混淆：Fabric 模组用了 KFF，或 Forge 模组用了 FLK
- 照抄旧版本教程的初始化写法 → KFF 随 MC 版本演进，以当前 README + 示例为准
- **版本线要分对**：同一 slug 下 **6.x 起是纯 NeoForge 构建**（`loaders=neoforge`，覆盖 1.21.9–26.2），**5.x 才带 forge 线**（6.0.0 是最后仍声明 `forge` 的构建）⇒ 给 MC ≥1.21.9 的 NeoForge 档取件时别去 5.x 里找（本仓实测 `5.8.0` 那件正是上文那条库件的来源）。

## 自检清单

- 启动日志确认 KFF 语言加载器加载成功
- `runServer` / `runClient` 正常启动，Kotlin 主类被识别
- 协程/标准库代码运行无 NoClassDefFoundError
- 目标 MC 版本能拉到对应 KFF 构建

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-kotlin`；相关：`mc-mod-entry-init`（`authored/mod-entry-init-structure`）
- 全览：§二.10 脚本/工具；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/thedarkcolour/KotlinForForge ；Fabric 侧见 `lib-fabric-language-kotlin`
- 不清楚时：打开 KFF README + 示例项目；`search_forge_docs` / `search_neoforge_docs` 查语言加载器相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.14/forge：顶层 API 包 `kotlin.annotation`、`kotlinx.coroutines`、`net.minecraftforge.fml`、`org.intellij.lang`、`thedarkcolour.kotlinforforge`，入口 无 entrypoint
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
