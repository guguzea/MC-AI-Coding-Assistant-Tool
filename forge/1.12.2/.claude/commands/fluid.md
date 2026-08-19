---
name: mc-fluid
description: Minecraft Forge 流体开发。创建流体 Fluid、FluidRegistry、桶物品。触发词：Fluid、FluidRegistry、FluidStack、BucketHandler
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 流体开发（Forge 1.12.2）

## Decision: 创建流体类型

```
IF 只需要静态流体（不流动）
  → Fluid + FluidRegistry

IF 需要流动、填装、无限水源
  → FluidRegistry.registerFluid() + BucketHandler
```

## 完整示例：自定义流体

### 1. 注册流体

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModFluids {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Fluid> event) {
        event.getRegistry().register(
            new Fluid("my_fluid", new ResourceLocation(MOD_ID, "blocks/my_fluid"),
                                         new ResourceLocation(MOD_ID, "blocks/my_fluid_flowing"))
                .setRegistryName(MOD_ID, "my_fluid")
        );
    }
}
```

### 2. 流体方块

```java
public class MyFluidBlock extends BlockFluidClassic {
    public MyFluidBlock(Fluid fluid) {
        super(fluid, Material.WATER);
        setHardness(100.0F);
    }
}
```

### 3. 桶物品

```java
public class MyBucket extends ItemBucket {
    public MyBucket(Block containedBlock) {
        super(containedBlock);
        setMaxStackSize(1);
        setContainerItem(Items.BUCKET);
        setRegistryName(MOD_ID, "my_fluid_bucket");
    }
}
```

## 常见错误

- ❌ 只注册 Fluid 而不创建方块 → 流体无法放置
- ❌ 忘记 BucketHandler 注册 → 桶无法装填

## 参考资料

- 详细示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | Fluid 通过 RegistryEvent 注册 |
| `mc-block` | 流体方块本质是 BlockFluidClassic |
