---
name: mc-recipe
description: Fabric 26.1.2 配方。FabricRecipeProvider.createRecipeProvider、ShapedRecipeBuilder。触发词：配方、Recipe、ShapedRecipe
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 配方系统（Fabric 26.1.2）

## 快速开始

通过 DataGen（推荐）。Mojmap：`ShapedRecipeBuilder.shaped` + `define` + `unlockedBy` + `save`。

完整 `createRecipeProvider` 示例见 `07-datagen.mdc`。不要 Yarn 的 `ShapedRecipeJsonBuilder` / `offerTo`。

### 手动注册（不推荐）

```java
// 原版配方走数据包；不要在代码里编造 offerShapedRecipe
```

## Decision: 选择方式

```
IF 使用配方数据
  → DataGen FabricRecipeProvider

IF 动态自定义逻辑
  → 自定义 recipe serializer，而不是假 helper
```

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 |
| `mc-item` | 配方产出物品 |
| `mc-registry` | 配方引用已注册物品 |
