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
- 生成的 JSON 文件放在 `src/main/data/`（数据包）或 `src/main/resources/`（资源包）

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
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();

        if (event.includeServer()) {
            generator.addProvider(true, new ModBlockTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModItemTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output));
        }
        if (event.includeClient()) {
            generator.addProvider(true, new ModItemModelsProvider(output, event.getExistingFileHelper()));
            generator.addProvider(true, new ModBlockStatesProvider(output, event.getExistingFileHelper()));
        }
    }
}
```

### RecipeProvider 使用规范

- 使用 `ShapedRecipeBuilder` 和 `ShapelessRecipeBuilder` 创建配方
- 熔炉配方使用 `FurnaceRecipeProvider` 或 `SimpleCookingRecipeBuilder`
- 配方结果自动注册，**不需要**手动调用注册方法
- 配方 ID 格式：`minecraft:...`（原版）或 `{modid}:...`（mod）
- 必须调用 `.save(Consumer<FinishedRecipe>)` 保存

### LootTableProvider 使用规范

- 使用 `LootTableProvider` 子类管理掉落表
- `LootPool.Builder` 添加掉落池，`LootEntryItem` 添加物品掉落
- `LootFunction` 应用修饰器（如 `setCount`、`explosionDecay`）

---

## Decision Flow

### Decision: 生成什么类型的数据

```
IF 生成合成配方
  → 使用 RecipeProvider 子类
  → ShapedRecipeBuilder / ShapelessRecipeBuilder
  → 放到 data/{modid}/recipes/

IF 生成战利品表
  → 使用 LootTableProvider
  → LootPool.Builder
  → 放到 data/{modid}/loot_tables/blocks/

IF 生成方块标签（哪些方块可被某工具挖掘）
  → 使用 BlockTagsProvider
  → 放到 data/{modid}/tags/blocks/

IF 生成物品标签
  → 使用 ItemTagsProvider
  → 放到 data/{modid}/tags/items/

IF 生成物品模型（JSON）
  → 使用 ItemModelProvider
  → 放到 assets/{modid}/models/item/

IF 生成方块状态（BlockState JSON）
  → 使用 BlockStateProvider
  → 放到 assets/{modid}/blockstates/
```

### Decision: 配方类型选择

```
IF 配方有固定形状（工具、武器等）
  → ShapedRecipeBuilder
  → 定义行和列：.pattern("XXX").pattern(" X ").pattern(" X ")

IF 配方成分无固定位置（药水、染料混合等）
  → ShapelessRecipeBuilder
  → 用 .add() 添加成分

IF 熔炉烧制/烟熏/营火烧制
  → FurnaceRecipeProvider 或 SimpleCookingRecipeBuilder.smelting()

IF 用自定义工作台配方
  → 需要实现 IRecipe 或扩展现有配方
  → 需要自定义 Container 和 Screen
```

### Decision: 战利品表掉落方式

```
IF 固定掉落某物品
  → LootEntryItem.of(ItemStack)
  → .withCount(Function)

IF 掉落方块本身（方块被破坏时）
  → dropSelf()
  → 推荐用 DataGen 的 blockLootTables

IF 有条件的掉落（附魔工具挖掘等）
  → LootFunction
  → MatchTool + enchantment

IF 随机数量掉落
  → RandomValueRange
  → LootFunction.setCount

IF 掉落多个物品
  → 多个 LootEntry
```

---

## 示例：ModDataGenerators 入口

```java
// datagen/ModDataGenerators.java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();

        if (event.includeServer()) {
            generator.addProvider(true, new ModBlockTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModItemTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModRecipeProvider(output));
            generator.addProvider(true, new ModLootTableProvider(output));
        }
        if (event.includeClient()) {
            generator.addProvider(true, new ModItemModelsProvider(output, event.getExistingFileHelper()));
            generator.addProvider(true, new ModBlockStatesProvider(output, event.getExistingFileHelper()));
        }
    }
}
```

## 示例：合成配方

```java
// datagen/ModRecipes.java
public class ModRecipes extends RecipeProvider {
    public ModRecipes(PackOutput output, Collection<IConsumer<FinishedRecipe>> consumer) {
        super(output, consumer);
    }

    @Override
    protected void registerRecipes() {
        // 有形状配方
        ShapedRecipeBuilder.shapedRecipe(ModItems.MY_ITEM.get())
            .patternLine(" X ")
            .patternLine(" X ")
            .patternLine(" Y ")
            .key('X', Items.DIAMOND)
            .key('Y', Items.STICK)
            .addCriterion("has_diamond", hasItem(Items.DIAMOND))
            .buildRecipe(consumer);

        // 无形状配方
        ShapelessRecipeBuilder.shapelessRecipe(ModItems.OTHER_ITEM.get())
            .addIngredient(Items.GOLD_INGOT, 3)
            .addIngredient(Items.DIAMOND)
            .addCriterion("has_gold", hasItem(Items.GOLD_INGOT))
            .buildRecipe(consumer);
    }
}
```

## 示例：战利品表

```java
// datagen/ModLootTables.java
public class ModLootTables extends LootTableProvider {
    public ModLootTables(PackOutput output, Collection<IConsumer<FinishedRecipe>> consumer) {
        super(output, consumer);
    }

    @Override
    protected List<SubProviderEntry> getTables() {
        return Collections.singletonList(
            new SubProviderEntry(ModBlockLootTables::new, LootContextParamSets.BLOCK)
        );
    }

    public static class ModBlockLootTables extends LootTableManager.BlockLootTable {
        @Override
        protected void addTables() {
            // 简单掉落：破坏方块后掉落该方块物品
            dropSelf(ModBlocks.MY_BLOCK.get());

            // 自定义掉落
            this.add(ModBlocks.SPECIAL_BLOCK.get(),
                createSingleItemTable(ModItems.SPECIAL_DROP.get(), RandomValueRange.of(1, 3))
            );
        }
    }
}
```

## 示例：方块标签

```java
// datagen/ModTags.java
public class ModBlockTagsProvider extends BlockTagsProvider {
    public ModBlockTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookup) {
        super(output, lookup);
    }

    @Override
    protected void registerTags() {
        getBuilder(BlockTags.MINEABLE_WITH_PICKAXE)
            .add(ModBlocks.MY_BLOCK.get());
    }
}
```

> 注意：标签需要正确的命名空间。在 Forge 1.15.2 中，`#minecraft:xxx` 是原版标签，`#forge:xxx` 是 Forge 通用标签，`#{modid}:xxx` 是 mod 专属标签。
