---
title: "IRecipe"
description: "Returns an Item that is the result of this recipe"
package: "net/minecraft/item/crafting"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/IRecipe.html"
sourceType: javadoc
---

# IRecipe

## Class signature

```java
public interface IRecipe
```

## Methods

- `boolean matches( InventoryCrafting inv, World worldIn)`
- `ItemStack getCraftingResult( InventoryCrafting inv)`
- `int getRecipeSize()`
- `ItemStack getRecipeOutput()`
- `ItemStack [] getRemainingItems( InventoryCrafting inv)`

## Description

Returns an Item that is the result of this recipe
