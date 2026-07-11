# 数据包（Forge 1.12.2）

## 重要：Forge 1.12.2 没有 DataGen API

**Forge 1.12.2 必须手动编写所有 JSON 数据文件**。

## 目录结构

```
src/main/resources/
└── assets/{modid}/
    ├── lang/
    │   └── en_us.lang      # 语言文件（.lang 格式，不是 .json）
    ├── recipes/            # 配方 JSON
    └── loot_tables/       # 战利品表 JSON
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

> **pack_format = 4**（1.12.2 专用）

## 语言文件（.lang 格式）

```
# 格式：key=value
item.examplemod.my_item.name=My Item
tile.examplemod.my_block.name=My Block
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

## 常见错误

- ❌ 使用 .json 语言文件（1.12.2 用 .lang）
- ❌ pack_format 错误（1.12.2 = 4）
- ❌ 资源路径含大写

## 参考资料

- 详细示例：参见 `07-datagen.mdc`
