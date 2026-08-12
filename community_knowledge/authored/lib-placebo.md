---
id: authored/lib-placebo
title: Placebo 全家桶共享库要点
tags: [placebo, shadows-of-fire, shared-lib, apotheosis, zenith, forge, neoforge]
summary: Shadows_of_Fire 全家桶共享库（Modrinth 57 万下载，CF 口径更大）。Apotheosis（神化）、Zenith 的共同前置；版本跟随作者发布节奏，以页面为准。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [placebo]
loaders: [forge, neoforge]
modrinthSlug: placebo
role: author_shared
skillId: mc-author-shared-libs
---

# Placebo 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Shadows_of_Fire 全家桶共享库，Modrinth 57 万下载（CF 口径通常更大）。版本与加载器细节以页面为准。

## 这是什么

Shadows_of_Fire 为其模组（Apotheosis 神化、Zenith 等）共用的共享库，提供条件配方、延迟事件、客户端工具等基座能力。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

Apotheosis 是热门大型模组，Placebo 跟着它被大量安装。但它是作者自家模组的内部基座，API 面向自家需求；第三方集成先读官方文档，别当通用库。

## 依赖树识别

- 装 Apotheosis / Zenith → mods.toml depends 自动拉入 placebo
- 给神化体系做联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 Placebo 作为依赖
→ 用户/整合包侧 → 自动传递
→ 神化生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm
→ 版本 → 跟随 Shadows_of_Fire 发布节奏，以页面为准
```

## 常见坑

- 显式引 placebo 与已装 Apotheosis 版本不一致 → 冲突；让传递依赖解决
- 把库当通用条件配方/事件库 → 它服务神化体系，接口变更不通知第三方
- 下载口径混淆：57 万是 Modrinth 单平台，CF 端因 Apotheosis 体量更大，别拿来做对比结论
- Apotheosis 更新常伴随 Placebo 更新 → 一起升级，别只更新其一

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/Shadows-of-Fire/Placebo
- 不清楚时：打开 Placebo GitHub README；AGENT_USAGE.md 规则先行
