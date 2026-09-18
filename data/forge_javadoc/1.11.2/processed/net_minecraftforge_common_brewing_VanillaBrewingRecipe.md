# VanillaBrewingRecipe

## Class signature

```java
public class VanillaBrewingRecipe extends java.lang.Object implements IBrewingRecipe
```

## Constructors

- `public VanillaBrewingRecipe()`

## Methods

- `public boolean isInput(@Nonnull ItemStack stack)`
- `public boolean isIngredient(@Nonnull ItemStack stack)`
- `@Nonnull public ItemStack getOutput(@Nonnull ItemStack input, @Nonnull ItemStack ingredient)`

## Description

Used in BrewingRecipeRegistry to maintain the vanilla behaviour. Most of the code was simply adapted from net.minecraft.tileentity.TileEntityBrewingStand