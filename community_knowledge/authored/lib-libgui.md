---
id: authored/lib-libgui
title: LibGui 声明式 GUI 库集成要点
tags: [libgui, gui, fabric, declarative-ui, cotton]
summary: 老牌声明式 GUI 库（Fabric，GitHub 活跃至 26.2）。Modrinth 已下架(404)，分发走 Cotton maven + Jar-in-Jar；Panel/Widget 树声明式建 UI，服务器侧仍需原版容器/网络同步。
mcHint: ≤26.2（以 GitHub Releases 为准）
minecraftVersions: "≤26.2（以 GitHub Releases 为准）"
sourceKind: authored
modIds: [libgui]
loaders: [fabric]
modrinthSlug: ""
role: api
skillId: mc-libgui
---

# LibGui 声明式 GUI 库集成要点

自写短文。版本、maven 坐标与 API 细节以 [LibGui](https://github.com/CottonMC/LibGui) 当前 README 与示例 mod 为准。

## 何时用 / 何时不用

用：Fabric 模组要快速搭客户端界面（物品栏类界面、设置屏、HUD 组件），声明式 Panel/Widget 树免手写坐标布局。CottonMC 老牌出品，GitHub 活跃至 26.2（全览 §二.6）。

不用（重要）：

- **Modrinth 页面已下架（404）**，别指望"一键依赖解析"或文件页，分发必须走 Cotton maven + Jar-in-Jar（全览陷阱 5）
- 非 Fabric/Quilt 平台不可用（Fabric-only）
- 只要一个简单 Screen → 原版就够，不必引库
- 服务器侧交互不是它的职责：槽位/数据同步仍需原版容器 + 网络包自己补

## Decision Flow

```
Decision: 用不用 LibGui
→ 非 Fabric/Quilt → 不用
→ 只要简单 Screen / 纯文本界面 → 原版 Screen
→ 需要声明式布局、复杂控件 → LibGui
→ 已选 LibGui，分发决策：
   ├─ Modrinth 已下架(404)，禁止引用其文件页
   ├─ 走 Cotton maven：build.gradle 配 maven + modImplementation 坐标（以 README 为准）
   ├─ Jar-in-Jar：把 LibGui 嵌进自己 mod jar，玩家只装你的 mod（配置以 README/Loom 文档为准）
   └─ 版本：与目标 MC 对齐，GitHub Releases / maven 选对应版本（活跃至 26.2）
→ 服务器侧：GUI 只是客户端壳，数据交互仍走原版 Menu + 网络同步（见 mc-networking）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：Cotton maven 仓库 + `modImplementation` 坐标照 README 抄；JiJ 打包配置照 README（Loom 的 jar-in-jar）
2. `fabric.mod.json`：把嵌入依赖写进对应字段（jar-in-jar 语义），保证玩家不单独装 LibGui 也能跑
3. 版本核对：不看 Modrinth（404），以 GitHub Releases / maven 上的版本为准

## 集成要点（伪代码级）

```java
// 客户端：实现/继承 GUI 描述类，返回 Panel 树
// 结构：根 Panel → add 各种 Widget（按钮/文本框/物品槽位）→ 布局交给库
// 类名、包名与方法签名以官方 README + 示例 mod 为准，勿照抄旧教程
// 服务器侧：要槽位交互仍走原版容器 + 网络包同步，LibGui 不替代服务器逻辑
```

- 客户端代码放 client 侧，公共/服务端代码不要引用 LibGui 类
- 控件回调里别做重活，事件分发在渲染线程

## 常见坑

- 按"Modrinth 下载 + 玩家手动装"分发 → 页面已 404，改成 maven + JiJ
- 照抄 1.16 时代旧教程的类名/包名 → 版本跨度大已重构，以当前 README 为准
- 引了 maven 坐标却没 JiJ 打包 → 玩家缺 LibGui，`NoClassDefFoundError`
- 把 GUI 构建代码放进公共/服务端代码 → 专用服崩溃（应用 `Dist.CLIENT` 门闩）

## 自检清单

- 只装你的 mod（不单独装 LibGui）能进游戏并打开 GUI
- 槽位/按钮交互单机与联机行为一致（同步走原版容器）
- `runServer` 日志无 LibGui 类加载
- 目标 MC 版本能拉到对应 maven 坐标，构建无 API 报错

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-libgui`；相关：`mc-gui`、`mc-networking`
- 全览：§二.6 GUI/UI 库、陷阱 5；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/CottonMC/LibGui
- 不清楚时：打开 LibGui README + 示例 mod；`search_fabric_docs` 查 GUI/Menu 相关页；AGENT_USAGE.md 规则先行
