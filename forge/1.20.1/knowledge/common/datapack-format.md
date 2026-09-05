# 数据包格式速查（1.20.1）

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 15,
    "description": "My Datapack"
  }
}
```

| MC 版本 | pack_format（本表 = 数据包） | 官方出处（MDK `pack.mcmeta`，sha256 见 `mcp-server/data/mdk-checksums.json`） |
|---------|------------|----------|
| 1.20–1.20.1 | **15** | 官方 1.20.1-47.4.10 MDK `pack.mcmeta` = `"pack_format": 15`；本包 `scaffold/src/main/resources/pack.mcmeta` 同为 15 |
| 1.19.3–1.19.4 | 12 | 官方 1.19.4-45.4.0 MDK `forge:server_data_pack_format: 12`（资源包 13） |
| 1.18.x | 9 | 官方 1.18.2-40.3.0 MDK `forge:data_pack_format: 9`（资源包 8） |
| 1.17.x | 7 | 官方 1.17.1-37.1.1 MDK = 7 |

MDK sha256 钉在本仓 `mcp-server/data/mdk-checksums.json`（`source=official`）。

## 目录结构

```
data/<namespace>/
├── advancements/        # 进度
├── functions/          # 函数（.mcfunction）
├── loot_tables/        # 战利品表
│   ├── blocks/        # 方块掉落
│   ├── entities/      # 实体掉落
│   └── chests/       # 箱子战利品
├── predicates/        # 条件谓词
├── recipes/           # 配方
├── structures/       # 结构（.nbt）
├── tags/
│   ├── blocks/       # 方块标签
│   ├── entity_types/ # 实体标签
│   ├── fluids/       # 流体标签
│   ├── functions/    # 函数标签
│   └── items/        # 物品标签
└── dimension/         # 维度类型
    └── my_dimension.json
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
- ❌ pack_format 版本错误（1.20.1 用 15，不是 12）
- ❌ `functions/` 中 mcfunction 文件含有空行或多余空格
- ❌ `tags/items/` 中的值使用了物品 ID 但格式错误（应为 `namespace:item_name`）
- ❌ `loot_tables` 路径错误：应放在 `data/{namespace}/loot_tables/` 下，不是 `data/{namespace}/`

## 参考

- Minecraft Wiki：https://minecraft.wiki/w/Data_pack
- pack_format 完整列表：https://minecraft.wiki/w/Tutorials/Creating_a_data_pack#pack_format
