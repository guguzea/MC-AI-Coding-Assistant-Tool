# DataGen 模式（Fabric 1.20.1）

## 模式 1：语言文件生成

```yaml
模式: Language Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorEntrypoint]
---
public class MyEnLangProvider extends FabricLanguageProvider {
    public MyEnLangProvider(FabricDataOutput output) { super(output); }
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
    public MyRecipeProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generate(Consumer<RecipeJsonProvider> exporter) {
        ShapelessRecipeJsonBuilder.create(RecipeCategory.MISC, MY_ITEM)
            .input(Items.DIAMOND)
            .input(Items.GOLD_INGOT)
            .criterion("has_diamond", conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
        ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, MY_TOOL)
            .pattern("AAA")
            .pattern("A A")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
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
    public MyBlockLootProvider(FabricDataOutput output) { super(output); }
    @Override
    public void generate() {
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
public class MyItemTagProvider extends FabricTagProvider.ItemTagProvider {
    public MyItemTagProvider(FabricDataOutput output,
                             CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void configure(RegistryWrapper.WrapperLookup lookup) {
        getOrCreateTagBuilder(MY_ITEM_TAG).add(MY_ITEM);
    }
}
```
