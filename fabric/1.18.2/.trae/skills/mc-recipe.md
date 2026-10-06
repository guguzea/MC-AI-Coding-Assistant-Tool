---
name: mc-recipe
description: Fabric 配方系统。ShapedRecipeJsonBuilder / FabricRecipeProvider。触发词：配方、Recipe、ShapedRecipe、ShapelessRecipe
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 配方系统（Fabric 1.18.2）

## 快速开始

通过 DataGen 生成配方（推荐），或手写 JSON。

### 通过 DataGen（推荐）

```java
public class MyRecipeProvider extends FabricRecipeProvider {
    // 1.18.2 的构造入参是 FabricDataGenerator（本档还没有 FabricDataOutput，它自 1.19.4 起才有）
    public MyRecipeProvider(FabricDataGenerator generator) {
        super(generator);
    }

    // fabric-api 摘要：FabricRecipeProvider ⇒ protected abstract void generateRecipes(Consumer<RecipeJsonProvider> exporter)
    @Override
    protected void generateRecipes(Consumer<RecipeJsonProvider> exporter) { // Consumer 属 JDK java.util.function；本档语料没有 docs 正文可逐字对照
        // 1.18.2 的 create 只有 (ItemConvertible) / (ItemConvertible, int) 两形——RecipeCategory 重载本版还没有
        ShapedRecipeJsonBuilder.create(Items.DIAMOND_BLOCK)
            .pattern("AAA")
            .pattern("A A")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
            .criterion("has_diamond", conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
    }
}
```

把产出换成你自己注册的物品时，形参名（`generator` / `exporter`）随你起 —— 它们是本例的局部名，不是 API 名。

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
  → datagen 生成配方 JSON

IF 在代码中动态创建配方
  → 仅用于自定义逻辑
```

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 |
| `mc-item` | 配方产出物品 |
| `mc-registry` | 配方引用已注册物品 |
