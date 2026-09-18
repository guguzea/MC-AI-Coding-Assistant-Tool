# FurnaceRecipes

## Class signature

```java
public class FurnaceRecipes extends java.lang.Object
```

## Methods

- `public static FurnaceRecipes instance()`
- `public void addSmeltingRecipeForBlock( Block input, ItemStack stack, float experience)`
- `public void addSmelting( Item input, ItemStack stack, float experience)`
- `public void addSmeltingRecipe( ItemStack input, ItemStack stack, float experience)`
- `public ItemStack getSmeltingResult( ItemStack stack)`
- `public java.util.Map< ItemStack , ItemStack > getSmeltingList()`
- `public float getSmeltingExperience( ItemStack stack)`