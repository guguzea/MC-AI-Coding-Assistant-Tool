# DataGen 快速参考（Forge 1.13.2）

> Forge 1.13.2 的 DataGen API 相对基础，大部分资源文件需要**手动编写 JSON**。

## 模式: Manual BlockState JSON

```yaml
模式: Manual BlockState JSON
版本: Forge 1.13.2
平台: Forge
分类: datagen
依赖: []
扩展点: [方块模型]
---
文件: src/main/resources/assets/{modid}/blockstates/{block}.json

{
  "variants": {
    "": { "model": "{modid}:block/{block}" }
  }
}
```

## 模式: Manual ItemModel JSON

```yaml
模式: Manual ItemModel JSON
版本: Forge 1.13.2
平台: Forge
分类: datagen
依赖: []
扩展点: [物品模型]
---
文件: src/main/resources/assets/{modid}/models/item/{item}.json

{
  "parent": "{modid}:block/{block}"
}
```

## 模式: Manual Recipe JSON

```yaml
模式: Manual Recipe JSON
版本: Forge 1.13.2
平台: Forge
分类: datagen
依赖: []
扩展点: [配方]
---
文件: src/main/resources/data/{modid}/recipes/{recipe}.json

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
  "result": { "item": "{modid}:my_item", "count": 1 }
}
```

## 模式: Manual LootTable JSON

```yaml
模式: Manual LootTable JSON
版本: Forge 1.13.2
平台: Forge
分类: datagen
依赖: []
扩展点: [战利品表]
---
文件: src/main/resources/data/{modid}/loot_tables/blocks/{block}.json

{
  "type": "minecraft:block",
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "minecraft:item",
          "name": "{modid}:my_item"
        }
      ]
    }
  ]
}
```
