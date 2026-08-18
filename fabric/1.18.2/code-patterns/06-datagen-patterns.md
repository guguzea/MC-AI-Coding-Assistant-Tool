# DataGen 模式（Fabric 1.18.2）

## 模式 1：语言文件生成

```yaml
模式: Language Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorEntrypoint]
---
public class MyEnLangProvider extends FabricLanguageProvider {
    public MyEnLangProvider(FabricDataGenerator g) { super(g); }
    @Override
    public void generateTranslations(TranslationBuilder translationBuilder) {
        translationBuilder.add(MY_ITEM, "My Item");
        translationBuilder.add(MY_BLOCK, "My Block");
        translationBuilder.add(MY_ENTITY, "My Entity");
        translationBuilder.add("itemGroup.examplemod.my_group", "My Items");
    }
}
```

## 模式 2：配方生成

```yaml
模式: Recipe Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorEntrypoint]
---
public class MyRecipeProvider extends FabricRecipeProvider {
    public MyRecipeProvider(FabricDataGenerator g) { super(g); }

    @Override
    protected void generateRecipes(Consumer<RecipeJsonProvider> exporter) {
        ShapedRecipeJsonFactory.create(MY_TOOL)
            .pattern("AAA")
            .pattern("A A")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
            .criterion("has_diamond", conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);

        ShapelessRecipeJsonFactory.create(MY_ITEM)
            .input(Items.DIAMOND)
            .input(Items.GOLD_INGOT)
            .criterion("has_diamond", conditionsFromItem(Items.DIAMOND))
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
扩展点: [DataGeneratorEntrypoint]
---
public class MyBlockLootProvider extends FabricBlockLootTableProvider {
    public MyBlockLootProvider(FabricDataGenerator g) { super(g); }
    @Override
    protected void generateBlockLootTables() {
        addDrop(MY_BLOCK);
        addDrop(MY_ORE, oreDrops(MY_ORE, MY_GEM));
    }
}
```

## 模式 4：标签生成

```yaml
模式: Tag Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorEntrypoint]
---
# 手写 tags JSON，或查本版 FabricTagProvider
{
  "replace": false,
  "values": [
    "minecraft:diamond",
    "examplemod:my_item"
  ]
}
```
