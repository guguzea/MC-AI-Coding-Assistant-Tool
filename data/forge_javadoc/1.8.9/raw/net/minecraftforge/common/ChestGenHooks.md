---
title: "ChestGenHooks"
description: "Adds a new entry into the possible items to generate."
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/ChestGenHooks.html"
sourceType: javadoc
---

# ChestGenHooks

## Class signature

```java
public class ChestGenHooks extends java.lang.Object
```

## Constructors

- `public ChestGenHooks(java.lang.String category)`
- `public ChestGenHooks(java.lang.String category, java.util.List< WeightedRandomChestContent > items, int min, int max)`

## Methods

- `public static void init(java.lang.String category, java.util.List< WeightedRandomChestContent > items, int min, int max)`
- `public static ChestGenHooks getInfo(java.lang.String category)`
- `public static ItemStack [] generateStacks(java.util.Random rand, ItemStack source, int min, int max)`
- `public static java.util.List< WeightedRandomChestContent > getItems(java.lang.String category, java.util.Random rnd)`
- `public static int getCount(java.lang.String category, java.util.Random rand)`
- `public static void addItem(java.lang.String category, WeightedRandomChestContent item)`
- `public static void removeItem(java.lang.String category, ItemStack item)`
- `public static ItemStack getOneItem(java.lang.String category, java.util.Random rand)`
- `public void addItem( WeightedRandomChestContent item)`
- `public void removeItem( ItemStack item)`
- `public java.util.List< WeightedRandomChestContent > getItems(java.util.Random rnd)`
- `public int getCount(java.util.Random rand)`
- `public ItemStack getOneItem(java.util.Random rand)`
- `public int getMin()`
- `public int getMax()`
- `public void setMin(int value)`
- `public void setMax(int value)`

## Description

Adds a new entry into the possible items to generate.
