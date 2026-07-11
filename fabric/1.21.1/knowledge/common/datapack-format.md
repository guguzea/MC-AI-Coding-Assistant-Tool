# 数据包格式速查

## Pack Format

| Minecraft 版本 | Pack Format |
|---------------|-------------|
| 1.20.2 | 34 |
| 1.21.x | 34 |

## 资源包结构

```
assets/
├── <namespace>/
│   ├── blockstates/
│   │   └── <block_id>.json
│   ├── models/
│   │   ├── block/
│   │   │   └── <block_id>.json
│   │   └── item/
│   │       └── <item_id>.json
│   ├── textures/
│   │   ├── block/
│   │   │   └── <texture>.png
│   │   └── item/
│   │       └── <texture>.png
│   └── lang/
│       └── <locale>.json
```

## 数据包结构

```
data/
├── <namespace>/
│   ├── advancements/
│   │   └── <advancement_id>.json
│   ├── loot_tables/
│   │   ├── blocks/
│   │   │   └── <block_id>.json
│   │   └── entities/
│   │       └── <entity_id>.json
│   ├── recipes/
│   │   └── <recipe_id>.json
│   └── tags/
│       ├── blocks/
│       │   └── <tag_id>.json
│       ├── items/
│       │   └── <tag_id>.json
│       └── entity_types/
│           └── <tag_id>.json
```

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 34,
    "description": "My Mod Resources"
  }
}
```

## 方块状态 JSON

```json
{
  "variants": {
    "": { "model": "examplemod:block/my_block" }
  }
}
```

## 方块模型 JSON

```json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "examplemod:block/my_block"
  }
}
```

## 物品模型 JSON

```json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "examplemod:item/my_item"
  }
}
```

或手持物品：

```json
{
  "parent": "minecraft:item/handheld",
  "textures": {
    "layer0": "examplemod:item/my_tool"
  }
}
```

## 语言文件格式

```json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block",
  "entity.examplemod.my_entity": "My Entity",
  "itemGroup.examplemod": "Example Mod Items"
}
```

## 配方格式

### Shaped

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "AAA",
    "BBB",
    "CCC"
  ],
  "key": {
    "A": { "item": "minecraft:diamond" },
    "B": { "item": "minecraft:gold_ingot" },
    "C": { "item": "minecraft:iron_ingot" }
  },
  "result": {
    "item": "examplemod:my_item"
  }
}
```

### Shapeless

```json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "minecraft:diamond" },
    { "item": "minecraft:diamond" },
    { "item": "minecraft:stick" }
  ],
  "result": {
    "item": "examplemod:my_item"
  }
}
```

## 战利品表

```json
{
  "type": "minecraft:block",
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "minecraft:item",
          "name": "examplemod:my_item"
        }
      ],
      "conditions": [
        {
          "condition": "minecraft:survives_explosion"
        }
      ]
    }
  ]
}
```
