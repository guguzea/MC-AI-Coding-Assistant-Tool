---
title: "FurnaceRecipes"
description: "public class FurnaceRecipes extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/crafting/FurnaceRecipes.html"
sourceType: javadoc
---

# FurnaceRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.FurnaceRecipes

## Class signature

```java
public class FurnaceRecipes extends java.lang.Object
```

## Methods

- `void addSmelting(Item input, ItemStack stack, float experience)` — Adds a smelting recipe using an Item as the input item.
- `void addSmeltingRecipe(ItemStack input, ItemStack stack, float experience)` — Adds a smelting recipe using an ItemStack as the input for the recipe.
- `void addSmeltingRecipeForBlock(Block input, ItemStack stack, float experience)` — Adds a smelting recipe, where the input item is an instance of Block.
- `float getSmeltingExperience(ItemStack stack)`
- `java.util.Map<ItemStack, ItemStack> getSmeltingList()`
- `ItemStack getSmeltingResult(ItemStack stack)` — Returns the smelting result of an item.
- `static FurnaceRecipes instance()` — Returns an instance of FurnaceRecipes.
