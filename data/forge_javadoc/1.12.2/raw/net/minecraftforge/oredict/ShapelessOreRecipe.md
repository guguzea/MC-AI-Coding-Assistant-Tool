---
title: "ShapelessOreRecipe"
description: "public class ShapelessOreRecipe extends IForgeRegistryEntry.Impl<IRecipe> implements IRecipe"
package: "net/minecraftforge/oredict"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/oredict/ShapelessOreRecipe.html"
sourceType: javadoc
---

# ShapelessOreRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<IRecipe> → net.minecraftforge.oredict.ShapelessOreRecipe

## Class signature

```java
public class ShapelessOreRecipe extends IForgeRegistryEntry.Impl<IRecipe> implements IRecipe
```

## Constructors

- `ShapelessOreRecipe(ResourceLocation group, Block result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(ResourceLocation group, Item result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(ResourceLocation group, ItemStack result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(ResourceLocation group, NonNullList<Ingredient> input, ItemStack result)`

## Methods

- `boolean canFit(int width, int height)`
- `static ShapelessOreRecipe factory(JsonContext context, JsonObject json)`
- `ItemStack getCraftingResult(InventoryCrafting var1)`
- `java.lang.String getGroup()`
- `NonNullList<Ingredient> getIngredients()`
- `ItemStack getRecipeOutput()`
- `boolean matches(InventoryCrafting inv, World world)`

## Fields

- `protected ResourceLocation group`
- `protected NonNullList<Ingredient> input`
- `protected boolean isSimple`
- `protected ItemStack output`
