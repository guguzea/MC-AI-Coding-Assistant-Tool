---
id: authored/lib-libz
title: LibZ 全家桶共享库要点
tags: [libz, globox, shared-lib, village-spawn-point, fabric]
summary: Globox 全家桶共享库（Modrinth 380 万下载），仅 Fabric。Village Spawn Point 等模组的共同前置；Fabric 项目之外不用考虑。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [libz]
loaders: [fabric]
modrinthSlug: libz
role: author_shared
skillId: mc-author-shared-libs
---

# LibZ 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Globox 全家桶共享库，Modrinth 380 万下载，仅 Fabric。版本细节以页面为准。

## 这是什么

Globox 为其模组（Village Spawn Point 等）共用的共享库，仅支持 Fabric。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

装 Village Spawn Point 等 Globox 模组会自动拉入 LibZ。它是作者全家桶的内部基座，第三方集成前先读官方 README，别当通用库。

## 依赖树识别

- 装作者任一 Fabric 模组 → fabric.mod.json depends 自动拉入 libz
- 做作者生态联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 LibZ 作为依赖
→ 用户/整合包侧 → 自动传递
→ Globox 生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm / Fabric API
→ 平台 → 仅 Fabric；Forge/NeoForge 项目不用考虑
```

## 常见坑

- 仅 Fabric：在 Forge/NeoForge 项目里引 libz 直接编译不过
- 显式引库版本与已装模组不一致 → 冲突；让传递依赖解决
- 把库当通用服务端/工具 API → 它服务作者自家模组，接口变更不通知第三方
- 引库前确认是 Fabric 环境（Loom 项目），别把 fabric-only 依赖写进混合/跨平台项目

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库（仅 Fabric）；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/Globox1997/LibZ
- 不清楚时：打开 LibZ GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.19.2/fabric：顶层 API 包 `net.libz.api`
  - 1.20.1/fabric：顶层 API 包 `net.libz.access`
  - 1.21.1/fabric：顶层 API 包 `net.libz.access`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
