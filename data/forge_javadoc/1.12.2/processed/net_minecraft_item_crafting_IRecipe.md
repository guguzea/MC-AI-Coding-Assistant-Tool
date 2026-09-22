# IRecipe

## Class signature

```java
public interface IRecipe extends IForgeRegistryEntry<IRecipe>
```

## Methods

- `boolean canFit(int width, int height)`
- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `default java.lang.String getGroup()`
- `default NonNullList<Ingredient> getIngredients()`
- `ItemStack getRecipeOutput()`
- `default NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `default boolean isDynamic()`
- `boolean matches(InventoryCrafting inv, World worldIn)`