---
title: "IBrewingRecipe"
description: "Returns the output when the passed input is brewed with the passed ingredient."
package: "net/minecraftforge/common/brewing"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/brewing/IBrewingRecipe.html"
sourceType: javadoc
---

# IBrewingRecipe

## Class signature

```java
public interface IBrewingRecipe
```

## Methods

- `boolean isInput(@Nonnull ItemStack input)`
- `boolean isIngredient(@Nonnull ItemStack ingredient)`
- `@Nonnull ItemStack getOutput(@Nonnull ItemStack input, @Nonnull ItemStack ingredient)`

## Description

Returns the output when the passed input is brewed with the passed ingredient.
