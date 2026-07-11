---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成配方、战利品表、标签。触发词：DataGen、DataGenerator、LootTables、Recipes、TagProvider
platform: forge
version: "1.18.2"
---

# 数据生成器（Forge 1.18.2）

## pack_format

1.18.2 的 pack_format = **8**。

## 入口类

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        if (event.includeServer()) {
            generator.addProvider(true, new ModRecipeProvider(output));
        }
    }
}
```

## 参考资料

参见 `07-datagen.mdc`
