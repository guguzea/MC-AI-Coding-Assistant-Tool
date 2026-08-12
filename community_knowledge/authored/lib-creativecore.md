---
id: authored/lib-creativecore
title: CreativeCore 全家桶共享库要点
tags: [creativecore, creativemd, shared-lib, littletiles, ambient-sounds, forge, neoforge, fabric]
summary: CreativeMD 全家桶共享库（CurseForge 5.22 亿下载，全览为 CF 口径）。LittleTiles、AmbientSounds 的共同前置；全家桶中最"重"的基座之一，第三方集成更需谨慎。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [creativecore]
loaders: [forge, neoforge, fabric]
modrinthSlug: creativecore
role: author_shared
skillId: mc-author-shared-libs
---

# CreativeCore 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：CreativeMD 全家桶共享库，下载量 5.22 亿为 CurseForge 口径。版本与加载器细节以页面为准。

## 这是什么

CreativeMD 为其模组（LittleTiles、AmbientSounds 等）共用的共享库，承载渲染、网络等较重的基础能力。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

LittleTiles 玩家装机量巨大，CreativeCore 跟着海量安装。它是作者全家桶的内部基座（且体量最重），第三方集成前先读官方文档，别当通用库。

## 依赖树识别

- 装 LittleTiles / AmbientSounds → mods.toml depends 自动拉入 creativecore
- 做作者生态联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 CreativeCore 作为依赖
→ 用户/整合包侧 → 自动传递
→ 作者生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用渲染/网络 API → 不引；选 Architectury / Balm
→ 平台/版本 → 以页面为准，各加载器构建独立
```

## 常见坑

- 下载口径：5.22 亿是 CurseForge 口径（全览数据源如此），与 Modrinth 数字不可直接比
- 显式引 creativecore 与已装模组版本不一致 → 冲突；让传递依赖解决
- 把库当通用渲染/工具库 → 它服务作者自家模组（尤其 LittleTiles 重度依赖），接口变更不通知第三方
- 只想用 AmbientSounds 却显式引库 → 没必要，传递依赖会处理
- LittleTiles 的渲染栈深度依赖 CreativeCore → 做渲染联动按官方文档来，别直接 hook 内部

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/CreativeMD/CreativeCore
- 不清楚时：打开 CreativeCore GitHub README；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20.1/forge：顶层 API 包 `team.creative`
  - 1.21.11/neoforge：顶层 API 包 `team.creative`
  - 26.1/neoforge：顶层 API 包 `team.creative`
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
