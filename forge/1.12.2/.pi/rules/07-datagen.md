---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Forge 1.12.2
> **注意：Forge 1.12.2 没有 DataGenerator API，所有数据必须手动编写 JSON 文件。**

---

## 约束

### 数据生成时机

- **Forge 1.12.2 没有 DataGenerator API**
- 所有数据包和资源包文件必须手动编写 JSON
- 生成的 JSON 文件放在 `src/main/resources/` 目录

### 目录结构

```
src/main/resources/
└── assets/
    └── {modid}/
        ├── lang/
        │   └── en_us.lang           # 语言文件
        ├── models/
        │   ├── item/
        │   │   └── my_item.json
        │   └── block/
        │       └── my_block.json
        ├── blockstates/
        │   └── my_block.json
        └── textures/
            ├── block/
            │   └── my_block.png
            └── item/
                └── my_item.png

src/main/resources/
└── data/
    └── {modid}/
        ├── recipes/
        │   └── my_recipe.json
        ├── loot_tables/
        │   └── blocks/
        │       └── my_block.json
        └── advancements/
            └── my_advancement.json
```

---

## Decision Flow

### Decision: 生成什么类型的数据

```
IF 生成合成配方
  → 手动编写 JSON
  → 放到 data/{modid}/recipes/

IF 生成战利品表
  → 手动编写 JSON
  → 放到 data/{modid}/loot_tables/blocks/

IF 生成语言文件
  → 手动编写 .lang 文件
  → 放到 assets/{modid}/lang/

IF 生成物品模型（JSON）
  → 手动编写 JSON
  → 放到 assets/{modid}/models/item/

IF 生成方块状态（BlockState JSON）
  → 手动编写 JSON
  → 放到 assets/{modid}/blockstates/
```

### Decision: 配方类型选择

```
IF 配方有固定形状（工具、武器等）
  → 手动编写 Shaped Crafting Recipe JSON

IF 配方成分无固定位置（药水、染料混合等）
  → 手动编写 Shapeless Crafting Recipe JSON

IF 熔炉烧制/烟熏/营火烧制
  → 手动编写 Smelting Recipe JSON
```

---

## 示例：Shaped 配方 JSON

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "###",
    "#X#",
    "###"
  ],
  "key": {
    "#": {
      "item": "minecraft:diamond"
    },
    "X": {
      "item": "minecraft:dirt"
    }
  },
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```

## 示例：Shapeless 配方 JSON

```json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    {
      "item": "minecraft:gold_ingot",
      "count": 3
    },
    {
      "item": "minecraft:diamond"
    }
  ],
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```

## 示例：熔炉配方 JSON

```json
{
  "type": "minecraft:smelting",
  "ingredient": {
    "item": "minecraft:dirt"
  },
  "result": "minecraft:diamond",
  "experience": 0.1,
  "cookingtime": 200
}
```

## 示例：战利品表 JSON

```json
{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item",
          "name": "examplemod:my_item",
          "functions": [
            {
              "function": "minecraft:set_count",
              "count": {
                "min": 1,
                "max": 3
              }
            },
            {
              "function": "minecraft:explosion_decay"
            }
          ]
        }
      ]
    }
  ]
}
```

## 示例：物品模型 JSON

```json
{
  "parent": "item/generated",
  "textures": {
    "layer0": "examplemod:items/my_item"
  }
}
```

## 示例：方块模型 JSON

```json
{
  "parent": "block/cube_all",
  "textures": {
    "all": "examplemod:blocks/my_block"
  }
}
```

## 示例：方块状态 JSON

```json
{
  "variants": {
    "": { "model": "examplemod:block/my_block" }
  }
}
```

## 示例：语言文件

```lang
# en_us.lang
item.examplemod.my_item.name=My Item
tile.examplemod.my_block.name=My Block
entity.examplemod.my_entity.name=My Entity
```

> 注意：语言文件中 `tile.` 前缀用于方块显示名称，`item.` 前缀用于物品显示名称。
