---
title: "ShapelessRecipes"
description: "public class ShapelessRecipes extends java.lang.Object implements IRecipe"
package: "net/minecraft/item/crafting"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/crafting/ShapelessRecipes.html"
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
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getRecipeSize()`
