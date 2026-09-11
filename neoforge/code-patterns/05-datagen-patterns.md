# DataGen 快速参考（NeoForge 1.20.4）

## 常用 Provider 速查

| 数据 | Provider |
|------|----------|
| 方块状态变体 | `BlockStateProvider` |
| 物品模型（继承方块） | `ItemModelProvider`（子类，withExistingParent） |
| 物品模型（独立） | `ItemModelProvider`（子类，`getBuilder(name)` + `mcLoc` / `modLoc`；⚠️ 旧文本这里的 `basicFlat` / `basicCubeAll` 是 Fabric 侧 helper，本档 1.20.4 语料 0 命中） |
| 方块模型 / 方块物品模型 | `BlockStateProvider` 内部暴露 `models()` 与 `itemModels()`（语料 resources_client_models_datagen 原文） |
| 配方（有序） | `ShapedRecipeBuilder` |
| 配方（无序） | `ShapelessRecipeBuilder` |
| 配方（熔炉） | `SimpleCookingRecipeBuilder.smelting()` 在 `RecipeProvider.buildRecipes()` 中 |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider` |
| 战利品表 | `LootTableProvider` |

## 快速模板

```java
// NeoForge 1.20.4 —— 形状取自本仓语料原文：
//   data/neoforge_1.20.4/neoforge-docs/1.20.4/processed/datagen_tags.md:9-27（四参 + output -> new …）
//   同目录 datagen_recipes.md:19（MyRecipeProvider::new ⇒ 该构造只吃 PackOutput）
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();

        // addProvider 的第二参是「拿 PackOutput 的工厂」，不是先取好 output 再传实例
        generator.addProvider(event.includeServer(), output -> new ModBlockTagsProvider(
            output,
            event.getLookupProvider(),
            MOD_ID,
            event.getExistingFileHelper()));
        // ⚠️ 旧文本写成 new ModBlockTagsProvider(output, event.getLookupProvider())：少 MOD_ID 与 ExistingFileHelper
        generator.addProvider(event.includeServer(), output -> new ModRecipeProvider(output));
        generator.addProvider(event.includeServer(), output -> new ModLootTableProvider(output));
        // TODO(未核实)：ItemTagsProvider 的确切入参语料未给出（只给了对照表「Item | ItemTagsProvider」）。
        //   旧文本的 (output, lookup, lookup) 三参、同一个 lookup 传两遍的写法没有任何出处，已删除；
        //   要写物品标签，先让用户自备 NeoForge jar 跑 ingest_loader_api，再 query_loader_api
        //   net.neoforged.neoforge.common.data.ItemTagsProvider 逐签名核实。
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
