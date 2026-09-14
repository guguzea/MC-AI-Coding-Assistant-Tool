# 数据包格式速查

## Pack Format

| Minecraft 版本 | 数据包 | 资源包 |
|---------------|--------|--------|
| 1.20.2 | 10 | 18 |
| 1.21 / 1.21.1 | **48** | **34** |

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
│   ├── advancement/
│   │   └── <advancement_id>.json
│   ├── loot_table/
│   │   ├── blocks/
│   │   │   └── <block_id>.json
│   │   └── entities/
│   │       └── <entity_id>.json
│   ├── recipe/
│   │   └── <recipe_id>.json
│   └── tags/
│       ├── block/
│       │   └── <tag_id>.json
│       ├── item/
│       │   └── <tag_id>.json
│       └── entity_type/
│           └── <tag_id>.json
```

> **目录名单/复数口径（1.21 起 = 单数注册表 id）**。本档本地实证：
> `advancement/` ← `data/fabric_1.21.1/reference/1.21.1/src/main/generated/data/minecraft/advancement/`（实扫目录）+ `fabric-docs/1.21.1/processed/develop_data-generation_advancements.md:47`；
> `loot_table/` ← `fabric-docs/1.21.1/processed/develop_blocks_first-block.md:129`（`data/example-mod/loot_table/blocks/`）；
> `tags/block/` ← 同页 :143、:160（`data/minecraft/tags/block/mineable/`）；单数 tag 分类另见 `.../generated/data/minecraft/tags/damage_type/`。
> `recipe/`、`tags/item/`、`tags/entity_type/` 按同一「单数 = 注册表 id」规则改；这三条在本档 processed 正文**无直接命中**（相关页示例落在 `reference/` 另一棵树，检索按页面正文计），故标为规则推导。
> 语料抓取日期 = `data/fabric_1.21.1/reference.provenance.json` 的 `fetchedAt: 2026-09-12T06:54:51.104Z`（上游 FabricMC/fabric-docs commit caa6822e）。
> 1.20.x 及更早仍是 `advancements/` / `loot_tables/` / `recipes/` / `tags/blocks|items|entity_types/`。

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
