---
id: authored/lib-spruceui-obsidianui
title: SpruceUI / ObsidianUI GUI 抽象库要点
tags: [spruceui, obsidianui, gui, architectury, fabric, forge, neoforge, quilt]
summary: GUI 抽象库（245 万，1.16.4-1.21.5）。SpruceUI 原版已下架，ObsidianUI 是 Architectury 移植延续（跨加载器）。新项目优先 ObsidianUI，或评估 Modern UI / owo-ui。
mcHint: 1.16.4-1.21.5
minecraftVersions: "1.16.4-1.21.5"
sourceKind: authored
modIds: [spruceui, obsidianui]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: ""
role: api
skillId: mc-spruceui
---

# SpruceUI / ObsidianUI GUI 抽象库要点

自写短文。版本与 API 细节以 [ObsidianUI](https://github.com/architectury/ObsidianUI)（及原版 [SpruceUI](https://github.com/LambdAurora/SpruceUI) 历史仓库）为准。

## 何时用 / 何时不用

用：想把 SpruceUI 风格的控件/布局抽象（列表、按钮、文本框等）带到多个加载器（Fabric/Forge/NeoForge/Quilt），ObsidianUI 是 Architectury 移植的延续版本（245 万下载，1.16.4-1.21.5，全览 §二.6）。

不用（重要）：

- **SpruceUI 原版已下架**，Modrinth 页面不可用；新项目应直接选 ObsidianUI（全览陷阱 5）
- **版本窗口停在 1.21.5**：26.x 新模组没有对应构建，别选
- 界面简单、跨平台需求低 → 原版 Screen 或 Modern UI / owo-ui 更省事
- 只有客户端 GUI 抽象，服务器侧逻辑（容器/同步）照样自己写

## Decision Flow

```
Decision: 用不用 SpruceUI / ObsidianUI
→ 目标 MC ≥ 1.22 或 26.x → 不用（版本停在 1.21.5）
→ 单加载器且界面简单 → 原版 Screen 或 Modern UI
→ 需要跨加载器 GUI 抽象（1.16.4-1.21.5 内）→ ObsidianUI（Architectury 移植）
→ 已选 ObsidianUI：
   ├─ 依赖声明：按官方 README 的 maven 坐标/依赖方式（Fabric 用 modImplementation；Forge/Neo 按 Architectury 依赖惯例）
   ├─ 分发：ObsidianUI 本体仍可下载（Modrinth 上架中），SpruceUI 原版页面已下架
   └─ 平台：多加载器版本按 Architectury 体系对齐
→ 仅 Fabric 且想沿用 SpruceUI 旧代码 → 评估 ObsidianUI 兼容性后迁移，别用已下架版本
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：仓库与坐标照 ObsidianUI README（Architectury maven 系）；多加载器项目用 Architectury Loom 统一管理
2. `fabric.mod.json` / `mods.toml`：写 ObsidianUI 依赖，不要写已下架的 SpruceUI modId（ObsidianUI 与 SpruceUI 的 modId 不同，以 README 为准）
3. 版本核对：以 ObsidianUI 官方发布页为准（1.16.4-1.21.5），确认与目标 MC 匹配

## 集成要点（伪代码级）

```java
// 继承/实现库提供的 Screen 基类，用其控件构建界面
// 控件：按钮/文本框/列表等抽象（具体类名以 ObsidianUI README/源码为准）
// 客户端专用：Screen 相关代码只放 client 侧
// 服务器侧：槽位/数据同步仍走原版容器 + 网络包
```

- 类名与 SpruceUI 历史版有差异，迁移旧代码时逐个核对
- 跨加载器时优先走 Architectury 的通用入口，避免平台分支散落

## 常见坑

- 新项目选了已下架的 SpruceUI 原版 → 拿不到新版本，改用 ObsidianUI
- 在 26.x / 1.22+ 上期待 ObsidianUI 更新 → 停在 1.21.5，需换方案
- 把 GUI 类放公共/服务端代码 → 专用服崩溃（客户端门闩）
- 混用 SpruceUI 与 ObsidianUI 两套类名 → 以 ObsidianUI 一套为准

## 自检清单

- 目标 MC 版本（1.16.4-1.21.5 内）有对应 ObsidianUI 构建
- 客户端 GUI 能打开，控件交互正常
- `runServer` 无 ObsidianUI/SpruceUI 类加载
- 多加载器下依赖解析通过（Fabric 与 Forge/Neo 都进游戏验证）

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-spruceui`；相关：`mc-gui`、`mc-architectury`（跨加载器）
- 全览：§二.6 GUI/UI 库、陷阱 5；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/architectury/ObsidianUI ；原版：https://github.com/LambdAurora/SpruceUI
- 不清楚时：打开 ObsidianUI README/源码；`search_fabric_docs` / `search_forge_docs` 查 GUI 相关页；AGENT_USAGE.md 规则先行
