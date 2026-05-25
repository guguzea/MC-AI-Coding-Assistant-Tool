---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、FluidType、FlowingFluid、桶物品。触发词：Fluid、FluidType、FlowingFluid、BucketItem、桶、bucket、流体
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 流体开发（Forge 1.20.1）

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
        MY_FLUID_SOURCE    // source fluid
    )
        .bucket(() -> MY_BUCKET.get())
        .block(() -> MY_FLUID_BLOCK.get());
```

### 2. 注册 FluidType（必需，独立注册表）

```java
public static final DeferredRegister<FluidType> FLUID_TYPES =
    DeferredRegister.create(ForgeRegistries.Keys.FLUID_TYPES, MOD_ID);

public static final RegistryObject<FluidType> MY_FLUID_TYPE =
    FLUID_TYPES.register("my_fluid_type",
        () -> new FluidType(FluidType.Properties.create()
            .density(1000)        // 密度（水的密度 = 1000）
            .viscosity(1000)      // 黏度（水的黏度 = 1000）
            .temperature(300)     // 温度（开尔文）
            .lightLevel(0)        // 发光等级 0-15
            .sound(SoundActions.BUCKET_FILL, SoundEvents.BUCKET_FILL)
            .sound(SoundActions.BUCKET_EMPTY, SoundEvents.BUCKET_EMPTY)
        )
    );
```

### 3. 注册 Source Fluid（静止来源）

```java
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
            BlockBehaviour.Properties.of(Material.WATER)
                .noCollision()
                .strength(100.0f)
                .noDrops()
        )
    );
```

### 6. 注册桶物品

```java
public static final RegistryObject<BUCKET_ITEM> MY_BUCKET =
    ITEMS.register("my_fluid_bucket",
        () -> new BucketItem(MY_FLUID_SOURCE.get(),
            new Item.Properties()
                .stacksTo(1)
                .tab(CreativeModeTab.TAB_MISC)
        )
    );
```

## DeferredRegister 汇总

| 类型 | 注册表 | 备注 |
|------|--------|------|
| `FluidType` | `ForgeRegistries.Keys.FLUID_TYPES` | 必须先注册 |
| `Fluid`（Source） | `ForgeRegistries.FLUIDS` | Source 用 `new ForgeFlowingFluid.Source()` |
| `Fluid`（Flowing） | `ForgeRegistries.FLUIDS` | Flowing 用 `new ForgeFlowingFluid.Flowing()` |
| `Block` | `ForgeRegistries.BLOCKS` | 用 `LiquidBlock` |
| `Item` | `ForgeRegistries.ITEMS` | 用 `BucketItem` |

## FluidType 核心属性

```java
new FluidType(Properties.create()
    .density(1000)              // > 0 下沉，< 0 上浮（岩浆密度 3000，虚空空气 0）
    .viscosity(1000)           // 影响流动速度和下落速度
    .temperature(300)          // 300K = ~27°C，岩浆约 1300K
    .lightLevel(0)             // 0-15，影响水下光照
    .sound(SoundActions.BUCKET_FILL, SoundEvents.BUCKET_FILL)
    .sound(SoundActions.BUCKET_EMPTY, SoundEvents.BUCKET_EMPTY)
    .sound(SoundActions.STEP, SoundEvents.WATER_STEP)        // 可选
    .descriptionId("fluid." + MOD_ID + ".my_fluid")           // 可选
)
```

## 资源文件

### 流体 JSON（可选，用于高级渲染）

文件：`assets/{modid}/textures/fluid/my_fluid.png`（至少需要纹理）

### 语言文件

```json
{
  "fluid." + MOD_ID + ".my_fluid": "My Fluid",
  "item." + MOD_ID + ".my_fluid_bucket": "My Fluid Bucket"
}
```

## 常见错误

- ❌ 只注册 `Fluid` 而不注册 `FluidType` → 流体无法加载
- ❌ `FluidType` 在 `ForgeRegistries.FLUIDS` 中注册 → 必须在 `ForgeRegistries.Keys.FLUID_TYPES` 中注册
- ❌ `BucketItem` 引用了未注册的 `Fluid` → 桶无法装填
- ❌ `LiquidBlock` 使用 `Material.WATER` 但未设置 `noDrops()` → 挖掘时掉落水桶物品
- ❌ 密度/黏度设为 0 → 流体行为异常
- ❌ 在服务端初始化流体相关资源 → 纹理等客户端资源必须客户端加载

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | FluidType 用专用注册表键，Fluid/Block/Item 用标准注册表 |
| `mc-datagen` | 流体可生成方块状态 JSON 和语言文件 |
| `mc-block` | 流体方块本质是 LiquidBlock，与普通方块注册相同 |