---
title: "FurnaceRecipes"
description: "Adds a smelting recipe using an Item as the input item."
package: "net/minecraft/item/crafting"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/FurnaceRecipes.html"
sourceType: javadoc
---

# FurnaceRecipes

## Class signature

```java
public class FurnaceRecipes extends java.lang.Object
```

## Methods

- `public static FurnaceRecipes instance()`
- `public void addSmeltingRecipeForBlock( Block input, ItemStack stack, float experience)`
- `public void addSmelting( Item input, ItemStack stack, float experience)`
- `public void addSmeltingRecipe( ItemStack input, ItemStack stack, float experience)`
- `public ItemStack getSmeltingResult( ItemStack stack)`
- `public java.util.Map< ItemStack , ItemStack > getSmeltingList()`
- `public float getSmeltingExperience( ItemStack stack)`

## Description

Adds a smelting recipe using an Item as the input item.
