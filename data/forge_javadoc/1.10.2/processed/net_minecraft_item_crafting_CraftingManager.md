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
- `@Nullable public ItemStack findMatchingRecipe( InventoryCrafting craftMatrix, World worldIn)`
- `public ItemStack [] getRemainingItems( InventoryCrafting craftMatrix, World worldIn)`
- `public java.util.List< IRecipe > getRecipeList()`