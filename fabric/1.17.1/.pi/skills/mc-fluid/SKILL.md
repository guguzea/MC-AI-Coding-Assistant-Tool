---
name: mc-fluid
description: Fabric 流体开发。Fluid、FluidType、FlowableFluid。触发词：流体、Fluid、FluidType
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 流体开发（Fabric 1.17.1）

## 快速开始

```java
// 1. 创建流体
// ⚠️ 1.17.x 使用 Registry.FLUID
private static final Fluid MY_FLUID = Registry.register(
    Registry.FLUID,
    new Identifier(MOD_ID, "my_fluid"),
    new FabricFlowableFluid.Settings()
        .slopeFindDistance(3)
        .levelDecreasePerBlock(1)
        .tickRate(5)
);

// 2. 注册对应的方块状态
Registry.register(Registry.FLUID, new Identifier(MOD_ID, "my_fluid"), MY_FLUID);
```

## Decision: 选择流体类型

```
IF 可流动的液体
  → FabricFlowableFluid

IF 静态流体（岩浆等）
  → StillFluid
```

## 常见错误

- ❌忘记注册 Fluid 和对应的方块 — 流体不显示
- ❌Fluid 和 Block 使用不同 ID — 状态映射失败

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 流体通过 Registry.register() 注册 |
| `mc-block` | 流体需要对应的方块 |
