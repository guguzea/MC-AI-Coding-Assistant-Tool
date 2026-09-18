---
title: "CraftingManager"
description: "public class CraftingManager extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/crafting/CraftingManager.html"
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
- `@Nullable public ItemStack findMatchingRecipe( InventoryCrafting craftMatrix, World worldIn)`
- `public ItemStack [] getRemainingItems( InventoryCrafting craftMatrix, World worldIn)`
- `public java.util.List< IRecipe > getRecipeList()`
