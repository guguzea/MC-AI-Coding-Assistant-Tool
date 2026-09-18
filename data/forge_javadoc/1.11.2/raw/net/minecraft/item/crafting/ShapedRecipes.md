---
title: "ShapedRecipes"
description: "public class ShapedRecipes extends java.lang.Object implements IRecipe"
package: "net/minecraft/item/crafting"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/crafting/ShapedRecipes.html"
sourceType: javadoc
---

# ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapedRecipes(int width, int height, ItemStack [] ingredientsIn, ItemStack output)`

## Methods

- `public ItemStack getRecipeOutput()`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getRecipeSize()`
