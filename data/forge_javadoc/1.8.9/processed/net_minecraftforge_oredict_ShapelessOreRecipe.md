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

- `ItemStack getCraftingResult(InventoryCrafting var1)` — Returns an Item that is the result of this recipe
- `java.util.ArrayList<java.lang.Object> getInput()` — Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting var1, World world)` — Used to check if a recipe matches current crafting inventory

## Fields

- `protected java.util.ArrayList<java.lang.Object> input`
- `protected ItemStack output`