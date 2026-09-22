---
title: "IBrewingRecipe"
description: "public interface IBrewingRecipe"
package: "net/minecraftforge/common/brewing"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/brewing/IBrewingRecipe.html"
sourceType: javadoc
---

# IBrewingRecipe

## Class signature

```java
public interface IBrewingRecipe
```

## Methods

- `ItemStack getOutput(ItemStack input, ItemStack ingredient)` — Returns the output when the passed input is brewed with the passed ingredient.
- `boolean isIngredient(ItemStack ingredient)` — Returns true if the passed ItemStack is an ingredient for this recipe.
- `boolean isInput(ItemStack input)` — Returns true is the passed ItemStack is an input for this recipe.
