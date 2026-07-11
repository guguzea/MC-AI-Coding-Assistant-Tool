---
name: item
description: Minecraft Forge 物品开发（Forge 1.13.2）。创建物品、工具、盔甲、食物。触发词：物品、Item、ItemStack、Item.Properties、ToolMaterial、SwordItem、ArmorItem
---

# 物品开发（Forge 1.13.2）

## 快速开始

```java
public static final Item MY_ITEM = new Item(
    new Item.Properties()
        .group(ItemGroup.TAB_MISC)
        .maxStackSize(64)
);

@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(
        MY_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "my_item"))
    );
}
```

## Decision: 选择物品类型

```
IF 只是手持物品
  → Item

IF 剑/工具
  → SwordItem / PickaxeItem / AxeItem / ShovelItem

IF 盔甲
  → ArmorItem + IArmorTier

IF 可食用
  → Item + .effect()
```

## ItemGroup 常用标签

- `ItemGroup.TAB_BUILDING_BLOCKS` — 建筑方块
- `ItemGroup.TAB_TOOLS` — 工具
- `ItemGroup.TAB_COMBAT` — 武器/盔甲
- `ItemGroup.TAB_FOOD` — 食物
- `ItemGroup.TAB_MATERIALS` — 材料
- `ItemGroup.TAB_MISC` — 杂项

## 常见错误

- ❌ 忘记 `.group()` 导致物品不在任何标签页
- ❌ 忘记 `maxStackSize`（默认 64）

## 参考资料

- 详细示例：参见 `03-item.mdc`
