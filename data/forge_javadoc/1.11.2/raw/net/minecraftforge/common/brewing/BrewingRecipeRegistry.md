---
title: "BrewingRecipeRegistry"
description: "Adds a recipe to the registry."
package: "net/minecraftforge/common/brewing"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/brewing/BrewingRecipeRegistry.html"
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

- `public static boolean addRecipe(@Nonnull ItemStack input, @Nonnull ItemStack ingredient, @Nonnull ItemStack output)`
- `public static boolean addRecipe(@Nonnull ItemStack input, @Nonnull java.lang.String ingredient, @Nonnull ItemStack output)`
- `public static boolean addRecipe( IBrewingRecipe recipe)`
- `@Nonnull public static ItemStack getOutput(@Nonnull ItemStack input, @Nonnull ItemStack ingredient)`
- `public static boolean hasOutput(@Nonnull ItemStack input, @Nonnull ItemStack ingredient)`
- `public static boolean canBrew( NonNullList < ItemStack > inputs, @Nonnull ItemStack ingredient, int[] inputIndexes)`
- `public static void brewPotions( NonNullList < ItemStack > inputs, @Nonnull ItemStack ingredient, int[] inputIndexes)`
- `public static boolean isValidIngredient(@Nonnull ItemStack stack)`
- `public static boolean isValidInput(@Nonnull ItemStack stack)`
- `public static java.util.List< IBrewingRecipe > getRecipes()`

## Description

Adds a recipe to the registry.
