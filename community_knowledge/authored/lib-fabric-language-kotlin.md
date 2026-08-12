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
skillId: mc-kotlin
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
