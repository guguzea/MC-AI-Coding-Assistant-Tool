---
title: "CraftingManager"
description: "Adds an IRecipe to the list of crafting recipes."
package: "net/minecraft/item/crafting"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/CraftingManager.html"
sourceType: javadoc
---

# CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Methods

- `public static CraftingManager getInstance()`
- `public ShapedRecipes addRecipe( ItemStack stack, java.lang.Object... recipeComponents)`
- `public void addShapelessRecipe( ItemStack stack, java.lang.Object... recipeComponents)`
- `public void addRecipe( IRecipe recipe)`
- `public ItemStack findMatchingRecipe( InventoryCrafting p_82787_1_, World worldIn)`
- `public ItemStack [] func_180303_b( InventoryCrafting p_180303_1_, World worldIn)`
- `public java.util.List< IRecipe > getRecipeList()`

## Description

Adds an IRecipe to the list of crafting recipes.
