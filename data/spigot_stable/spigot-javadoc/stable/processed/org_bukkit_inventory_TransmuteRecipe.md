---
title: "org.bukkit.inventory.TransmuteRecipe"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/TransmuteRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class TransmuteRecipe**
`public class TransmuteRecipe extends CraftingRecipe implements ComplexRecipe`
- `public TransmuteRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result, @NotNull RecipeChoice input, @NotNull RecipeChoice material, int minimumMaterialCount, int maximumMaterialCount, boolean addMaterialCountToResult)`
- `public TransmuteRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result, @NotNull RecipeChoice input, @NotNull RecipeChoice material)`
- `public TransmuteRecipe(@NotNull NamespacedKey key, @NotNull Material result, @NotNull RecipeChoice input, @NotNull RecipeChoice material)`
- `@NotNull public RecipeChoice getInput()`
- `@NotNull public RecipeChoice getMaterial()`
- `public int getMinimumMaterialCount()`
- `public int getMaximumMaterialCount()`
- `public boolean isAddMaterialCountToResult()`
