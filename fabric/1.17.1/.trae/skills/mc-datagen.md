---
name: mc-datagen
description: Fabric 数据生成器。DataGeneratorInitializer、fabric-datagen-api。触发词：DataGen、DataGenerator、RecipeProvider
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.17.1）

## 概述

> ⚠️ **推荐**：1.17.1 的 DataGen API 较繁琐且实验性强，**推荐直接手写 JSON 文件**到 `src/main/resources/` 目录。

## 直接手写 JSON（推荐）

### 生成物品模型 JSON

```json
// src/main/resources/assets/examplemod/models/item/my_item.json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "examplemod:item/my_item"
  }
}
```

### 生成配方 JSON

```json
// src/main/resources/data/examplemod/recipes/my_recipe.json
{
  "type": "minecraft:crafting_shaped",
  "pattern": ["AAA", "A A", " AAA"],
  "key": { "A": { "item": "minecraft:diamond" } },
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

### 生成语言文件

```json
// src/main/resources/assets/examplemod/lang/en_us.json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block"
}
```

## Decision: 选择生成方式

```
IF 生成 物品/方块模型、配方、语言文件
  → 推荐直接手写 JSON 到 src/main/resources/
  → 避免复杂的 DataGen 配置

IF 必须使用 DataGen（保持代码驱动）
  → 引入 fabric-datagen-api-v0
  → ⚠️ 1.17.1 DataGen API 是实验性的
```

## DataGen（可选）

```groovy
// build.gradle
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-datagen-api-v0:0.7.3+1.17.1"
}
```

```json
// fabric.mod.json
{
  "entrypoints": {
    "init": ["com.example.examplemod.MyDatagen"]
  }
}
```

## 常见错误

- ❌忘记在 `fabric.mod.json` 中注册 `init` — DataGen 不执行
- ❌手动编辑 DataGen 输出目录 — 文件会被重新生成覆盖
- ❌忘记添加 datagen 依赖 — DataGenerator 接口不存在

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | 手写物品模型 JSON |
| `mc-block` | 手写方块模型和掉落表 JSON |
| `mc-registry` | 配方引用已注册的物品 |
