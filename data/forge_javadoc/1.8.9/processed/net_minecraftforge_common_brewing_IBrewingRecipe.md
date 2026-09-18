# IBrewingRecipe

## Class signature

```java
public interface IBrewingRecipe
```

## Methods

- `boolean isInput( ItemStack input)`
- `boolean isIngredient( ItemStack ingredient)`
- `ItemStack getOutput( ItemStack input, ItemStack ingredient)`

## Description

Returns the output when the passed input is brewed with the passed ingredient.