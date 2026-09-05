# 数据包格式速查（1.14.4）

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 4,
    "description": "My Datapack"
  }
}
```

| MC 版本 | pack_format（本表 = 数据包） | 官方出处（MDK `src/main/resources/pack.mcmeta`，sha256 见 `mcp-server/data/mdk-checksums.json`，`source=official`） |
|--------|------------|----------|
| **1.14.4** | **4** | 官方 1.14.4-28.2.26 MDK = `"pack_format": 4`；本包 `scaffold/src/main/resources/pack.mcmeta` 同为 4（原表写 5，错） |
| 1.15.x | 5 | 官方 1.15.2-31.2.57 MDK = 5（原表写 6，错） |
| 1.16.x | 6 | 官方 1.16.5-36.2.34 MDK = 6（原表写 7，错） |
| 1.17.x | 7 | 官方 1.17.1-37.1.1 MDK = 7（原表写 8，错） |
| 1.18.x | 9 | 官方 1.18.2-40.3.0 MDK `forge:data_pack_format: 9`（资源包为 8） |

> 1.14.4 的数据包与资源包**共用同一个号 4**（`pack.mcmeta` 只有一个 `pack_format` 字段）；到 1.18 才分家，别把这条「相同」外推到 1.18+。

## 目录结构

```
data/<namespace>/
├── advancements/        # 进度
├── functions/          # 函数（.mcfunction）
├── loot_tables/        # 战利品表
│   ├── blocks/        # 方块掉落
│   ├── entities/      # 实体掉落
│   └── chests/       # 箱子战利品
├── recipes/           # 配方
└── tags/
    ├── blocks/       # 方块标签
    ├── entity_types/ # 实体标签
    ├── fluids/       # 流体标签
    ├── functions/    # 函数标签
    └── items/        # 物品标签
```

## Recipe JSON 速写

### 有序合成

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": ["ABA", "CDC", "ABA"],
  "key": {
    "A": { "item": "minecraft:diamond" },
    "B": { "item": "minecraft:emerald" },
    "C": { "item": "minecraft:iron_ingot" },
    "D": { "item": "minecraft:air" }
  },
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

### 无序合成

```json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "minecraft:diamond" },
    { "item": "minecraft:diamond" }
  ],
  "result": { "item": "minecraft:diamond_sword", "count": 1 }
}
```

### 熔炉烧制

```json
{
  "type": "minecraft:smelting",
  "ingredient": { "item": "minecraft:iron_ore" },
  "result": "minecraft:iron_ingot",
  "experience": 0.7,
  "cookingtime": 200
}
```

## Loot Table 速写

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

## Tag 速写

```json
// data/examplemod/tags/items/tools.json
{
  "replace": false,
  "values": [
    "examplemod:my_item"
  ]
}
```

## 常见错误

- ❌ namespace 包含大写字母（`ExampleMod:stone` → 改为 `examplemod:stone`）
- ❌ pack_format 版本错误（1.14.4 数据包用 **4**，不是 5 或 6；5 是 1.15.x、6 是 1.16.x）
- ❌ `functions/` 中 mcfunction 文件含有空行或多余空格
- ❌ `tags/items/` 中的值使用了物品 ID 但格式错误（应为 `namespace:item_name`）

## 参考

- Minecraft Wiki：https://minecraft.wiki/w/Data_pack
- pack_format 完整列表：https://minecraft.wiki/w/Tutorials/Creating_a_data_pack#pack_format
