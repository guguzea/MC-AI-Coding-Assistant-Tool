---
title: "ShapelessRecipes"
description: "public class ShapelessRecipes extends IForgeRegistryEntry.Impl<IRecipe> implements IRecipe"
package: "net/minecraft/item/crafting"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/crafting/ShapelessRecipes.html"
sourceType: javadoc
---

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
