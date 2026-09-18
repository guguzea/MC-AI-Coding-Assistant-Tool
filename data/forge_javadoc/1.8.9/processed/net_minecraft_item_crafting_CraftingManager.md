# CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Methods

- `public static CraftingManager getInstance()`
- `public ShapedRecipes addRecipe( ItemStack stack, java.lang.Object... recipeComponents)`
- `public void addShapelessRecipe( ItemStack stack, java.lang.Object... recipeComponents)`
- `public void addRecipe( IRecipe recipe)`
- `public ItemStack findMatchingRecipe( InventoryCrafting p_82787_1_, World worldIn)`
- `public ItemStack [] func_180303_b( InventoryCrafting p_180303_1_, World worldIn)`
- `public java.util.List< IRecipe > getRecipeList()`

## Description

Adds an IRecipe to the list of crafting recipes.