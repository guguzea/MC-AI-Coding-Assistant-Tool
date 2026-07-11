# 物品开发命令

适用版本：Fabric 1.21.1

## 创建基本物品

```java
private static final RegistrySupplier<Item> MY_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxCount(64))
);
```

## 创建食物

```java
private static final RegistrySupplier<Item> MY_FOOD = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_food"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .hunger(4)
            .saturationModifier(1.2f)
            .build())
        .maxCount(64))
);
```

## 常见问题

### Q: 物品图标显示为紫色黑色方块
A: 缺少物品模型 JSON 文件，路径应为 `assets/{mod_id}/models/item/{item_id}.json`。

### Q: 物品不消耗耐久
A: 检查是否设置了 maxDamage，或者在 postHit() 中是否正确调用了 damage()。

## 相关文件

- rules/03-item.mdc
- rules/01-registry.mdc
