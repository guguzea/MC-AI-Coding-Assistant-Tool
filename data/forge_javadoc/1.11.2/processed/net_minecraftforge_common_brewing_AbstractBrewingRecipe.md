# AbstractBrewingRecipe

## Class signature

```java
public abstract class AbstractBrewingRecipe<T> extends java.lang.Object implements IBrewingRecipe
```

## Constructors

- `protected AbstractBrewingRecipe(@Nonnull ItemStack input, @Nonnull T ingredient, @Nonnull ItemStack output)`

## Methods

- `public boolean isInput(@Nonnull ItemStack stack)`
- `@Nonnull public ItemStack getOutput(@Nonnull ItemStack input, @Nonnull ItemStack ingredient)`
- `@Nonnull public ItemStack getInput()`
- `@Nonnull public T getIngredient()`
- `@Nonnull public ItemStack getOutput()`

## Description

Returns the output when the passed input is brewed with the passed ingredient.