---
id: authored/lib-corgilib
title: CorgiLib 全家桶共享库要点
tags: [corgilib, corgi-taco, shared-lib, forge, neoforge, fabric]
summary: Corgi Taco 全家桶共享库（Modrinth 1370 万下载）。其全部模组的共同前置；以服务作者自家生态为主，第三方集成需谨慎。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [corgilib]
loaders: [forge, neoforge, fabric]
modrinthSlug: corgilib
role: author_shared
skillId: mc-author-shared-libs
---

# CorgiLib 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Corgi Taco 全家桶共享库，Modrinth 1370 万下载。版本与加载器细节以页面为准。

## 这是什么

Corgi Taco 为其全部模组共用的共享库，提供网络、注册、配置等基座能力。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

装 Corgi Taco 任一模组会自动拉入 CorgiLib。它是作者全家桶的内部基座，API 面向自家需求；第三方集成前先读官方 README，别当通用库。

## 依赖树识别

- 装作者任一模组 → 自动拉入 corgilib
- 跟随作者生态做联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 CorgiLib 作为依赖
→ 用户/整合包侧 → 自动传递
→ 作者生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm
→ 平台 → 以页面为准（Forge/NeoForge/Fabric 构建，版本各自对齐）
```

## 常见坑

- 显式引 corgilib 与已装模组版本不一致 → 冲突；让传递依赖解决
- 把库当通用注册/网络库 → 它是作者内部基座，接口变更不通知第三方
- 跨加载器版本不通用 → 各加载器构建独立，别混用

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/CorgiTaco/CorgiLib
- 不清楚时：打开 CorgiLib GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `corgitaco.corgilib`
  - 1.20.1/fabric：顶层 API 包 `corgitaco.corgilib`
  - 1.21.11/neoforge：顶层 API 包 `corgitaco.corgilib`、`dev.corgitaco.corgilib`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
