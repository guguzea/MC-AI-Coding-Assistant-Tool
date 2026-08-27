---
name: mc-recipe
description: Fabric 配方系统。手写 JSON 配方文件。触发词：配方、Recipe、ShapedRecipe、ShapelessRecipe
platform: fabric
version: "1.16.5"
dependencies: []
mappings: yarn
---

# 配方系统（Fabric 1.16.5）

## 快速开始

本版没有可用的 fabric-datagen 配方 provider（或不应依赖它）。把 JSON 放到数据包目录。

### 手写配方 JSON（推荐）

```json
// src/main/resources/data/examplemod/recipes/my_recipe.json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "AAA",
    "A A",
    "AAA"
  ],
  "key": {
    "A": { "item": "minecraft:diamond" }
  },
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```

### 手动注册（不推荐）

```java
@Override
public void onInitialize() {
    // 通常不推荐在代码里动态塞原版配方；数据包更灵活
}
```

## Decision: 选择方式

```
IF 使用配方数据
  → 手写 JSON 到 data/{modid}/recipes/

IF 在代码中动态创建配方
  → 仅用于自定义逻辑；不要编造 offerShapedRecipe
```

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | 本版以手写 JSON 为主 |
| `mc-item` | 配方产出物品 |
| `mc-registry` | 配方引用已注册物品 |
