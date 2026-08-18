# 数据包格式速查（Fabric 1.20.4）

> Fabric 和 Forge 共享相同的数据包格式。本文件仅列出关键格式参考。

## 目录结构

```
src/main/resources/
└── data/{namespace}/
    ├── advancements/{id}.json
    ├── loot_tables/{id}.json
    ├── recipes/{id}.json
    ├── tags/
    │   ├── block/{id}.json
    │   ├── item/{id}.json
    │   └── entity_type/{id}.json
    └── dimension_type/{id}.json
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
    "examplemod:my_item",
    { "id": "examplemod:custom_item", "required": false }
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
