# ShapelessRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapelessRecipes(ItemStack output, java.util.List<ItemStack> inputList)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()`
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)`

## Fields

- `java.util.List<ItemStack> recipeItems`