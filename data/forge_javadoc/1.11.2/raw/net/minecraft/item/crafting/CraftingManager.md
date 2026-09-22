---
title: "CraftingManager"
description: "public class CraftingManager extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/crafting/CraftingManager.html"
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
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting craftMatrix, World worldIn)`
