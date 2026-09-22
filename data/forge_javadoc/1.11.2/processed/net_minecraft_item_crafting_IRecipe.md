# IRecipe

## Class signature

```java
public interface IRecipe
```

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()`
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)`