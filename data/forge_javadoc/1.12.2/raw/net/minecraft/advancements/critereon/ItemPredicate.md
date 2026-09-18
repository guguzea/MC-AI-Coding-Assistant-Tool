---
title: "ItemPredicate"
description: "public class ItemPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ItemPredicate.html"
sourceType: javadoc
---

# ItemPredicate

## Class signature

```java
public class ItemPredicate extends java.lang.Object
```

## Constructors

- `public ItemPredicate()`
- `public ItemPredicate( Item item, java.lang.Integer data, MinMaxBounds count, MinMaxBounds durability, EnchantmentPredicate [] enchantments, PotionType potion, NBTPredicate nbt)`

## Methods

- `public boolean test( ItemStack item)`
- `public static ItemPredicate deserialize(JsonElement element)`
- `public static ItemPredicate [] deserializeArray(JsonElement element)`
