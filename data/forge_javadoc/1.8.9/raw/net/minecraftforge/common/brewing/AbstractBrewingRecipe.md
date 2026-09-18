---
title: "AbstractBrewingRecipe"
description: "Returns the output when the passed input is brewed with the passed ingredient."
package: "net/minecraftforge/common/brewing"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/brewing/AbstractBrewingRecipe.html"
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

## Description

Returns the output when the passed input is brewed with the passed ingredient.
