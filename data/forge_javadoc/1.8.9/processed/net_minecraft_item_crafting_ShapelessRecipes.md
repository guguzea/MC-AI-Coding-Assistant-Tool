# ShapelessRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapelessRecipes(ItemStack output, java.util.List<ItemStack> inputList)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)` — Returns an Item that is the result of this recipe
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)` — Used to check if a recipe matches current crafting inventory

## Fields

- `java.util.List<ItemStack> recipeItems`