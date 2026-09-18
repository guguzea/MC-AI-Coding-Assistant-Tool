---
title: "IRecipe"
description: "public interface IRecipe"
package: "net/minecraft/item/crafting"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/crafting/IRecipe.html"
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
