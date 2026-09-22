# ShapelessRecipes

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<IRecipe> → net.minecraft.item.crafting.ShapelessRecipes

## Class signature

```java
public class ShapelessRecipes extends IForgeRegistryEntry.Impl<IRecipe> implements IRecipe
```

## Constructors

- `ShapelessRecipes(java.lang.String group, ItemStack output, NonNullList<Ingredient> ingredients)`

## Methods

- `boolean canFit(int width, int height)`
- `static ShapelessRecipes deserialize(JsonObject json)`
- `ItemStack getCraftingResult(InventoryCrafting inv)`
- `java.lang.String getGroup()`
- `NonNullList<Ingredient> getIngredients()`
- `ItemStack getRecipeOutput()`
- `NonNullList<ItemStack> getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World worldIn)`

## Fields

- `NonNullList<Ingredient> recipeItems`