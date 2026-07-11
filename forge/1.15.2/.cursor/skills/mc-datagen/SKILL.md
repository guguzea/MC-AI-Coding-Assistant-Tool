---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成方块状态、物品模型、配方、战利品表、标签。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、RecipeProvider
---

# 数据生成器（Forge 1.15.2）

## 快速开始

运行 DataGen：
```bash
./gradlew runData
```

生成内容在 `build/cache/` 或 `src/generated/` 目录，**不要手动编辑**。

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
                new ModItemTagsProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModRecipeProvider(output, event.getLookupProvider()));
            generator.addProvider(true, new ModLootTableProvider(output, event.getLookupProvider()));
        }

        if (event.includeClient()) {
            generator.addProvider(true, new ModItemModelProvider(output, event.getExistingFileHelper()));
            generator.addProvider(true, new ModBlockStateProvider(output, event.getExistingFileHelper()));
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
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider` |

## 配方生成

```java
public class ModRecipes extends RecipeProvider {
    public ModRecipes(PackOutput output, Collection<IConsumer<FinishedRecipe>> consumer) {
        super(output, consumer);
    }

    @Override
    protected void registerRecipes() {
        ShapedRecipeBuilder.shapedRecipe(ModItems.MY_ITEM.get())
            .patternLine("ABA")
            .patternLine("CDC")
            .patternLine("ABA")
            .key('A', Items.DIAMOND)
            .key('B', Items.EMERALD)
            .key('C', Items.IRON_INGOT)
            .addCriterion("has_item", hasItem(ModItems.MY_INGOT.get()))
            .buildRecipe(consumer);
    }
}
```

## 方块状态生成

```java
public class ModBlockStateProvider extends BlockStateProvider {
    public ModBlockStateProvider(PackOutput output, ExistingFileHelper efh) {
        super(output, MOD_ID, efh);
    }

    @Override
    protected void registerStatesAndModels() {
        // 无变体方块
        simpleBlock(ModBlocks.MY_BLOCK.get(),
            models().cubeAll(name(ModBlocks.MY_BLOCK.get()), modLoc("block/my_block"))
        );
    }

    private String name(Block block) {
        return block.getRegistryName().getPath();
    }
}
```

## 战利品表

```java
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
            dropSelf(ModBlocks.MY_BLOCK.get());
        }
    }
}
```

## 常见错误

- ❌ 手动编辑生成的文件（重新运行会覆盖）
- ❌ 标签 Provider 依赖顺序错误（标签必须在配方之前）
- ❌ `modLoc()` vs `mcLoc()`：mod 内容用 `modLoc`，Minecraft 内容用 `mcLoc`

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI 读取 |
