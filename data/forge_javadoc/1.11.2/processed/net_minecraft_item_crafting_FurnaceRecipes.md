# FurnaceRecipes

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.FurnaceRecipes

## Class signature

```java
public class FurnaceRecipes extends java.lang.Object
```

## Methods

- `void addSmelting(Item input, ItemStack stack, float experience)`
- `void addSmeltingRecipe(ItemStack input, ItemStack stack, float experience)`
- `void addSmeltingRecipeForBlock(Block input, ItemStack stack, float experience)`
- `float getSmeltingExperience(ItemStack stack)`
- `java.util.Map<ItemStack, ItemStack> getSmeltingList()`
- `ItemStack getSmeltingResult(ItemStack stack)`
- `static FurnaceRecipes instance()`