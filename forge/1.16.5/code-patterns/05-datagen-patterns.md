# DataGen 快速参考（Forge 1.16.5）

## 常用 Provider 速查

| 数据 | Provider |
|------|----------|
| 方块状态变体 | `BlockStateProvider` |
| 物品模型（继承方块） | `ItemModelProvider`（子类，`withExistingParent`） |
| 物品模型（独立） | `ItemModelProvider`（子类，`basicFlat`/`basicCubeAll`） |
| 配方（有序） | `ShapedRecipeBuilder.shaped()` |
| 配方（无序） | `ShapelessRecipeBuilder.shapeless()` |
| 配方（熔炉） | `SimpleCookingRecipeBuilder.smelting()` 在 `registerRecipes()` 中 |
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

        if (event.includeServer()) {
            generator.addProvider(true, new ModBlockTagsProvider(generator));
            generator.addProvider(true, new ModItemTagsProvider(generator));
            generator.addProvider(true, new ModRecipeProvider(generator));
            generator.addProvider(true, new ModLootTableProvider(generator));
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
    .addCriterion("has_diamond", hasItem(Items.DIAMOND))
    .build(consumer);

// 无序配方
ShapelessRecipeBuilder.shapelessRecipe(Items.DIAMOND, 9)
    .addIngredient(Blocks.DIRT)
    .addCriterion("has_dirt", hasItem(Blocks.DIRT))
    .build(consumer);

// 熔炉配方
CookingRecipeBuilder.smeltingRecipe(Ingredient.from(Items.DIRT),
        Items.DIAMOND, 0.1f, 200)
    .addCriterion("has_dirt", hasItem(Items.DIRT))
    .build(consumer);
```

## 战利品表

```java
@Override
protected void addTables() {
    this.registerLootTable(Blocks.DIRT, LootTable.builder()
        .addLootPool(LootPool.builder()
            .rolls(ConstantRange.of(1))
            .addEntry(ItemLootEntry.builder(Blocks.DIRT))
            .acceptCondition(SurvivesExplosion.builder())
        )
    );
}
```
