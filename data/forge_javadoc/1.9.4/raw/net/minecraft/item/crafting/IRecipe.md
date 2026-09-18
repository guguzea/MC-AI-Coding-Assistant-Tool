---
title: "IRecipe"
description: "public interface IRecipe"
package: "net/minecraft/item/crafting"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/item/crafting/IRecipe.html"
sourceType: javadoc
---

# IRecipe

## Class signature

```java
public interface IRecipe
```

## Methods

- `boolean matches( InventoryCrafting inv, World worldIn)`
- `@Nullable ItemStack getCraftingResult( InventoryCrafting inv)`
- `int getRecipeSize()`
- `@Nullable ItemStack getRecipeOutput()`
- `ItemStack [] getRemainingItems( InventoryCrafting inv)`
