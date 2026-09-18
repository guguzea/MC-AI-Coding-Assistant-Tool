---
title: "ShapedOreRecipe"
description: "Deprecated."
package: "net/minecraftforge/oredict"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/oredict/ShapedOreRecipe.html"
sourceType: javadoc
---

# ShapedOreRecipe

## Class signature

```java
public class ShapedOreRecipe extends IForgeRegistryEntry.Impl < IRecipe > implements IShapedRecipe
```

## Constructors

- `public ShapedOreRecipe( ResourceLocation group, Block result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( ResourceLocation group, Item result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( ResourceLocation group, ItemStack result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( ResourceLocation group, ItemStack result, CraftingHelper.ShapedPrimer primer)`

## Methods

- `public ItemStack getCraftingResult( InventoryCrafting var1)`
- `public ItemStack getRecipeOutput()`
- `public boolean matches( InventoryCrafting inv, World world)`
- `protected boolean checkMatch( InventoryCrafting inv, int startX, int startY, boolean mirror)`
- `public ShapedOreRecipe setMirrored(boolean mirror)`
- `public NonNullList < Ingredient > getIngredients()`
- `@Deprecated public int getWidth()`
- `public int getRecipeWidth()`
- `@Deprecated public int getHeight()`
- `public int getRecipeHeight()`
- `public java.lang.String getGroup()`
- `public boolean canFit(int width, int height)`
- `public static ShapedOreRecipe factory( JsonContext context, JsonObject json)`

## Description

Deprecated.
