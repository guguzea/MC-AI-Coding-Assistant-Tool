# 物品/工具模式（Forge 1.18.2）

## 普通物品

```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Properties().tab(CreativeModeTab.TAB_MISC).stacksTo(64))
);
```

## 剑（SwordItem）

```java
// 参数：(Tier tier, int attackDamageModifier, float attackSpeedModifier, Properties)
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, 1.6f, new Properties())
);
```

**最终攻击伤害 = attackDamageModifier + 3.0f（剑类内置固定加成）**

## 工具层级 Tier

```java
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.of(Items.COPPER_INGOT));
    ...
}
```

## 常见错误

- ❌ `SwordItem` 只有 4 参数版本
- ❌ `Tier.getAttackDamageBonus()` 返回值含工具类型加成

## 参考资料

参见 `03-item.mdc`
