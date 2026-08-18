---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、ForgeFlowingFluid、FluidAttributes、桶物品。触发词：Fluid、FluidAttributes、FlowingFluid、BucketItem、桶、bucket、流体
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 流体开发（Forge 1.16.5）

## Decision: 创建流体

```
IF 只需要静态流体（不流动）
  → 仍建议同时注册 Source + Flowing

IF 需要流动、填装、无限水源
  → ForgeFlowingFluid.Source + ForgeFlowingFluid.Flowing + FlowingFluidBlock + BucketItem
```

**本档没有 `FluidType`。** `FluidType` 是 Forge **1.19+**。1.16.5 用 `FluidAttributes.builder`。Parchment 类名：`FlowingFluid` / `FlowingFluidBlock`（MCP 常写作 `LiquidBlock` 的邻版名不要用到 `ForgeRegistries.FLUID_TYPES` 上）。

## 完整示例：自定义流体

### 1. 定义流体属性

```java
public static final ResourceLocation STILL_RL = new ResourceLocation(MOD_ID, "block/my_fluid_still");
public static final ResourceLocation FLOW_RL = new ResourceLocation(MOD_ID, "block/my_fluid_flow");

public static final ForgeFlowingFluid.Properties FLUID_PROPERTIES =
    new ForgeFlowingFluid.Properties(
        MY_FLUID_SOURCE,
        MY_FLUID_FLOWING,
        FluidAttributes.builder(STILL_RL, FLOW_RL)
            .density(1000)
            .viscosity(1000)
            .temperature(300)
            .luminosity(0)
            .color(0xFF3F76E4)
    )
        .bucket(() -> MY_BUCKET.get())
        .block(() -> MY_FLUID_BLOCK.get());
```

### 2. 注册 Source / Flowing

```java
public static final DeferredRegister<Fluid> FLUIDS =
    DeferredRegister.create(ForgeRegistries.FLUIDS, MOD_ID);

public static final RegistryObject<FlowingFluid> MY_FLUID_SOURCE =
    FLUIDS.register("my_fluid", () -> new ForgeFlowingFluid.Source(FLUID_PROPERTIES));

public static final RegistryObject<FlowingFluid> MY_FLUID_FLOWING =
    FLUIDS.register("my_fluid_flowing", () -> new ForgeFlowingFluid.Flowing(FLUID_PROPERTIES));
```

### 3. 注册流体方块与桶

```java
public static final RegistryObject<FlowingFluidBlock> MY_FLUID_BLOCK =
    BLOCKS.register("my_fluid",
        () -> new FlowingFluidBlock(MY_FLUID_SOURCE,
            Block.Properties.of(Material.WATER)
                .noCollission()
                .strength(100.0f)
                .noDrops()
        )
    );

public static final RegistryObject<Item> MY_BUCKET =
    ITEMS.register("my_fluid_bucket",
        () -> new BucketItem(MY_FLUID_SOURCE,
            new Item.Properties().stacksTo(1).tab(ItemGroup.TAB_MISC)
        )
    );
```

1.16.5 Parchment 里 `Item.Properties` 若没有 `stacksTo` / `tab`，改用 `maxStackSize(1)` / `group(ItemGroup.TAB_MISC)`。

## DeferredRegister 汇总

| 类型 | 注册表 | 备注 |
|------|--------|------|
| `Fluid`（Source / Flowing） | `ForgeRegistries.FLUIDS` | 不要 `ForgeRegistries.FLUID_TYPES` |
| `Block` | `ForgeRegistries.BLOCKS` | `FlowingFluidBlock` |
| `Item` | `ForgeRegistries.ITEMS` | `BucketItem` |

## 常见错误

- ❌ `FluidType` / `ForgeRegistries.FLUID_TYPES` / `Keys.FLUID_TYPES`（1.19+）
- ❌ `Properties` 三个参数写成 FluidType + Fluid + Fluid
- ❌ `BucketItem` 引用未注册的 `Fluid`
- ❌ 流体方块未 `.noDrops()`
- ❌ 密度/黏度设为 0

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 只注册 `ForgeRegistries.FLUIDS` |
| `mc-datagen` | 流体可生成方块状态 JSON 和语言文件 |
| `mc-block` | 流体方块按普通方块注册 |
