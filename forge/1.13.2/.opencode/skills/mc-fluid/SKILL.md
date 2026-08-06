---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、FlowingFluid、BucketItem。触发词：Fluid、FlowingFluid、BucketItem、桶、bucket、流体
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 流体开发（Forge 1.13.2）

## Decision: 创建流体类型

```
IF 只需要静态流体（不流动）
  → Fluid

IF 需要流动、填装、无限水源
  → Fluid + FlowingFluid + BucketItem
```

## 完整示例：自定义流体

### 1. 注册 Fluid

```java
public static final Fluid MY_FLUID = new Fluid("my_fluid",
    new ResourceLocation(MOD_ID, "blocks/my_fluid_still"),
    new ResourceLocation(MOD_ID, "blocks/my_fluid_flowing")
);

public static final Fluid FLOWING_MY_FLUID = new Fluid("my_fluid_flowing",
    new ResourceLocation(MOD_ID, "blocks/my_fluid_flowing"),
    new ResourceLocation(MOD_ID, "blocks/my_fluid_still")
);
```

### 2. 注册 BucketItem

```java
public static final Item MY_BUCKET = new BucketItem(MY_FLUID,
    new Item.Properties()
        .maxStackSize(1)
        .containerItem(Items.BUCKET)
);

@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(MY_BUCKET.setRegistryName(
        new ResourceLocation(MOD_ID, "my_bucket")
    ));
}
```

## 常见错误

- ❌ `Fluid` 需要设置正确的状态纹理
- ❌ `BucketItem` 需要设置 `containerItem`
- ❌ 流体方块需要特殊处理

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Fluid 和 BucketItem 需要注册 |
| `mc-block` | 流体方块使用 LiquidBlock |
