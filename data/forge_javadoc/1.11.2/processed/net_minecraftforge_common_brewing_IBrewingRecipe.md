# IBrewingRecipe

## Class signature

```java
public interface IBrewingRecipe
```

## Methods

- `boolean isInput(@Nonnull ItemStack input)`
- `boolean isIngredient(@Nonnull ItemStack ingredient)`
- `@Nonnull ItemStack getOutput(@Nonnull ItemStack input, @Nonnull ItemStack ingredient)`

## Description

Returns the output when the passed input is brewed with the passed ingredient.