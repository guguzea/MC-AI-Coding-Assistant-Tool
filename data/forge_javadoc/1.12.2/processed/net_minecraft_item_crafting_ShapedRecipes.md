# ShapedRecipes

## Class signature

```java
public class ShapedRecipes extends IForgeRegistryEntry.Impl < IRecipe > implements IShapedRecipe
```

## Constructors

- `public ShapedRecipes(java.lang.String group, int width, int height, NonNullList < Ingredient > ingredients, ItemStack result)`

## Methods

- `public java.lang.String getGroup()`
- `public ItemStack getRecipeOutput()`
- `public NonNullList < ItemStack > getRemainingItems( InventoryCrafting inv)`
- `public NonNullList < Ingredient > getIngredients()`
- `public boolean canFit(int width, int height)`
- `public boolean matches( InventoryCrafting inv, World worldIn)`
- `public ItemStack getCraftingResult( InventoryCrafting inv)`
- `public int getWidth()`
- `public int getHeight()`
- `public static ShapedRecipes deserialize(JsonObject p_193362_0_)`
- `public static Ingredient deserializeIngredient(JsonElement p_193361_0_)`
- `public static ItemStack deserializeItem(JsonObject p_192405_0_, boolean useCount)`
- `public int getRecipeWidth()`
- `public int getRecipeHeight()`