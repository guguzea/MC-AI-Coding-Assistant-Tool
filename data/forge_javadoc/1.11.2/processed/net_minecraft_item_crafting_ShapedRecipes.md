# ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapedRecipes(int width, int height, ItemStack [] ingredientsIn, ItemStack output)`

## Methods

- `public ItemStack getRecipeOutput()`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getRecipeSize()`