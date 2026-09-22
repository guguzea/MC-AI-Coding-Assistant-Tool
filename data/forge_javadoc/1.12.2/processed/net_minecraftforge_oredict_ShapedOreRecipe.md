# ShapedOreRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<IRecipe> → net.minecraftforge.oredict.ShapedOreRecipe

## Class signature

```java
public class ShapedOreRecipe extends IForgeRegistryEntry.Impl<IRecipe> implements IShapedRecipe
```

## Constructors

- `ShapedOreRecipe(ResourceLocation group, Block result, java.lang.Object... recipe)`
- `ShapedOreRecipe(ResourceLocation group, Item result, java.lang.Object... recipe)`
- `ShapedOreRecipe(ResourceLocation group, ItemStack result, CraftingHelper.ShapedPrimer primer)`
- `ShapedOreRecipe(ResourceLocation group, ItemStack result, java.lang.Object... recipe)`

## Methods

- `boolean canFit(int width, int height)`
- `protected boolean checkMatch(InventoryCrafting inv, int startX, int startY, boolean mirror)` — Based on ShapedRecipes.checkMatch(InventoryCrafting, int, int, boolean)
- `static ShapedOreRecipe factory(JsonContext context, JsonObject json)`
- `ItemStack getCraftingResult(InventoryCrafting var1)`
- `java.lang.String getGroup()`
- `@Deprecated int getHeight()`
- `NonNullList<Ingredient> getIngredients()`
- `int getRecipeHeight()`
- `ItemStack getRecipeOutput()`
- `int getRecipeWidth()`
- `@Deprecated int getWidth()`
- `boolean matches(InventoryCrafting inv, World world)`
- `ShapedOreRecipe setMirrored(boolean mirror)`

## Fields

- `protected ResourceLocation group`
- `protected int height`
- `protected NonNullList<Ingredient> input`
- `static int MAX_CRAFT_GRID_HEIGHT`
- `static int MAX_CRAFT_GRID_WIDTH`
- `protected boolean mirrored`
- `protected ItemStack output`
- `protected int width`