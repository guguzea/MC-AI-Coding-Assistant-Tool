# BrewingRecipe

## Class signature

```java
public class BrewingRecipe extends AbstractBrewingRecipe < ItemStack >
```

## Constructors

- `public BrewingRecipe(@Nonnull ItemStack input, @Nonnull ItemStack ingredient, @Nonnull ItemStack output)`

## Methods

- `public boolean isIngredient(@Nonnull ItemStack stack)`

## Description

Returns true if the passed ItemStack is an ingredient for this recipe.