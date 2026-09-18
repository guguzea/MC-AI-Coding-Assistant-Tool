---
title: "ShapelessRecipes"
description: "public class ShapelessRecipes extends IForgeRegistryEntry.Impl < IRecipe > implements IRecipe"
package: "net/minecraft/item/crafting"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/crafting/ShapelessRecipes.html"
sourceType: javadoc
---

# ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends IForgeRegistryEntry.Impl < IRecipe > implements IRecipe
```

## Constructors

- `public ShapelessRecipes(java.lang.String group, ItemStack output, NonNullList < Ingredient > ingredients)`

## Methods

- `public java.lang.String getGroup()`
- `public ItemStack getRecipeOutput()`
- `public NonNullList < Ingredient > getIngredients()`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public static ShapelessRecipes deserialize(JsonObject json)`
- `public boolean canFit(int width, int height)`
