# FurnaceRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.FurnaceRecipes

## Class signature

```java
public class FurnaceRecipes extends java.lang.Object
```

## Methods

- `void addSmelting(Item input, ItemStack stack, float experience)` — Adds a smelting recipe using an Item as the input item.
- `void addSmeltingRecipe(ItemStack input, ItemStack stack, float experience)` — Adds a smelting recipe using an ItemStack as the input for the recipe.
- `void addSmeltingRecipeForBlock(Block input, ItemStack stack, float experience)` — Adds a smelting recipe, where the input item is an instance of Block.
- `float getSmeltingExperience(ItemStack stack)`
- `java.util.Map<ItemStack, ItemStack> getSmeltingList()`
- `ItemStack getSmeltingResult(ItemStack stack)` — Returns the smelting result of an item.
- `static FurnaceRecipes instance()` — Returns an instance of FurnaceRecipes.