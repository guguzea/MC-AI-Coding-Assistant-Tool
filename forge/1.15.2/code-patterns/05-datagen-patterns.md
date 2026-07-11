# DataGen 快速参考（Forge 1.15.2）

## 常用 Provider 速查

| 数据 | Provider |
|------|----------|
| 方块状态变体 | `BlockStateProvider` |
| 物品模型（继承方块） | `ItemModelProvider`（子类，withExistingParent） |
| 物品模型（独立） | `ItemModelProvider`（子类，basicFlat/basicCubeAll） |
| 配方（有序） | `ShapedRecipeBuilder` |
| 配方（无序） | `ShapelessRecipeBuilder` |
| 配方（熔炉） | `FurnaceRecipeProvider` |
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
        IFinishedGenericWorker output = event.getGenerator();

        if (event.includeServer()) {
            generator.addProvider(true, new ModBlockTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModItemTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output, event.getLookupProvider()));
        }
    }
}
```

## 配方速写

```java
// 有序配方
ShapedRecipeBuilder.shaped(RecipeCategory.BUILDING_BLOCKS, Blocks.COBBLESTONE, 1)
    .patternLine("###")
    .patternLine("#X#")
    .patternLine("###")
    .key('#', Items.DIAMOND)
    .key('X', Blocks.DIRT)
    .addCriterion("has_diamond", hasItem(Items.DIAMOND))
    .build(consumer);

// 无序配方
ShapelessRecipeBuilder.shapeless(RecipeCategory.MISC, Items.DIAMOND, 9)
    .addIngredient(Blocks.DIRT)
    .addCriterion("has_dirt", hasItem(Blocks.DIRT))
    .build(consumer);

// 熔炉配方（在 RecipeProvider 中）
FurnaceRecipeProvider.addSmelting(Ingredient.fromItems(Items.DIRT),
    Items.DIAMOND, 0.1f, 200, consumer);
```
