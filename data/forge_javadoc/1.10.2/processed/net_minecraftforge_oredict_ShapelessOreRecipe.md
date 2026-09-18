# ShapelessOreRecipe

## Class signature

```java
public class ShapelessOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapelessOreRecipe( Block result, java.lang.Object... recipe)`
- `public ShapelessOreRecipe( Item result, java.lang.Object... recipe)`
- `public ShapelessOreRecipe( ItemStack result, java.lang.Object... recipe)`

## Methods

- `public int getRecipeSize()`
- `public ItemStack getRecipeOutput()`
- `public ItemStack getCraftingResult( InventoryCrafting var1)`
- `public boolean matches( InventoryCrafting var1, World world)`
- `public java.util.ArrayList<java.lang.Object> getInput()`
- `public ItemStack [] getRemainingItems( InventoryCrafting inv)`

## Description

Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.