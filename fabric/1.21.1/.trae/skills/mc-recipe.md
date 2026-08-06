---
name: mc-recipe
description: Fabric 配方系统。ShapedRecipeJsonBuilder、ShapelessRecipeJsonBuilder。触发词：配方、Recipe、ShapedRecipe、ShapelessRecipe
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# 配方系统（Fabric 1.21.1）

## 快速开始

通过 DataGen 生成配方（推荐），或手动注册。

### 通过 DataGen（推荐）

```java
// 在 DataGeneratorInitializer 中
public class MyRecipeProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        offerShapedRecipe(output, "my_recipe", MY_ITEM.get(), """
            AAA
            A A
            AAA
            """,
            Map.of('A', Registries.ITEM.getId(Items.DIAMOND))
        );
    }
}
```

### 手动注册（不推荐）

```java
// 在 onInitialize() 中
@Override
public void onInitialize() {
    // 手动注册（通常不推荐，数据包更灵活）
}
```

## Decision: 选择方式

```
IF 使用配方数据
  → DataGen 生成配方 JSON

IF 在代码中动态创建配方
  → 手动注册（仅用于自定义逻辑）
```

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 |
| `mc-item` | 配方产出物品 |
| `mc-registry` | 配方引用已注册物品 |
