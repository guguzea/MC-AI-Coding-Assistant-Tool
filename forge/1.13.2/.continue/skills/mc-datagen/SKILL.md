---
name: mc-datagen
description: Minecraft Forge 数据生成器。Forge 1.13.2 DataGen 有限，手动编写 JSON 为主。触发词：DataGen、DataGenerator、数据包、资源包
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 数据生成器（Forge 1.13.2）

## 约束

Forge 1.13.2 的 DataGen API 相对基础，大部分资源文件需要**手动编写 JSON**。

### 生成时机

数据生成在 Gradle 任务 `./gradlew runData` 或 `build` 期间执行。

### 目录结构

```
src/main/resources/
├── assets/{modid}/
│   ├── blockstates/
│   ├── models/
│   ├── textures/
│   └── lang/
└── data/{modid}/
    ├── recipes/
    └── loot_tables/
```

## 手动编写的资源文件

### BlockState JSON

文件：`assets/{modid}/blockstates/my_block.json`

```json
{
  "variants": {
    "": { "model": "modid:block/my_block" }
  }
}
```

### ItemModel JSON

文件：`assets/{modid}/models/item/my_item.json`

```json
{
  "parent": "modid:block/my_block"
}
```

### 配方 JSON

文件：`data/{modid}/recipes/my_recipe.json`

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    " X ",
    " X ",
    " Y "
  ],
  "key": {
    "X": { "item": "minecraft:diamond" },
    "Y": { "item": "minecraft:stick" }
  },
  "result": { "item": "modid:my_item" }
}
```

## 常见错误

- ❌ 资源文件路径大小写错误
- ❌ JSON 格式不正确
- ❌ 配方 JSON 中 `result` 字段缺失

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可编写对应的 JSON |
| `mc-block` | 方块状态 JSON |
| `mc-item` | 物品模型 JSON |
