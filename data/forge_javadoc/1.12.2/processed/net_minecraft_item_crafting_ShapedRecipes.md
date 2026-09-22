# ShapedRecipes

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<IRecipe> → net.minecraft.item.crafting.ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends IForgeRegistryEntry.Impl<IRecipe> implements IShapedRecipe
```

## Constructors

- `ShapedRecipes(java.lang.String group, int width, int height, NonNullList<Ingredient> ingredients, ItemStack result)`

## Methods

- `boolean canFit(int width, int height)`
- `static ShapedRecipes deserialize(JsonObject p_193362_0_)`
- `static Ingredient deserializeIngredient(JsonElement p_193361_0_)`
- `static ItemStack deserializeItem(JsonObject p_192405_0_, boolean useCount)`
- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `java.lang.String getGroup()`
- `int getHeight()`
- `NonNullList<Ingredient> getIngredients()`
- `int getRecipeHeight()`
- `ItemStack getRecipeOutput()`
- `int getRecipeWidth()`
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `int getWidth()`
- `boolean matches(InventoryCrafting inv, World worldIn)`

## Fields

- `int recipeHeight`
- `NonNullList<Ingredient> recipeItems`
- `int recipeWidth`