# CraftingManager

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Methods

- `void addRecipe(IRecipe recipe)`
- `ShapedRecipes addRecipe(ItemStack stack, java.lang.Object... recipeComponents)`
- `void addShapelessRecipe(ItemStack stack, java.lang.Object... recipeComponents)`
- `ItemStack findMatchingRecipe(InventoryCrafting craftMatrix, World worldIn)`
- `static CraftingManager getInstance()`
- `java.util.List<IRecipe> getRecipeList()`
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting craftMatrix, World worldIn)`