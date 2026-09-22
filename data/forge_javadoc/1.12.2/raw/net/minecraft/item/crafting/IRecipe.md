---
title: "IRecipe"
description: "public interface IRecipe extends IForgeRegistryEntry<IRecipe>"
package: "net/minecraft/item/crafting"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/crafting/IRecipe.html"
sourceType: javadoc
---

# IRecipe

## Class signature

```java
public interface IRecipe extends IForgeRegistryEntry<IRecipe>
```

## Methods

- `boolean canFit(int width, int height)`
- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `default java.lang.String getGroup()`
- `default NonNullList<Ingredient> getIngredients()`
- `ItemStack getRecipeOutput()`
- `default NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `default boolean isDynamic()`
- `boolean matches(InventoryCrafting inv, World worldIn)`
