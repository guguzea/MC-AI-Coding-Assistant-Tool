---
name: mc-fluid
description: Fabric 流体开发。Fluid、FluidType、FlowableFluid。触发词：流体、Fluid、FluidType
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 流体开发（Fabric 1.21.11）

## 快速开始

```java
// 1. 自定义流体：继承原版的 FlowableFluid（net/minecraft/fluid/FlowableFluid）
//    构造签名本代理未核实 ⇒ 落地前用 get_minecraft_source / IDE genSources 取 FlowableFluid 的形参，不要照抄任何「看着像」的 builder 链
private static final Fluid MY_FLUID = new MyFluid();   // TODO(未核实): class MyFluid extends FlowableFluid { … }

// 2. 只注册一次；流体需要配一个 Block 才会出现在世界里（见 mc-block），但那是注册 Registries.BLOCK，不是再注册一次 FLUID
Registry.register(
    Registries.FLUID,
    Identifier.of(MOD_ID, "my_fluid"),
    MY_FLUID
);
```

> **本节更正（F185，2026-09-13；证据 = 本档 yarn 映射全表 `[T12111]` = `M:\data\fabric_1.21.11\mappings\yarn-1.21.11+build.6-tiny.gz` 的 `gunzip -c` 输出）**：
> ① 原示例的 `new FabricFlowableFluid.Settings().slopeFindDistance(3).levelDecreasePerBlock(1).tickRate(5).supportsBoating(true)` 全部查无此名：`FabricFlowableFluid` / `slopeFindDistance` / `levelDecreasePerBlock` / `supportsBoating` 在 `[T12111]` 全表 **0 命中**；可流动流体的 Yarn 基类是 `net/minecraft/fluid/FlowableFluid`（`[T12111]` L71911 = `class_3609`），它的具名嵌套类**只有** `$1`（L71947）/ `$NeighborGroup`（L71948）/ `$SpreadCache`（L71955），**没有 `$Settings`**。`tickRate` 全表只出现 1 行且是 **FIELD**（L33727 `field_46961`），不是流体上的链式方法。这组拼写来自 Mojmap 侧命名，Yarn 轴不成立。
> ② 原示例用**同一个 id** `Identifier.of(MOD_ID, "my_fluid")` 连续调了两次 `Registry.register(Registries.FLUID, …)`（第二次还注册的是第一次的返回值）—— 重复注册同名条目就是报错路径，流体只需注册一次；`Registries.FLUID` 本身存在（`[T12111]` L6449 `field_41173`）。
> ③ 本文件 frontmatter 的 `description` 仍写着 `FluidType`：`FluidType` 在 `[T12111]` 全表 **0 命中**（它是 Forge/NeoForge 的流体类型类，不在 Yarn 轴）。frontmatter 属禁改区，**已登记移交主代理**。

## Decision: 选择流体类型

```
IF 可流动的液体
  → 继承 FlowableFluid（net/minecraft/fluid/FlowableFluid，本档 class_3609）

IF 需要「静态 / 流动」成对形态
  → 照原版家族结构自己写两个子类：静态侧对应 WaterFluid$Still / LavaFluid$Still，
     流动侧对应 WaterFluid$Flowing / LavaFluid$Flowing
     （本档**没有**名为 StillFluid 的独立类，全表 0 命中）

IF 流体要出现在世界里
  → 还要注册对应的 Block（Registries.BLOCK，见 mc-block），与 FLUID 注册是两次不同的注册
```

## 常见错误

- ❌忘记注册 Fluid 和对应的方块 — 流体不显示
- ❌Fluid 和 Block 使用不同 ID — 状态映射失败

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 流体通过 Registry.register() 注册 |
| `mc-block` | 流体需要对应的方块 |
