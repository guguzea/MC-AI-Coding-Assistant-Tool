---
name: mc-fluid
description: Fabric 流体开发。Fluid、FluidType、FlowableFluid。触发词：流体、Fluid、FluidType
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 流体开发（Fabric 1.19.4）

## 快速开始

```java
// 1. 子类化 Yarn 的抽象流体基类 net.minecraft.fluid.FlowableFluid
//    （本仓 data/fabric_1.19.4/mappings/yarn-mappings.json 的 classMap 里 net/minecraft/fluid/
//      只有 Fluid / FlowableFluid / WaterFluid / WaterFluid$Still / WaterFluid$Flowing /
//      LavaFluid / LavaFluid$Still / LavaFluid$Flowing / EmptyFluid / FluidState / Fluids；
//      不存在 FabricFlowableFluid，Fabric API 也不提供流体子类）
public class MyFlowableFluid extends FlowableFluid {
    // TODO(未核实)：本包 mappings 与语料内没有一手证据支撑下面这条 Settings 构建链
    //   （slopeFindDistance / levelDecreasePerBlock / tickRate / supportsBoating），
    //   待 query_api --version=1.19.4 或 get_minecraft_source 反编译核实后再填写，禁止照抄。
    // @Override public Fluid getStill() { ... }
    // @Override public Fluid getFlowing() { ... }
    // @Override public FluidState getFluidState(BlockState state) { ... }
}

// 2. 注册流体（同档 rules/01-registry.mdc：Registry.register(Registries.FLUID, id, fluid) 只做一次；
//    对同一 id 再调一次 Registry.register 会重复注册并崩溃，且它也不是「方块状态映射」）
private static final Fluid MY_FLUID = Registry.register(
    Registries.FLUID,
    new Identifier(MOD_ID, "my_fluid"),
    new MyFlowableFluid()
);
```

## Decision: 选择流体类型

```
IF 可流动的液体
  → 继承 net.minecraft.fluid.FlowableFluid（抽象类，需自己子类化）

IF 静态（源）流体
  → 本档没有通用的 StillFluid 类；只有各流体自带的嵌套源态类
    WaterFluid.Still / LavaFluid.Still（vanilla 注册在 Fluids 里）
```

## 常见错误

- ❌忘记注册 Fluid 和对应的方块 — 流体不显示
- ❌Fluid 和 Block 使用不同 ID — 状态映射失败

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 流体通过 Registry.register() 注册 |
| `mc-block` | 流体需要对应的方块 |
