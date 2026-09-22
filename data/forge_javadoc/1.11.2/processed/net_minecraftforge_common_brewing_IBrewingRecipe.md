# IBrewingRecipe

## Class signature

```java
public interface IBrewingRecipe
```

## Methods

- `ItemStack getOutput(ItemStack input, ItemStack ingredient)` — Returns the output when the passed input is brewed with the passed ingredient.
- `boolean isIngredient(ItemStack ingredient)` — Returns true if the passed ItemStack is an ingredient for this recipe.
- `boolean isInput(ItemStack input)` — Returns true is the passed ItemStack is an input for this recipe.