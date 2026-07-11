# Fabric 配方系统命令参考

本文件描述 Fabric 1.17.1 平台上进行配方（Recipe）系统开发时所需掌握的核心 API 和常用命令。

## 配方概述

> ⚠️ **推荐**：1.17.1 中推荐直接手写 JSON 配方文件。DataGen API 在 1.17.x 中较繁琐且实验性强。

## 手动生成配方 JSON（推荐）

### 有形配方

```json
// src/main/resources/data/examplemod/recipes/my_recipe.json
{
  "type": "minecraft:crafting_shaped",
  "pattern": ["AAA", "A A", " AAA"],
  "key": { "A": { "item": "minecraft:diamond" } },
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

### 无形配方

```json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "minecraft:diamond" },
    { "item": "minecraft:stick" }
  ],
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

### 熔炉配方

```json
{
  "type": "minecraft:smelting",
  "ingredient": { "item": "minecraft:raw_iron" },
  "result": "minecraft:iron_ingot",
  "experience": 0.7,
  "cookingtime": 200
}
```

### 形状规则

有形配方规则：
- 最多 3 行，每行最多 3 个字符
- 相同字符表示相同材料
- 空格表示空位
- 配方会自动镜像

## DataGen（如必须使用）

### 依赖配置

```groovy
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-datagen-api-v0:0.7.3+1.17.1"
}
```

> ⚠️ **1.17.1 DataGen API 与 1.20.x 差异很大**，参考 Minecraft 原版源码和 Fabric API 源码了解具体用法。
