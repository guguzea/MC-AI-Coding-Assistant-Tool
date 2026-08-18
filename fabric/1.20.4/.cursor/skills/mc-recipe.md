---
name: mc-recipe
description: Fabric 配方系统。ShapedRecipeJsonBuilder / FabricRecipeProvider。触发词：配方、Recipe、ShapedRecipe、ShapelessRecipe
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
---

# 配方系统（Fabric 1.20.4）

## 快速开始

通过 DataGen 生成配方（推荐），或手写 JSON。

### 通过 DataGen（推荐）

```java
public class MyRecipeProvider extends FabricRecipeProvider {
    public MyRecipeProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generate(Consumer<RecipeJsonProvider> exporter) {
        ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, MY_ITEM)
            .pattern("AAA")
            .pattern("A A")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
            .criterion("has_diamond", conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
    }
}
```

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
