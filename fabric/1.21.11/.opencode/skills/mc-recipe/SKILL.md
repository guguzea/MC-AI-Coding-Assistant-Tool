---
name: mc-recipe
description: Fabric 配方系统。ShapedRecipeJsonBuilder / FabricRecipeProvider。触发词：配方、Recipe、ShapedRecipe、ShapelessRecipe
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 配方系统（Fabric 1.21.11）

## 快速开始

通过 DataGen 生成配方（推荐），或手写 JSON。

### 通过 DataGen（推荐）

```java
public class MyRecipeProvider extends FabricRecipeProvider {
    public MyRecipeProvider(FabricDataOutput output,
                            CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    // 1.21.11：子类只造 vanilla 生成器，配方在返回对象的无参 generate() 里
    @Override
    protected RecipeGenerator getRecipeGenerator(RegistryWrapper.WrapperLookup registries,
                                                 RecipeExporter exporter) {
        return new RecipeGenerator(registries, exporter) {
            @Override
            protected void generate() {
                RegistryEntryLookup<Item> items = registries.getOrThrow(RegistryKeys.ITEM);
                ShapedRecipeJsonBuilder.create(items, RecipeCategory.MISC, MY_ITEM)
                    .pattern("AAA")
                    .pattern("A A")
                    .pattern(" A ")
                    .input('A', Items.DIAMOND)
                    .criterion(hasItem(Items.DIAMOND), conditionsFromItem(Items.DIAMOND))
                    .offerTo(exporter, RegistryKey.of(RegistryKeys.RECIPE,
                        Identifier.of("examplemod", "my_item")));
            }
        };
    }
}
```

完整口径与 Yarn↔Mojmap 对照见规则 `07-datagen` 「生成配方」。

在 `DataGeneratorEntrypoint` 里 `addProvider(MyRecipeProvider::new)`（1.18.2）或 `pack.addProvider(MyRecipeProvider::new)`（1.19.4+）。不要 `DataGeneratorInitializer`。

### 手动注册（不推荐）

```java
@Override
public void onInitialize() {
    // 通常不推荐，数据包更灵活
}
```

## Decision: 选择方式

```
IF 使用配方数据
  → DataGen 生成配方 JSON

IF 在代码中动态创建配方
  → 仅用于自定义逻辑
```

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 |
| `mc-item` | 配方产出物品 |
| `mc-registry` | 配方引用已注册物品 |
