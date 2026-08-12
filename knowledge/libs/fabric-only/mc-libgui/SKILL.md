---
name: mc-libgui
description: LibGui 声明式 GUI。触发词：LibGui、声明式 GUI、Cotton、Panel、Widget、GUI 库
platforms: [fabric, quilt]
mcVersions: ["≤26.2"]
communityDocId: authored/lib-libgui
mappings: hint
---

# LibGui（Fabric 声明式 GUI）

Panel/Widget 树声明式建客户端界面（物品栏类、设置屏、HUD 组件），免手写坐标布局。GitHub 活跃至 26.2。**Modrinth 页面已下架（404）**：分发走 Cotton maven + Jar-in-Jar。仅 Fabric（Quilt 以官方为准）。

## Decision Flow

```
Decision: 用不用 LibGui
→ platform = forge / neoforge → 本 skill 不适用（Fabric-only）
→ 只要简单 Screen / 纯文本界面 → 原版 Screen 就够
→ 需要声明式布局、复杂控件 → LibGui
→ 已选，分发决策：
   ├─ Modrinth 已下架(404)，禁止引用其文件页
   ├─ 走 Cotton maven：build.gradle 配 maven + modImplementation 坐标（以 README 为准）
   ├─ Jar-in-Jar：把 LibGui 嵌进自己 mod jar，玩家只装你的 mod
   └─ 版本：与目标 MC 对齐（GitHub Releases / maven；活跃至 26.2）
→ 服务器侧：GUI 只是客户端壳，槽位/数据交互仍走原版 Menu + 网络同步（mc-networking）
```

## 软/硬依赖

- Cotton maven 仓库 + 坐标照 README 抄；JiJ 打包配置照 README（Loom jar-in-jar）
- `fabric.mod.json`：嵌入依赖写进 jar-in-jar 字段，玩家不单独装 LibGui 也能跑
- 类加载隔离：客户端代码放 client 侧，公共/服务端代码不要引用 LibGui 类
- 控件回调里别做重活，事件分发在渲染线程

## 官方文档

- 仓库：https://github.com/CottonMC/LibGui （README + 示例 mod）

## communityDocId 引用

- `authored/lib-libgui`：完整要点（含下架与分发替代路径），经 MCP `search_community_docs` 读取

## 常见错误

- 按"Modrinth 下载 + 玩家手动装"分发：页面已 404，改 maven + JiJ
- 引了 maven 坐标却没 JiJ 打包：玩家缺 LibGui，NoClassDefFoundError
- 把 GUI 构建代码放进公共/服务端代码：专用服崩溃（Dist.CLIENT 门闩）
- 照抄 1.16 时代旧教程类名/包名：已重构，以当前 README 为准

## 自检

- 只装你的 mod（不单独装 LibGui）能进游戏并打开 GUI
- 槽位/按钮交互单机与联机一致（同步走原版容器）
- runServer 日志无 LibGui 类加载；目标版本能拉到 maven 坐标

未核对签名不写死：GUI 描述类与 Widget API 以官方 README + 示例 mod 为准。
