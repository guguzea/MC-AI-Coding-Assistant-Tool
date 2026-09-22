# RecipeBookCloning

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.RecipeBookCloning

## Class signature

```java
public class RecipeBookCloning extends java.lang.Object implements IRecipe
```

## Constructors

- `RecipeBookCloning()`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)` — Returns an Item that is the result of this recipe
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)` — Used to check if a recipe matches current crafting inventory