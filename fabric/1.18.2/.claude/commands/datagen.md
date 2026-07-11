# Fabric 数据生成命令参考

本文件描述 Fabric 1.18.2 平台上进行数据生成（Data Generation）时所需掌握的核心 API 和常用命令。

## 基础配置命令

### 依赖添加命令

在 `build.gradle` 中添加数据生成 API 依赖：

```groovy
dependencies {
    modApi "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1+1.18.2"
}
```

`modApi` 确保依赖被传递到其他依赖本模组的模组。如果只是本模组自己使用数据生成，也可以使用 `modImplementation`。

### DataGeneratorInitializer 创建命令

创建数据生成器入口点类，实现 `DataGeneratorInitializer` 接口：

```java
public class MyDatagen implements DataGeneratorInitializer {
    @Override
    public void initialize(RegistryWrapper.WrapperLookup registries,
                          DataGenerator generator,
                          Pack.Output output,
                          ExistingFileHelper existingFileHelper) {
        // 在这里注册各类型的数据生成器
    }
}
```

`registries` 提供对游戏注册表的只读访问，`generator` 用于添加生成器，`output` 指定输出位置，`existingFileHelper` 用于检查文件是否存在。

### fabric.mod.json 配置命令

在 `fabric.mod.json` 中注册数据生成器入口点：

```json
{
  "entrypoints": {
    "main": ["com.example.ExampleMod"],
    "init_data": ["com.example.ExampleModClient"]  // 这里
  }
}
```

`init_data` 是 Fabric 约定的数据生成入口点名称。运行 `./gradlew runDatagen` 时会调用所有 `init_data` 入口点。

## 运行命令

### Gradle 任务命令

数据生成通过 Gradle 任务执行：`./gradlew runDatagen` 运行数据生成器，`./gradlew cleanDatagen` 清理生成的数据文件。生成的数据默认输出到 `src/generated/resources/` 目录。Loom 会自动将这些文件合并到最终的 Minecraft 资源包和 datapack 中。

### 增量生成命令

Loom 的数据生成器支持增量生成，只会重新生成修改过的文件。使用 `./gradlew runDatagen --no-build-cache` 强制重新生成所有数据。在开发过程中，修改某个方块的代码后只需重新生成该方块相关的模型文件即可。

## 模型生成命令

### BlockModelProvider 方块模型命令

创建方块模型生成器，实现 `FabricDataGenerator.PackFactory` 接口：

```java
public class MyBlockModelProvider implements FabricDataGenerator.PackFactory {
    @Override
    public void generateFabricData(GeneratorContext context) {
        RegistryWrapper.Impl<Block> blockRegistry = context.getRegistryManager().get(Registries.BLOCK);
        PackOutput output = context.getPackOutput();
        
        BlockModelGenerator modelGenerator = BlockModelGenerator.of(
            output,
            ResourceCrossSource.of(context.getResourceFactory()),
            blockRegistry
        );
        modelGenerator.registerItemAndBlockItems(EXAMPLE_BLOCK.get(), BlockTextureMapping.COLOR);
        modelGenerator.generate();
    }
}
```

### ItemModelProvider 物品模型命令

物品模型生成可以使用预设模板：

```java
public class MyItemModelProvider implements FabricDataGenerator.PackFactory {
    @Override
    public void generateFabricData(GeneratorContext context) {
        // 生成手持物品模型
        ExistingFileHelper existingFileHelper = context.getExistingFileHelper();
        PackOutput output = context.getPackOutput();
        
        // 使用 Models.HANDHELD_ITEM 生成手持模型
        // 使用 Models.GENERATED 生成悬浮模型
    }
}
```

## 配方生成命令

### RecipeProvider 配方生成命令

使用 `RecipeProvider` 辅助类生成合成配方：

```java
ShapedRecipeJsonBuilder.create(
    RecipeCategory.MISC,
    ExampleModItems.MY_ITEM.get(),  // 输出物品
    1
)
.pattern("ABA")
.pattern(" B ")
.pattern(" B ")
.input('A', Items.DIAMOND)  // 'A' = 钻石
.input('B', Items.STICK)    // 'B' = 棍子
.criterion("has_diamond", 
    RecipeProvider.conditionsFromItem(Items.DIAMOND))
.offerTo(exporter);  // exporter 是 GeneratorFabricApis.Exporter
```

### ShapelessRecipeJsonBuilder 无形配方命令

无形配方（自由摆放配方）：

```java
ShapelessRecipeJsonBuilder.create(
    RecipeCategory.MISC,
    ExampleModItems.MY_ITEM.get(),
    1
)
.input(Items.DIAMOND)
.input(Items.GOLD_INGOT)
.criterion("has_gold", 
    RecipeProvider.conditionsFromItem(Items.GOLD_INGOT))
.offerTo(exporter);
```

### SmithingRecipeJsonBuilder 锻造配方命令

下界合金锻造配方：

