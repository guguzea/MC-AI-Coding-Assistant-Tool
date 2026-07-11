---
name: mc-item
description: Minecraft Forge 物品开发（Forge 1.13.2）。创建物品、工具、盔甲。
---

# 物品开发（Forge 1.13.2）

## 快速开始

```java
public static final Item MY_ITEM = new Item(
    new Item.Properties()
        .group(ItemGroup.TAB_MISC)
        .maxStackSize(64)
);
```

## ItemGroup

- `ItemGroup.TAB_BUILDING_BLOCKS` — 建筑方块
- `ItemGroup.TAB_TOOLS` — 工具
- `ItemGroup.TAB_COMBAT` — 武器/盔甲
- `ItemGroup.TAB_FOOD` — 食物
- `ItemGroup.TAB_MISC` — 杂项

## 参考资料

- 详细示例：参见 `03-item.mdc`
