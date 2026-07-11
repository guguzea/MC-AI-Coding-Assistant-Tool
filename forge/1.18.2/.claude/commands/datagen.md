# 数据生成器（Forge 1.18.2）

## 入口类

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        if (event.includeServer()) {
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output));
        }
    }
}
```

## pack_format 注意

1.18.2 的 pack_format = **8**。

## 常见错误

- ❌ 手动编辑 `src/generated/resources/`
- ❌ 标签 Provider 依赖顺序错误

## 参考资料

参见 `07-datagen.mdc`
