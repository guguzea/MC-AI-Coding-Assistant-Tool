# ShapelessOreRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.ShapelessOreRecipe

## Class signature

```java
public class ShapelessOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapelessOreRecipe(Block result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(Item result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(ItemStack result, java.lang.Object... recipe)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting var1)`
- `NonNullList<java.lang.Object> getInput()` — Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()`
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting var1, World world)`

## Fields

- `protected NonNullList<java.lang.Object> input`
- `protected ItemStack output`