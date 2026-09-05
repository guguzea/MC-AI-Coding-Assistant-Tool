# 数据包格式速查（1.12.2）

## pack.mcmeta

```json
{
  "pack": {
    "description": "My Resource Pack",
    "pack_format": 3
  }
}
```

| MC 版本 | pack_format（本表 = 数据包） | 官方出处（MDK `src/main/resources/pack.mcmeta`，sha256 见 `mcp-server/data/mdk-checksums.json`，`source=official`） |
|--------|-------------|----------|
| 1.12.2 | **3**（资源包） | 官方 1.12.2-14.23.5.2860 MDK = `"pack_format": 3` |
| 1.13.x | 4 | 官方 1.13.2-25.0.223 MDK = 4（本表原写 6，错） |
| 1.14.x | 4 | 官方 1.14.4-28.2.26 MDK = 4（本表原写 7，错） |
| 1.16.x | 6 | 官方 1.16.5-36.2.34 MDK = 6（本表原写 8，错） |
| 1.18.x | 9 | 官方 1.18.2-40.3.0 MDK `forge:data_pack_format: 9`（资源包为 8） |
| 1.20.x | 15 | 官方 1.20.1-47.4.10 MDK = 15 |

> ⚠️ **1.12.2 没有数据包系统**：`data/` 命名空间与 `/datapack` 自 1.13 起才有（仓内语料 `data/forge_1.12.2/forge-docs/1.12.2/raw/utilities_recipes.md:10` 称 1.12.2 的 JSON 配方「will be expanded in Minecraft 1.13 into datapacks」）。上表其余行只是跨版本对照，别把 1.12.2 工程写成「数据包 pack_format = 3」。
> 1.18 之前数据包与资源包共用同一个 `pack_format`；1.18 起分家（1.18.2 MDK 同时给出 `forge:resource_pack_format` 与 `forge:data_pack_format` 两个键）。

## 目录结构（1.12.2）

> 注意：1.12.2 的配方 / 战利品表 JSON 与资源一起放在 `assets/{modid}/` 下（`recipes/`、`loot_tables/`），**没有 `data/` 命名空间**；`data/` 与数据包系统是 1.13 才引入的，移植时必须把这些目录搬到 `data/`。

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


## 常见错误

- ❌ pack_format 版本错误（1.12.2 资源包用 3，不是 4/6/7/8）
- ❌ `type` 字段缺少 `forge:` 前缀
- ❌ namespace 包含大写字母
