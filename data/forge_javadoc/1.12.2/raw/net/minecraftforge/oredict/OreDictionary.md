---
title: "OreDictionary"
description: "Minecraft changed from -1 to Short.MAX_VALUE in 1.5 release for the \"block wildcard\"."
package: "net/minecraftforge/oredict"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/oredict/OreDictionary.html"
sourceType: javadoc
---

# OreDictionary

## Class signature

```java
public class OreDictionary extends java.lang.Object
```

## Constructors

- `public OreDictionary()`

## Methods

- `public static int getOreID(java.lang.String name)`
- `public static java.lang.String getOreName(int id)`
- `public static int[] getOreIDs( ItemStack stack)`
- `public static NonNullList < ItemStack > getOres(java.lang.String name)`
- `public static NonNullList < ItemStack > getOres(java.lang.String name, boolean alwaysCreateEntry)`
- `public static boolean doesOreNameExist(java.lang.String name)`
- `public static java.lang.String[] getOreNames()`
- `public static boolean containsMatch(boolean strict, NonNullList < ItemStack > inputs, ItemStack ... targets)`
- `public static boolean itemMatches( ItemStack target, ItemStack input, boolean strict)`
- `public static void registerOre(java.lang.String name, Item ore)`
- `public static void registerOre(java.lang.String name, Block ore)`
- `public static void registerOre(java.lang.String name, ItemStack ore)`
- `public static void rebakeMap()`

## Description

Minecraft changed from -1 to Short.MAX_VALUE in 1.5 release for the "block wildcard".
