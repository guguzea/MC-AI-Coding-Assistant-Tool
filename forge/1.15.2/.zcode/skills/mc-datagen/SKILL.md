---
name: mc-datagen
description: Minecraft Forge 数据生成器。GatherDataEvent、IDataProvider、RecipeProvider、LootTableProvider、LanguageProvider。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、AdvancementProvider、LanguageProvider
mappings: mcp
---

# 数据生成器（Forge 1.15.2）

## 快速开始

运行 DataGen：
```bash
./gradlew runData
```

生成内容在 `src/generated/resources/` 目录，**不要手动编辑**。
**不要** `PackOutput` / `getLookupProvider()` / `addProvider(true, ...)` / `RecipeCategory`。

## 主类注册

> 自造名说明：本文**所有**代码块里的 `DataGenerators`、`gatherData`、`ModBlockTagsProvider` / `ModItemTagsProvider` / `ModRecipeProvider` / `ModLootTableProvider` / `ModItemModelsProvider` / `ModBlockStatesProvider` / `ModLanguageProvider` / `ModRecipes`、局部变量 `blockTags`、`ModItems` / `ModBlocks` 以及 `MY_ITEM` / `MY_BLOCK` / `MY_BLOCK_ITEM` / `OTHER_ITEM`，都是**示例工程自造名**（对应 `01-registry.mdc` 里的注册类与常量），不是 Forge / vanilla API，无需语料出处。非自造的名字必须能在本档语料里逐字命中，命中不了的按 `// TODO(未核实)` 就地标注。

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

## Decision: 选择 Provider

| 数据类型 | Provider |
|----------|----------|
| 方块状态变体 | `BlockStateProvider#registerStatesAndModels` |
| 方块/物品模型 | `ItemModelProvider#registerModels` |
| 配方 | `RecipeProvider`（覆盖 **buildShapelessRecipes**；`registerRecipes` 只见于本档语料页，1.15.2 official 构件已无此方法） |
| 战利品表 | `LootTableProvider#getTables` |
| 进度 | 优先手写 JSON |
| 语言 | `LanguageProvider#addTranslations` |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider`（传入 BlockTagsProvider） |



## 配方生成

```java
// datagen/ModRecipes.java
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(DataGenerator generator) {
        super(generator);
    }

    @Override
    // 本段方法名 2026-10-05 已对 1.15.2-31.2.50_mapped_official_1.15.2 构件 javap 实证：
    // RecipeProvider#buildShapelessRecipes(Consumer<IFinishedRecipe>)、shaped/pattern/define/unlocks/save、
    // shapeless/requires、CookingRecipeBuilder.smelting(Ingredient, IItemProvider, float, int) 均存在；
    // registerRecipes/shapedRecipe/patternLine/key/addCriterion/hasItems/build 在构件中不存在（语料页 datagen_intro.md 用的是 MCP 旧名）。
    protected void buildShapelessRecipes(Consumer<IFinishedRecipe> consumer) {
        ShapedRecipeBuilder.shaped(ModItems.MY_ITEM.get())
            .pattern(" X ")
            .pattern(" X ")
            .pattern(" Y ")
            .define('X', Items.DIAMOND)
            .define('Y', Items.STICK)
            .unlocks("has_diamond", has(Items.DIAMOND))
            .save(consumer);

        ShapelessRecipeBuilder.shapeless(ModItems.OTHER_ITEM.get())
            .requires(Items.GOLD_INGOT, 3)
            .requires(Items.DIAMOND)
            .unlocks("has_gold", has(Items.GOLD_INGOT))
            .save(consumer);

        CookingRecipeBuilder.smelting(Ingredient.of(Items.COBBLESTONE), Items.STONE, 0.1f, 200)
            .unlocks("has_cobblestone", has(Items.COBBLESTONE))
            .save(consumer);
    }
}
```

## 方块状态生成

`BlockStateProvider` 构造：`DataGenerator`、`modId`、`ExistingFileHelper`。

```java
public class ModBlockStatesProvider extends BlockStateProvider {
    public ModBlockStatesProvider(DataGenerator generator, ExistingFileHelper efh) {
        super(generator, MOD_ID, efh);
    }

    @Override
    protected void registerStatesAndModels() {
        simpleBlock(ModBlocks.MY_BLOCK.get(), // TODO(未核实：simpleBlock 未在 forge 1.15.2 语料命中，需 search_forge_docs 复核或反编译)
            models().cubeAll(ModBlocks.MY_BLOCK.getId().getPath(), modLoc("block/my_block")) // TODO(未核实：cubeAll / modLoc 未在 forge 1.15.2 语料命中，需 search_forge_docs 复核或反编译；本行只有 models() 有出处 data/forge_1.15.2/forge-docs/1.15.2/processed/datagen_modelproviders.md:21)
        );
    }
}
```

## 物品模型（来自方块）

```java
public class ModItemModelsProvider extends ItemModelProvider {
    public ModItemModelsProvider(DataGenerator generator, ExistingFileHelper helper) {
        super(generator, MOD_ID, helper);
    }

    @Override
    protected void registerModels() {
        withExistingParent(ModItems.MY_BLOCK_ITEM.getId().getPath(), modLoc("block/my_block")); // TODO(未核实：withExistingParent / modLoc 未在 forge 1.15.2 语料命中，需 search_forge_docs 复核或反编译)
    }
}
```

## 战利品表

覆盖 `LootTableProvider#getTables`。完整 `BlockLoot` / 1.14 `Consumer` 示例见 `07-datagen.mdc`。
不要 `BlockLootSubProvider` / `FeatureFlags`。

## 标签生成

覆盖 **registerTags**。Forge 构造传入 `MOD_ID` 与 `ExistingFileHelper`。完整示例见 `07-datagen.mdc`。

## 语言生成（ModLanguageProvider）

```java
public class ModLanguageProvider extends LanguageProvider {
    public ModLanguageProvider(DataGenerator generator, String locale) {
        super(generator, MOD_ID, locale);
    }

    @Override
    protected void addTranslations() {
        add(ModItems.MY_ITEM.get(), "My Item");
        add(ModBlocks.MY_BLOCK.get(), "My Block");
        add("advancement." + MOD_ID + ".custom.root.title", "First Steps");
        add("advancement." + MOD_ID + ".custom.root.description", "Obtain your first item");
    }
}
```

如需中文：`generator.addProvider(new ModLanguageProvider(generator, "zh_cn"));`

## 常见错误

- ❌ `PackOutput` / `getPackOutput()` — 1.15.2 用 `DataGenerator` 构造 Provider
- ❌ `addProvider(true, provider)` — 本档 `DataGenerator#addProvider(IDataProvider)` 无 boolean
- ❌ `event.getLookupProvider()` / `HolderLookup` — 1.19.3+
- ❌ `RecipeCategory` — 1.19.3+
- ❌ 手改 `src/generated/resources/`
- ❌ `FurnaceRecipe.Builder` / `setRegistryName` 当 DataGen 保存配方
- ❌ `modLoc()` 与 `mcLoc()` 用反
- ❌ 标签 Provider 依赖顺序错误（先 BlockTags，再 ItemTags，再配方）
- ❌ `ExistingFileHelper` 检查失败（引用的贴图不存在）

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
