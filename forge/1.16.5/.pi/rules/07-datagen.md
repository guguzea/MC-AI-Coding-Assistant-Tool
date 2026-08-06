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
- 生成的 JSON 文件放在 `src/generated/resources/`（数据生成器自动处理）

### 目录结构

```
src/main/java/
└── {package}/
    └── datagen/
        ├── ModDataGenerators.java      # 入口类
        ├── ModBlockStates.java          # 方块状态数据
        ├── ModItemModels.java           # 物品模型
        ├── ModRecipes.java              # 合成配方
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
            generator.addProvider(new ModBlockTagsProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(new ModItemTagsProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(new ModRecipeProvider(output, MOD_ID));
        }
        if (event.includeClient()) {
            generator.addProvider(new ModItemModelsProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(new ModBlockStatesProvider(output, MOD_ID, event.getExistingFileHelper()));
        }
    }
}
```

### RecipeProvider 使用规范

- 使用 `ShapedRecipeBuilder` 和 `ShapelessRecipeBuilder` 创建配方
- 熔炉配方使用 `FurnaceRecipeProvider` 或直接在 `buildRecipes` 中使用 `CookingRecipeBuilder`
- 配方结果自动注册，**不需要**手动调用注册方法
- 配方 ID 格式：`minecraft:...`（原版）或 `{modid}:...`（mod）
- 必须调用 `.save(Consumer<FinishedRecipe>)` 保存

---

## Decision Flow

### Decision: 生成什么类型的数据

```
IF 生成合成配方
  → 使用 RecipeProvider 子类
  → ShapedRecipeBuilder / ShapelessRecipeBuilder / CookingRecipeBuilder
  → 放到 data/{modid}/recipes/

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
  → 用 .ingredient() 添加成分

IF 熔炉烧制/烟熏/营火烧制
  → 在 RecipeProvider.buildRecipes() 中使用：
  → CookingRecipeBuilder.smelting()
  → CookingRecipeBuilder.smoking()
  → CookingRecipeBuilder.campfireCooking()

IF 用自定义工作台配方
  → 需要实现 IRecipe 或扩展现有配方
  → 需要自定义 Container 和 Screen
```

---

## 示例：ModDataGenerators 入口

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();

        if (event.includeServer()) {
            generator.addProvider(new ModRecipeProvider(output, MOD_ID));
            generator.addProvider(new ModBlockTagsProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(new ModItemTagsProvider(output, MOD_ID, event.getExistingFileHelper()));
        }
        if (event.includeClient()) {
            generator.addProvider(new ModItemModelsProvider(output, MOD_ID, event.getExistingFileHelper()));
            generator.addProvider(new ModBlockStatesProvider(output, MOD_ID, event.getExistingFileHelper()));
        }
    }
}
```

## 示例：合成配方

```java
// datagen/ModRecipeProvider.java
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(PackOutput output, String modId) {
        super(output, modId);
    }

    @Override
    protected void registerRecipes() {
        // 有形状配方
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, ModItems.MY_ITEM.get())
            .pattern(" X ")
            .pattern(" X ")
            .pattern(" Y ")
            .define('X', Items.DIAMOND)
            .define('Y', Items.STICK)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(consumer);

        // 无形状配方
        ShapelessRecipeBuilder.shapeless(RecipeCategory.MISC, ModItems.OTHER_ITEM.get())
            .ingredient(Items.GOLD_INGOT, 3)
            .ingredient(Items.DIAMOND)
            .unlockedBy("has_gold", has(Items.GOLD_INGOT))
            .save(consumer);

        // 熔炉配方
        CookingRecipeBuilder.smelting(Ingredient.of(Items.DIRT),
                RecipeCategory.MISC, Items.DIAMOND, 0.1f, 200)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(consumer);
    }
}
```

## 示例：方块标签

```java
// datagen/ModBlockTagsProvider.java
public class ModBlockTagsProvider extends BlockTagsProvider {
    public ModBlockTagsProvider(PackOutput output, String modId, ExistingFileHelper existingFileHelper) {
        super(output, modId, existingFileHelper);
    }

    @Override
    protected void registerTags() {
        getOrCreateBuilder(BlockTags.MINEABLE_WITH_PICKAXE)
            .add(ModBlocks.MY_BLOCK.get());
    }
}

// datagen/ModItemTagsProvider.java
public class ModItemTagsProvider extends ItemTagsProvider {
    public ModItemTagsProvider(PackOutput output, String modId, ExistingFileHelper existingFileHelper) {
        super(output, modId, existingFileHelper);
    }

    @Override
    protected void registerTags() {
        getOrCreateBuilder(ItemTags.LOGS)
            .add(ModItems.MY_ITEM.get());
    }
}
```

> 注意：标签需要正确的命名空间。在 Forge 1.16.5 中，`#minecraft:xxx` 是原版标签，`#forge:xxx` 是 Forge 通用标签，`#{modid}:xxx` 是 mod 专属标签。
