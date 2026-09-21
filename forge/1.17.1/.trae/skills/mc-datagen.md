---
name: mc-datagen
description: Minecraft Forge 数据生成器。GatherDataEvent、DataProvider、RecipeProvider、LootTableProvider、LanguageProvider。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、AdvancementProvider、LanguageProvider
mappings: official
---

# 数据生成器（Forge 1.17.1）

## 快速开始

运行 DataGen：
```bash
./gradlew runData
```

生成内容在 `src/generated/resources/` 目录，**不要手动编辑**。
**不要** `PackOutput` / `getLookupProvider()` / `addProvider(true, ...)` / `RecipeCategory`。

## 主类注册

> **示例工程自造名（不需语料出处，按你工程实际替换）**：`DataGenerators` 与其事件方法 `gatherData`、`ModBlockTagsProvider` / `ModItemTagsProvider` / `ModRecipeProvider` / `ModLootTableProvider` / `ModItemModelsProvider` / `ModBlockStatesProvider` / `ModLanguageProvider` / `ModRecipes`、注册类 `ModItems` / `ModBlocks` 及常量 `MY_ITEM` / `MY_BLOCK` / `OTHER_ITEM` / `MY_BLOCK_ITEM`。
> 真正有本档语料出处的只有：`GatherDataEvent`、`DataGenerator`、`DataGenerator#addProvider`（`data/forge_1.17.1/forge-docs/1.17.1/processed/datagen_intro.md:29`）、`DataProvider`（同文件 `:27`）、`ExistingFileHelper` 与 `GatherDataEvent#getExistingFileHelper()`（`datagen_modelproviders.md:11`）。

```java
// net.minecraftforge.forge.event.lifecycle.GatherDataEvent
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
| 配方 | `RecipeProvider`（覆盖 **buildCraftingRecipes**；⚠️ 本档语料 `datagen_intro.md:46` 逐字写的是 `#buildShapelessRecipes`，`buildCraftingRecipes` 语料零命中 ⇒ 哪个拼写适用于 1.17.1 未核实，须反编译或按你工程 IDE 实名核对，勿二选一照抄） |
| 战利品表 | `LootTableProvider#getTables` |
| 进度 | AdvancementProvider#registerAdvancements |
| 语言 | `LanguageProvider#addTranslations` |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider`（传入 BlockTagsProvider） |



## 配方生成

```java
// datagen/ModRecipes.java
// TODO(未核实：Items.DIAMOND 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// TODO(未核实：Items.STICK 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// TODO(未核实：Items.GOLD_INGOT 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// TODO(未核实：Items.COBBLESTONE 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// 本档正处 MCP → mojmap 口径分叉档（mappings=official），成员拼写只按本档语料判：
// 语料内没有任何 `Items.<常量>` 与 `Ingredient.*` 工厂方法 ⇒ 上面四个物品名与 `Ingredient.of` 一律未核实。
// 本段唯一有出处的是 RecipeProvider 与要覆盖的 #buildShapelessRecipes（datagen_intro.md:46）
// —— 下面整体是结构壳，编译前须逐名核实，勿当已核实签名照抄。
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(DataGenerator generator) {
        super(generator);
    }

    @Override
    protected void buildCraftingRecipes(Consumer<FinishedRecipe> consumer) {
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

## 方块状态生成

`BlockStateProvider` 构造：`DataGenerator`、`modId`、`ExistingFileHelper`。

```java
// TODO(未核实：simpleBlock 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// TODO(未核实：cubeAll 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// TODO(未核实：modLoc 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// 本档语料只背书 BlockStateProvider#registerStatesAndModels（datagen_intro.md:36）与可取的 #models() / #itemModels()
// 实例（datagen_modelproviders.md:21）；具体建模 helper 名未收录 ⇒ 下面是结构壳，勿当已核实签名照抄。
public class ModBlockStatesProvider extends BlockStateProvider {
    public ModBlockStatesProvider(DataGenerator generator, ExistingFileHelper efh) {
        super(generator, MOD_ID, efh);
    }

    @Override
    protected void registerStatesAndModels() {
        simpleBlock(ModBlocks.MY_BLOCK.get(),
            models().cubeAll(ModBlocks.MY_BLOCK.getId().getPath(), modLoc("block/my_block"))
        );
    }
}
```

## 物品模型（来自方块）

```java
// TODO(未核实：withExistingParent 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// TODO(未核实：modLoc 未在 forge 1.17.1 语料命中，需 search_forge_docs 复核或反编译)
// 本档语料只背书 ItemModelProvider 及要覆盖的 #registerModels / #generateModels
// （datagen_intro.md:35、datagen_modelproviders.md:19）；建模 helper 名未收录 ⇒ 结构壳，须逐名核实。
public class ModItemModelsProvider extends ItemModelProvider {
    public ModItemModelsProvider(DataGenerator generator, ExistingFileHelper helper) {
        super(generator, MOD_ID, helper);
    }

    @Override
    protected void registerModels() {
        withExistingParent(ModItems.MY_BLOCK_ITEM.getId().getPath(), modLoc("block/my_block"));
    }
}
```

## 战利品表

覆盖 `LootTableProvider#getTables`。完整 `BlockLoot` / 1.14 `Consumer` 示例见 `07-datagen.mdc`。
不要 `BlockLootSubProvider` / `FeatureFlags`。

## 标签生成

覆盖 **addTags**。Forge 构造传入 `MOD_ID` 与 `ExistingFileHelper`。完整示例见 `07-datagen.mdc`。

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

- ❌ `PackOutput` / `getPackOutput()` — 1.17.1 用 `DataGenerator` 构造 Provider
- ❌ `addProvider(true, provider)` — 本档 `DataGenerator#addProvider(DataProvider)` 无 boolean
- ❌ `event.getLookupProvider()` / `HolderLookup` — 1.19.3+
- ❌ `RecipeCategory` — 1.19.3+
- ❌ 手改 `src/generated/resources/`
- ❌ `FurnaceRecipe.Builder` / `setRegistryName` 当 DataGen 保存配方
- ❌ `modLoc()` 与 `mcLoc()` 用反（本档语料对这两个名字逐字零命中 ⇒ 均未核实，见上文 `TODO(未核实)`，不得当已核实 API 照抄）
- ❌ 标签 Provider 依赖顺序错误（先 BlockTags，再 ItemTags，再配方）
- ❌ `ExistingFileHelper` 检查失败（引用的贴图不存在）

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
