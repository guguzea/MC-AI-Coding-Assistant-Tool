# IRecipe

## Class signature

```java
public interface IRecipe extends IForgeRegistryEntry < IRecipe >
```

## Methods

- `boolean matches( InventoryCrafting inv, World worldIn)`
- `ItemStack getCraftingResult( InventoryCrafting inv)`
- `boolean canFit(int width, int height)`
- `ItemStack getRecipeOutput()`
- `default NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `default NonNullList < Ingredient > getIngredients()`
- `default boolean isDynamic()`
- `default java.lang.String getGroup()`