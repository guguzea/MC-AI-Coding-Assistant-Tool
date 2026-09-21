---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成方块状态、物品模型、配方、战利品表、标签、进度、语言文件。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、AdvancementProvider、LanguageProvider
mappings: parchment
---

# 数据生成器（Forge 1.19.4）

> **本件命名口径**：下文代码里的 `DataGenerators` / `gatherData` / `ModItems` / `ModBlocks` / `ModBlockTagsProvider` / `ModItemTagsProvider` / `ModRecipeProvider` / `ModLootTableProvider` / `ModBlockLootSubProvider` / `ModEntityLootSubProvider` / `ModBlockStatesProvider` / `ModItemModelProvider` / `ModItemModelsProvider` / `ModLanguageProvider`，注册常量 `MY_ITEM` / `MY_INGOT` / `MY_BLOCK` / `MY_BLOCK_ITEM`，以及构造参数名 `blockLookupProvider` / `lookupProvider` / `output`，都是**本 Skill 示例工程的自造名**（不是 Minecraft / Forge API，不需要语料出处）。
> 逐字命中本档语料的只有类名与覆盖方法名：`DataGenerator`、`GatherDataEvent#getExistingFileHelper`、`#includeClient` / `#includeServer`、`DataGenerator#addProvider`、`BlockStateProvider#registerStatesAndModels`、`ItemModelProvider` / `ModelProvider#registerModels`、`RecipeProvider#buildRecipes`、`loot.LootTableProvider` 与 `LootTableProvider$SubProviderEntry`、`tags.TagsProvider#addTags`、`LanguageProvider#addTranslations`（页面 `data/forge_1.19.4/forge-docs/1.19.4/processed/datagen.md:13,23,26,40,44,46,49,60,61,62`）、`TagsProvider.TagLookup`（`processed/primer_1_19_4.md:195`）、`FeatureFlags.DEFAULT_FLAGS`（`processed/gui_menus.md:20`）。
> **本档语料没有 datagen 的 models / recipes / loottables 子页面**：`getPackOutput` / `getLookupProvider` / `PackOutput` / `HolderLookup` / `RecipeCategory` / `Items.*` / `BlockTags.*` / `ItemTags.*` / `BlockLootSubProvider` / `simpleBlock` / `cubeAll` / `modLoc` / `withExistingParent` / `getKnownBlocks` 逐字 0 命中，下方按行标了 `未核实`，不要当已核实签名抄。

## 快速开始

运行 DataGen：
```bash
./gradlew runData
```

生成内容在 `src/generated/resources/` 目录，**不要手动编辑**。

## 主类注册

```java
// 在 mod 主类中注册 DataProvider
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators { // DataGenerators / gatherData = 示例工程自造名
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        // TODO(未核实：getPackOutput / getLookupProvider / PackOutput / HolderLookup 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)
        PackOutput output = generator.getPackOutput(); // 未核实: PackOutput / getPackOutput

        if (event.includeServer()) {
            ModBlockTagsProvider blockTags = new ModBlockTagsProvider(output, event.getLookupProvider()); // 未核实: getLookupProvider
            generator.addProvider(true, blockTags);
            generator.addProvider(true, new ModItemTagsProvider(output, event.getLookupProvider(), blockTags.contentsGetter())); // 未核实: getLookupProvider
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output,
                Collections.emptySet(),
                List.of(new LootTableProvider.SubProviderEntry(
                    ModBlockLootSubProvider::new, LootContextParamSets.BLOCK))));
        }

        if (event.includeClient()) {
            generator.addProvider(true, new ModBlockStatesProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(true, new ModItemModelProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(true, new ModLanguageProvider(output, "en_us"));
        }
    }
}
```

## Decision: 选择 Provider

