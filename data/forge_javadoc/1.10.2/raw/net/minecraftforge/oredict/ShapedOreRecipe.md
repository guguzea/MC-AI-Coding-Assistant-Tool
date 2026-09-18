---
title: "ShapedOreRecipe"
description: "Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself."
package: "net/minecraftforge/oredict"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/oredict/ShapedOreRecipe.html"
sourceType: javadoc
---

# ShapedOreRecipe

## Class signature

```java
public class ShapedOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapedOreRecipe( Block result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( Item result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( ItemStack result, java.lang.Object... recipe)`

## Methods

- `public ItemStack getCraftingResult( InventoryCrafting var1)`
- `public int getRecipeSize()`
- `public ItemStack getRecipeOutput()`
- `public boolean matches( InventoryCrafting inv, World world)`
- `protected boolean checkMatch( InventoryCrafting inv, int startX, int startY, boolean mirror)`
- `public ShapedOreRecipe setMirrored(boolean mirror)`
- `public java.lang.Object[] getInput()`
- `public ItemStack [] getRemainingItems( InventoryCrafting inv)`

## Description

Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.
