---
id: authored/lib-puzzles-lib
title: Puzzles Lib 全家桶共享库要点
tags: [puzzles-lib, fuzs, shared-lib, forge-config-api-port, fabric, forge, neoforge, quilt]
summary: Fuzs 全家桶共享库（Modrinth 5630 万下载）。装 Bag of Holding、TrashSlot 等任一 Fuzs 模组自动拉入；与 Forge Config API Port 构成依赖链；面向作者自家模组，非通用 API。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [puzzleslib]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: puzzles-lib
role: author_shared
skillId: mc-author-shared-libs
---

# Puzzles Lib 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Fuzs 全家桶共享库，Modrinth 5630 万下载。版本与加载器细节以 Modrinth/CurseForge 页面为准。

## 这是什么

Fuzs 为其全部模组（Bag of Holding、Tiny Skeletons、Pick Up Notifier、TrashSlot 等）共用的共享库。装任一 Fuzs 模组，Puzzles Lib 都会自动进入依赖树。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

TrashSlot、Bag of Holding 等模组在整合包里随处可见，Puzzles Lib 跟着它们被大量安装。但它是 Fuzs 自家模组的内部基座，API 面向自家需求设计。第三方集成前先看官方 README，别把它当通用库。

## 依赖树识别

- 装任一 Fuzs 模组 → 自动拉入 puzzleslib；Fabric 端还会连带 Forge Config API Port（Fuzs 自家的移植依赖链）
- 联动 Fuzs 生态（如给 Bag of Holding 加功能）时，才轮到你主动声明
- 日常开发：不要显式声明，除非做联动

## 决策

```
Decision: 要不要把 Puzzles Lib 作为依赖
→ 用户/整合包侧 → 自动传递，什么都不做
→ Fuzs 生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 需要"通用 API" → 不引；选 Architectury / Balm
→ 依赖链冲突（puzzleslib ↔ forge-config-api-port）→ 优先让传递依赖解决，别自己引
```

## 常见坑

- 显式引 Puzzles Lib 或 Forge Config API Port，版本与 Fuzs 模组已带的不一致 → 冲突；让传递依赖解决
- 在非 Fuzs 模组里当通用配置/工具库用 → 它服务自家模组，接口变更不通知第三方
- 混淆 Puzzles Lib 与"通用配置库" → 配置需求走 YACL / Cloth / ForgeConfigSpec，不是它

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist、authored/lib-forge-config-api-port
- 官方：https://github.com/Fuzss/PuzzlesLib
- 不清楚时：打开 PuzzlesLib GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `fuzs.puzzleslib`
  - 1.20.1/fabric：顶层 API 包 `fuzs.puzzleslib`
  - 26.1/neoforge：顶层 API 包 `fuzs.puzzleslib`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
