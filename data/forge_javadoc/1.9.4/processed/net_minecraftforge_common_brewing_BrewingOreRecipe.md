# BrewingOreRecipe

## Class signature

```java
public class BrewingOreRecipe extends AbstractBrewingRecipe <java.util.List< ItemStack >>
```

## Constructors

- `public BrewingOreRecipe( ItemStack input, java.lang.String ingredient, ItemStack output)`
- `public BrewingOreRecipe( ItemStack input, java.util.List< ItemStack > ingredient, ItemStack output)`

## Methods

- `public boolean isIngredient( ItemStack stack)`

## Description

Returns true if the passed ItemStack is an ingredient for this recipe.