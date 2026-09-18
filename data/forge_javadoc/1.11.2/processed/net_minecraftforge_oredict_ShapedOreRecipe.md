# ShapedOreRecipe

## Class signature

```java
public class ShapedOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapedOreRecipe( Block result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( Item result, java.lang.Object... recipe)`
- `public ShapedOreRecipe(@Nonnull ItemStack result, java.lang.Object... recipe)`

## Methods

- `@Nonnull public ItemStack getCraftingResult(@Nonnull InventoryCrafting var1)`
- `public int getRecipeSize()`
- `@Nonnull public ItemStack getRecipeOutput()`
- `public boolean matches( InventoryCrafting inv, World world)`
- `protected boolean checkMatch( InventoryCrafting inv, int startX, int startY, boolean mirror)`
- `public ShapedOreRecipe setMirrored(boolean mirror)`
- `public java.lang.Object[] getInput()`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public int getWidth()`
- `public int getHeight()`

## Description

Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.