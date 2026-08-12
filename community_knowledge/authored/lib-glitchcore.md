---
id: authored/lib-glitchcore
title: GlitchCore 全家桶共享库要点
tags: [glitchcore, glitchfiend, shared-lib, biomes-o-plenty, serene-seasons, tough-as-nails, forge, neoforge, fabric]
summary: Glitchfiend 全家桶共享库（CurseForge 4.04 亿下载，全览为 CF 口径）。Biomes O' Plenty、Serene Seasons、Tough As Nails 的共同前置；以服务作者大型内容模组为主。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [glitchcore]
loaders: [forge, neoforge, fabric]
modrinthSlug: glitchcore
role: author_shared
skillId: mc-author-shared-libs
---

# GlitchCore 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Glitchfiend 全家桶共享库，下载量 4.04 亿为 CurseForge 口径。版本与加载器细节以页面为准。

## 这是什么

Glitchfiend 为其模组（Biomes O' Plenty、Serene Seasons、Tough As Nails 等）共用的共享库，是多个大型内容模组的硬前置。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

Biomes O' Plenty 几乎每个整合包都有，GlitchCore 因此海量安装。但它是作者大型内容模组的内部基座，第三方集成先读官方 README，别当通用库。

## 依赖树识别

- 装 BoP / Serene Seasons / Tough As Nails → 自动拉入 glitchcore
- 给这些内容模组做联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 GlitchCore 作为依赖
→ 用户/整合包侧 → 自动传递
→ Glitchfiend 生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm
→ 平台/版本 → 以页面为准，各加载器构建独立
```

## 常见坑

- 下载口径：4.04 亿是 CurseForge 口径（全览数据源如此），与 Modrinth 数字不可直接比
- 显式引 glitchcore 与已装内容模组版本不一致 → 冲突；让传递依赖解决
- 把库当通用群系/季节 API → 它服务作者自家模组，接口变更不通知第三方
- 大型内容模组更新节奏不一 → 版本窗口以各模组页面为准

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/Glitchfiend/GlitchCore
- 不清楚时：打开 GlitchCore GitHub README；AGENT_USAGE.md 规则先行
