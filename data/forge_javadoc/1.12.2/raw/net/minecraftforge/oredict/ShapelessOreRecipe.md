---
title: "ShapelessOreRecipe"
description: "public class ShapelessOreRecipe extends IForgeRegistryEntry.Impl < IRecipe > implements IRecipe"
package: "net/minecraftforge/oredict"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/oredict/ShapelessOreRecipe.html"
sourceType: javadoc
---

# ShapelessOreRecipe

## Class signature

```java
public class ShapelessOreRecipe extends IForgeRegistryEntry.Impl < IRecipe > implements IRecipe
```

## Constructors

- `public ShapelessOreRecipe( ResourceLocation group, Block result, java.lang.Object... recipe)`
- `public ShapelessOreRecipe( ResourceLocation group, Item result, java.lang.Object... recipe)`
- `public ShapelessOreRecipe( ResourceLocation group, NonNullList < Ingredient > input, ItemStack result)`
- `public ShapelessOreRecipe( ResourceLocation group, ItemStack result, java.lang.Object... recipe)`

## Methods

- `public ItemStack getRecipeOutput()`
- `public ItemStack getCraftingResult( InventoryCrafting var1)`
- `public boolean matches( InventoryCrafting inv, World world)`
- `public NonNullList < Ingredient > getIngredients()`
- `public java.lang.String getGroup()`
- `public boolean canFit(int width, int height)`
- `public static ShapelessOreRecipe factory( JsonContext context, JsonObject json)`
