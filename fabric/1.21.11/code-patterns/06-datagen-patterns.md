# DataGen 模式（Fabric 1.21.11）

## 模式 1：语言文件生成

```yaml
模式: Language Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorInitializer]
---
public class MyLangProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // 生成英文语言文件
        output.add(Locale.ENGLISH,
            "item.examplemod.my_item", "My Item",
            "block.examplemod.my_block", "My Block",
            "entity.examplemod.my_entity", "My Entity",
            "itemGroup.examplemod.my_group", "My Items"
        );

        // 生成中文语言文件
        output.add(Locale.ZH_CN,
            "item.examplemod.my_item", "我的物品",
            "block.examplemod.my_block", "我的方块",
            "entity.examplemod.my_entity", "我的实体"
        );
    }
}
```

## 模式 2：配方生成

```yaml
模式: Recipe Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorInitializer]
---
public class MyRecipeProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // Shapeless 配方
        ShapelessRecipeJsonBuilder.create(
                RecipeProvider.getItemConvertible(MY_ITEM.get()), 1)
            .input(Items.DIAMOND)
            .input(Items.GOLD_INGOT)
            .criterion("has_diamond",
                conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);

        // Shaped 配方
        ShapedRecipeJsonBuilder.create(
                RecipeProvider.getItemConvertible(MY_TOOL.get()), 1)
            .pattern("AAA")
            .pattern(" A ")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
            .criterion("has_diamond",
                conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
    }
}
```

## 模式 3：战利品表生成

```yaml
模式: Loot Table Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorInitializer]
---
public class MyLootTableProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // 方块掉落表
        output.add(
            Registries.BLOCK.getId(MY_BLOCK.get()),
            BlockLootTableGenerator.dropsWithShears(MY_BLOCK.get())
        );

        // 自定义掉落表
        output.add(
            Registries.BLOCK.getId(MY_ORE.get()),
            LootTable.builder()
                .pool(LootPool.builder()
                    .rolls(ConstantLootNumberProvider.create(1))
                    .bonusRolls(UniformLootNumberProvider.create(0, 1))
                    .entry(ItemEntry.builder(MY_GEM.get())
                        .weight(1)
                        .build())
                    .entry(ItemEntry.builder(Items.DIAMOND)
                        .weight(1)
                        .build())
                    .condition(SurvivesExplosionLootCondition.builder())
                    .build())
                .build()
        );
    }
}
```

## 模式 4：标签生成

```yaml
模式: Tag Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorInitializer]
---
public class MyTagProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // 方块标签
        output.add(
            FabricTagProvider.getTagId(FabricTagKeys.BLOCKS),
            FabricTagBuilder.create()
                .add(Blocks.DIAMOND_BLOCK)
                .add(MY_BLOCK.get())
                .setReplace(false)
                .build()
        );

        // 物品标签
        output.add(
            FabricTagProvider.getTagId(FabricTagKeys.ITEMS),
            FabricTagBuilder.create()
                .add(Items.DIAMOND)
                .add(MY_ITEM.get())
                .setReplace(false)
                .build()
        );
    }
}
```
