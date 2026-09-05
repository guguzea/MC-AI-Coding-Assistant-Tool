# 数据包格式速查（1.16.5）

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 6,
    "description": "My Datapack"
  }
}
```

| MC 版本 | pack_format（本表 = 数据包） | 官方出处（MDK `src/main/resources/pack.mcmeta`，sha256 见 `mcp-server/data/mdk-checksums.json`，`source=official`） |
|---------|------------|----------|
| 1.16.2–1.16.5 | **6** | 官方 1.16.5-36.2.34 MDK = `"pack_format": 6`，`_comment`「…texture changes from 1.16.2」；本包 `scaffold/src/main/resources/pack.mcmeta` 同为 6 |
| 1.16–1.16.1 | 5（推论） | 由上条 `_comment`「from 1.16.2」**推论**，本仓无 1.16/1.16.1 的 MDK 实测 |
| 1.15.x | 5 | 官方 1.15.2-31.2.57 MDK = 5（本表原写 4，错） |
| 1.14.x | 4 | 官方 1.14.4-28.2.26 MDK = 4 |

> 1.18 之前数据包与资源包共用同一个 `pack_format`；1.18 起分家（1.18.2 MDK = 资源 8 / 数据 9）。

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
├── structures/       # 结构（.nbt）
├── tags/
│   ├── blocks/       # 方块标签
│   ├── entity_types/ # 实体标签
│   ├── fluids/       # 流体标签
│   ├── functions/    # 函数标签
│   └── items/        # 物品标签
└── worldgen/
    └── dimension/    # 维度类型
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
// data/examplemod/tags/blocks/mineable/pickaxe.json
{
  "replace": false,
  "values": [
    "examplemod:my_block",
    "examplemod:my_ore"
  ]
}
```

## 常见错误

- ❌ namespace 包含大写字母（`ExampleMod:stone` → 改为 `examplemod:stone`）
- ❌ pack_format 版本错误（1.16.5 用 6，不是 15）
- ❌ `functions/` 中 mcfunction 文件含有空行或多余空格
- ❌ `tags/items/` 中的值使用了物品 ID 但格式错误（应为 `namespace:item_name`）
- ❌ `loot_tables` 路径错误：应放在 `data/{namespace}/loot_tables/` 下，不是 `data/{namespace}/`

## 参考

- Minecraft Wiki：https://minecraft.wiki/w/Data_pack
- pack_format 完整列表：https://minecraft.wiki/w/Tutorials/Creating_a_data_pack#pack_format
