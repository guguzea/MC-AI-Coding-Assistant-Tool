---
id: authored/lib-moonlight
title: Moonlight Lib（原 Selene）集成要点
tags: [moonlight, selene, dynamic-registration, blockset, villager, fluid, forge, fabric, neoforge]
summary: MehVahdJukaar 的动态注册/资源库（3690 万下载，CF 2.33 亿，F/Forge/Neo 1.16.5-1.21.1）。动态注册、BlockSetAPI、村民 AI、流体系统；⚠️ 版本上限 1.21.1，26.x 无构建。Supplementaries/Sawmill 依赖。
mcHint: 1.16.5-1.21.1
minecraftVersions: "1.16.5-1.21.1"
sourceKind: authored
modIds: [moonlight]
loaders: [fabric, forge, neoforge]
modrinthSlug: moonlight
role: api
skillId: mc-moonlight-lib
---

# Moonlight Lib（原 Selene）集成要点

自写短文。Moonlight Lib 曾用名 Selene，API 与版本细节以 [官方仓库](https://github.com/MehVahdJukaar/Moonlight) 当前 README 为准。

## 何时用 / 何时不用

用：需要以下任一能力，且**目标 MC 版本 ≤ 1.21.1**（全览报告 §二.3，支持窗口 1.16.5-1.21.1）：

- **动态注册**：运行时注册/动态资源，减少静态样板
- **BlockSetAPI**：把新方块接入原版方块族（楼梯/台阶/墙/栅栏/门等成套变体），免手写一堆变体注册与模型
- **村民 AI**：给村民职业加自定义 AI 行为/任务的便捷接口
- **流体系统**：流体渲染与行为的封装工具

Supplementaries、Sawmill 等模组依赖它，生态成熟。

不用（重要）：

- **目标版本 1.21.4+ / 26.x → 不要用。** Moonlight 停在 1.21.1，没有 26.x 构建（全览报告 §二.3 版本列明确为 1.16.5-1.21.1）。新版需求要么自研，要么等作者更新
- 只需要零散的方块族变体 → 原版/自己写变体注册可能更轻
- 只想要通用跨平台抽象 → Architectury / Balm 定位不同

## Decision Flow

```
Decision: 要不要用 Moonlight Lib
→ 目标版本 > 1.21.1（如 1.21.4 / 26.x）→ 不用（无构建），自研或换方案
→ 目标 ≤ 1.21.1 且需要 动态注册/BlockSet/村民 AI/流体 中 ≥1 项 → Moonlight
→ 只要注册抽象，不需要上述能力 → Architectury（lib-architectury）或 Balm（lib-balm）
→ 已选 Moonlight：
   ├─ 版本：1.16.5-1.21.1 内与 MC 对齐（文件页为准）
   ├─ BlockSet：声明你要的方块族 → 库自动生成成套变体与模型
   └─ 村民 AI：通过其注册入口挂任务，别直接改原版 GoalSelector
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven 仓库与坐标照抄（Fabric 用 Loom `modImplementation`，Forge/Neo 对应配置）
2. `mods.toml` / `neoforge.mods.toml` / `fabric.mod.json`：`depends` 写 moonlight；软依赖门闩见 `authored/soft-deps-modlist`
3. 版本核对：**先确认你的 MC 版本 ≤ 1.21.1 且该版本有对应构建**，这是硬门槛
4. 若从旧项目升级：留意曾用名 Selene 的坐标/包名差异，以当前 README 为准

## 集成要点（伪代码级）

```java
// 类名/包名以官方 README 为准，下面只是流程
// 动态注册：用其注册入口登记方块/物品（比手写 DeferredRegister 样板少）
// BlockSet：把新方块声明进目标方块族（如原版石头族），库补全楼梯/台阶/墙等变体与模型
// 村民 AI：给职业注册额外 AI 任务（寻路/交互），遵守客户端-服务端边界
// 流体：用其流体工具注册与渲染，别手写渲染管线
```

- BlockSet 生成的内容也要补语言文件与掉落物，别漏
- 村民 AI 只在服务端逻辑生效，渲染/音效归客户端
- 动态资源名守 modId 命名规则

## 常见坑

- **在 1.21.4+ / 26.x 项目里声明 moonlight 依赖** → 找不到构建或启动崩溃，这是最常见的坑
- 用了 BlockSet 却没给变体补掉落物/合成 → 方块获取不到
- 把村民 AI 逻辑写进客户端类 → 专用服异常
- 只 `compileOnly` 却硬依赖 → 未装 Moonlight 时 `NoClassDefFoundError`
- 混用新旧坐标（Selene vs Moonlight）→ 依赖解析失败

## 自检清单

- 项目 MC 版本 ≤ 1.21.1 且依赖版本与文件页一致
- 未装 Moonlight（若软依赖）：模组正常进档
- BlockSet 变体（楼梯/台阶等）在创造模式可拿、模型正确、掉落正常
- 村民新 AI 行为在游戏中生效，服务端日志无异常

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`、`audit_resources`
- Skill：`mc-moonlight-lib`；相关：`mc-block`、`mc-villager`、`mc-fluid`、`mc-model`
- 全览：§二.3 跨加载器抽象层；`authored/library-catalog-2026`、`authored/soft-deps-modlist`
- 官方：https://github.com/MehVahdJukaar/Moonlight
- 不清楚时：打开官方 README + 示例 mod（Supplementaries 源码是现成范例）；AGENT_USAGE.md 规则先行
