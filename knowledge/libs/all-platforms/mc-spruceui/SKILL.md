---
name: mc-spruceui
description: SpruceUI / ObsidianUI GUI 抽象库，跨加载器控件与布局抽象（Architectury 移植延续）。触发词：SpruceUI、ObsidianUI、Obsidian UI、GUI 抽象、控件库、Architectury、LambdAurora
platforms: [fabric, forge, neoforge, quilt]
mcVersions: ["1.16.4-1.21.5"]
communityDocId: authored/lib-spruceui-obsidianui
---

# SpruceUI / ObsidianUI GUI 抽象（操作指引）

给 AI 的操作指引：需要把 SpruceUI 风格的控件/布局抽象（列表、按钮、文本框等）带到多个加载器时，选 ObsidianUI（Architectury 移植的延续版本）。详细信息用 `search_community_docs` 查 `authored/lib-spruceui-obsidianui`，版本与 API 细节以 [ObsidianUI](https://github.com/architectury/ObsidianUI)（及原版 [SpruceUI](https://github.com/LambdAurora/SpruceUI) 历史仓库）为准。

## 定位

- 能力：GUI 控件/布局抽象（列表、按钮、文本框等），跨加载器（Fabric/Forge/NeoForge/Quilt）复用界面代码（245 万下载，1.16.4-1.21.5）
- 生态：SpruceUI 原版（LambdAurora）**已下架**，ObsidianUI 是 Architectury 移植的延续版本
- 版本 / loader 边界：F/Forge/Neo/Quilt，窗口 **1.16.4-1.21.5**；**版本停在 1.21.5，26.x / 1.22+ 无对应构建**
- 边界：只有客户端 GUI 抽象，服务器侧逻辑（容器/同步）照样自己写

## Decision Flow

```
Decision: 用不用 SpruceUI / ObsidianUI
→ 目标 MC ≥ 1.22 或 26.x → 不用（版本停在 1.21.5），换方案
→ 单加载器且界面简单 → 原版 Screen 或 Modern UI（见 mc-modern-ui）更省事
→ 需要跨加载器 GUI 抽象（1.16.4-1.21.5 内）→ ObsidianUI（Architectury 移植）
→ 已选 ObsidianUI：
   ├─ 依赖声明：按官方 README 的 maven 坐标/依赖方式（Fabric 用 modImplementation；Forge/Neo 按 Architectury 依赖惯例；多加载器项目用 Architectury Loom 统一管理）
   ├─ 分发：ObsidianUI 本体仍可下载（Modrinth 上架中），SpruceUI 原版页面已下架
   └─ 平台：多加载器版本按 Architectury 体系对齐
→ 仅 Fabric 且想沿用 SpruceUI 旧代码 → 评估 ObsidianUI 兼容性后迁移，别用已下架版本
```

## 接入检查顺序

1. `build.gradle`：仓库与坐标照 ObsidianUI README（Architectury maven 系）
2. `fabric.mod.json` / `mods.toml`：写 ObsidianUI 依赖，**不要写已下架的 SpruceUI modId**（两者 modId 不同，以 README 为准）
3. 版本核对：以 ObsidianUI 官方发布页为准（1.16.4-1.21.5），确认与目标 MC 匹配

## 核心 API 速查

具体类名以 ObsidianUI README/源码为准（注意：暂未反编译核对，catalog 无 verifiedApi），下面只列能力与流程：

- **Screen 基类**：继承/实现库提供的 Screen 基类，用其控件构建界面（按钮/文本框/列表等抽象）
- **客户端专用**：Screen 相关代码只放 client 侧，服务端槽位/数据同步仍走原版容器 + 网络包
- **迁移**：类名与 SpruceUI 历史版有差异，迁移旧代码时逐个核对
- **跨加载器**：优先走 Architectury 的通用入口，避免平台分支散落

## 常见错误

- 新项目选了已下架的 SpruceUI 原版 → 拿不到新版本，改用 ObsidianUI
- 在 26.x / 1.22+ 上期待 ObsidianUI 更新 → 停在 1.21.5，需换方案
- 把 GUI 类放公共/服务端代码 → 专用服崩溃（客户端门闩）
- 混用 SpruceUI 与 ObsidianUI 两套类名 → 以 ObsidianUI 一套为准

## 参考

- 官方：https://github.com/architectury/ObsidianUI ；原版：https://github.com/LambdAurora/SpruceUI
- 社区：`search_community_docs` → `authored/lib-spruceui-obsidianui`；相关：`authored/library-catalog-2026`、`authored/library-integration`
- 相关 Skill：`mc-gui`、`mc-architectury`（跨加载器）、`mc-modern-ui`、`mc-owo`
- 不确定时：打开 ObsidianUI README/源码；`search_fabric_docs` / `search_forge_docs` 查 GUI 相关页；未核对前不写死任何类名/方法签名
