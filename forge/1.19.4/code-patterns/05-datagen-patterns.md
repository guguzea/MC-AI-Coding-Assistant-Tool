# DataGen 快速参考（Forge 1.19.4）

```yaml
模式: 数据生成器
分类: datagen
```

> **1.19.4 关键差异**（相对 1.18.2 档）：
> Provider 构造参数从 `DataGenerator` 改为 **`PackOutput`**；标签/进度类还要
> `CompletableFuture<HolderLookup.Provider>`；`addProvider` 变为 **`addProvider(boolean, provider)`**；
> 覆写方法从 `buildCraftingRecipes` 改为 **`buildRecipes`**，配方构建器带上 **`RecipeCategory`**；
> `LootTableProvider` 改为向构造器传 `List<LootTableProvider.SubProviderEntry>`（1.18.2 档的 `getTables` 形在 1.19.4 索引中查不到）。

## 常用 Provider 速查

| 数据 | Provider（1.19.4） |
|------|--------------------|
| 方块状态变体 | `net.minecraftforge.client.model.generators.BlockStateProvider`（实现 `registerStatesAndModels`） |
| 物品模型 | `net.minecraftforge.client.model.generators.ItemModelProvider` |
| 语言文件 | `net.minecraftforge.common.data.LanguageProvider`（实现 `addTranslations`） |
| 配方（有序） | `ShapedRecipeBuilder.shaped(RecipeCategory, ItemLike[, count])` |
| 配方（无序） | `ShapelessRecipeBuilder.shapeless(RecipeCategory, ItemLike[, count])` |
| 配方（熔炉/烟熏/营火） | `SimpleCookingRecipeBuilder.smelting()/smoking()/campfireCooking()`，在 `RecipeProvider#buildRecipes()` 内 |
| 方块标签 | `BlockTagsProvider`（实现 `addTags(HolderLookup.Provider)`） |
| 物品标签 | `ItemTagsProvider`（可取 `contentsGetter()`；1.19.4 primer 记载 `TagsProvider` 新增 `TagLookup` 传递） |
| 战利品表 | `LootTableProvider(PackOutput, Set, List<LootTableProvider.SubProviderEntry>)` |
| 进度 | `AdvancementProvider(PackOutput, CompletableFuture, List)` |

> `DataGenerator` / `GatherDataEvent` / 模型与语言 Provider 都是 **Forge 侧类**：
> `query_api --class=DataGenerator --version=1.19.4` 只返回 `run()`，
> `addProvider` / `getPackOutput` / `getExistingFileHelper` 的出处是官方文档页 `1.19.4/datagen`（`get_forge_doc_full --id=1.19.4/datagen --version=1.19.4`）。

## 快速模板

```java
// datagen/ModDataGenerators.java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();
        CompletableFuture<HolderLookup.Provider> lookup = event.getLookupProvider();

        if (event.includeServer()) {
            ModBlockTagsProvider blockTags = new ModBlockTagsProvider(output, lookup);
            generator.addProvider(true, blockTags);
            generator.addProvider(true, new ModItemTagsProvider(output, lookup, blockTags.contentsGetter()));
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output,
                Collections.emptySet(),
                List.of(new LootTableProvider.SubProviderEntry(
                    ModBlockLootSubProvider::new,
                    LootContextParamSets.BLOCK))));
        }
        if (event.includeClient()) {
            generator.addProvider(true, new ModItemModelsProvider(output, event.getExistingFileHelper()));
            generator.addProvider(true, new ModBlockStatesProvider(output, event.getExistingFileHelper()));
        }
    }
}
```

> 出处：`../.cursor/rules/07-datagen.mdc:34-58`。`ExistingFileHelper` 仍从
> `GatherDataEvent#getExistingFileHelper` 取得（官方文档页 `1.19.4/datagen`）。

## 配方速写

