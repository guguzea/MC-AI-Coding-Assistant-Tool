# 流体开发（Forge 1.12.2）

## 快速开始

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModFluids {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Fluid> event) {
        event.getRegistry().register(
            new Fluid("my_fluid",
                new ResourceLocation(MOD_ID, "blocks/my_fluid"),
                new ResourceLocation(MOD_ID, "blocks/my_fluid_flowing"))
                .setRegistryName(MOD_ID, "my_fluid")
        );
    }
}
```

## 流体方块

```java
public class MyFluidBlock extends BlockFluidClassic {
    public MyFluidBlock(Fluid fluid) {
        super(fluid, Block.Properties.create(Material.WATER)
            .hardnessAndResistance(1000f)
            .noDrops()
        );
    }
}
```

## 常见错误

- ❌ 只注册 Fluid 而不创建方块
- ❌ 忘记 BucketHandler 注册

## 参考资料

- 详细示例：参见 `02-block.mdc`
