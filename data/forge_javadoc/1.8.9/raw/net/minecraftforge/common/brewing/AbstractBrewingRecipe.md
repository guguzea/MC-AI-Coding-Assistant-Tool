---
title: "AbstractBrewingRecipe"
description: "public abstract class AbstractBrewingRecipe<T> extends java.lang.Object implements IBrewingRecipe"
package: "net/minecraftforge/common/brewing"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/brewing/AbstractBrewingRecipe.html"
sourceType: javadoc
---

# AbstractBrewingRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.common.brewing.AbstractBrewingRecipe<T>

## Class signature

```java
public abstract class AbstractBrewingRecipe<T> extends java.lang.Object implements IBrewingRecipe
```

## Constructors

- `AbstractBrewingRecipe(ItemStack input, T ingredient, ItemStack output)`

## Methods

- `ItemStack getOutput(ItemStack input, ItemStack ingredient)` — Returns the output when the passed input is brewed with the passed ingredient.
- `boolean isInput(ItemStack stack)` — Returns true is the passed ItemStack is an input for this recipe.

## Fields

- `T ingredient`
- `ItemStack input`
- `ItemStack output`
