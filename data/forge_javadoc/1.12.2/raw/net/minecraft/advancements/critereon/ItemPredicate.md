---
title: "ItemPredicate"
description: "public class ItemPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ItemPredicate.html"
sourceType: javadoc
---

# ItemPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ItemPredicate

## Class signature

```java
public class ItemPredicate extends java.lang.Object
```

## Constructors

- `ItemPredicate()`
- `ItemPredicate(Item item, java.lang.Integer data, MinMaxBounds count, MinMaxBounds durability, EnchantmentPredicate [] enchantments, PotionType potion, NBTPredicate nbt)`

## Methods

- `static ItemPredicate deserialize(JsonElement element)`
- `static ItemPredicate [] deserializeArray(JsonElement element)`
- `boolean test(ItemStack item)`

## Fields

- `static ItemPredicate ANY`
