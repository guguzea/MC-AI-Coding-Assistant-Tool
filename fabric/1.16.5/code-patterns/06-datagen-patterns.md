# DataGen 模式（Fabric 1.16.5）

本版没有 fabric-datagen。下面四段都是 **手写 JSON**（保留原模式分类）。

## 模式 1：语言文件生成

```yaml
模式: Language Generation
平台: Fabric
分类: datagen
依赖: []
扩展点: []
---
# assets/examplemod/lang/en_us.json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block",
  "entity.examplemod.my_entity": "My Entity"
}
```

## 模式 2：配方生成

```yaml
模式: Recipe Generation
平台: Fabric
分类: datagen
依赖: []
扩展点: []
---
# data/examplemod/recipes/my_item.json
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

## 模式 3：战利品表生成

```yaml
模式: Loot Table Generation
平台: Fabric
分类: datagen
依赖: []
扩展点: []
---
# data/examplemod/loot_tables/blocks/my_block.json
{
  "type": "minecraft:block",
  "pools": [
    {
      "rolls": 1,
      "entries": [{ "type": "minecraft:item", "name": "examplemod:my_block" }],
      "conditions": [{ "condition": "minecraft:survives_explosion" }]
    }
  ]
}
```

## 模式 4：标签生成

```yaml
模式: Tag Generation
平台: Fabric
分类: datagen
依赖: [TagRegistry]
扩展点: []
---
# data/examplemod/tags/items/my_items.json
{
  "replace": false,
  "values": [
    "minecraft:diamond",
    "examplemod:my_item"
  ]
}

# 或代码：TagRegistry.item(new Identifier(MOD_ID, "my_items"))
```
