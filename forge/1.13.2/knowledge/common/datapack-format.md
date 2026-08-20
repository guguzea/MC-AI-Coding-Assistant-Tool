# 数据包格式速查（Forge 1.13.2）

## 目录结构

```
src/main/resources/
├── assets/{modid}/
│   ├── blockstates/
│   │   └── {block}.json
│   ├── models/
│   │   ├── block/
│   │   │   └── {block}.json
│   │   └── item/
│   │       └── {item}.json
│   ├── textures/
│   │   ├── block/
│   │   └── item/
│   └── lang/
│       └── en_us.json
└── data/{modid}/
    ├── recipes/
    │   └── {recipe}.json
    └── loot_tables/
        └── blocks/
            └── {block}.json
```

## pack.mcmeta

```json
{
  "pack": {
    "description": "Example Mod",
    "pack_format": 4
  }
}
```

> Forge 1.13.2 数据包使用 `pack_format = 4`

## BlockState JSON

文件：`assets/{modid}/blockstates/{block}.json`

```json
{
  "variants": {
    "": { "model": "modid:block/my_block" }
  }
}
```

## Block Model JSON

文件：`assets/{modid}/models/block/{block}.json`

```json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "modid:block/my_block"
  }
}
```

## Item Model JSON

文件：`assets/{modid}/models/item/{item}.json`

```json
{
  "parent": "modid:block/my_block"
}
```

## 配方 JSON

文件：`data/{modid}/recipes/{recipe}.json`

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
  "result": { "item": "modid:my_item", "count": 1 }
}
```

无形状配方：

```json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "minecraft:diamond" },
    { "item": "minecraft:gold_ingot" }
  ],
  "result": { "item": "modid:my_item", "count": 1 }
}
```

## 战利品表 JSON

文件：`data/{modid}/loot_tables/blocks/{block}.json`

```json
{
  "type": "minecraft:block",
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "minecraft:item",
          "name": "modid:my_item"
        }
      ]
    }
  ]
}
```

## 语言文件 JSON

文件：`assets/{modid}/lang/en_us.json`

```json
{
  "item.modid.my_item": "My Item",
  "block.modid.my_block": "My Block"
}
```
