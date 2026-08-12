---
id: authored/lib-necronomicon
title: Necronomicon 全家桶共享库要点
tags: [necronomicon, elocindev, shared-lib, api, forge, neoforge, fabric]
summary: ElocinDev 全家桶共享库（Modrinth 1230 万下载）。其全部模组的共同前置；较新、迭代快的 API 型共享库，版本窗口滚动快，以页面为准。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [necronomicon]
loaders: [forge, neoforge, fabric]
modrinthSlug: necronomicon
role: author_shared
skillId: mc-author-shared-libs
---

# Necronomicon 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：ElocinDev 全家桶共享库，Modrinth 1230 万下载。版本与加载器细节以页面为准。

## 这是什么

ElocinDev 为其全部模组共用的共享库，定位是作者生态的 API 基座。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

Necronomicon 跟着 ElocinDev 全家桶被大量安装，但它首先服务作者自家模组。它较新且迭代快，第三方基于它写代码要接受 API 变动风险，先读官方文档确认。

## 依赖树识别

- 装作者任一模组 → 自动拉入 necronomicon
- 做作者生态联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 Necronomicon 作为依赖
→ 用户/整合包侧 → 自动传递
→ 作者生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要通用 API → 不引；选 Architectury / Balm
→ 版本 → 滚动快，以 Modrinth/CurseForge 文件页为准
```

## 常见坑

- 版本窗口滚动快 → 按旧版本写死依赖容易失效，以文件页为准
- 显式引库版本与已装模组不一致 → 冲突；让传递依赖解决
- 把库当通用 API 用 → 它是作者生态基座，接口变更不通知第三方
- 版本与 MC 版本强绑定 → 锁定版本时连 MC 版本一起核对（每个 MC 版本构建独立）
- 做生态联动时按官方文档给的入口走，别直接翻内部类

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/ElocinDev/Necronomicon
- 不清楚时：打开 Necronomicon GitHub README / Wiki；AGENT_USAGE.md 规则先行