| 数据类型 | Provider 类 |
|----------|------------|
| 方块状态变体 | `BlockStateProvider`（自定义子类） |
| 方块/物品模型 | `ItemModelProvider`（自定义子类） |
| 配方 | `RecipeProvider` |
| 战利品表 | `LootTableProvider` |
| 进度 | `AdvancementProvider`（自定义子类） |
| 语言 | `ModLanguageProvider`（自定义子类） |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider` |
| 实体类型标签 | `EntityTypeTagsProvider` |

## 配方生成

```java
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes(Consumer<FinishedRecipe> consumer) {
        // TODO(未核实：RecipeCategory.MISC 与 Items.DIAMOND / EMERALD / IRON_INGOT 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, ModItems.MY_ITEM.get(), 1) // 未核实: RecipeCategory.MISC（ModItems.MY_ITEM = 示例自造名）
            .pattern("ABA")
            .pattern("CDC")
            .pattern("ABA")
            .define('A', Items.DIAMOND) // 未核实: Items.DIAMOND
            .define('B', Items.EMERALD) // 未核实: Items.EMERALD
            .define('C', Items.IRON_INGOT) // 未核实: Items.IRON_INGOT
            .define('D', ModItems.MY_INGOT.get())
            .unlockedBy("has_item", has(ModItems.MY_INGOT.get()))
            .save(consumer);
    }
}
```

## 方块状态生成

`BlockStateProvider` 构造函数需要 3 个参数：`PackOutput`、`modId`、`ExistingFileHelper`。
本档语料只有 `datagen.md` 的 Provider 清单，**没有 models / blockstates 子页面**，下面三个成员名与该构造签名均无出处。

```java
public class ModBlockStatesProvider extends BlockStateProvider { // ModBlockStatesProvider = 示例工程自造名
    public ModBlockStatesProvider(PackOutput output, String modid, ExistingFileHelper efh) { // 未核实: PackOutput
        super(output, modid, efh);
    }

    @Override
    protected void registerStatesAndModels() {
        // 无变体方块
        // TODO(未核实：simpleBlock / models().cubeAll / modLoc 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)
        simpleBlock(ModBlocks.MY_BLOCK.get(), // 未核实: simpleBlock（ModBlocks.MY_BLOCK = 示例自造名）
            models().cubeAll(name(ModBlocks.MY_BLOCK.get()), modLoc("block/my_block")) // 未核实: cubeAll / modLoc
        );
    }

    private String name(ResourceLocation rl) {
        return rl.getPath();
    }
}
```

在 `GatherDataEvent` 中注册时传 3 个参数：
```java
generator.addProvider(true, new ModBlockStatesProvider(output, MOD_ID, event.getExistingFileHelper()));
```

## 物品模型（来自方块）

```java
// ItemModelProvider
public class ModItemModelsProvider extends ItemModelProvider { // 示例自造类名（主类注册处写作 ModItemModelProvider，同一个类，按你工程的名字统一）
    public ModItemModelsProvider(PackOutput output, String modid, ExistingFileHelper helper) { // 未核实: PackOutput
        super(output, modid, helper);
    }

    @Override
    public void registerModels() {
        // 使用已有的方块模型作为物品模型
        // TODO(未核实：withExistingParent / modLoc 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)
        withExistingParent(name(ModItems.MY_BLOCK_ITEM.get()), // 未核实: withExistingParent（ModItems.MY_BLOCK_ITEM = 示例自造名）
            modLoc("block/my_block")); // 未核实: modLoc
    }
}
```

## 战利品表

```java
// ModLootTableProvider
// 本档语料（datagen.md:60）只背书 LootTableProvider 与 LootTableProvider$SubProviderEntry；
// 未核实: BlockLootSubProvider / LootContextParamSets / FeatureFlags.REGISTRY.allFlags() / generate() / dropSelf 同样未在 forge 1.19.4 语料命中
//（FeatureFlags 本档只在 gui_menus.md:20 以 FeatureFlags.DEFAULT_FLAGS 命中）
public class ModLootTableProvider extends LootTableProvider { // Mod* 子类 = 示例工程自造名
    public ModLootTableProvider(PackOutput output) { // 未核实: PackOutput
        super(output, Collections.emptySet(), // 未核实: Collections.emptySet 属 JDK（java.util.Collections#emptySet），不在 MC 语料面
            List.of(
                new SubProviderEntry(ModBlockLootSubProvider::new, LootContextParamSets.BLOCK),
                new SubProviderEntry(ModEntityLootSubProvider::new, LootContextParamSets.EMPTY)
            )
        );
    }
}

