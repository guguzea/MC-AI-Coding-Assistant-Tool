---
id: authored/lib-bookshelf
title: Bookshelf（Darkhax）共享库要点
tags: [bookshelf, darkhax, bookshelf-lib, shared-lib, enchantment-descriptions, forge, neoforge]
summary: Darkhax 全家桶共享库（Modrinth 4230 万、CF 3.94 亿下载）。Enchantment Descriptions、Botany Pots、Tips 等的共同前置；⚠️ Modrinth 上 bookshelf 是 Spigot 插件，Darkhax 库的 slug 是 bookshelf-lib。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [bookshelf]
loaders: [forge, neoforge]
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
- 官方：https://github.com/Darkhax/Bookshelf
- 不清楚时：打开 Bookshelf GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `net.darkhax.bookshelf`
  - 1.20.1/fabric：顶层 API 包 `net.darkhax.bookshelf`
  - 26.1/neoforge：顶层 API 包 `net.darkhax.bookshelf`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
