---
id: authored/lib-kotlin-for-forge
title: Kotlin for Forge 语言加载器集成要点
tags: [kotlin-for-forge, kotlin, language-loader, coroutines, forge, neoforge]
summary: Forge/NeoForge 的 Kotlin 语言加载器（4410 万下载，Forge/Neo 1.14-26.2）：让模组用 Kotlin 编写，提供 Kotlin 标准库与协程运行时；Fabric 平台用 Fabric Language Kotlin。
mcHint: 1.14-26.2
minecraftVersions: "1.14-26.2"
sourceKind: authored
modIds: [kotlinforforge]
loaders: [forge, neoforge]
modrinthSlug: kotlin-for-forge
role: api
skillId: mc-kotlin
---

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
   └─ 版本：1.14-26.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
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
- 自引 kotlin-stdlib / coroutines 版本与 KFF 打包版本冲突 → 以 KFF 提供为准
- 平台混淆：Fabric 模组用了 KFF，或 Forge 模组用了 FLK
- 照抄旧版本教程的初始化写法 → KFF 随 MC 版本演进，以当前 README + 示例为准

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
