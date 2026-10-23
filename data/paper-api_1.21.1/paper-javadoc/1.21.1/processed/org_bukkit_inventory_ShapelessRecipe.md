---
title: "org.bukkit.inventory.ShapelessRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/inventory/ShapelessRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public ShapelessRecipe(@NotNull @NotNull ItemStack result)`
- `public ShapelessRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull @Deprecated public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull Material ingredient)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull Material ingredient, int rawdata)`
- `@NotNull @Deprecated public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull Material ingredient)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull Material ingredient, int rawdata)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient(int count, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient(@NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient(@NotNull @NotNull Material ingredient)`
- `@NotNull @Deprecated public @NotNull ShapelessRecipe removeIngredient(@NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient(int count, @NotNull @NotNull Material ingredient)`
- `@NotNull @Deprecated public @NotNull ShapelessRecipe removeIngredient(int count, @NotNull @NotNull MaterialData ingredient)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe removeIngredient(@NotNull @NotNull Material ingredient, int rawdata)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe removeIngredient(int count, @NotNull @NotNull Material ingredient, int rawdata)`
- `@Deprecated @NotNull public @NotNull List<ItemStack> getIngredientList()`
- `@NotNull public @NotNull List<RecipeChoice> getChoiceList()`
