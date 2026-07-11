---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、FluidBlock、桶物品。触发词：Fluid、FluidBlock、FluidStack、BucketItem
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 流体开发（Forge 1.15.2）

## Decision: 创建流体类型

```
IF 只需要静态流体（不流动）
  → Fluid + FluidBlock 即可

IF 需要流动、填装、无限水源
  → Fluid + FluidBlock + BucketItem
```

## 完整示例：自定义流体

### 1. 注册 Fluid

```java
public static final RegistryObject<Fluid> MY_FLUID =
    FLUIDS.register("my_fluid",
        () -> new FluidFlowing("my_fluid", FluidAttributes.Builder.builder(
                new ResourceLocation("block/water_still"),
                new ResourceLocation("block/water_flow"))
            .density(1000)
            .viscosity(1000)
        )
    );

// 在 mod 构造函数中
FLUIDS.register(modEventBus);
```

### 2. 注册流体方块

```java
public static final RegistryObject<FluidBlock> MY_FLUID_BLOCK =
    BLOCKS.register("my_fluid",
        () -> new FluidBlock(() -> ModFluids.MY_FLUID.get(), Block.Properties.create(Material.WATER)
            .doesNotBlockMovement()
            .hardnessAndResistance(100.0f)
            .noDrops()
        )
    );
```

### 3. 注册桶物品

```java
public static final RegistryObject<Item> MY_BUCKET =
    ITEMS.register("my_fluid_bucket",
        () -> new BucketItem(() -> ModFluids.MY_FLUID_SOURCE.get(),
            new Item.Properties()
                .maxStackSize(1)
                .group(CreativeModeTab.TAB_MISC)
        )
    );
```

## DeferredRegister 汇总

| 类型 | 注册表 | 备注 |
|------|--------|------|
| `Fluid` | `ForgeRegistries.FLUIDS` | 用 `new FluidFlowing` |
| `Block` | `ForgeRegistries.BLOCKS` | 用 `FluidBlock` |

## 常见错误

- ❌ `FluidBlock` 使用 `Material.WATER` 但未设置 `noDrops()` → 挖掘时掉落桶物品
- ❌ 在服务端初始化流体相关资源 → 纹理等客户端资源必须客户端加载

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Fluid/Block/Item 用标准注册表 |
| `mc-datagen` | 流体可生成方块状态 JSON |
