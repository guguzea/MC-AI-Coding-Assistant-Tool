---
id: authored/lib-fabric-language-kotlin
title: Fabric Language Kotlin 语言加载器集成要点
tags: [fabric-language-kotlin, kotlin, language-loader, coroutines, fabric, fabricmc]
summary: Fabric 的 Kotlin 语言支持（1.07 亿下载，Fabric 1.14-26.2，通用库 Top 3）：让 Fabric 模组用 Kotlin 编写，提供 Kotlin 标准库与协程运行时；Forge/Neo 平台用 Kotlin for Forge。
mcHint: 1.14-26.2
minecraftVersions: "1.14-26.2"
sourceKind: authored
modIds: [fabric-language-kotlin]
loaders: [fabric]
modrinthSlug: fabric-language-kotlin
role: api
skillId: mc-fabric-language-kotlin
---

# Fabric Language Kotlin 语言加载器集成要点

自写短文。版本与 API 细节以 [Fabric Language Kotlin](https://github.com/FabricMC/fabric-language-kotlin) 当前 README 与示例为准。

## 何时用 / 何时不用

用：Fabric 模组想用 **Kotlin 编写**。它提供 Kotlin 标准库、kotlinx-coroutines 等运行时，玩家装 FLK 即可运行 Kotlin 模组；1.07 亿下载，是通用库 Top 12 第三（全览 §二.10 / §一）。

不用：

- Forge / NeoForge 平台 → 用 Kotlin for Forge（见 `lib-kotlin-for-forge`）
- 团队/代码库坚持 Java → 不引，避免给玩家加装依赖
- Quilt 平台：以 FLK 官方发布为准（全览标注 Fabric；Quilt 兼容性查官方说明）

## Decision Flow

```
Decision: Fabric 用不用 Kotlin
→ 平台 Forge / NeoForge → Kotlin for Forge（见 lib-kotlin-for-forge）
→ 团队/代码库用 Java → 不引
→ 要用 Kotlin 写 Fabric 模组 → Fabric Language Kotlin
→ 已选：
   ├─ 构建：Loom + Kotlin 插件，照官方文档配（fabric-loom 的 kotlin 配置）
   ├─ 依赖：fabric.mod.json 声明 fabric-language-kotlin 为依赖，玩家需装语言加载器
   ├─ 标准库/协程：由 FLK 提供，避免自引冲突版本
   └─ 版本：1.14-26.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按官方文档配置 Kotlin 插件 + FLK 依赖（Loom 流程，照 README 抄）
2. `fabric.mod.json`：`depends` 写 fabric-language-kotlin（入口点照常写你的主类，加载器负责 Kotlin 运行时）
3. 版本核对：Kotlin 语言版本与 FLK 发布的 Kotlin 运行时匹配，以 GitHub Releases / Modrinth 文件页为准

## 集成要点（伪代码级）

```kotlin
// 入口点用 Kotlin 类，写法与 Java 版一致（fabric.mod.json 的 entrypoints 不变）
// FLK 提供 kotlinx-coroutines 等运行时，可直接用协程写异步逻辑
// 与 Fabric API 的混用方式与 Java 一致
// 初始化写法以 FLK README + 官方示例为准，勿照抄旧版本教程
```

- 入口结构与 Java 模组等价，只是语言不同
- 协程作用域由你自己管理，避免在渲染线程阻塞

## 常见坑

- 玩家未装 FLK → 启动报缺依赖/类加载失败，`depends` 声明必须写
- 自引 kotlin-stdlib / coroutines 版本与 FLK 打包版本冲突 → 以 FLK 提供为准
- 平台混淆：Forge 模组用了 FLK，或 Fabric 模组用了 KFF
- 照抄旧版本教程的入口写法 → FLK 随 MC 版本演进，以当前 README + 官方示例为准
- **loader 钉低于 FLK 地板** → 启动即 `Incompatible mods found!`（**加载期错误，无崩溃报告**）；见下节「启动依赖地板」

## 启动依赖地板：loader 版本（2026-09-29 真机实证）

- **FLK 全 MC 线只发一个 jar**：as-of 2026-09-07 最新件 `1.14.1+kotlin.2.4.20`（8,142,858 B，sha256 `620C2709…FEE7A5`，Modrinth `game_versions` 覆盖 1.14–26.2）。实测该件 `fabric.mod.json` 声明 **`fabricloader >=0.19.5`**；上一档 `1.13.4+kotlin.2.2.0`（7,387,359 B，sha256 `2A3C56FC…F50B`）声明 **`>=0.16.9`**。
- ⇒ **开发工程的 loader 钉（`gradle.properties` 的 `loader_version`，即 Loom 的 `net.fabricmc:fabric-loader` 版本）必须 ≥ 所用 FLK 的地板**。低于地板时 `runClient` 在依赖解析阶段直接拒启，日志为 `Incompatible mods found!` + 「模组 'Fabric Language Kotlin' … 需要 模组 'Fabric Loader' 的 0.19.5 及以上版本」。**这是加载期错误、不产出崩溃报告**（与物品注册那类运行期 NPE 不同），判读要读启动日志的 loader 解析段。
- 现场记录（fabric/1.21.11 档）：钉 `0.19.3` + FLK 1.14.1 ⇒ 拒启；提到 `0.19.5` 后**同一载荷**启动通过并跑通游戏内闭环（证据见 `mcp-server/CHANGELOG.md` 第三十一批）。
- 逐档地板对照（本仓脚手架钉值，2026-09-29 现扫）：**`0.19.5` 档** = `1.21.11`（本轮已修）/ `26.1.2`，以及无钉薄档 `1.21.4` / `1.21.8` / `1.21.10`（上游 latest 即 0.19.5）⇒ 装最新 FLK 即通过；**`0.16.9` 档** = `1.21.1` / `1.21.3` ⇒ 最新 FLK 不通过、`1.13.4` 通过；**其余七档**（1.14.4 = 0.3.7.111、1.16.5 = 0.11.2、1.17.1 = 0.11.7、1.18.2 = 0.14.24、1.19.4 = 0.14.21、1.20.1 = 0.15.11、1.20.4 = 0.15.11）**连 1.13.4 的地板也不满足** ⇒ 要上 FLK 必须先提钉。
- 老档提钉的两难：脚手架里 `loader_version` 同时被 `fabric.mod.json` 的 `"fabricloader": ">=${loader_version}"` 引用 ⇒ 提钉会**同步抬高发布件声明的最低 loader**，可能挡住仍用旧 loader 的老版本玩家。「dev 侧提钉、发布下限不动」需要把两处拆成两个属性（当前是单属性）或发布前回落。**本仓未擅自批改上述七档钉值**，批改与否见 `CONTRIBUTING.md` 台账。
  - **拆两属性样张（用户裁定后落地，2026-09-30，`fabric/1.20.1`）**：新增 `loader_version_dev`（可选）＋ Loom 依赖行改 `fabric-loader:${project.hasProperty('loader_version_dev') ? project.loader_version_dev : project.loader_version}` ⇒ **开发期** loader 可单独提到 FLK 地板，而 `fabric.mod.json` 的 `>=${loader_version}` **保持不动**。真机实测（该档 dev 工程）：`loader_version=0.15.11`（发布下限）+ `loader_version_dev=0.16.9`（Loom）+ 装入 FLK `1.13.4+kotlin.2.2.0` ⇒ 客户端正常启动（**无 `Incompatible mods found`**、模组列表含 `fabric-language-kotlin`）、构建产物 `fabric.mod.json` 仍声明 **`"fabricloader": ">=0.15.11"`**、驱动整轮 **17/17 `ok:true`**（含村庄扫描与两张截图）。⇒ 「老档要 FLK 又不抬玩家门槛」这条路线**已证明可行**；其余 fabric 档是否照做见台账。

## 自检清单

- 启动日志确认 FLK 语言加载器加载成功
- `runServer` / `runClient` 正常启动，Kotlin 入口点被识别
- 协程/标准库代码运行无 NoClassDefFoundError
- 目标 MC 版本能拉到对应 FLK 构建

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-kotlin`；相关：`mc-fabric-api`、`mc-mod-entry-init`（`authored/mod-entry-init-structure`）
- 全览：§一 Top 3、§二.10 脚本/工具；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/FabricMC/fabric-language-kotlin ；Forge 侧见 `lib-kotlin-for-forge`
- 不清楚时：打开 FLK README + 官方示例；`search_fabric_docs` 查入口点/开发环境相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.14-pre1/fabric：顶层 API 包 `net.fabricmc.language`，入口 无 entrypoint
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
