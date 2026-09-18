---
title: "IRecipe"
description: "public interface IRecipe"
package: "net/minecraft/item/crafting"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/crafting/IRecipe.html"
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
- `NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
