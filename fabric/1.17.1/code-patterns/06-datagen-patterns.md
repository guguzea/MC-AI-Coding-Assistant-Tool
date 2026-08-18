# DataGen 模式（Fabric 1.17.1）

## 模式 1：语言文件生成

```yaml
模式: Language Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorEntrypoint]
---
# 推荐手写 assets/examplemod/lang/en_us.json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block",
  "entity.examplemod.my_entity": "My Entity"
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
public class MyRecipeProvider extends FabricRecipesProvider {
    public MyRecipeProvider(FabricDataGenerator g) { super(g); }

    @Override
    protected void generateRecipes(Consumer<RecipeJsonProvider> exporter) {
        ShapedRecipeJsonFactory.create(MY_ITEM)
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
# 1.17.1 索引里没有 FabricBlockLootTableProvider；手写 loot JSON
# data/examplemod/loot_tables/blocks/my_block.json
```

## 模式 4：标签生成

```yaml
模式: Tag Generation
平台: Fabric
分类: datagen
依赖: [fabric-datagen-api-v0]
扩展点: [DataGeneratorEntrypoint]
---
# 手写 data/examplemod/tags/items/my_items.json
{
  "replace": false,
  "values": [
    "minecraft:diamond",
    "examplemod:my_item"
  ]
}
```
