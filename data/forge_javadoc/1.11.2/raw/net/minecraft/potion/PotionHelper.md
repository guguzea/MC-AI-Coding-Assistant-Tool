---
title: "PotionHelper"
description: "public class PotionHelper extends java.lang.Object"
package: "net/minecraft/potion"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/potion/PotionHelper.html"
sourceType: javadoc
---

# PotionHelper

## Class signature

```java
public class PotionHelper extends java.lang.Object
```

## Constructors

- `public PotionHelper()`

## Methods

- `public static boolean isReagent( ItemStack stack)`
- `protected static boolean isItemConversionReagent( ItemStack stack)`
- `protected static boolean isTypeConversionReagent( ItemStack stack)`
- `public static boolean hasConversions( ItemStack input, ItemStack reagent)`
- `protected static boolean hasItemConversions( ItemStack p_185206_0_, ItemStack p_185206_1_)`
- `protected static boolean hasTypeConversions( ItemStack p_185209_0_, ItemStack p_185209_1_)`
- `public static ItemStack doReaction( ItemStack reagent, ItemStack potionIn)`
- `public static void init()`
- `public static void registerPotionItemConversion( ItemPotion p_185201_0_, PotionHelper.ItemPredicateInstance p_185201_1_, ItemPotion p_185201_2_)`
- `public static void registerPotionItem( PotionHelper.ItemPredicateInstance p_185202_0_)`
- `public static void registerPotionTypeConversion( PotionType input, com.google.common.base.Predicate< ItemStack > reagentPredicate, PotionType output)`
