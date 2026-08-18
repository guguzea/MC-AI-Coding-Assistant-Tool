---
name: mc-datagen
description: Fabric 1.14.4 没有 fabric-datagen。手写 JSON 到 resources。触发词：DataGen、DataGenerator、配方 JSON、模型 JSON
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.14.4）

## 快速开始

本版 **没有** `DataGeneratorEntrypoint`。不要写 `DataGeneratorInitializer`、`init_data`、`ExistingFileHelper`。

把 JSON 放到 `src/main/resources/`：

```json
// assets/examplemod/models/item/my_item.json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "examplemod:item/my_item"
  }
}
```

```json
// data/examplemod/recipes/my_recipe.json
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

## Decision: 选择生成内容

```
IF 生成模型 JSON
  → assets/{modid}/models/

IF 生成配方
  → data/{modid}/recipes/

IF 生成战利品表
  → data/{modid}/loot_tables/

IF 生成语言文件
  → assets/{modid}/lang/
```

## 常见错误

- ❌ 去注册 `fabric-datagen` / `init_data` — 1.14.4 没有该入口
- ❌ 抄 1.20 的 `FabricRecipeProvider` 到本档
- ❌ 语言文件放错目录 — 应在 `assets/{modid}/lang/`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | 手写物品模型 JSON |
| `mc-block` | 手写方块模型和掉落表 JSON |
| `mc-registry` | 配方引用已注册的物品 |
