---
title: "ShapelessRecipes"
description: "Returns an Item that is the result of this recipe"
package: "net/minecraft/item/crafting"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/ShapelessRecipes.html"
sourceType: javadoc
---

# ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapelessRecipes( ItemStack output, java.util.List< ItemStack > inputList)`

## Methods

- `public ItemStack getRecipeOutput()`
- `public ItemStack [] getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getRecipeSize()`

## Description

Returns an Item that is the result of this recipe
