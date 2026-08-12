---
id: authored/lib-libx
title: LibX 全家桶共享库要点
tags: [libx, noeppi-noeppi, shared-lib, forge, neoforge, fabric]
summary: noeppi_noeppi 全家桶共享库（Modrinth 210 万下载）。其全部模组的共同前置；以服务作者自家生态为主，第三方集成需谨慎。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [libx]
loaders: [forge, neoforge, fabric]
modrinthSlug: libx
role: author_shared
skillId: mc-author-shared-libs
---

# LibX 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：noeppi_noeppi 全家桶共享库，Modrinth 210 万下载。版本与加载器细节以页面为准。

## 这是什么

noeppi_noeppi 为其全部模组共用的共享库，提供注册、配置、GUI、网络等基座能力。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

装作者任一模组会自动拉入 LibX。它是作者全家桶的内部基座，API 面向自家需求；第三方集成前先读官方 README，别当通用库。

## 依赖树识别

- 装作者任一模组 → 自动拉入 libx
- 跟随作者生态做联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 LibX 作为依赖
→ 用户/整合包侧 → 自动传递
→ 作者生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm
→ 平台/版本 → 以页面为准，各加载器构建独立
```

## 常见坑

- 显式引 libx 与已装模组版本不一致 → 冲突；让传递依赖解决
- 把库当通用注册/配置库 → 它是作者内部基座，接口变更不通知第三方
- 跨加载器版本不通用 → 各加载器构建独立，别混用

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/ModdingX/LibX
- 不清楚时：打开 LibX GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `coremods`、`org.moddingx.libx`
  - 1.19.2/forge：顶层 API 包 `coremods`、`org.moddingx.libx`
  - 26.1.2/neoforge：顶层 API 包 `org.moddingx.libx`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
