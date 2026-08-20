---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、ForgeFlowingFluid、FluidAttributes、桶物品。触发词：Fluid、FluidAttributes、FlowingFluid、BucketItem、桶、bucket、流体
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 流体开发（Forge 1.14.4）

## Decision: 创建流体

```
IF 只需要静态流体（不流动）
  → 仍建议同时注册 Source + Flowing（多数模组这么做）

IF 需要流动、填装、无限水源
  → ForgeFlowingFluid.Source + ForgeFlowingFluid.Flowing + FlowingFluidBlock + BucketItem
```

**本档没有 `FluidType`。** 那是 Forge **1.19+** 的独立注册表。1.13–1.18 用 `FluidAttributes.builder` 描述密度、黏度、贴图和颜色。

## 完整示例：自定义流体

### 1. 定义流体属性（FluidAttributes + Properties）

`ForgeFlowingFluid.Properties` 的三个参数是：**Source 供应器、Flowing 供应器、`FluidAttributes.Builder`**。`RegistryObject` 本身就是 `Supplier`，静态初始化时不要调用 `.get()`。

```java
public static final ResourceLocation STILL_RL = new ResourceLocation(MOD_ID, "block/my_fluid_still");
public static final ResourceLocation FLOW_RL = new ResourceLocation(MOD_ID, "block/my_fluid_flow");

public static final ForgeFlowingFluid.Properties FLUID_PROPERTIES =
    new ForgeFlowingFluid.Properties(
        MY_FLUID_SOURCE,
        MY_FLUID_FLOWING,
        FluidAttributes.builder(STILL_RL, FLOW_RL)
            .density(1000)       // 水 = 1000；岩浆约 3000
            .viscosity(1000)     // 水 = 1000
            .temperature(300)    // 开尔文
            .luminosity(0)       // 0-15
            .color(0xFF3F76E4)
    )
        .bucket(() -> MY_BUCKET.get())
        .block(() -> MY_FLUID_BLOCK.get());
```

### 2. 注册 Source Fluid（静止来源）

```java
public static final DeferredRegister<Fluid> FLUIDS =
    new DeferredRegister<>(ForgeRegistries.FLUIDS, MOD_ID);

public static final RegistryObject<FlowingFluid> MY_FLUID_SOURCE =
    FLUIDS.register("my_fluid",
        () -> new ForgeFlowingFluid.Source(FLUID_PROPERTIES)
    );
```

### 3. 注册 Flowing Fluid（流动变体）

```java
public static final RegistryObject<FlowingFluid> MY_FLUID_FLOWING =
    FLUIDS.register("my_fluid_flowing",
        () -> new ForgeFlowingFluid.Flowing(FLUID_PROPERTIES)
    );
```

### 4. 注册流体方块

```java
public static final RegistryObject<FlowingFluidBlock> MY_FLUID_BLOCK =
    BLOCKS.register("my_fluid",
        () -> new FlowingFluidBlock(MY_FLUID_SOURCE,
            Block.Properties.create(Material.WATER)
                .doesNotBlockMovement()
                .hardnessAndResistance(100.0f)
                .noDrops()
        )
    );
```

### 5. 注册桶物品

```java
public static final RegistryObject<Item> MY_BUCKET =
    ITEMS.register("my_fluid_bucket",
        () -> new BucketItem(MY_FLUID_SOURCE,
            new Item.Properties().maxStackSize(1)
        )
    );
```

## DeferredRegister 汇总

| 类型 | 注册表 | 备注 |
|------|--------|------|
| `Fluid`（Source） | `ForgeRegistries.FLUIDS` | `new ForgeFlowingFluid.Source(properties)` |
| `Fluid`（Flowing） | `ForgeRegistries.FLUIDS` | `new ForgeFlowingFluid.Flowing(properties)` |
| `Block` | `ForgeRegistries.BLOCKS` | 用 `FlowingFluidBlock` |
| `Item` | `ForgeRegistries.ITEMS` | 用 `BucketItem` |

不要再单独注册 `FluidType` / `ForgeRegistries.Keys.FLUID_TYPES`。

## FluidAttributes 核心属性

```java
FluidAttributes.builder(STILL_RL, FLOW_RL)
    .density(1000)           // > 0 下沉，岩浆约 3000
    .viscosity(1000)         // 影响流动速度
    .temperature(300)        // 300K ≈ 27°C，岩浆约 1300K
    .luminosity(0)           // 0-15
    .color(0xFF3F76E4)
```

## 资源文件

### 流体贴图

至少提供 still / flow 贴图，路径与 `ResourceLocation` 一致，例如：
`assets/{modid}/textures/block/my_fluid_still.png`

### 语言文件

```json
{
  "fluid.examplemod.my_fluid": "My Fluid",
  "item.examplemod.my_fluid_bucket": "My Fluid Bucket"
}
```

## 常见错误

- ❌ 使用 `FluidType` / `SoundActions`（1.19+ API）
- ❌ `Properties` 三个参数写成 FluidType + Fluid + Fluid（本档是 still、flowing、attributes）
- ❌ `BucketItem` 引用了未注册的 `Fluid`
- ❌ `FlowingFluidBlock` 用 `Material.WATER` 但未 `.noDrops()` → 挖掘可能掉水桶
- ❌ 密度/黏度设为 0 → 流体行为异常
- ❌ 在服务端初始化流体贴图等客户端资源

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | Fluid / Block / Item 都走 `DeferredRegister` |
| `mc-datagen` | 流体可生成方块状态 JSON 和语言文件 |
| `mc-block` | 流体方块是 `FlowingFluidBlock`，注册方式与普通方块相同 |
