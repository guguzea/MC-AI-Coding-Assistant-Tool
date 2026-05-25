---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成方块状态、物品模型、配方、战利品表、标签、进度、语言文件。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、AdvancementProvider、LanguageProvider
---

# 数据生成器（Forge 1.20.1）

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
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();

        if (event.includeServer()) {
            generator.addProvider(true, output ->
                new ModBlockTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, output ->
                new ModItemTagsProvider(output, event.getLookupProvider(), event.getLookupProvider()));
            generator.addProvider(true, new ModRecipeProvider(output, event.getLookupProvider()));
            generator.addProvider(true, output ->
                new ModLootTableProvider(output, event.getLookupProvider()));
        }

        if (event.includeClient()) {
            generator.addProvider(true, new ModBlockStatesProvider(output, event.getLookupProvider(), event.getExistingFileHelper()));
            generator.addProvider(true, new ModItemModelProvider(output, event.getExistingFileHelper()));
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
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, ModItems.MY_ITEM.get(), 1)
            .pattern("ABA")
            .pattern("CDC")
            .pattern("ABA")
            .define('A', Items.DIAMOND)
            .define('B', Items.EMERALD)
            .define('C', Items.IRON_INGOT)
            .define('D', ModItems.MY_INGOT.get())
            .unlockedBy("has_item", has(ModItems.MY_INGOT.get()))
            .save(consumer);
    }
}
```

## 方块状态生成

`BlockStateProvider` 构造函数需要 3 个参数：`PackOutput`、`modId`、`ExistingFileHelper`。

```java
public class ModBlockStatesProvider extends BlockStateProvider {
    public ModBlockStatesProvider(PackOutput output, String modid, ExistingFileHelper efh) {
        super(output, modid, efh);
    }

    @Override
    protected void registerStatesAndModels() {
        // 无变体方块
        simpleBlock(ModBlocks.MY_BLOCK.get(),
            models().cubeAll(name(ModBlocks.MY_BLOCK.get()), modLoc("block/my_block"))
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
public class ModItemModelsProvider extends ItemModelProvider {
    public ModItemModelsProvider(PackOutput output, ExistingFileHelper helper) {
        super(output, MOD_ID, helper);
    }

    @Override
    public void registerModels() {
        // 使用已有的方块模型作为物品模型
        withExistingParent(name(ModItems.MY_BLOCK_ITEM.get()),
            modLoc("block/my_block"));
    }
}
```

## 战利品表

```java
// ModLootTableProvider
public class ModLootTableProvider extends LootTableProvider {
    public ModLootTableProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, Collections.emptySet(),
            List.of(
                new SubProviderEntry(ModBlockLootSubProvider::new, LootContextParamSets.BLOCK),
                new SubProviderEntry(ModEntityLootSubProvider::new, LootContextParamSets.EMPTY)
            ),
            registries
        );
    }
}

// 方块战利品
public class ModBlockLootSubProvider extends BlockLootSubProvider {
    public ModBlockLootSubProvider() {
        super(Collections.emptySet(), FeatureFlags.REGISTRY.allFlags());
    }

    @Override
    protected void addTables() {
        this.dropSelf(ModBlocks.MY_BLOCK.get());
    }

    @Override
    protected Iterable<Block> getKnownBlocks() {
        return ModBlocks.BLOCKS.getEntries().stream()
            .flatMap(r -> r.stream())
            ::iterator;
    }
}
```

## 标签生成

```java
// BlockTagsProvider
public class ModBlockTagsProvider extends BlockTagsProvider {
    public ModBlockTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider) {
        super(output, MOD_ID, lookupProvider);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        tag(BlockTags.NEEDS_DIAMOND_TOOL)
            .add(ModBlocks.MY_BLOCK.get());
    }
}

// ItemTagsProvider
public class ModItemTagsProvider extends ItemTagsProvider {
    public ModItemTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider,
            CompletableFuture<HolderLookup.Provider> blockLookupProvider) {
        super(output, lookupProvider, blockLookupProvider, MOD_ID);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        tag(ItemTags.PIGLIN_LOVED)
            .add(ModItems.MY_INGOT.get());
    }
}
```

## 进度生成（AdvancementProvider）

```java
public class ModAdvancementProvider extends AdvancementProvider {
    public ModAdvancementProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, registries, List.of(
            // 每一项是一个 Consumer<Consumer<FinishedRecipe>>，通常对应一个 json 文件
            new ModAdvancementSubProvider()
        ));
    }

    private static class ModAdvancementSubProvider implements Consumer<Consumer<FinishedAdvancement>> {
        @Override
        public void accept(Consumer<FinishedAdvancement> consumer) {
            // 根进度
            Advancement.Builder.advancement()
                .display(
                    ModItems.MY_ITEM.get(),
                    Component.literal("First Steps"),
                    Component.literal("Obtain your first item"),
                    null,
                    FrameType.TASK,
                    false, false, false
                )
                .addCriterion("has_item", InventoryChangeTrigger.TriggerInstance.hasItems(
                    ModItems.MY_ITEM.get()
                ))
                .save(consumer, MOD_ID + ":custom/root");

            // 子进度
            Advancement.Builder.advancement()
                .parent(new ResourceLocation(MOD_ID, "custom/root"))
                .display(
                    Items.DIAMOND,
                    Component.literal("Upgrade"),
                    Component.literal("Upgrade your equipment"),
                    null,
                    FrameType.GOAL,
                    true, true, false
                )
                .addCriterion("has_diamond", InventoryChangeTrigger.TriggerInstance.hasItems(Items.DIAMOND))
                .save(consumer, MOD_ID + ":custom/upgrade");
        }
    }
}
```

在 `GatherDataEvent` 中注册：
```java
generator.addProvider(true, new ModAdvancementProvider(output, event.getLookupProvider()));
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
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
