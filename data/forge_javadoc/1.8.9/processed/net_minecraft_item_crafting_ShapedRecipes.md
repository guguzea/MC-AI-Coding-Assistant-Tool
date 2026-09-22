# ShapedRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapedRecipes(int width, int height, ItemStack [] p_i1917_3_, ItemStack output)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)` — Returns an Item that is the result of this recipe
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)` — Used to check if a recipe matches current crafting inventory

## Fields

- `int recipeHeight` — How many vertical slots this recipe uses.
- `ItemStack [] recipeItems` — Is a array of ItemStack that composes the recipe.
- `int recipeWidth` — How many horizontal slots this recipe is wide.