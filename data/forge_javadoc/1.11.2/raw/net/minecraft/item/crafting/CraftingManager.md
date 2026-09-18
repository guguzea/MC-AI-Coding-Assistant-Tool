---
title: "CraftingManager"
description: "public class CraftingManager extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/crafting/CraftingManager.html"
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
- `public ItemStack findMatchingRecipe( InventoryCrafting craftMatrix, World worldIn)`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting craftMatrix, World worldIn)`
- `public java.util.List< IRecipe > getRecipeList()`
