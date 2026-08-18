---
name: mc-datagen
description: Minecraft Forge 数据生成。Forge 1.12.2 无 DataGen API，必须手动编写 JSON 数据包文件。触发词：数据包、recipes、loot_tables、lang、blockstates
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 数据包（Forge 1.12.2）

## 重要：Forge 1.12.2 没有 DataGen API

**Forge 1.12.2 必须手动编写所有 JSON 数据文件**，没有 DataGenerator。

## 目录结构

```
src/main/resources/
└── assets/{modid}/
    ├── lang/
    │   └── en_us.lang      # 语言文件（.lang 格式，不是 .json）
    ├── models/
    │   ├── block/
    │   └── item/
    ├── blockstates/
    ├── textures/
    ├── recipes/            # 配方 JSON（手动编写）
    └── loot_tables/       # 战利品表 JSON（手动编写）
```

## 合成配方 JSON

```json
{
  "type": "crafting_shaped",
  "pattern": [" X ", " X ", " Y "],
  "key": {
    "X": { "item": "minecraft:diamond" },
    "Y": { "item": "minecraft:stick" }
  },
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

## 语言文件（.lang 格式）

```
# 格式：key=value（不是 JSON）
item.examplemod.my_item.name=My Item
tile.examplemod.my_block.name=My Block
entity.examplemod.my_entity.name=My Entity
```

## pack.mcmeta

```json
{
  "pack": {
    "pack_description": "${mod_name}",
    "pack_format": 4
  }
}
```

> **pack_format = 4**（1.12.2 专用，不是 1.13+ 的更高值）

## 常见错误

- ❌ 使用 .json 语言文件（1.12.2 用 .lang）
- ❌ pack_format 错误（1.12.2 = 4）
- ❌ 资源路径含大写
- ❌ 把配方/战利品放到 `data/{modid}/` — 那是 1.13+；本档在 `assets/{modid}/`
- ❌ `minecraft:smelting` JSON — 1.13+；熔炉用 `GameRegistry.addSmelting`

## 参考资料

- 详细示例：参见 `07-datagen.mdc`
