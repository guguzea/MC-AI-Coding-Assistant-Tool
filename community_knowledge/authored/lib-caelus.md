---
id: authored/lib-caelus
title: Caelus API 鞘翅飞行抽象集成要点
tags: [caelus, elytra, flight, attribute, forge, fabric, neoforge]
summary: 将鞘翅飞行抽象为实体属性的 API（690 万下载，F/Forge/Neo 1.13.2-1.21.5），支持自定义飞行能力。⚠️ 26.x 新版号未跟进（全览 §五 陷阱 8），选依赖注意版本窗口。
mcHint: 1.13.2-1.21.5
minecraftVersions: "1.13.2-1.21.5"
sourceKind: authored
modIds: [caelus]
loaders: [fabric, forge, neoforge]
modrinthSlug: caelus
role: api
skillId: mc-caelus
---

# Caelus API 鞘翅飞行抽象集成要点

自写短文。Caelus 的 API 与版本细节以 [官方仓库](https://github.com/TheIllusiveC4/Caelus) 当前 README 为准。

## 何时用 / 何时不用

用：模组需要把**鞘翅飞行能力**从「鞘翅这件物品」中解耦出来，抽象成**实体属性**（全览报告 §二.4）。典型场景：

- 让自定义装备/饰品赋予鞘翅式滑翔（与 Curios / Trinkets 类槽位配合）
- 让特定实体具备飞行能力，而不绑定原版鞘翅物品
- 查询/控制实体当前能否鞘翅飞行，做能力门闩

Caelus 由 TheIllusiveC4（Curios 作者）维护，Fabric / Forge / NeoForge 三端 1.13.2-1.21.5 都有构建。

不用（重要）：

- **⚠️ 26.x 新版号未跟进。** 全览报告 §五 陷阱 8 明确：Mantle、Botarium、Caelus 等未跟进 2026 新版号（26.x）。**1.21.5+ / 26.x 项目没有对应构建**，别选它
- 只是给玩家穿鞘翅，不扩展能力 → 原版机制就够，不用引库
- 目标版本超出 1.13.2-1.21.5 窗口 → 自研（基于原版飞行逻辑）或换方案

## Decision Flow

```
Decision: 要不要用 Caelus
→ 目标版本 > 1.21.5（如 1.21.5+ / 26.x）→ 不用（未跟进新版号，无构建）
→ 需要自定义鞘翅式飞行/查询飞行能力，且版本 ≤ 1.21.5 → Caelus
→ 只用原版鞘翅，无自定义需求 → 不引库，直接原版
→ 已选 Caelus：
   ├─ 版本：1.13.2-1.21.5 内与 MC 对齐（文件页为准）
   ├─ 平台：三端（F/Forge/Neo）同版本窗口，按端选构建
   └─ 集成：用其 API 给实体/装备挂飞行能力，属性/状态在服务端
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven 仓库（`https://maven.theillusivec4.top/`，以 README 为准）与坐标照抄；Fabric 走 Loom `modImplementation`，Forge/Neo 对应配置
2. artifact 名随端变化（`caelus-fabric` / `caelus-forge` / `caelus-neoforge` 之类，以文件页为准），别混用
3. `mods.toml` / `neoforge.mods.toml` / `fabric.mod.json`：`depends` 写 caelus；软依赖门闩见 `authored/soft-deps-modlist`
4. 版本核对：**26.x 无构建**，1.21.5 之后的项目直接放弃此库

## 集成要点（伪代码级）

```java
// 类名/包名以官方 README 为准，下面只是流程
// 能力查询：问库「该实体当前能否鞘翅飞行」→ 用结果做门闩/交互分支
// 赋予能力：给实体/装备挂飞行属性（库提供注册入口），飞行逻辑由库接管
// 与饰品槽配合：饰品槽回调里把 Caelus 能力挂到玩家身上（Fabric 配 Trinkets / Forge 配 Curios）
```

- 飞行状态与属性计算放服务端，客户端只做表现（粒子/音效/动画）
- 能力赋予时机：实体生成/装备变更时挂，别每 tick 重复注册
- 与其它飞行类模组并存时，能力判断以 Caelus 查询结果为准，避免互踩

## 常见坑

- **给 1.21.5+ / 26.x 项目声明 caelus 依赖** → 无构建/启动崩溃（未跟进新版号）
- 把 Caelus 的能力查询写进客户端，服务端逻辑不生效
- 只 `compileOnly` 却硬依赖 → 未装 Caelus 时 `NoClassDefFoundError`
- 每 tick 重复注册/撤销能力 → 性能浪费与状态闪烁
- 与其它飞行模组叠加时未做能力门闩 → 双重飞行/冲突

## 自检清单

- 项目版本 ≤ 1.21.5，依赖版本与文件页一致（26.x 项目应无此依赖）
- 未装 Caelus（若软依赖）：模组正常进档
- 装了 Caelus：自定义装备/实体能鞘翅飞行，行为与原版鞘翅一致
- 服务端能正确查询/控制飞行能力，日志无异常

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-caelus`；相关：`mc-item`、`mc-entity`、`mc-curios`、`mc-trinkets`
- 全览：§二.4 饰品/装备槽、§五 陷阱 8（Caelus 未跟进 26.x）；`authored/library-catalog-2026`、`authored/lib-curios`、`authored/lib-trinkets`
- 官方：https://github.com/TheIllusiveC4/Caelus
- 不清楚时：打开官方 README + 示例 mod（作者另维护 Curios，其仓库也有配合用法）；AGENT_USAGE.md 规则先行
