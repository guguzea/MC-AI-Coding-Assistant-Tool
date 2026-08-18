# DataGen 快速参考（Forge 1.16.5）

```yaml
模式: 数据生成器
分类: datagen
```

## 常用 Provider 速查

| 数据 | Provider |
|------|----------|
| 方块状态变体 | `BlockStateProvider` |
| 物品模型 | `ItemModelProvider` |
| 配方（有序） | `ShapedRecipeBuilder` |
| 配方（无序） | `ShapelessRecipeBuilder` |
| 配方（熔炉） | `SimpleCookingRecipeBuilder.smelting`（在 `buildShapelessRecipes` 内） |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider` |
| 战利品表 | `LootTableProvider#getTables` |

## 快速模板

```java
// net.minecraftforge.fml.event.lifecycle.GatherDataEvent
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        ExistingFileHelper helper = event.getExistingFileHelper();

        if (event.includeServer()) {
            ModBlockTagsProvider blockTags = new ModBlockTagsProvider(generator, helper);
            generator.addProvider(blockTags);
            generator.addProvider(new ModItemTagsProvider(generator, blockTags, helper));
            generator.addProvider(new ModRecipeProvider(generator));
            generator.addProvider(new ModLootTableProvider(generator));
        }
        if (event.includeClient()) {
            generator.addProvider(new ModItemModelsProvider(generator, helper));
            generator.addProvider(new ModBlockStatesProvider(generator, helper));
            generator.addProvider(new ModLanguageProvider(generator, "en_us"));
        }
    }
}
```

## 配方速写

```java
// datagen/ModRecipes.java
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(DataGenerator generator) {
        super(generator);
    }

    @Override
    protected void buildShapelessRecipes(Consumer<FinishedRecipe> consumer) {
        ShapedRecipeBuilder.shaped(ModItems.MY_ITEM.get())
            .pattern(" X ")
            .pattern(" X ")
            .pattern(" Y ")
            .define('X', Items.DIAMOND)
            .define('Y', Items.STICK)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(consumer);

        ShapelessRecipeBuilder.shapeless(ModItems.OTHER_ITEM.get())
            .requires(Items.GOLD_INGOT, 3)
            .requires(Items.DIAMOND)
            .unlockedBy("has_gold", has(Items.GOLD_INGOT))
            .save(consumer);

        SimpleCookingRecipeBuilder.smelting(Ingredient.of(Items.COBBLESTONE), Items.STONE, 0.1f, 200)
            .unlockedBy("has_cobblestone", has(Items.COBBLESTONE))
            .save(consumer);
    }
}
```


