---
title: "CraftingManager"
description: "public class CraftingManager extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/item/crafting/CraftingManager.html"
sourceType: javadoc
---

# CraftingManager

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Methods

- `void addRecipe(IRecipe recipe)`
- `ShapedRecipes addRecipe(ItemStack stack, java.lang.Object... recipeComponents)`
- `void addShapelessRecipe(ItemStack stack, java.lang.Object... recipeComponents)`
- `ItemStack findMatchingRecipe(InventoryCrafting craftMatrix, World worldIn)`
- `static CraftingManager getInstance()`
- `java.util.List<IRecipe> getRecipeList()`
- `ItemStack [] getRemainingItems(InventoryCrafting craftMatrix, World worldIn)`