```java
SmithingRecipeJsonBuilder.create(
    ExampleModItems.DIAMOND_PICKAXE.get(),  // 模板
    Items.DIAMOND_PICKAXE,                   // 基础物品
    Items.NETHERITE_INGOT,                    // 添加物品
    RecipeCategory.EQUIPMENT,
    ExampleModItems.NETHERITE_PICKAXE.get()
)
.criterion("has_netherite_ingot",
    RecipeProvider.conditionsFromItem(Items.NETHERITE_INGOT))
.offerTo(exporter);
```

## 战利品表生成命令

### BlockLootTableGenerator 方块掉落命令

生成方块掉落表：

```java
public class MyLootTableProvider implements FabricDataGenerator.PackFactory {
    @Override
    public void generateFabricData(GeneratorContext context) {
        RegistryWrapper.Impl<Block> blockRegistry = context.getRegistryManager().get(Registries.BLOCK);
        PackOutput output = context.getPackOutput();
        
        LootTableProvider.SubpacketEntryGenerator blockLootTables = 
            LootTableProvider.of(blockRegistry, output);
        blockLootTables.addBlock(EXAMPLE_BLOCK.get(),
            BlockLootTableGenerator.dropsWithShears(EXAMPLE_BLOCK.get()));
        blockLootTables.generate();
    }
}
```

### 自定义掉落命令

自定义掉落规则：

```java
BlockLootTableGenerator.dropsWithProperty(
    block,
    LootPool.builder()
        .rolls(ConstantLootNumberProvider.create(1))
        .with(ItemEntry.builder(ExampleModItems.MY_ITEM.get())
            .apply(SetCountLootFunction.builder(
                UniformLootNumberProvider.create(1, 3)))))
);
```

## 标签生成命令

### FabricTagBuilder 标签构建命令

生成方块或物品标签：

```java
FabricTagBuilder<Block> blockTagBuilder = FabricTagProvider.getOrCreateTagBuilder(
    FabricTagKeys.BLOCKS, 
    new Identifier(MOD_ID, "my_tag")
);
blockTagBuilder.add(Blocks.DIAMOND_BLOCK);
blockTagBuilder.add(Blocks.EMERALD_BLOCK);
blockTagBuilder.forceAdd();  // 使标签为必需
```

物品标签使用 `FabricTagKeys.ITEMS`，工具标签使用 `FabricToolTags` 预设。

## 语言文件生成命令

### LanguageGenerator 语言生成命令

生成多语言文件：

```java
public class MyLangProvider implements FabricDataGenerator.PackFactory {
    @Override
    public void generateFabricData(GeneratorContext context) {
        RegistryWrapper.Impl<Item> itemRegistry = context.getRegistryManager().get(Registries.ITEM);
        PackOutput output = context.getPackOutput();
        
        LanguageGenerator langGenerator = LanguageGenerator.of(output, Locale.EN_US);
        
        itemRegistry.forEach(item -> {
            langGenerator.add(item, "Item Name");
        });
        langGenerator.generate();
    }
}
```

使用 `Locale` 枚举指定语言：`EN_US`、`ZH_CN`、`ZH_TW`、`JA_JP` 等。

## 进度生成命令

### AdvancementProvider 进度命令

生成自定义进度（advancement）：

```java
public class MyAdvancementProvider implements FabricDataGenerator.PackFactory {
    @Override
    public void generateFabricData(GeneratorContext context) {
        RegistryWrapper.Impl<Item> itemRegistry = context.getRegistryManager().get(Registries.ITEM);
        PackOutput output = context.getPackOutput();
        
        AdvancementGenerator advancementGenerator = AdvancementGenerator.of(
            output,
            ResourceCrossSource.of(context.getResourceFactory())
        );
        
        advancementGenerator.addAdvancement(
            new Identifier(MOD_ID, "my_advancement"),
            Advancement.builder()
                .display(ExampleModItems.MY_ITEM.get(),
                    Text.literal("My Advancement"),
                    Text.literal("Description"),
                    new Identifier("textures/gui/advancements/backgrounds/stone.png"),
                    FrameType.TASK,
                    true, true, false)
                .criterion("has_item", InventoryChangedCriterion.Instance(
                    ItemPredicate.Builder.create().items(ExampleModItems.MY_ITEM.get()).build()))
                .parent(new Identifier("minecraft:story/root"))
                .rewards(AdvancementRewards.Builder.recipe(
                    RecipeId.getItemId(ExampleModItems.MY_ITEM.get())))
        );
        advancementGenerator.generate();
    }
}
```

## 注意事项

生成的文件会自动写入 `src/generated/resources/` 目录，由 Loom 管理。**禁止**手动编辑这些文件，因为它们会在下次运行数据生成时被覆盖。源代码文件应保留在 `src/main/resources/` 目录，只有手动编写的静态资源（如自定义纹理）才放在那里。数据生成器优先使用 `ExistingFileHelper` 检查已存在的文件，避免重复生成。
