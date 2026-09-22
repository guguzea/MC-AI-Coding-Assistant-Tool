---
title: "ShapedRecipes"
description: "public class ShapedRecipes extends java.lang.Object implements IRecipe"
package: "net/minecraft/item/crafting"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/ShapedRecipes.html"
sourceType: javadoc
---

# ShapedRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapedRecipes(int width, int height, ItemStack [] p_i1917_3_, ItemStack output)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)` — Returns an Item that is the result of this recipe
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)` — Used to check if a recipe matches current crafting inventory

## Fields

- `int recipeHeight` — How many vertical slots this recipe uses.
- `ItemStack [] recipeItems` — Is a array of ItemStack that composes the recipe.
- `int recipeWidth` — How many horizontal slots this recipe is wide.