// 方块战利品
public class ModBlockLootSubProvider extends BlockLootSubProvider { // Mod* 子类 = 示例工程自造名
    public ModBlockLootSubProvider() {
        super(Collections.emptySet(), FeatureFlags.REGISTRY.allFlags()); // 未核实: Collections.emptySet 属 JDK
    }

    @Override
    protected void generate() {
        this.dropSelf(ModBlocks.MY_BLOCK.get());
    }

    @Override
    protected Iterable<Block> getKnownBlocks() { // 未核实: getKnownBlocks（TODO(未核实：getKnownBlocks 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)）
        return ModBlocks.BLOCKS.getEntries().stream()
            .flatMap(r -> r.stream()) // 未核实: flatMap 属 JDK（java.util.stream.Stream#flatMap），不在 MC 语料面
            ::iterator;
    }
}
```

## 标签生成

```java
// BlockTagsProvider
// 未核实: BlockTags / ItemTags / HolderLookup / PackOutput / BlockTagsProvider / ItemTagsProvider 的类名与构造签名本档语料 0 命中
//（本档只背书 tags.TagsProvider#addTags（datagen.md:62）与 TagsProvider.TagLookup（primer_1_19_4.md:195））
// lookupProvider / blockLookupProvider / output / provider 都是本示例自取的参数名，不是 API 成员名
public class ModBlockTagsProvider extends BlockTagsProvider { // ModBlockTagsProvider = 示例工程自造名
    public ModBlockTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider) { // 未核实: PackOutput / HolderLookup
        super(output, MOD_ID, lookupProvider);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) { // 未核实: HolderLookup
        // TODO(未核实：BlockTags.NEEDS_DIAMOND_TOOL 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)
        tag(BlockTags.NEEDS_DIAMOND_TOOL) // 未核实: BlockTags.NEEDS_DIAMOND_TOOL
            .add(ModBlocks.MY_BLOCK.get());
    }
}

// ItemTagsProvider
public class ModItemTagsProvider extends ItemTagsProvider { // ModItemTagsProvider = 示例工程自造名
    public ModItemTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider,
            CompletableFuture<TagLookup<Block>> blockLookupProvider) { // 未核实: PackOutput / HolderLookup（TagLookup 有出处 primer_1_19_4.md:195）
        super(output, lookupProvider, blockLookupProvider, MOD_ID);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) { // 未核实: HolderLookup
        // TODO(未核实：ItemTags.PIGLIN_LOVED 未在 forge 1.19.4 语料命中，需 search_forge_docs 复核或反编译)
        tag(ItemTags.PIGLIN_LOVED) // 未核实: ItemTags.PIGLIN_LOVED
            .add(ModItems.MY_INGOT.get());
    }
}
```

## 语言生成（ModLanguageProvider）

```java
public class ModLanguageProvider extends LanguageProvider {
    public ModLanguageProvider(PackOutput output, String locale) {
        super(output, MOD_ID, locale);
    }

    @Override
    protected void addTranslations() {
        // 添加翻译键值对
        add("item." + MOD_ID + ".my_item", "My Item");
        add("block." + MOD_ID + ".my_block", "My Block");
        add("advancement." + MOD_ID + ".custom.root.title", "First Steps");
        add("advancement." + MOD_ID + ".custom.root.description", "Obtain your first item");
    }
}
```

在 `GatherDataEvent` 中注册：
```java
generator.addProvider(true, new ModLanguageProvider(output, "en_us"));
// 如需其他语言（如中文）：
generator.addProvider(true, new ModLanguageProvider(output, "zh_cn"));
```

## 常见错误

- ❌ 手动编辑 `src/generated/resources/`（DataGen 重新运行会覆盖）
- ❌ 标签 Provider 依赖顺序错误（标签必须在配方之前）
- ❌ `modLoc()` vs `mcLoc()`：mod 内容用 `modLoc`，Minecraft 内容用 `mcLoc`
- ❌ `ExistingFileHelper` 检查失败（文件不存在时不要调用）

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
