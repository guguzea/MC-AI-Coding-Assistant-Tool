---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）。
platform: forge
version: "1.18.2"
---

# 物品开发（Forge 1.18.2）

## 剑

```java
new SwordItem(MyTier.COPPER, 3, 1.6f, new Properties())
```

**最终攻击伤害 = attackDamageModifier + 3.0f**

## 工具层级 Tier

```java
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.of(Items.COPPER_INGOT));
    ...
}
```

## 参考资料

参见 `03-item.mdc`
