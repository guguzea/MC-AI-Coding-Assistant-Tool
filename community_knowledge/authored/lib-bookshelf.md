---
id: authored/lib-bookshelf
title: Bookshelf（Darkhax）共享库要点
tags: [bookshelf, darkhax, bookshelf-lib, shared-lib, enchantment-descriptions, fabric, forge, neoforge, quilt]
summary: Darkhax 全家桶共享库（Modrinth 4230 万、CF 3.94 亿下载）。Enchantment Descriptions、Botany Pots、Tips 等的共同前置；⚠️ Modrinth 上 bookshelf 是 Spigot 插件，Darkhax 库的 slug 是 bookshelf-lib。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [bookshelf]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: bookshelf-lib
role: author_shared
skillId: mc-author-shared-libs
---

# Bookshelf（Darkhax）共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Darkhax 全家桶共享库，Modrinth 4230 万（CF 3.94 亿）下载。版本与加载器细节以页面为准。

## 这是什么

Darkhax 为其模组（Enchantment Descriptions、Botany Pots、Tips、Dark Utilities 等）共用的工具库。装这些模组时，Bookshelf 自动进入依赖树。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

Enchantment Descriptions 几乎人人装，Bookshelf 的安装量因此巨大。但它是 Darkhax 自家模组的内部工具，即使官方以文档形式公开了一部分 API，仍以服务自家模组为主。第三方集成先读官方文档确认，别想当然。

## 加载器口径（2026-09-25 按构件面逐 loader 实测；本档 `loaders` 由 [forge, neoforge] 补成 [fabric, forge, neoforge, quilt]）

口径 = 2026-09-22 裁定④ + 2026-09-24 延伸：**点名某 loader ⇔ 构件面该 loader 有 `versionType=release` 的文件行**。数据 = `mcp-server/data/lib-manifests/all.json` 的 slug `bookshelf-lib`（快照 as-of 2026-09-16，文件 mtime 同日；本轮未重抓，该欠账仍挂在 `CONTRIBUTING.md` 未排期清单 `L42` ①）。逐 loader 分解（分母 = 该 slug 73 行）：

| loader | 行 | release | 点分 `gameVersion` 上界（数值序，非字典序） | 判定 |
|---|---|---|---|---|
| forge | 35 | 33（另 2 beta） | 1.21.1 | 原已点名 |
| neoforge | 9 | 9 | 26.2 | 原已点名 |
| **fabric** | 19 | **19** | 26.2 | ⇒ 补点名：fileName 逐条是 `Bookshelf-Fabric-*.jar` / `Bookshelf-fabric-MC26*.jar`，与 forge 行 fileName 交集 **0** ⇒ 独立 Fabric 构建，不是同一 jar 换标（下方「核对」小节的 1.20.1/fabric 反编译记录同向） |
| **quilt** | 10 | **10** | 1.21.1 | ⇒ 补点名，但带两点保留，见下 |

quilt 的两点保留（写坐标前必读）：

- 10 行里 **9 行 fileName 是 `Bookshelf-Fabric-*.jar`**（与 fabric 行 fileName 交集 8）⇒ Quilt 复用同一条 Fabric 构建；且 **≥1.21.1 之后无 quilt 行**（同 slug 的 fabric/neoforge 已到 26.2）⇒ 给 Quilt 工程写坐标只可读到 1.21.1 及以下，**禁止**照抄 Fabric 的高版本坐标。
- 其中 1 行是 `Bookshelf-Forge-1.18.1-12.0.23.jar` 被快照标成 `loader=quilt` ⇒ **该行不构成 quilt 证据**（快照误标）；剥掉它仍有 9 行 release，点名结论不变。

复核（只读、不落盘）：`node temp/ralph-20260922/_r37-probe-slug-loader.mjs`（逐 loader 行数 + versionType 分解 + 数值序上界）与 `node temp/ralph-20260922/_r37-probe-rows.mjs`（逐行 fileName / versionNumber、跨 loader fileName 交集） （第 37 轮探针脚本落在 `temp/**`，**不入库** ⇒ 只在本机这一轮可跑；持久口径 = 直接按 `mcp-server/data/lib-manifests/all.json` 里该 slug 的 `entries` 数 `loader` × `versionType`，点分 `gameVersion` 按数值序取上界）。


## 依赖树识别

- 装 Enchantment Descriptions / Botany Pots 等 → mods.toml depends 自动拉入 bookshelf
- 做 Darkhax 生态联动时才主动声明
- 日常开发：不要显式声明

## 决策

```
Decision: 要不要把 Bookshelf 作为依赖
→ 用户/整合包侧 → 自动传递
→ 跟随 Darkhax 生态做兼容 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方文档
→ 想要通用工具 API → 不引；选 Architectury / Balm
→ 找不到库 → 记住 slug 是 bookshelf-lib（Modrinth 的 bookshelf 是 Spigot 插件）
```

## 常见坑

- 重名陷阱（全览陷阱 4）：Modrinth 搜 "bookshelf" 会命中 Spigot 插件，Darkhax 库的 slug 是 bookshelf-lib（modId 才是 bookshelf）
- 显式声明版本与已装模组不一致 → 冲突；让传递依赖解决
- 把 Bookshelf 当通用工具库写死依赖 → 它是作者内部库，跨版本接口可能变
- 声明依赖时写错 slug（bookshelf vs bookshelf-lib）→ 解析错包或拉错项目；坐标以官方文档为准

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库、§五 陷阱 4（Bookshelf 重名）；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist、authored/lib-traps-2026
- 官方：https://github.com/Darkhax-Minecraft/Bookshelf
- 不清楚时：打开 Bookshelf GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `net.darkhax.bookshelf`
  - 1.20.1/fabric：顶层 API 包 `net.darkhax.bookshelf`
  - 26.1/neoforge：顶层 API 包 `net.darkhax.bookshelf`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
