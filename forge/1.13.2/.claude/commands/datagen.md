---
name: datagen
description: Minecraft Forge 数据生成（Forge 1.13.2）。Forge 1.13.2 DataGen 有限，手动编写 JSON 为主。触发词：DataGen、数据包、资源包、JSON
---

# 数据生成（Forge 1.13.2）

Forge 1.13.2 的 DataGen API 相对基础，大部分资源文件需要**手动编写 JSON**。

## 目录结构

```
src/main/resources/
├── assets/{modid}/
│   ├── blockstates/
│   ├── models/
│   └── lang/
└── data/{modid}/
    └── recipes/
```

## 常用 JSON 文件

### BlockState
`assets/{modid}/blockstates/my_block.json`

### ItemModel
`assets/{modid}/models/item/my_item.json`

### 配方
`data/{modid}/recipes/my_recipe.json`

## 参考资料

- 详细示例：参见 `07-datagen.mdc`
