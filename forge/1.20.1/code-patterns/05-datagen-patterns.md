# DataGen 快速参考（Forge 1.20.1）

## 常用 Provider 速查

| 数据 | Provider |
|------|----------|
| 方块状态变体 | `BlockStateProvider` |
| 物品模型（继承方块） | `ItemModelProvider`（子类，withExistingParent） |
| 物品模型（独立） | `ItemModelProvider`（子类，basicFlat/basicCubeAll） |
| 配方（有序） | `ShapedRecipeBuilder` |
| 配方（无序） | `ShapelessRecipeBuilder` |
| 配方（熔炉） | `SimpleCookingRecipeBuilder.smelting()` 在 `RecipeProvider.buildRecipes()` 中 |
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

        if (event.includeServer()) {
            generator.addProvider(true, new ModBlockTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModItemTagsProvider(output,
                event.getLookupProvider(), event.getLookupProvider()));
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output));
        }
    }
}
```

## 配方速写

```java
// 有序配方
ShapedRecipeBuilder.shaped(RecipeCategory.BUILDING_BLOCKS, Blocks.COBBLESTONE, 1)
    .pattern("###")
    .pattern("#X#")
    .pattern("###")
    .define('#', Items.DIAMOND)
    .define('X', Blocks.DIRT)
    .unlockedBy("has_diamond", has(Items.DIAMOND))
    .save(consumer);

// 无序配方
ShapelessRecipeBuilder.shapeless(RecipeCategory.MISC, Items.DIAMOND, 9)
    .requires(Blocks.DIRT)
    .unlockedBy("has_dirt", has(Blocks.DIRT))
    .save(consumer);

// 熔炉配方
SimpleCookingRecipeBuilder.smelting(
        Ingredient.of(Items.DIRT),
        RecipeCategory.MISC,
        Items.DIAMOND, 0.1f, 200)
    .unlockedBy("has_dirt", has(Items.DIRT))
    .save(consumer);
```
