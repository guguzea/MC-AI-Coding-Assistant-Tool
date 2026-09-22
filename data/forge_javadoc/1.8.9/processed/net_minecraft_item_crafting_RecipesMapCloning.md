# RecipesMapCloning

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.RecipesMapCloning

## Class signature

```java
public class RecipesMapCloning extends java.lang.Object implements IRecipe
```

## Constructors

- `RecipesMapCloning()`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)` — Returns an Item that is the result of this recipe
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)` — Used to check if a recipe matches current crafting inventory