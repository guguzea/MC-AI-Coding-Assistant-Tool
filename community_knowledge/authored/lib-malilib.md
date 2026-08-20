---
id: authored/lib-malilib
title: MaLiLib 全家桶共享库要点
tags: [malilib, masa, shared-lib, client, litematica, minihud, tweakeroo, fabric, forge]
summary: masa 全家桶共享库（Modrinth 3140 万下载），客户端专用。Litematica、MiniHUD、Tweakeroo 等工具模组的共同前置；服务端不需要也不该装。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [malilib]
loaders: [fabric, forge]
modrinthSlug: malilib
role: author_shared
skillId: mc-author-shared-libs
---

# MaLiLib 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：masa 全家桶共享库（客户端专用），Modrinth 3140 万下载。版本与加载器细节以页面为准。

## 这是什么

masa 为其客户端工具模组（Litematica、MiniHUD、Tweakeroo、Item Scroller、TellMe 等）共用的共享库。它是纯客户端库。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

Litematica 玩家装机量极大，MaLiLib 跟着海量安装。但 masa 的工具模组是给玩家用的"游戏内工具"，MaLiLib 主要服务这些工具（GUI、热键、配置体系），面向第三方模组的稳定 API 有限，且随版本大改。

## 依赖树识别

- 装 Litematica 等 → 客户端自动拉入 malilib（服务端不需要也不该装）
- 想复用其 GUI/热键体系做客户端工具时才考虑
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 MaLiLib 作为依赖
→ 玩家/整合包侧 → 客户端自动传递，服务端不装
→ 做 masa 式客户端工具 → 软依赖 + 客户端门闩（Forge：`Dist.CLIENT`；Fabric：client 源集 + `@Environment(EnvType.CLIENT)`）
→ 想要通用客户端 GUI/热键 API → 评估 owo-lib 等；MaLiLib 接口不稳定
→ 版本选择 → 严格跟随 masa 对应 MC 版本的发布，混用即崩
```

## 常见坑

- 服务端装了 malilib → 无用甚至日志报错；它是客户端专用
- 版本混用：masa 每个 MC 版本的构建独立，跨版本引 malilib 必崩
- 把 MaLiLib 当通用 GUI 库 → 接口随版本大改，且只服务 masa 系工具
- 端分离：引用 malilib 的类只能在客户端代码里（Forge：`Dist.CLIENT` 门闩；Fabric：client 源集 + `@Environment(EnvType.CLIENT)`），公共/服务端代码禁止触碰
- masa 系列工具模组都要求 malilib 精确匹配 → 让启动器自动处理依赖，手动混装易崩

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库（客户端专用）；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/maruohon/malilib
- 不清楚时：打开 MaLiLib GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.21/fabric：顶层 API 包 `fi.dy`
  - 1.21.11/fabric：顶层 API 包 `fi.dy`
  - 26.2/fabric：顶层 API 包 `fi.dy`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
