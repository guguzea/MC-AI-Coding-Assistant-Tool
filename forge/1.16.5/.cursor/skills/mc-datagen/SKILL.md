---
name: mc-datagen
description: Minecraft Forge 数据生成器。生成方块状态、物品模型、配方、战利品表、标签、语言文件。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider、LanguageProvider
---

# 数据生成器（Forge 1.16.5）

## 快速开始

运行 DataGen：
```bash
./gradlew runData
```

生成内容在 `src/generated/resources/` 目录，**不要手动编辑**。

## 主类注册

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

## Decision: 选择 Provider

| 数据类型 | Provider 类 |
|----------|------------|
| 方块状态变体 | `BlockStateProvider`（自定义子类） |
| 方块/物品模型 | `ItemModelProvider`（自定义子类） |
| 配方 | `RecipeProvider` |
| 方块标签 | `BlockTagsProvider` |
| 物品标签 | `ItemTagsProvider` |
| 语言 | `LanguageProvider`（自定义子类） |

## 配方生成

```java
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(PackOutput output, String modId) {
        super(output, modId);
    }

    @Override
    protected void registerRecipes() {
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, ModItems.MY_ITEM.get())
            .pattern("ABA")
            .pattern("CDC")
            .pattern("ABA")
            .key('A', Items.DIAMOND)
            .key('B', Items.EMERALD)
            .key('C', Items.IRON_INGOT)
            .key('D', ModItems.MY_INGOT.get())
            .unlockedBy("has_item", has(ModItems.MY_INGOT.get()))
            .save(consumer);
    }
}
```

## 方块状态生成

```java
public class ModBlockStatesProvider extends BlockStateProvider {
    public ModBlockStatesProvider(PackOutput output, String modId, ExistingFileHelper efh) {
        super(output, modId, efh);
    }

    @Override
    protected void registerStatesAndModels() {
        // 无变体方块
        simpleBlock(ModBlocks.MY_BLOCK.get(),
            models().cubeAll(name(ModBlocks.MY_BLOCK.get()), modLoc("block/my_block"))
        );
    }
}
```

## 物品模型（来自方块）

```java
public class ModItemModelsProvider extends ItemModelProvider {
    public ModItemModelsProvider(PackOutput output, String modId, ExistingFileHelper existingFileHelper) {
        super(output, modId, existingFileHelper);
    }

    @Override
    protected void registerModels() {
        // 使用已有的方块模型作为物品模型
        withExistingParent(name(ModItems.MY_BLOCK_ITEM.get()),
            modLoc("block/my_block"));
    }
}
```

## 语言生成

```java
public class ModLanguageProvider extends LanguageProvider {
    public ModLanguageProvider(PackOutput output, String locale) {
        super(output, MOD_ID, locale);
    }

    @Override
    protected void registerTranslations() {
        // 添加翻译键值对
        add("item." + MOD_ID + ".my_item", "My Item");
        add("block." + MOD_ID + ".my_block", "My Block");
    }
}
```

## 常见错误

- ❌ 手动编辑 `src/generated/resources/`（DataGen 重新运行会覆盖）
- ❌ 标签 Provider 依赖顺序错误（标签必须在配方之前）
- ❌ `modLoc()` vs `mcLoc()`：mod 内容用 `modLoc`，Minecraft 内容用 `mcLoc`

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
