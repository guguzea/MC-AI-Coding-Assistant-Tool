---
title: "AbstractBrewingRecipe"
description: "Returns the output when the passed input is brewed with the passed ingredient."
package: "net/minecraftforge/common/brewing"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/brewing/AbstractBrewingRecipe.html"
sourceType: javadoc
---

# AbstractBrewingRecipe

## Class signature

```java
public abstract class AbstractBrewingRecipe<T> extends java.lang.Object implements IBrewingRecipe
```

## Constructors

- `protected AbstractBrewingRecipe( ItemStack input, T ingredient, ItemStack output)`

## Methods

- `public boolean isInput( ItemStack stack)`
- `public ItemStack getOutput( ItemStack input, ItemStack ingredient)`
- `public ItemStack getInput()`
- `public T getIngredient()`
- `public ItemStack getOutput()`

## Description

Returns the output when the passed input is brewed with the passed ingredient.
