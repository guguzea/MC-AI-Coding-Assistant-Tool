---
id: authored/lib-mantle
title: Mantle 全家桶共享库要点
tags: [mantle, slimeknights, shared-lib, tinkers-construct, natura, ceramics, forge, neoforge]
summary: SlimeKnights 全家桶共享库（Modrinth 320 万下载，Forge 系）。Tinkers' Construct、Natura、Ceramics 的共同前置；⚠️ 1.21+ / 26.x 无版本。
mcHint: 以 Modrinth/CurseForge 页面为准（1.21+ 无版本）
minecraftVersions: "1.21+ 无版本；具体窗口以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [mantle]
loaders: [forge, neoforge]
modrinthSlug: mantle
role: author_shared
skillId: mc-author-shared-libs
---

# Mantle 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：SlimeKnights 全家桶共享库（Forge 系），Modrinth 320 万下载；1.21+ / 26.x 无版本。细节以页面为准。

## 这是什么

SlimeKnights 为其 Forge 系模组（Tinkers' Construct、Natura、Ceramics）共用的共享库，提供 GUI 组件、网络、配方等基座能力。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

装 Tinkers' Construct 会自动拉入 Mantle。它是匠魂系模组的内部基座，API 面向自家需求设计；第三方集成先读官方文档，别当通用库。

## 依赖树识别

- 装 Tinkers / Natura / Ceramics → mods.toml depends 自动拉入 mantle
- 给匠魂系做内容（新材料、新增强）时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 Mantle 作为依赖
→ 用户/整合包侧 → 自动传递
→ 匠魂系内容联动 → 按官方文档声明
→ 想要通用 GUI/配方 API → 不引；选通用库
→ 版本 → 1.21+ / 26.x 无版本（全览陷阱 8），新版本项目不要引它
```

## 常见坑

- 1.21+ / 26.x 无版本（全览陷阱 8）：新版本项目显式引 mantle 必失败
- 显式引库版本与已装匠魂模组不一致 → 冲突；让传递依赖解决
- 把 Mantle 当通用 GUI/网络库 → 它服务匠魂系，接口变更不通知第三方
- 与 Modrinth 上相似命名的产物混淆 → 认准 SlimeKnights 出品
- 新整合包/新项目里想要匠魂系内容 → 1.21+ 无 Mantle，等 SlimeKnights 跟进或选替代方案
- 旧版本上做联动也要按对应 MC 版本选 Mantle 构建，别跨版本引

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库、§五 陷阱 8（Mantle 等未跟进 26.x）；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist、authored/lib-traps-2026
- 官方：https://github.com/SlimeKnights/Mantle
- 不清楚时：打开 Mantle GitHub README；AGENT_USAGE.md 规则先行
