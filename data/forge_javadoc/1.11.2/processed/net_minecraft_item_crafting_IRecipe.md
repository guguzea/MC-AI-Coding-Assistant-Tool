# IRecipe

## Class signature

```java
public interface IRecipe
```

## Methods

- `boolean matches( InventoryCrafting inv, World worldIn)`
- `ItemStack getCraftingResult( InventoryCrafting inv)`
- `int getRecipeSize()`
- `ItemStack getRecipeOutput()`
- `NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`