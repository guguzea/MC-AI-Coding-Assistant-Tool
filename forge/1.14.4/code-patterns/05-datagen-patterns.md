# DataGen 快速参考（Forge 1.14.4）

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
| 配方（熔炉） | `CookingRecipeBuilder.smelting` |
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
    protected void registerRecipes(Consumer<IFinishedRecipe> consumer) {
        ShapedRecipeBuilder.shapedRecipe(ModItems.MY_ITEM.get())
            .patternLine(" X ")
            .patternLine(" X ")
            .patternLine(" Y ")
            .key('X', Items.DIAMOND)
            .key('Y', Items.STICK)
            .addCriterion("has_diamond", InventoryChangeTrigger.Instance.hasItems(Items.DIAMOND))
            .build(consumer);

        ShapelessRecipeBuilder.shapelessRecipe(ModItems.OTHER_ITEM.get())
            .addIngredient(Items.GOLD_INGOT, 3)
            .addIngredient(Items.DIAMOND)
            .addCriterion("has_gold", InventoryChangeTrigger.Instance.hasItems(Items.GOLD_INGOT))
            .build(consumer);

        CookingRecipeBuilder.smelting(Ingredient.fromItems(Items.COBBLESTONE), Items.STONE, 0.1f, 200)
            .addCriterion("has_cobblestone", InventoryChangeTrigger.Instance.hasItems(Items.COBBLESTONE))
            .build(consumer);
    }
}
```


