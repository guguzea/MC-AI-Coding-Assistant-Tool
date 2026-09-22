# ShapedRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapedRecipes(int width, int height, ItemStack [] ingredientsIn, ItemStack output)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()`
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)`

## Fields

- `int recipeHeight`
- `ItemStack [] recipeItems`
- `int recipeWidth`