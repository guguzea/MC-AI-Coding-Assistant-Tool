---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成方块状态、物品模型、配方、战利品表、标签、进度、语言文件。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、AdvancementProvider、LanguageProvider
mappings: parchment
---

# 数据生成器（Forge 1.20.1）

## 快速开始

运行 DataGen：
```bash
./gradlew runData
```

生成内容在 `src/generated/resources/` 目录，**不要手动编辑**。

## 主类注册

> **示例工程自造名（不需语料出处）**：本文件各代码块里的 `DataGenerators` 类、`ModItems` / `ModBlocks` 注册类及其 `MY_ITEM` / `MY_INGOT` / `MY_BLOCK` / `MY_BLOCK_ITEM` 常量，以及 `ModBlockTagsProvider` / `ModItemTagsProvider` / `ModRecipeProvider` / `ModLootTableProvider` / `ModBlockStatesProvider` / `ModItemModelProvider` / `ModItemModelsProvider` / `ModLanguageProvider` / `ModAdvancementProvider` / `ModAdvancementSubProvider` / `ModBlockLootSubProvider` / `ModEntityLootSubProvider` 这些带 `Mod` 前缀的类，都是**本文件虚构的示例工程类名/字段名**（对应你工程里的注册类与 Provider 子类），不是 Forge / vanilla API。去掉 `Mod` 前缀后的父类名（`BlockTagsProvider`、`RecipeProvider`、`LootTableProvider`、`BlockStateProvider`…）才是 API 实名，那些在本档语料逐字命中。

```java
// 在 mod 主类中注册 DataProvider
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        // TODO(未核实：getPackOutput 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
        // 本档语料逐字出现的只有 `PackOutput` 形参类型与 `event.getGenerator()`；
        // 语料取 PackOutput 的形态是给 addProvider 传工厂 lambda `output -> new XxxProvider(output, ...)`
        //（出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_tags.md:12-22、
        //  同档 datagen_server_advancements.md:17-27；`GatherDataEvent` / `DataGenerator` 见同档 datagen.md:40）
        PackOutput output = generator.getPackOutput();

        if (event.includeServer()) {
            ModBlockTagsProvider blockTags = new ModBlockTagsProvider(output, event.getLookupProvider());
            generator.addProvider(true, blockTags);
            generator.addProvider(true, new ModItemTagsProvider(output, event.getLookupProvider(), blockTags.contentsGetter()));
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
        // TODO(未核实：DIAMOND / EMERALD / IRON_INGOT 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
        // 本档语料逐字命中的 vanilla 常量只有 `Items.DIRT`
        //（出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_glm.md:26）；
        //  `ShapedRecipeBuilder.shaped(RecipeCategory.MISC, result)` 与 `#define` 的形态见同档 datagen_server_recipes.md:43-60
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
        // TODO(未核实：cubeAll 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
        // 同行调用链上的 `simpleBlock` / `models()` 在本档语料同样零命中；
        // 本档 `BlockStateProvider` 方法表逐字命中的是 `simpleBlockItem`、`simpleBlockWithItem`、`models`、`itemModels`、`blockTexture`
        //（出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_client_modelproviders.md:150-156）；
        // 「六面同纹理」在语料里只以 JSON parent 名 `block/cube_all` 出现（同档 rendering_modelextensions_rendertypes.md:20），不是 datagen 方法名
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
    public void generate() {
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
    // TODO(未核实：NEEDS_DIAMOND_TOOL 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
    // 本档语料的 BlockTagsProvider 构造是 4 参形态：
    // `output -> new MyBlockTagsProvider(output, event.getLookupProvider(), MOD_ID, event.getExistingFileHelper())`
    //（出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_tags.md:12-22）
    public ModBlockTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider) {
        super(output, MOD_ID, lookupProvider);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        // `tag(...)` 与链式 `add` 有出处：同档 datagen_server_tags.md:35-44（TagAppender 方法表）、示例 :49-58
        tag(BlockTags.NEEDS_DIAMOND_TOOL)
            .add(ModBlocks.MY_BLOCK.get());
    }
}

// ItemTagsProvider
public class ModItemTagsProvider extends ItemTagsProvider {
    // TODO(未核实：blockLookupProvider 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
    //（该形参名本档语料从未逐字出现；语料里 ItemTagsProvider 只出现在 provider 对照表
    //  data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_tags.md:72 与 `#copy` 用法 :89-99，均无构造签名；
    //  语料给出的形参名风格是 `registries` / `fileHelper`，见同档 :106、:120）
    public ModItemTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookupProvider,
            CompletableFuture<HolderLookup.Provider> blockLookupProvider) {
        super(output, lookupProvider, blockLookupProvider, MOD_ID);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        // TODO(未核实：PIGLIN_LOVED 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
        tag(ItemTags.PIGLIN_LOVED)
            .add(ModItems.MY_INGOT.get());
    }
}
```

## 进度生成（AdvancementProvider）

```java
public class ModAdvancementProvider extends AdvancementProvider {
    // 本档语料的进度生成实名形态不是 AdvancementProvider 子类，而是 Forge 的扩展
    // `ForgeAdvancementProvider` + 子 provider 接口 `ForgeAdvancementProvider$AdvancementGenerator`，
    // 入口签名 `generate(HolderLookup.Provider registries, Consumer<Advancement> writer, ExistingFileHelper existingFileHelper)`，
    // 且 `#save` 在该页是三参 `(writer, name, existingFileHelper)`
    //（出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_advancements.md:8,20,31,42,61,70）
    public ModAdvancementProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, registries, List.of(
            // 每一项是一个 Consumer<Consumer<FinishedRecipe>>，通常对应一个 json 文件
            new ModAdvancementSubProvider()
        ));
    }

    // FinishedAdvancement 在 forge 1.20.1 语料零命中；语料里 writer 的元素类型逐字是 `Advancement`
    //（出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_advancements.md:33,42）
    private static class ModAdvancementSubProvider implements Consumer<Consumer<Advancement>> {
        @Override
        public void accept(Consumer<Advancement> consumer) {
            // 根进度
            Advancement.Builder.advancement()
                // TODO(未核实：FrameType / TASK 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
                //（本档语料对 `display` 只给了方法名与一句描述，未给参数类型 ⇒ 同档 mc-advancement 亦留 TODO(未核实)；
                //  `FrameType` 仅出现在机器 dump data/forge_1.20.1/extracted/api-index.json，按口径不算出处，
                //  出处：data/forge_1.20.1/forge-docs/1.20.1/processed/datagen_server_advancements.md:56）
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
                // TODO(未核实：FrameType / GOAL 与 Items.DIAMOND 未在 forge 1.20.1 语料命中，需 search_forge_docs 复核或反编译)
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
