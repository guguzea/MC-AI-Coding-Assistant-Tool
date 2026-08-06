---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成方块状态、物品模型、配方、战利品表、标签、进度、语言文件。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、AdvancementProvider、LanguageProvider
---

# 数据生成器（Forge 1.18.2）

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

## 配方生成

```java
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, registries);
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

## 战利品表

```java
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

## pack_format 注意（1.18.2）

1.18.2 的 pack_format = **8**（Caves & Cliffs）。

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
