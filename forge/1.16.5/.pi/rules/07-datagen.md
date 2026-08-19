---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Forge 1.16.5

---

## 约束

### 数据生成时机

- 数据生成（DataGen）在 Gradle 任务 `./gradlew runData` 或 `build` 期间执行
- **禁止**在运行时修改数据生成器输出
- 生成的 JSON 放在 `src/generated/resources/`（ForgeGradle 配置的输出目录），不要手改
- Provider 实现 **`IDataProvider`**；构造函数吃 **`DataGenerator`**，**不要** `PackOutput` / `getPackOutput()`（那是 1.19.3+）
- `DataGenerator#addProvider(IDataProvider)`（1.18 文档写 `DataProvider`），**不要** `addProvider(true, ...)`（1.19.2+）
- **不要** `event.getLookupProvider()` / `HolderLookup`（1.19.3+）
- GatherDataEvent：`net.minecraftforge.fml.event.lifecycle.GatherDataEvent`
- 官方文档：`IDataProvider`；`RecipeProvider#buildShapelessRecipes`（名字如此，会写出全部配方）；`TagsProvider#addTags`；`AdvancementProvider#registerAdvancements`；`GlobalLootModifierProvider#start`

### 目录结构

```
src/main/java/
└── {package}/
    └── datagen/
        ├── ModDataGenerators.java      # 入口类
        ├── ModBlockStates.java          # 方块状态数据
        ├── ModItemModels.java           # 物品模型
        ├── ModRecipes.java              # 合成配方
        ├── ModLootTables.java           # 战利品表
        └── ModTags.java                 # 标签
```

### DataGenerators 入口类规范

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

### RecipeProvider 使用规范

- 覆盖 `buildShapelessRecipes(Consumer<FinishedRecipe>)`，**不要** `buildRecipes`（1.19.3+）也不要 `registerRecipes`（1.14 MCP）
- Official：`ShapedRecipeBuilder.shaped` + `pattern` + `define` + `unlockedBy` + `save`
- 无序：`ShapelessRecipeBuilder.shapeless` + `requires`（不是 `.ingredient()`）
- 熔炉：`SimpleCookingRecipeBuilder.smelting`（无 RecipeCategory；不要 `CookingRecipeBuilder` / `FurnaceRecipeProvider`）

### LootTableProvider 使用规范

- 覆盖 `#getTables`
- **不要** `BlockLootSubProvider` / `FeatureFlags` / `LootTableProvider.SubProviderEntry`（1.20+）

---

## Decision Flow

### Decision: 生成什么类型的数据

```
IF 生成合成配方
  → 使用 RecipeProvider 子类
  → ShapedRecipeBuilder / ShapelessRecipeBuilder / SimpleCookingRecipeBuilder
  → 放到 data/{modid}/recipes/

IF 生成战利品表
  → 使用 LootTableProvider（覆盖 #getTables）
  → 放到 data/{modid}/loot_tables/blocks/

IF 生成方块标签（哪些方块可被某工具挖掘）
  → 使用 BlockTagsProvider
  → 放到 data/{modid}/tags/blocks/

IF 生成物品标签
  → 使用 ItemTagsProvider（构造要传入 BlockTagsProvider）
  → 放到 data/{modid}/tags/items/

IF 生成进度 / advancements
  → AdvancementProvider#registerAdvancements → data/{modid}/advancements/

IF 生成物品模型（JSON）
  → 使用 ItemModelProvider#registerModels
  → 放到 assets/{modid}/models/item/

IF 生成方块状态（BlockState JSON）
  → 使用 BlockStateProvider#registerStatesAndModels
  → 放到 assets/{modid}/blockstates/

IF 生成语言文件
  → 使用 LanguageProvider#addTranslations
  → 放到 assets/{modid}/lang/
```

### Decision: 配方类型选择

```
IF 配方有固定形状（工具、武器等）
  → ShapedRecipeBuilder.shaped + pattern + define

IF 配方成分无固定位置（药水、染料混合等）
  → ShapelessRecipeBuilder.shapeless + requires

IF 熔炉烧制/烟熏/营火烧制
  → 在 buildShapelessRecipes() 中使用：
  → SimpleCookingRecipeBuilder.smelting()
  → SimpleCookingRecipeBuilder.smoking()
  → SimpleCookingRecipeBuilder.campfireCooking()

IF 用自定义工作台配方
  → 实现 IRecipe + 自定义 Container 和 Screen
```

### Decision: 战利品表掉落方式

