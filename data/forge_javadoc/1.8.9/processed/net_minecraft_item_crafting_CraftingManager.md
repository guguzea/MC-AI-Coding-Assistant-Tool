# CraftingManager

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Methods

- `void addRecipe(IRecipe recipe)` — Adds an IRecipe to the list of crafting recipes.
- `ShapedRecipes addRecipe(ItemStack stack, java.lang.Object... recipeComponents)` — Adds a shaped recipe to the games recipe list.
- `void addShapelessRecipe(ItemStack stack, java.lang.Object... recipeComponents)` — Adds a shapeless crafting recipe to the the game.
- `ItemStack findMatchingRecipe(InventoryCrafting p_82787_1_, World worldIn)` — Retrieves an ItemStack that has multiple recipes for it.
- `ItemStack [] func_180303_b(InventoryCrafting p_180303_1_, World worldIn)`
- `static CraftingManager getInstance()` — Returns the static instance of this class
- `java.util.List<IRecipe> getRecipeList()`