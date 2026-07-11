# Fabric 流体开发命令参考

本文件描述 Fabric 1.17.1 平台上进行流体（Fluid）开发时所需掌握的核心 API 和常用命令。

## 核心概念

流体是 Minecraft 中表示液体和气体的特殊方块/实体组合。每个流体由两部分组成：`Fluid`（流体实例）和对应的方块。

**⚠️ 1.17.x 没有 `FluidType` 类**，直接使用 `StillFluid` 和 `FlowingFluid`。

## 流体注册命令

### StillFluid / FlowingFluid 命令

```java
// ✅ 1.17.x 使用 Registry.FLUID
private static final Fluid MY_FLUID = Registry.register(
    Registry.FLUID,
    new Identifier(MOD_ID, "my_fluid"),
    new StillFluid(
        FabricFluidAttributes.builder(
            new Identifier("minecraft", "block/water_still"),
            new Identifier("minecraft", "block/water_flow")
        )
            .density(1000)
            .viscosity(5)
    )
);
```

### 流动流体命令

```java
// 流动流体
private static final Fluid FLOWING_MY_FLUID = Registry.register(
    Registry.FLUID,
    new Identifier(MOD_ID, "flowing_my_fluid"),
    new FlowingFluid(
        FabricFluidAttributes.builder(
            new Identifier("minecraft", "block/water_still"),
            new Identifier("minecraft", "block/water_flow")
        )
            .density(1000)
            .viscosity(5)
    )
);
```

## 流体方块命令

```java
private static final Block MY_FLUID_BLOCK = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_fluid_block"),
    new FluidBlock(MY_FLUID, AbstractBlock.Settings.copy(Blocks.WATER))
);
```

## 注意事项

1.17.1 的流体 API 与 1.20.x 差异很大：
- **没有 `FluidType` 类**
- 直接继承 `StillFluid` / `FlowingFluid`
- **没有 `FluidBucketItem`** - 需要手动注册普通 `Item`

参考 Minecraft 1.17.1 原版源码中的水/岩浆实现。
