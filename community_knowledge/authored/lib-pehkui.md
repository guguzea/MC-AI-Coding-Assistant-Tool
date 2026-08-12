---
id: authored/lib-pehkui
title: Pehkui 实体缩放 API 集成要点
tags: [pehkui, scale, entity, resize, fabric, forge, neoforge, quilt, virtuoel]
summary: 实体缩放 API（920 万下载，F/Forge/Neo/Quilt 1.14.4-1.21.1）：20+ 缩放类型（身高/宽度/视距/命中盒等）可分别设置并带平滑过渡；注意版本窗口停在 1.21.1。
mcHint: 1.14.4-1.21.1
minecraftVersions: "1.14.4-1.21.1"
sourceKind: authored
modIds: [pehkui]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: pehkui
role: api
skillId: mc-pehkui
---

# Pehkui 实体缩放 API 集成要点

自写短文。版本与 API 细节以 [Pehkui](https://github.com/Virtuoel/Pehkui) 当前 README 与示例为准。

## 何时用 / 何时不用

用：要**改变实体（含玩家）尺寸**，且需要按 20+ 缩放类型分别控制（身高、宽度、视距、命中盒、经验掉落等），或需要**平滑过渡动画**。四平台（F/Forge/Neo/Quilt）均有构建，是做缩放类玩法的标准选择（全览 §二.8）。

不用：

- 目标 MC 高于 1.21.1 → Pehkui 版本窗口已停（以 GitHub Releases 为准），评估原版缩放机制（如 1.20.5+ 的 scale attribute）或其他方案
- 只需要简单固定倍率缩放 → 原版实体 scale 相关属性/机制够用时不必引库
- 只需要外观比例、不涉及命中盒/视距 → 看需求再决定是否上 Pehkui

## Decision Flow

```
Decision: 用不用 Pehkui
→ 目标 MC 高于 1.21.1 → 无新构建，评估原版缩放机制或其他库
→ 简单固定倍率 → 原版实体缩放属性/机制够用
→ 需要分类型缩放 + 平滑过渡 → Pehkui
→ 已选：
   ├─ 平台分支：Fabric / Forge / NeoForge / Quilt 各装对应构建
   ├─ 缩放类型：20+ 种（身高/宽度/视距/命中盒/掉落物等），按需组合，不是整体一缩了事
   ├─ 过渡：平滑插值动画（时长/缓动参数以 README 为准）
   └─ 版本：1.14.4-1.21.1 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按官方 README 配 maven 仓库与依赖坐标（Fabric Loom 用 `modImplementation`，Forge/Neo 照 README 抄）
2. `fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` / `suggests` 写 pehkui（软依赖门闩见 `authored/soft-deps-modlist`）
3. 版本核对：以 GitHub Releases / Modrinth 文件页为准，确认目标 MC 有对应构建

## 集成要点（伪代码级）

```java
// 取实体缩放 API → 按类型设置缩放值（身高/宽度/视距等分开设）
// 平滑过渡：设置动画目标与时长/缓动，库负责插值
// 重置：把对应缩放类型恢复到 1.0 或调取消入口
// 类名、包名与方法签名以官方 README + 示例为准，勿照抄旧版本教程
```

- 缩放类型按玩法需求组合：改外观同时考虑命中盒/视距，避免"看得见打不着"
- 客户端与服务端行为由库同步，触发逻辑放服务端

## 常见坑

- 在 1.21.2+ 找 Pehkui 构建 → 版本窗口停在 1.21.1，以 GitHub Releases 为准
- 只缩了模型没缩命中盒/视距 → 没配对应缩放类型，交互错位
- 只设终值没有动画 → 平滑过渡需要显式动画入口，不会自动补间
- 与同样改实体尺寸的 mod 叠加 → 缩放值互相覆盖，先查冲突面

## 自检清单

- 缩放后外观与命中盒/视距匹配，交互正常
- 平滑过渡动画符合预期（时长/缓动生效）
- 取消缩放后实体恢复原尺寸
- `runServer` 日志无 Pehkui 相关报错

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-pehkui`；相关：`mc-entity`、`mc-renderer`、`mc-cca`
- 全览：§二.8 服务端/网络/文本；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Virtuoel/Pehkui
- 不清楚时：打开 Pehkui README + 示例；`query_api` / `search_*_docs` 查实体缩放相关 API；AGENT_USAGE.md 规则先行
