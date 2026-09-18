# ShapedOreRecipe

## Class signature

```java
public class ShapedOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapedOreRecipe( Block result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( Item result, java.lang.Object... recipe)`
- `public ShapedOreRecipe( ItemStack result, java.lang.Object... recipe)`

## Methods

- `public ItemStack getCraftingResult( InventoryCrafting var1)`
- `public int getRecipeSize()`
- `public ItemStack getRecipeOutput()`
- `public boolean matches( InventoryCrafting inv, World world)`
- `protected boolean checkMatch( InventoryCrafting inv, int startX, int startY, boolean mirror)`
- `public ShapedOreRecipe setMirrored(boolean mirror)`
- `public java.lang.Object[] getInput()`
- `public ItemStack [] getRemainingItems( InventoryCrafting inv)`

## Description

Returns an Item that is the result of this recipe