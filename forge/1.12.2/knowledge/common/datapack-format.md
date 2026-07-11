# 数据包格式速查（1.12.2）

## pack.mcmeta

```json
{
  "pack": {
    "pack_description": "My Datapack",
    "pack_format": 4
  }
}
```

| MC 版本 | pack_format |
|--------|-------------|
| 1.12.2 | **4** |
| 1.13.x | 6 |
| 1.14.x | 7 |
| 1.16.x | 8 |
| 1.18.x | 9 |
| 1.20.x | 15 |

## 目录结构（1.12.2）

> 注意：1.12.2 的数据包和资源包都放在 `assets/{modid}/` 下，**不像 1.13+ 那样分离**。

```
assets/{modid}/
├── recipes/           # 配方 JSON
├── loot_tables/      # 战利品表 JSON
└── ...
```

## Recipe JSON 速写

### 有序合成

```json
{
  "type": "forge:ore_shaped",
  "pattern": ["ABA", "CDC", "ABA"],
  "key": {
    "A": { "item": "minecraft:diamond" },
    "B": { "item": "minecraft:emerald" },
    "C": { "item": "minecraft:iron_ingot" },
    "D": { "item": "minecraft:gold_ingot" }
  },
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

### 无序合成

```json
{
  "type": "forge:ore_shapeless",
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
  "type": "smelting",
  "ingredient": { "item": "minecraft:iron_ore" },
  "result": "minecraft:iron_ingot",
  "experience": 0.7,
  "cookingtime": 200
}
```

## 常见错误

- ❌ pack_format 版本错误（1.12.2 用 4，不是 6/7/8）
- ❌ `type` 字段缺少 `forge:` 前缀
- ❌ namespace 包含大写字母
