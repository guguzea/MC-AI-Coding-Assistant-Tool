# BrewingOreRecipe

## Class signature

```java
public class BrewingOreRecipe extends AbstractBrewingRecipe <java.util.List< ItemStack >>
```

## Constructors

- `public BrewingOreRecipe(@Nonnull ItemStack input, @Nonnull java.lang.String ingredient, @Nonnull ItemStack output)`
- `public BrewingOreRecipe(@Nonnull ItemStack input, @Nonnull java.util.List< ItemStack > ingredient, @Nonnull ItemStack output)`

## Methods

- `public boolean isIngredient(@Nonnull ItemStack stack)`

## Description

Returns true if the passed ItemStack is an ingredient for this recipe.