---
id: authored/lib-iceberg
title: Iceberg 全家桶共享库要点
tags: [iceberg, grend, shared-lib, visual-workbench, forge, neoforge]
summary: Grend 全家桶共享库（CurseForge 2.33 亿下载，全览为 CF 口径）。Visual Workbench 等模组的共同前置；以服务作者自家生态为主，第三方集成需谨慎。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [iceberg]
loaders: [forge, neoforge]
modrinthSlug: iceberg
role: author_shared
skillId: mc-author-shared-libs
---

# Iceberg 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Grend 全家桶共享库，下载量 2.33 亿为 CurseForge 口径。版本与加载器细节以页面为准。

## 这是什么

Grend 为其模组（Visual Workbench 等）共用的共享库，提供客户端与公共基座工具。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

装 Visual Workbench 等 Grend 模组会自动拉入 Iceberg。它是作者全家桶的内部基座，第三方集成前先读官方 README，别当通用库。

## 依赖树识别

- 装作者任一模组 → mods.toml depends 自动拉入 iceberg
- 做作者生态联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 Iceberg 作为依赖
→ 用户/整合包侧 → 自动传递
→ 作者生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm
→ 版本/平台 → 以页面为准
```

## 常见坑

- 下载口径：2.33 亿是 CurseForge 口径（全览数据源如此），与 Modrinth 数字不可直接比
- 显式引 iceberg 与已装模组版本不一致 → 冲突；让传递依赖解决
- 把库当通用客户端工具库 → 它服务作者自家模组，接口变更不通知第三方
- 客户端工具较多 → 公共代码引用其类时注意端分离（Dist.CLIENT 门闩）
- 排查缺前置崩溃时认准 Grend 出品的 iceberg 依赖声明，别与其他同名项目混淆

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/Grend-G/Iceberg
- 不清楚时：打开 Iceberg GitHub README；AGENT_USAGE.md 规则先行
