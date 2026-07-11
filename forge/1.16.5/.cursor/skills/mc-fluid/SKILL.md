---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、FluidType、FlowingFluid、桶物品。触发词：Fluid、FluidType、FlowingFluid、BucketItem、桶、bucket、流体
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 流体开发（Forge 1.16.5）

## Decision: 创建流体类型

```
IF 只需要静态流体（不流动）
  → Fluid + FluidType 即可

IF 需要流动、填装、无限水源
  → Fluid + FluidType + FlowingFluid + BucketItem
```

## 完整示例：自定义流体

### 1. 定义流体属性

```java
public static final ForgeFlowingFluid.Properties FLUID_PROPERTIES =
    new ForgeFlowingFluid.Properties(
        MY_FLUID_TYPE,     // source fluid type
        MY_FLUID,          // flowing fluid
        MY_FLUID_SOURCE     // source fluid
    )
        .bucket(() -> MY_BUCKET.get())
        .block(() -> MY_FLUID_BLOCK.get());
```

### 2. 注册 FluidType（必需，独立注册表）

```java
public static final DeferredRegister<FluidType> FLUID_TYPES =
    DeferredRegister.create(ForgeRegistries.FLUID_TYPES, MOD_ID);

public static final RegistryObject<FluidType> MY_FLUID_TYPE =
    FLUID_TYPES.register("my_fluid_type",
        () -> new FluidType(FluidType.Properties.create()
            .density(1000)        // 密度（水的密度 = 1000）
            .viscosity(1000)      // 黏度（水的黏度 = 1000）
            .temperature(300)     // 温度（开尔文）
            .lightLevel(0)        // 发光等级 0-15
        )
    );
```

### 3. 注册 Source Fluid（静止来源）

```java
public static final DeferredRegister<Fluid> FLUIDS =
    DeferredRegister.create(ForgeRegistries.FLUIDS, MOD_ID);

public static final RegistryObject<FlowingFluid> MY_FLUID_SOURCE =
    FLUIDS.register("my_fluid",
        () -> new ForgeFlowingFluid.Source(FLUID_PROPERTIES)
    );
```

### 4. 注册 Flowing Fluid（流动变体）

```java
public static final RegistryObject<FlowingFluid> MY_FLUID =
    FLUIDS.register("my_fluid_flowing",
        () -> new ForgeFlowingFluid.Flowing(FLUID_PROPERTIES)
    );
```

### 5. 注册流体方块

```java
public static final RegistryObject<LiquidBlock> MY_FLUID_BLOCK =
    BLOCKS.register("my_fluid",
        () -> new LiquidBlock(MY_FLUID_SOURCE.get(),
            Block.Properties.of(Material.WATER)
                .doesNotBlockMovement()
                .hardnessAndResistance(100.0f)
                .noDrops()
        )
    );
```

### 6. 注册桶物品

```java
public static final RegistryObject<Item> MY_BUCKET =
    ITEMS.register("my_fluid_bucket",
        () -> new BucketItem(MY_FLUID_SOURCE.get(),
            new Item.Properties()
                .maxStackSize(1)
                .group(ItemGroup.TAB_MISC)
        )
    );
```

## 常见错误

- ❌ 只注册 `Fluid` 而不注册 `FluidType` → 流体无法加载
- ❌ `FluidType` 在 `ForgeRegistries.FLUIDS` 中注册 → 必须在 `ForgeRegistries.FLUID_TYPES` 中注册
- ❌ `BucketItem` 引用了未注册的 `Fluid` → 桶无法装填
- ❌ `LiquidBlock` 使用 `Material.WATER` 但未设置 `noDrops()` → 挖掘时掉落水桶物品
- ❌ 密度/黏度设为 0 → 流体行为异常

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | FluidType 用专用注册表键，Fluid/Block/Item 用标准注册表 |
| `mc-datagen` | 流体可生成方块状态 JSON 和语言文件 |
| `mc-block` | 流体方块本质是 LiquidBlock，与普通方块注册相同 |
