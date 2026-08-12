---
id: authored/lib-collective
title: Collective 全家桶共享库要点
tags: [collective, serilum, shared-lib, qol, forge, neoforge, fabric]
summary: Serilum 100+ 模组的共享库（Modrinth 5980 万下载）。装任意 Serilum 模组都会自动拉入它；这是作者全家桶的内部依赖，不是通用 API，第三方集成需谨慎。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [collective]
loaders: [forge, neoforge, fabric]
modrinthSlug: collective
role: author_shared
skillId: mc-author-shared-libs
---

# Collective 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Serilum 全家桶共享库，Modrinth 5980 万下载。版本与加载器细节以 Modrinth/CurseForge 页面为准。

## 这是什么

Serilum 为其 100+ 个模组（Villager Names、各类 QoL 小模组等）共用的共享库。装任意 Serilum 模组，Collective 都会作为硬前置自动进入依赖树。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

整合包"依赖"它，是因为它跟着 Serilum 的模组走，不是因为它欢迎第三方调用。Collective 面向作者自家模组的内部工具（注册、配置、实体工具等），API 随版本大改的风险高。第三方集成前先看官方 README 是否提供明确的对外 API。

## 依赖树识别

- 装 Villager Names 等任意 Serilum 模组 → mods.toml / fabric.mod.json 的 depends 自动拉入 collective
- 想做 Serilum 生态联动（如给 Villager Names 加内容）时，才会轮到你主动考虑它
- 日常开发：不要在 build.gradle 显式声明 collective

## 决策

```
Decision: 要不要把 Collective 作为依赖
→ 用户/整合包侧 → 什么都不用做，自动传递
→ 跟随 Serilum 生态做联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README 声明
→ 想要通用 QoL/注册 API → 不要引它；选 Architectury / Balm 这类通用库
→ 不确定 → 先看它 README 是否有明确的第三方 API 文档
```

## 常见坑

- 显式声明 collective 却与已装的 Serilum 模组版本不一致 → 版本冲突；优先让传递依赖自己解决
- 100+ 模组全家桶更新节奏快，版本窗口以页面为准，别按旧版本写死
- 把 Collective 当通用注册/工具库用 → 它主要服务自家模组，接口变更不通知第三方
- 崩溃日志提示缺 collective → 先核对已装 Serilum 模组的版本组合，别单独手动装库（容易装错版本）

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze（缺前置崩溃）
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/Serilum/Collective ；作者页 https://modrinth.com/user/Serilum
- 不清楚时：打开 Collective GitHub README 与对应版本文件页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `com.natamus.collective`
  - 1.20.1/fabric：顶层 API 包 `com.natamus.collective`
  - 26.2/forge：顶层 API 包 `com.natamus.collective`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
