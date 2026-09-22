---
title: "BrewingRecipeRegistry"
description: "public class BrewingRecipeRegistry extends java.lang.Object"
package: "net/minecraftforge/common/brewing"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/brewing/BrewingRecipeRegistry.html"
sourceType: javadoc
---

# BrewingRecipeRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.common.brewing.BrewingRecipeRegistry

## Class signature

```java
public class BrewingRecipeRegistry extends java.lang.Object
```

## Constructors

- `BrewingRecipeRegistry()`

## Methods

- `static boolean addRecipe(IBrewingRecipe recipe)` — Adds a recipe to the registry.
- `static boolean addRecipe(ItemStack input, ItemStack ingredient, ItemStack output)` — Adds a recipe to the registry.
- `static boolean addRecipe(ItemStack input, java.lang.String ingredient, ItemStack output)` — Adds a recipe to the registry.
- `static void brewPotions(NonNullList<ItemStack> inputs, ItemStack ingredient, int[] inputIndexes)` — Used by the brewing stand to brew its inventory Extra parameters exist to allow modders to create bigger brewing stands without much hassle
- `static boolean canBrew(NonNullList<ItemStack> inputs, ItemStack ingredient, int[] inputIndexes)` — Used by the brewing stand to determine if its contents can be brewed.
- `static ItemStack getOutput(ItemStack input, ItemStack ingredient)` — Returns the output ItemStack obtained by brewing the passed input and ingredient.
- `static java.util.List<IBrewingRecipe> getRecipes()` — Returns an unmodifiable list containing all the recipes in the registry
- `static boolean hasOutput(ItemStack input, ItemStack ingredient)` — Returns true if the passed input and ingredient have an output
- `static boolean isValidIngredient(ItemStack stack)` — Returns true if the passed ItemStack is a valid ingredient for any of the recipes in the registry.
- `static boolean isValidInput(ItemStack stack)` — Returns true if the passed ItemStack is a valid input for any of the recipes in the registry.
