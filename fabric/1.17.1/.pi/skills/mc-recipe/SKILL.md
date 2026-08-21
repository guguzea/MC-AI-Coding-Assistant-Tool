---
name: mc-recipe
description: Fabric 配方系统。手写 JSON 配方文件。触发词：配方、Recipe、ShapedRecipe、ShapelessRecipe
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 配方系统（Fabric 1.17.1）

## 快速开始

> ⚠️ **推荐**：在 1.17.1 中直接手写 JSON 配方文件，而非使用 DataGen。

### 手写配方 JSON

```json
// src/main/resources/data/examplemod/recipes/my_recipe.json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "AAA",
    "A A",
    " AAA"
  ],
  "key": {
    "A": {
      "item": "minecraft:diamond"
    }
  },
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```

### 无序配方

```json
// src/main/resources/data/examplemod/recipes/my_shapeless_recipe.json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "minecraft:diamond" },
    { "item": "minecraft:stick" }
  ],
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```

## Decision: 选择方式

```
IF 使用配方数据
  → 手写 JSON 到 src/main/resources/data/{modid}/recipes/

IF 在代码中动态创建配方
  → 几乎不需要，通常使用 JSON
```

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | 配方产出物品 |
| `mc-registry` | 配方引用已注册物品 |
