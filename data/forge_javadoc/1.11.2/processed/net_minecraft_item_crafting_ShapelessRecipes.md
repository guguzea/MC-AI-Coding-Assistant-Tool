# ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `public ShapelessRecipes( ItemStack output, java.util.List< ItemStack > inputList)`

## Methods

- `public ItemStack getRecipeOutput()`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getRecipeSize()`