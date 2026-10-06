---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Forge 1.15.2

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
- 与 1.14.x 同代：`IDataProvider` + `DataGenerator` 构造；MCP：`registerRecipes` / `registerTags`

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

- 覆盖 `buildShapelessRecipes(Consumer<IFinishedRecipe>)`（本档 official 构件实证；`registerRecipes` 是 1.14 及更早 MCP 名，1.15.2 构件已无）
- `ShapedRecipeBuilder.shaped` / `pattern` / `define` / `unlocks` / `save`（构件实证；`shapedRecipe`/`patternLine`/`key`/`addCriterion`/`build` 是 MCP 旧名，本档构件不存在）
- 熔炉：`CookingRecipeBuilder.smelting(Ingredient, IItemProvider, float, int)`（构件实证），不要 `FurnaceRecipeProvider`（1.17+）；无序配方用 `ShapelessRecipeBuilder.shapeless(...).requires(...)`
- 末端方法就是 `.save(consumer)`（构件实证有 `save(Consumer)` / `save(Consumer, String)` / `save(Consumer, ResourceLocation)` 三重载）；`registerRecipes`/`build(consumer)` 在 1.15.2 official 构件里都不存在，**不要**再用
- 解锁条件用 `RecipeProvider` 自带的 `has(IItemProvider)`：`.unlocks("has_diamond", has(Items.DIAMOND))`（构件实证 `has` 返回 `InventoryChangeTrigger.Instance`；`ItemPredicate.getItemByItem` 在 1.15.2 构件不存在，别按 1.16.2+ 写法补）

### LootTableProvider 使用规范

- 覆盖 `#getTables`
- **不要** `BlockLootSubProvider` / `FeatureFlags` / `LootTableProvider.SubProviderEntry`（1.20+）

---

## Decision Flow

### Decision: 生成什么类型的数据

```
IF 生成合成配方
  → 使用 RecipeProvider 子类
  → ShapedRecipeBuilder / ShapelessRecipeBuilder / CookingRecipeBuilder
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
  → 优先手写 JSON；原版 AdvancementProvider 仍偏原版进度

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
  → ShapedRecipeBuilder.shaped + pattern + define（构件实证名）

IF 配方成分无固定位置（药水、染料混合等）
  → ShapelessRecipeBuilder.shapeless + requires

IF 熔炉烧制
  → CookingRecipeBuilder.smelting

IF 用自定义工作台配方
  → 实现 IRecipe + 自定义 Container 和 GUI
```

### Decision: 战利品表掉落方式

```
IF 固定掉落某物品
  → ItemLootEntry / LootItem + SetCount

IF 掉落方块本身（方块被破坏时）
  → LootTable.builder + ItemLootEntry.builder

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
    protected void buildShapelessRecipes(Consumer<IFinishedRecipe> consumer) {
        // 1.15.2 official 构件实证面：shaped/pattern/define/unlocks/save + has()（RecipeProvider 自带）
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

## 示例：战利品表

```java
// datagen/ModLootTables.java
public class ModLootTableProvider extends LootTableProvider {
    public ModLootTableProvider(DataGenerator generator) {
        super(generator);
    }

    @Override
    protected List<Pair<Supplier<Consumer<BiConsumer<ResourceLocation, LootTable.Builder>>>, LootParameterSet>> getTables() {
        return ImmutableList.of(Pair.of(ModBlockLootTables::new, LootParameterSets.BLOCK));
    }
}

public class ModBlockLootTables implements Consumer<BiConsumer<ResourceLocation, LootTable.Builder>> {
    @Override
    public void accept(BiConsumer<ResourceLocation, LootTable.Builder> consumer) {
        consumer.accept(
            ModBlocks.MY_BLOCK.get().getLootTable(),
            LootTable.builder().addLootPool(
                LootPool.builder().addEntry(ItemLootEntry.builder(ModBlocks.MY_BLOCK.get()))
            )
        );
        consumer.accept(
            ModBlocks.SPECIAL_BLOCK.get().getLootTable(),
            LootTable.builder().addLootPool(
                LootPool.builder().addEntry(
                    ItemLootEntry.builder(ModItems.SPECIAL_DROP.get())
                        .addFunction(SetCount.setCount(RandomValueRange.of(1, 3)))
                )
            )
        );
    }
}
```

不要 `LootTables.register` / `LootTableList` / `FurnaceRecipe.Builder`。覆盖 `LootTableProvider#getTables`。

## 示例：方块标签

```java
public class ModBlockTagsProvider extends BlockTagsProvider {
    public ModBlockTagsProvider(DataGenerator generator, ExistingFileHelper helper) {
        super(generator, MOD_ID, helper);
    }

    @Override
    protected void registerTags() {
        getBuilder(BlockTags.LOGS).add(ModBlocks.MY_BLOCK.get());
    }
}

public class ModItemTagsProvider extends ItemTagsProvider {
    public ModItemTagsProvider(DataGenerator generator, BlockTagsProvider blockTags, ExistingFileHelper helper) {
        super(generator, blockTags, MOD_ID, helper);
    }

    @Override
    protected void registerTags() {
        getBuilder(ItemTags.LOGS).add(ModItems.MY_ITEM.get());
    }
}
```

> 注意：`#minecraft:xxx` 是原版标签，`#forge:xxx` 是 Forge 通用标签，`#{modid}:xxx` 是 mod 专属标签。不要 `BlockTags.MINEABLE_WITH_PICKAXE`（1.17+）。

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

- ❌ `PackOutput` / `getPackOutput()` — 1.15.2 用 `DataGenerator` 构造 Provider
- ❌ `addProvider(true, provider)` — 本档 `DataGenerator#addProvider(IDataProvider)` 无 boolean
- ❌ `event.getLookupProvider()` / `HolderLookup` — 1.19.3+
- ❌ `RecipeCategory` — 1.19.3+
- ❌ 手改 `src/generated/resources/`
- ❌ `FurnaceRecipe.Builder` / `setRegistryName` 当 DataGen 保存配方
- ❌ `modLoc()` 与 `mcLoc()` 用反
- ❌ `SimpleCookingRecipeBuilder` / `.build(consumer)` / `registerRecipes` — 前者是 1.17+ 类名（1.15.2/1.16.5 official 构件都没有），后两个是 1.14 及更早 MCP 名；本档末端方法恰恰是 `.save(consumer)`（构件 javap 实证）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
