---
id: authored/lib-kiwi
title: Kiwi 全家桶共享库要点
tags: [kiwi, snownee, shared-lib, sculk-horde, forge, neoforge, fabric]
summary: Snownee 全家桶共享库（Modrinth 1970 万下载）。Sculk Horde、Smarter Farmers、Frozen Up 等的共同前置；提供注解式注册等能力，但以服务自家模组为主。
mcHint: 以 Modrinth/CurseForge 页面为准
minecraftVersions: "以 Modrinth/CurseForge 页面为准"
sourceKind: authored
modIds: [kiwi]
loaders: [forge, neoforge, fabric]
modrinthSlug: kiwi
role: author_shared
skillId: mc-author-shared-libs
---

# Kiwi 全家桶共享库要点

自写短文（role: author_shared）。数据来自《Minecraft 社区常用库模组全览（2026 版）》第三节：Snownee 全家桶共享库，Modrinth 1970 万下载。版本与加载器细节以页面为准。

## 这是什么

Snownee 为其模组（Sculk Horde、Smarter Farmers、Frozen Up 等）共用的共享库，包含注解式注册、自动化生成等能力。

## 核心警示：整合包依赖 ≠ 推荐第三方集成 API

装 Sculk Horde 等 Snownee 模组会自动拉入 Kiwi。Kiwi 的部分能力（如注解处理器）看着通用，但它以服务 Snownee 自家模组为设计目标，作为第三方依赖使用前先读官方文档确认。

## 依赖树识别

- 装任一 Snownee 模组 → 自动拉入 kiwi
- 跟随 Snownee 生态做联动时才主动声明
- 日常开发：不显式声明

## 决策

```
Decision: 要不要把 Kiwi 作为依赖
→ 用户/整合包侧 → 自动传递
→ Snownee 生态联动 → 软依赖 + 门闩（authored/soft-deps-modlist），或按官方 README
→ 想要注解式注册/自动化工具 → 先确认版本兼容与接口稳定性；或选更通用的方案
→ 版本 → 以页面为准，跟随 Snownee 发布节奏
```

## 常见坑

- 注解处理器相关构建配置照抄旧教程 → Kiwi 版本与 MC 版本绑定，配置随版本变
- 显式引 kiwi 与已装 Snownee 模组版本不一致 → 冲突；让传递依赖解决
- 把 Kiwi 当通用注册库 → 它是作者内部基座，接口变更不通知第三方
- Snownee 模组常对 Kiwi 版本有上下限要求 → 更新模组时一起核对 Kiwi 版本，别只更新一个

## 交叉引用

- MCP：check_dependencies、search_community_docs、crash_analyze
- Skill：mc-author-shared-libs（作者全家桶共享库纪律）
- 全览：§三 全家桶共享库；相关：authored/library-catalog-2026、authored/library-integration、authored/soft-deps-modlist
- 官方：https://github.com/Snownee/Kiwi
- 不清楚时：打开 Kiwi GitHub README；AGENT_USAGE.md 规则先行