```
IF 固定掉落某物品
  → ItemLootEntry / LootItem + SetCount

IF 掉落方块本身（方块被破坏时）
  → BlockLoot#dropSelf（1.16 已有）

IF 有条件的掉落（附魔工具挖掘等）
  → MatchTool + enchantment 条件

IF 随机数量掉落
  → SetCount + RandomValueRange / UniformGenerator（以本版 mappings 为准）

IF 掉落多个物品
  → 多个 LootPool / LootEntry
```

---

## 示例：ModDataGenerators 入口

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

## 示例：合成配方

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

        SimpleCookingRecipeBuilder.smelting(Ingredient.fromItems(Items.COBBLESTONE), Items.STONE, 0.1f, 200)
            .unlockedBy("has_cobblestone", has(Items.COBBLESTONE))
            .save(consumer);
    }
}
```

## 示例：战利品表

```java
public class ModLootTableProvider extends LootTableProvider {
    public ModLootTableProvider(DataGenerator generator) {
        super(generator);
    }

    @Override
    protected List<Pair<Supplier<Consumer<BiConsumer<ResourceLocation, LootTable.Builder>>>, LootContextParamSet>> getTables() {
        return List.of(Pair.of(ModBlockLoot::new, LootContextParamSets.BLOCK));
    }
}

public class ModBlockLoot extends BlockLoot {
    @Override
    protected void addTables() {
        dropSelf(ModBlocks.MY_BLOCK.get());
        add(ModBlocks.SPECIAL_BLOCK.get(), createSingleItemTable(ModItems.SPECIAL_DROP.get()));
    }

    @Override
    protected Iterable<Block> getKnownBlocks() {
        return List.of(ModBlocks.MY_BLOCK.get(), ModBlocks.SPECIAL_BLOCK.get());
    }
}
```

不要 `PackOutput`、`BlockLootSubProvider`、`FeatureFlags`、`LootTableProvider.SubProviderEntry`（那是 1.19.3/1.20+）。

## 示例：方块标签

```java
public class ModBlockTagsProvider extends BlockTagsProvider {
    public ModBlockTagsProvider(DataGenerator generator, ExistingFileHelper helper) {
        super(generator, MOD_ID, helper);
    }

    @Override
    protected void addTags() {
        tag(BlockTags.LOGS).add(ModBlocks.MY_BLOCK.get());
    }
}

public class ModItemTagsProvider extends ItemTagsProvider {
    public ModItemTagsProvider(DataGenerator generator, BlockTagsProvider blockTags, ExistingFileHelper helper) {
        super(generator, blockTags, MOD_ID, helper);
    }

    @Override
    protected void addTags() {
        tag(ItemTags.LOGS).add(ModItems.MY_ITEM.get());
    }
}
```

> 注意：官方映射用 `TagsProvider#tag`。不要 `BlockTags.MINEABLE_WITH_PICKAXE`（1.17+），不要 `registerTags`（1.14 MCP）。

## 示例：模型 / 语言

```java
public class ModItemModelsProvider extends ItemModelProvider {
    public ModItemModelsProvider(DataGenerator generator, ExistingFileHelper helper) {
        super(generator, MOD_ID, helper);
    }

    @Override
    protected void registerModels() {
        withExistingParent(ModItems.MY_BLOCK_ITEM.getId().getPath(), modLoc("block/my_block"));
        singleTexture(ModItems.MY_ITEM.getId().getPath(), mcLoc("item/generated"), "layer0", modLoc("item/" + ModItems.MY_ITEM.getId().getPath()));
    }
}

public class ModBlockStatesProvider extends BlockStateProvider {
    public ModBlockStatesProvider(DataGenerator generator, ExistingFileHelper helper) {
        super(generator, MOD_ID, helper);
    }

    @Override
    protected void registerStatesAndModels() {
        simpleBlock(ModBlocks.MY_BLOCK.get());
    }
}

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

## 常见错误

- ❌ `PackOutput` / `getPackOutput()` — 1.16.5 用 `DataGenerator` 构造 Provider
- ❌ `addProvider(true, provider)` — 本档 `DataGenerator#addProvider(IDataProvider)` 无 boolean
- ❌ `event.getLookupProvider()` / `HolderLookup` — 1.19.3+
- ❌ `RecipeCategory` — 1.19.3+
- ❌ 手改 `src/generated/resources/`
- ❌ `FurnaceRecipe.Builder` / `setRegistryName` 当 DataGen 保存配方
- ❌ `modLoc()` 与 `mcLoc()` 用反
- ❌ `BlockTags.MINEABLE_WITH_PICKAXE` — 1.17+
- ❌ `.ingredient()` — 无序配方用 `requires`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