```java
// datagen/ModRecipes.java
public class ModRecipes extends RecipeProvider {
    public ModRecipes(PackOutput output) {
        super(output);
    }

    // 1.18.2 是 buildCraftingRecipes(Consumer)；1.19.4 索引与官方文档均为 buildRecipes(Consumer)
    @Override
    protected void buildRecipes(Consumer<FinishedRecipe> consumer) {
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, ModItems.MY_ITEM.get(), 1)
            .pattern(" X ")
            .pattern(" X ")
            .pattern(" Y ")
            .define('X', Items.DIAMOND)
            .define('Y', Items.STICK)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(consumer);

        ShapelessRecipeBuilder.shapeless(RecipeCategory.MISC, ModItems.OTHER_ITEM.get(), 1)
            .requires(Items.GOLD_INGOT, 3)
            .requires(Items.DIAMOND)
            .unlockedBy("has_gold", has(Items.GOLD_INGOT))
            .save(consumer);

        // 1.19.4 索引形：smelting(Ingredient, RecipeCategory, ItemLike, float xp, int time)
        SimpleCookingRecipeBuilder.smelting(
                Ingredient.of(Items.DIRT),
                RecipeCategory.MISC,
                Items.DIAMOND, 0.1f, 200)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(consumer);
    }
}
```

> `has(...)` 是 `RecipeProvider` 的受保护辅助方法（本档规则 `07-datagen.mdc:209` 用例）；
> `Ingredient.of(...)` 为多重载，`get_method_params` 会因歧义返回 MISS，用例出处同 `03-item.mdc:178`。

## 战利品表

```java
// datagen/ModBlockLootSubProvider.java
public class ModBlockLootSubProvider extends BlockLootSubProvider {
    protected ModBlockLootSubProvider() {
        super(Collections.emptySet(), FeatureFlags.REGISTRY.allFlags());
    }

    @Override
    protected void generate() {
        dropSelf(ModBlocks.MY_BLOCK.get());

        this.add(ModBlocks.SPECIAL_BLOCK.get(),
            LootTable.lootTable()
                .withPool(LootPool.lootPool()
                    .add(LootItem.lootTableItem(ModItems.SPECIAL_DROP.get())
                        .apply(SetItemCountFunction.setCount(
                            UniformGenerator.between(1, 3)))
                        .apply(ApplyExplosionDecay.explosionDecay())
                    )
                )
        );

        this.add(ModBlocks.AIR_BLOCK.get(), noDrop());
    }
}
```

> 出处：`../.cursor/rules/07-datagen.mdc:234-259`。

## 方块与物品标签

```java
public class ModBlockTagsProvider extends BlockTagsProvider {
    public ModBlockTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookup) {
        super(output, lookup, MOD_ID, null);
    }

    @Override
    protected void addTags(HolderLookup.Provider lookup) {
        tag(BlockTags.MINEABLE_WITH_PICKAXE)
            .add(ModBlocks.MY_BLOCK.get())
            .addOptionalTag(Tags.Blocks.ORES);
    }
}

public class ModItemTagsProvider extends ItemTagsProvider {
    public ModItemTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookup,
            CompletableFuture<TagLookup<Block>> blockTags) {
        super(output, lookup, blockTags, MOD_ID, null);
    }

    @Override
    protected void addTags(HolderLookup.Provider lookup) {
        tag(ItemTags.LOGS)
            .add(ModItems.MY_ITEM.get());
    }
}
```

> 出处：`../.cursor/rules/07-datagen.mdc:266-290`；`ItemTagsProvider` 的 3/4 参构造已在
> `query_api --class=ItemTagsProvider --version=1.19.4` 核实（`PackOutput` + `CompletableFuture`）。
> 命名空间：`#minecraft:xxx` 原版、`#forge:xxx` Forge 通用、`#{modid}:xxx` mod 专属（`07-datagen.mdc:293`）。

## pack_format

1.19.4 的 **数据包 `pack_format = 12`**，**资源包 `pack_format = 13`**。

> 出处：`../.cursor/rules/00-project-setup.mdc:78`、`07-datagen.mdc:14`、
> `knowledge/version-changes/1.20.x.md:13`（对照：1.18.2 为 8，1.20.1 为 15）。
