---
title: "FurnaceRecipes"
description: "public class FurnaceRecipes extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/crafting/FurnaceRecipes.html"
sourceType: javadoc
---

# FurnaceRecipes

## Class signature

```java
public class FurnaceRecipes extends java.lang.Object
```

## Methods

- `public static FurnaceRecipes instance()`
- `public void addSmeltingRecipeForBlock( Block input, ItemStack stack, float experience)`
- `public void addSmelting( Item input, ItemStack stack, float experience)`
- `public void addSmeltingRecipe( ItemStack input, ItemStack stack, float experience)`
- `@Nullable public ItemStack getSmeltingResult( ItemStack stack)`
- `public java.util.Map< ItemStack , ItemStack > getSmeltingList()`
- `public float getSmeltingExperience( ItemStack stack)`
