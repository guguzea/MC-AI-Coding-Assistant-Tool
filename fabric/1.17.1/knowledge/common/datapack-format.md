# 数据包格式速查（Fabric 1.17.1）

> Fabric 和 Forge 共享相同的数据包格式。本文件仅列出关键格式参考。

## ⚠️ 1.17.x 关键差异

- **pack_format 是 `6`**（不是 `9`）
- **推荐手写 JSON**，DataGen API 在 1.17.x 仍处于实验阶段

## pack.mcmeta

```json
{
    "pack": {
        "pack_format": 6,
        "description": "My Fabric Mod Data"
    }
}
```

## 目录结构

```
src/main/resources/
└── data/{namespace}/
    ├── advancements/{id}.json
    ├── loot_tables/{id}.json
    ├── recipes/{id}.json
    ├── tags/
    │   ├── blocks/{id}.json
    │   ├── items/{id}.json
    │   └── entity_types/{id}.json
    └── dimensions/{id}.json
```

## 配方格式

```json
{
    "type": "minecraft:crafting_shaped",
    "pattern": [
        "AAA",
        "ABA",
        "AAA"
    ],
    "key": {
        "A": { "item": "minecraft:diamond" },
        "B": { "item": "examplemod:my_item" }
    },
    "result": { "item": "examplemod:result_item", "count": 1 }
}
```

## 战利品表格式

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
                { "condition": "minecraft:survives_explosion" }
            ]
        }
    ]
}
```

## 标签格式

```json
{
    "replace": false,
    "values": [
        "minecraft:diamond",
        "examplemod:my_item"
    ]
}
```

## 进度格式

```json
{
    "criteria": {
        "impossible": {
            "trigger": "minecraft:impossible"
        }
    }
}
```
