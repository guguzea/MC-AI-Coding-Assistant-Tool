---
title: "IRecipe"
description: "public interface IRecipe"
package: "net/minecraft/item/crafting"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/IRecipe.html"
sourceType: javadoc
---

# IRecipe

## Class signature

```java
public interface IRecipe
```

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)` — Returns an Item that is the result of this recipe
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)` — Used to check if a recipe matches current crafting inventory
