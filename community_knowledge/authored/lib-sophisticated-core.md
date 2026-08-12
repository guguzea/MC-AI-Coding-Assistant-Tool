---
id: authored/lib-sophisticated-core
title: Sophisticated Core 全家桶共享库要点
tags: [sophisticated-core, p3pp3r1y, shared-lib, sophisticated-backpacks, sophisticated-storage, forge, neoforge]
summary: P3pp3rF1y 全家桶共享库（Modrinth 1630 万下载）。Sophisticated Backpacks、Sophisticated Storage 的共同前置；Fabric 版背包为社区移植，别与官方库混用。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [sophisticatedcore]
loaders: [forge, neoforge]
modrinthSlug: sophisticated-core
role: author_shared
skillId: mc-author-shared-libs
---

# Sophisticated Core 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：P3pp3rF1y 全家桶共享库，Modrinth 1630 万下载。版本与加载器细节以页面为准。

## 这是什么

P3pp3rF1y 为其模组（Sophisticated Backpacks、Sophisticated Storage 及大量附加模组）共用的共享库，承载背包/存储系统的基础逻辑与 GUI。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

Sophisticated Backpacks 在整合包里非常常见，Sophisticated Core 跟着海量安装。但它是作者自家背包/存储系统的内部基座，第三方模组直接调用其 API 属于"跟随生态"，要按官方说明来，别当通用库。

## 依赖树识别

- 装 Sophisticated Backpacks / Storage / 各附加模组 → 自动拉入 sophisticatedcore
- 给背包系统加内容（新升级、新存储方块）时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 Sophisticated Core 作为依赖
→ 用户/整合包侧 → 自动传递
→ 给背包/存储生态加内容 → 按官方文档声明对应版本
→ 想要通用存储/容器 API → 不引；用原版或通用库
→ 平台 → 官方库是 Forge/NeoForge 系；Fabric 背包是社区移植，别混用
```

## 常见坑

- Fabric 版 Sophisticated Backpacks 是社区移植，其依赖与官方 sophisticatedcore 不同，别混引
- 显式引库版本与已装背包模组不一致 → 冲突；让传递依赖解决
- 把库当通用存储 API → 它服务自家背包体系，接口变更不通知第三方
- 附加模组（各种 Sophisticated X）都依赖它，排查缺前置崩溃时先看它
- 给 Sophisticated 附加模组写依赖时用官方给出的坐标与版本范围，别猜
- 升级 Sophisticated Storage 大版本时配套升级库，旧库配新模组会报错

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/P3pp3rF1y/SophisticatedCore
- 不清楚时：打开 SophisticatedCore GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `net.darkhax.bookshelf`
  - 1.21.1/neoforge：顶层 API 包 `net.p3pp3rf1y.sophisticatedcore`
  - 26.1/neoforge：顶层 API 包 `net.p3pp3rf1y.sophisticatedcore`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
