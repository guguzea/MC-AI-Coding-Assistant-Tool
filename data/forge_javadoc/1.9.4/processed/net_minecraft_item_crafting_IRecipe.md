# IRecipe

## Class signature

```java
public interface IRecipe
```

## Methods

- `boolean matches( InventoryCrafting inv, World worldIn)`
- `@Nullable ItemStack getCraftingResult( InventoryCrafting inv)`
- `int getRecipeSize()`
- `@Nullable ItemStack getRecipeOutput()`
- `ItemStack [] getRemainingItems( InventoryCrafting inv)`