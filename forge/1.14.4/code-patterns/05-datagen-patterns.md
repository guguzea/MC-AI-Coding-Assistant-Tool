# DataGen 快速参考（Forge 1.14.4）

## 常用 Provider 速查

| 数据 | Provider |
|------|----------|
| 方块状态变体 | `BlockStateProvider` |
| 物品模型 | `ItemModelProvider` |
| 配方（有序） | `ShapedRecipeBuilder` |
| 配方（无序） | `ShapelessRecipeBuilder` |
| 配方（熔炉） | `FurnaceRecipe` |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider` |
| 战利品表 | `LootTableProvider` |

## 快速模板

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();
        ExistingFileHelper existingFileHelper = event.getExistingFileHelper();

        if (event.includeServer()) {
            generator.addProvider(true, new ModBlockTagsProvider(output, existingFileHelper));
            generator.addProvider(true, new ModItemTagsProvider(output, existingFileHelper));
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output));
        }
    }
}
```

## 配方速写

```java
// 有序配方
ShapedRecipeBuilder.shapedRecipe(Blocks.COBBLESTONE, 1)
    .patternLine("###")
    .patternLine("#X#")
    .patternLine("###")
    .key('#', Items.DIAMOND)
    .key('X', Blocks.DIRT)
    .addCriterion("has_diamond", InventoryChangeTrigger.Instance.hasItems(Items.DIAMOND))
    .build(consumer, new ResourceLocation(MOD_ID, "cobblestone_to_diamond"));

// 无序配方
ShapelessRecipeBuilder.shapelessRecipe(Items.DIAMOND, 9)
    .addIngredient(Blocks.DIRT)
    .addCriterion("has_dirt", InventoryChangeTrigger.Instance.hasItems(Blocks.DIRT))
    .build(consumer, new ResourceLocation(MOD_ID, "dirt_to_diamond"));

// 熔炉配方
FurnaceRecipe.BUILDER
    .input(Items.DIRT)
    .output(Items.DIAMOND)
    .experience(0.1f)
    .build(consumer, new ResourceLocation(MOD_ID, "dirt_to_diamond_furnace"));
```
