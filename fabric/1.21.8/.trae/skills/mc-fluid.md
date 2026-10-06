---
name: mc-fluid
description: Fabric 流体开发。Fluid、FluidType、FlowableFluid。触发词：流体、Fluid、FluidType
platform: fabric
version: "1.21.8"
dependencies: []
mappings: yarn
---

[DONOR_SKILL 禁止直接抄写]
本 Skill 正文原派生自 fabric/1.21.4；**2026-10-05 已按本档 yarn 映射（data/fabric_1.21.8/mappings/yarn-mappings.sqlite）与本档 Fabric API 真构件 roster 逐名核正**：类名/方法名有本档出处，但构造参数表与抽象成员全集仍未核实 ⇒ 落地前必须 get_minecraft_source(version="1.21.8") 复核，禁止跨档照抄，禁止把 26.1.2 的 mojmap 写法当本档。

# 流体开发（Fabric 1.21.8）

## 本档更正（2026-10-05；证据 = 本档 yarn 映射与本档 Fabric API 真构件 roster）

- 旧正文的 `new FabricFlowableFluid.Settings().slopeFindDistance(3).levelDecreasePerBlock(1).tickRate(5).supportsBoating(true)` 全部零命中：`FabricFlowableFluid` / `slopeFindDistance` / `levelDecreasePerBlock` / `supportsBoating` 不在本档 Yarn 映射；`FlowableFluid` 本档映射里的具名嵌套类只有 `$1` / `$NeighborGroup` / `$SpreadCache`，**没有 `$Settings`**。`tickRate` 在本档只属 `TickManager` / `UpdateTickRateS2CPacket`（游戏刻速管理），与流体构造无关。流体没有 Settings builder，实例只能**子类化 `FlowableFluid`**（本档真实类 `net/minecraft/fluid/FlowableFluid`）。
- 旧正文用同一 id 连调两次 `Registry.register(Registries.FLUID, …)`（第二次还注册第一次的返回值）：重复注册即报错路径；流体只注册一次，「流体对应的方块」是另一条 BLOCK 注册，不是再注册一次 FLUID。

## 快速开始

```java
// 1. 自定义可流动流体：继承本档 Yarn 真类 net.minecraft.fluid.FlowableFluid（抽象基类，需自己子类化）
//    原版家族参考：WaterFluid / WaterFluid$Still / WaterFluid$Flowing，LavaFluid / LavaFluid$Still / LavaFluid$Flowing
//    getStill()/getFlowing() 为本档映射真名（返回 Fluid）；其余抽象成员全集与构造参数本档映射未核实 ⇒
//    落地前用 get_minecraft_source(version="1.21.8", className="net.minecraft.fluid.FlowableFluid") 补齐，禁止拿邻档记忆填写
public abstract class MyFluid extends FlowableFluid {

    @Override
    public Fluid getStill() { return MY_STILL; }

    @Override
    public Fluid getFlowing() { return MY_FLOWING; }
    // TODO(未核实): 其余抽象 override（如方块状态/流体状态映射一族）本档映射未证出，不得凭记忆补写

    public static class Still extends MyFluid { }

    public static class Flowing extends MyFluid { }
}

// 2. 两种形态各注册一次。本档注册入口 = net.minecraft.registry.Registries（FLUID 字段在其上）+ Registry.register；
//    本档 Identifier.of(String,String) 为映射真名
public static final Fluid MY_STILL = Registry.register(
    Registries.FLUID,
    Identifier.of(MOD_ID, "my_fluid"),
    new MyFluid.Still()
);

public static final Fluid MY_FLOWING = Registry.register(
    Registries.FLUID,
    Identifier.of(MOD_ID, "flowing_my_fluid"),
    new MyFluid.Flowing()
);

// 3. 流体要进世界还须注册对应液体方块（见 mc-block）——那是 BLOCK 注册，不是再注册一次 FLUID
```

## Decision: 选择流体类型

```
IF 可流动的液体
  → 继承本档真类 FlowableFluid（FabricFlowableFluid 本档零命中，禁止当注册方式写）

IF 需要「静止/流动」成对形态
  → 照原版家族各写一个子类（本档没有名为 StillFluid 的独立类，零命中）

IF 流体要出现在世界里
  → 还要注册对应液体方块（见 mc-block），流体本身只注册一次
```

## 渲染（客户端，本档 Fabric API 真构件）

```java
// net.fabricmc.fabric.api.client.render.fluid.v1 —— FluidRenderHandler / FluidRenderHandlerRegistry / SimpleFluidRenderHandler
// 本档 register 有两种签名：register(Fluid, FluidRenderHandler) 与 register(Fluid still, Fluid flow, FluidRenderHandler)
FluidRenderHandlerRegistry.INSTANCE.register(MY_STILL, MY_FLOWING, new SimpleFluidRenderHandler(
    // TODO(未核实): SimpleFluidRenderHandler 构造参数表（纹理 sprite id / overlay）roster 未证 ⇒ 反编译构件后再填
));
```

## 常见错误

- ❌ 把 `new FabricFlowableFluid.Settings()...` 当注册方式 — 该名字本档 Yarn 与本档 Fabric API 真构件零命中，是虚构，不可写
- ❌ 同一 id 调两次 `Registry.register(Registries.FLUID, …)` — 重复注册是报错路径，流体只注册一次
- ❌ 忘记注册 Fluid 和对应的方块 — 流体不显示
- ❌ Fluid 和 Block 使用不同 ID — 状态映射失败

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 流体通过 Registry.register() 注册 |
| `mc-block` | 流体需要对应的液体方块才能进入世界 |
| `mc-item` | 通常再配一个桶物品（本档映射真类 BucketItem） |
