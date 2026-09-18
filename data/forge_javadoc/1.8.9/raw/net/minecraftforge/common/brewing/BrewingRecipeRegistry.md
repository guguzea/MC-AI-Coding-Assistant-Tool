---
title: "BrewingRecipeRegistry"
description: "Adds a recipe to the registry."
package: "net/minecraftforge/common/brewing"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/brewing/BrewingRecipeRegistry.html"
sourceType: javadoc
---

# BrewingRecipeRegistry

## Class signature

```java
public class BrewingRecipeRegistry extends java.lang.Object
```

## Constructors

- `public BrewingRecipeRegistry()`

## Methods

- `public static boolean addRecipe( ItemStack input, ItemStack ingredient, ItemStack output)`
- `public static boolean addRecipe( ItemStack input, java.lang.String ingredient, ItemStack output)`
- `public static boolean addRecipe( IBrewingRecipe recipe)`
- `public static ItemStack getOutput( ItemStack input, ItemStack ingredient)`
- `public static boolean hasOuput( ItemStack input, ItemStack ingredient)`
- `public static boolean canBrew( ItemStack [] inputs, ItemStack ingredient, int[] inputIndexes)`
- `public static void brewPotions( ItemStack [] inputs, ItemStack ingredient, int[] inputIndexes)`
- `public static boolean isValidIngredient( ItemStack stack)`
- `public static boolean isValidInput( ItemStack stack)`
- `public static java.util.List< IBrewingRecipe > getRecipes()`

## Description

Adds a recipe to the registry.
