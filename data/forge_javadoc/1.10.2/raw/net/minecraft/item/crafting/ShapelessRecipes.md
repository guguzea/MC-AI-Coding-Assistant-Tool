---
title: "ShapelessRecipes"
description: "public class ShapelessRecipes extends java.lang.Object implements IRecipe"
package: "net/minecraft/item/crafting"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/crafting/ShapelessRecipes.html"
sourceType: javadoc
---

# ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapelessRecipes( ItemStack output, java.util.List< ItemStack > inputList)`

## Methods

- `@Nullable public ItemStack getRecipeOutput()`
- `public ItemStack [] getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `@Nullable public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getRecipeSize()`
