---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、BucketItem。触发词：Fluid、Fluid、FlowingFluid、BucketItem、桶、bucket、流体
platform: forge
version: "1.14.4"
---

# 流体开发（Forge 1.14.4）

## 重要提示

> **Forge 1.14.4 没有 FluidType**。流体注册方式与 1.20.1+ 有很大不同。

## Decision: 创建流体类型

```
IF 需要流动、填装、无限水源
  → Fluid + FlowingFluid + BucketItem

IF 只需要静态流体（不流动）
  → Fluid + BucketItem
```

## 完整示例：自定义流体

### 1. 注册 Source Fluid（静止来源）

```java
public static final FlowingFluid MY_FLUID = new FlowingFluid.Properties(
    MY_FLUID,          // source
    MY_FLUID_FLOWING,   // flowing
    FluidAttributes.builder(...)
)
)
    .block(MyFluidBlock::new)
    .bucket(MyFluidBucket::new)
    .build();
```

### 2. 注册 Flowing Fluid（流动变体）

```java
public static final FlowingFluid MY_FLUID_FLOWING = new FlowingFluid.Flowing();
```

### 3. 注册流体方块

```java
public static final Block MY_FLUID_BLOCK = new FlowingFluidBlock(
    () -> MY_FLUID,
    Block.Properties.create(Material.WATER)
        .doesNotBlockMovement()
        .hardnessAndResistance(100.0F)
        .noDrops()
);
```

### 4. 注册桶物品

```java
public static final Item MY_FLUID_BUCKET = new BucketItem(
    () -> MY_FLUID,
    new Item.Properties().maxStackSize(1).group(ItemGroup.MISC)
);
```

## 注册（RegistryEvent）

```java
@SubscribeEvent
public static void onFluidRegistry(final RegistryEvent.Register<Fluid> event) {
    event.getRegistry().registerAll(
        MY_FLUID.setRegistryName(new ResourceLocation(MOD_ID, "my_fluid")),
        MY_FLUID_FLOWING.setRegistryName(new ResourceLocation(MOD_ID, "my_fluid_flowing"))
    );
}

@SubscribeEvent
public static void onBlockRegistry(final RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_FLUID_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_fluid"))
    );
}

@SubscribeEvent
public static void onItemRegistry(final RegistryEvent.Register<Item> event) {
    event.getRegistry().register(
        MY_FLUID_BUCKET.setRegistryName(new ResourceLocation(MOD_ID, "my_fluid_bucket"))
    );
}
```

## 资源文件

### 流体纹理

需要两个纹理文件：
- `assets/{modid}/textures/fluid/my_fluid_still.png`（静止状态）
- `assets/{modid}/textures/fluid/my_fluid_flow.png`（流动状态）

### 语言文件

```json
{
  "block.mymod.my_fluid": "My Fluid",
  "item.mymod.my_fluid_bucket": "My Fluid Bucket"
}
```

## 常见错误

- ❌ 使用 `FluidType`（1.14.4 没有 FluidType）
- ❌ `FluidAttributes.builder()` 参数错误
- ❌ 忘记注册桶物品 → 桶无法装填
- ❌ `LiquidBlock` vs `FlowingFluidBlock`：1.14.4 使用 `FlowingFluidBlock`
- ❌ 流体方块没有 `noDrops()` → 挖掘时掉落流体物品

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Fluid/Block/Item 用标准 RegistryEvent 注册 |
| `mc-datagen` | 手动编写流体方块状态 JSON 和语言文件 |
