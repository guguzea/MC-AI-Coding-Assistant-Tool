---
title: "BrewingRecipeRegistry"
description: "Adds a recipe to the registry."
package: "net/minecraftforge/common/brewing"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/brewing/BrewingRecipeRegistry.html"
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
- `public static boolean hasOutput( ItemStack input, ItemStack ingredient)`
- `public static boolean canBrew( NonNullList < ItemStack > inputs, ItemStack ingredient, int[] inputIndexes)`
- `public static void brewPotions( NonNullList < ItemStack > inputs, ItemStack ingredient, int[] inputIndexes)`
- `public static boolean isValidIngredient( ItemStack stack)`
- `public static boolean isValidInput( ItemStack stack)`
- `public static java.util.List< IBrewingRecipe > getRecipes()`

## Description

Adds a recipe to the registry.
