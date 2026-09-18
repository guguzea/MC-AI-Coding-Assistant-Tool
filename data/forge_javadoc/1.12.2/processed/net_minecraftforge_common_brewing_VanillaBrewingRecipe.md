# VanillaBrewingRecipe

## Class signature

```java
public class VanillaBrewingRecipe extends java.lang.Object implements IBrewingRecipe
```

## Constructors

- `public VanillaBrewingRecipe()`

## Methods

- `public boolean isInput( ItemStack stack)`
- `public boolean isIngredient( ItemStack stack)`
- `public ItemStack getOutput( ItemStack input, ItemStack ingredient)`

## Description

Used in BrewingRecipeRegistry to maintain the vanilla behaviour. Most of the code was simply adapted from net.minecraft.tileentity.TileEntityBrewingStand