---
id: authored/bedrock-script-api-primer
title: 基岩版 Script API 入门要点（@minecraft/server）
tags: [bedrock, script-api, javascript, typescript, manifest, system-run, world, addon]
summary: manifest 加 script 模块与 @minecraft/server 依赖；world/system 核心类；tick 循环与 % 200 调度；spawnEntity/dimension.id；热重载 /reload；版本锁定陷阱（依赖 version 决定可用 API）；TypeScript 工具链价值。
mcHint: stable 线（示例 @minecraft/server 1.5.0 / min_engine 1.20.30；模块版本随游戏更新）
sourceKind: authored
---

# 基岩版 Script API 入门要点

自写短文。依据 Microsoft Learn《Introduction to Scripting》（本地 `data/bedrock_stable` 已收录原文，2026-08 抓取）提炼；**不是 Java 版教程**，勿混用 Forge/Fabric 概念。

## 启用脚本：manifest 两处改动

```json
{
  "format_version": 2,
  "modules": [
    { "type": "data",   "uuid": "…", "version": [1,0,0] },
    { "type": "script", "uuid": "…", "version": [1,0,0], "entry": "scripts/main.js" }
  ],
  "dependencies": [
    { "module_name": "@minecraft/server", "version": "1.5.0" }
  ]
}
```

- **dependencies 里的 version 决定你能用哪套 API**：写 `"1.5.0"` 就只有 1.5.0 的接口；想用新 API 必须升版本号——旧教程代码跑不起来多半是这个。beta API 还要在世界设置开实验开关。
- 每个 module/header 的 UUID 必须全新生成，不能复用。
- 语言是 JavaScript（社区多用 TypeScript 编译）；没有 Gradle/Java。

## 最小骨架：world + system

```js
import { world, system } from "@minecraft/server";

function mainTick() {
  if (system.currentTick % 200 === 0) {        // 每 10 秒（20 tick = 1 秒）
    world.sendMessage("hello");
  }
  system.run(mainTick);                        // 自续循环
}
system.run(mainTick);
```

- `system.run(fn)` 把函数排进当前 tick；末尾不写首次调用、函数内不写自续，都只会跑一次。
- **别依赖绝对 tick**（`currentTick === 400` 只会在一个世界里发生一次，存档续玩时已过期）；周期任务用 `% n === 0`。
- 常用对象：`world.getAllPlayers()` / `world.sendMessage()`；`player.dimension`（`.id === "minecraft:overworld|nether|…"`）；`dimension.spawnEntity("minecraft:fox", location)`；`Entity`/`Block` 类在 `@minecraft/server` 文档里查。

## 热重载

- 世界内 `/reload` 重载脚本文件——日常迭代不用退出世界。
- 但「错过就不再触发」的逻辑（绝对 tick、世界加载一次性事件）reload 后不会补跑；改这类逻辑要新建世界验证。

## 与行为包的关系

- Script 是行为包里的一个 module，与 JSON 实体/方块定义共存；常见分工：JSON 定义结构属性，脚本负责动态逻辑（事件响应、计分、自定义机制）。
- 事件监听（如 `world.afterEvents.entityDie`）属于进阶用法，入门教程只教了 tick 循环；写事件前先查 `search_bedrock_docs` 对应模块的 API 参考。

## 工具链建议（官方立场）

- 上 TypeScript：静态类型 + Intellisense + 升级 API 时编译期报错；官方 samples 全是 TS。
- 官方样例仓库 `microsoft/minecraft-samples`（behavior_pack_sample 等）+ VS Code 的 Minecraft 扩展。

## 反模式

- ❌ 拿 Java 版（Forge/Fabric）类名或概念硬套（没有 Registry/ItemStack 那套）。
- ❌ dependencies 版本写 beta 号但没开实验开关，或反之。
- ❌ 在 tick 循环里每 tick `getAllPlayers()+sendMessage` 刷屏；按需降频。
- ❌ 把脚本逻辑绑在绝对 tick 上（见上）。

## 自检

- 新世界进入后消息按预期出现；`/reload` 后改动生效。
- 换维度行为正确（overworld/nether 分支各验一次）。
- 三端（Windows/手机/主机）行为一致——Script API 行为以引擎为准，个别接口平台差异查官方注释。

## 不清楚时

- 官方教程原文：https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/introduction?view=minecraft-bedrock-stable
- 本地已收录：`search_bedrock_docs`（script-api-intro / script-server / getting-started）
- API 参考：https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/?view=minecraft-bedrock-stable （接口随模块版本变化，写码前核对）
