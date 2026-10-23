---
title: "org.bukkit.inventory.ShapelessRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/ShapelessRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public ShapelessRecipe&#8203;(@NotNull @NotNull ItemStack result)`
- `public ShapelessRecipe&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(@NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(@NotNull @NotNull Material ingredient)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(@NotNull @NotNull Material ingredient, int rawdata)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(int count, @NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(int count, @NotNull @NotNull Material ingredient)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(int count, @NotNull @NotNull Material ingredient, int rawdata)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(@NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient&#8203;(int count, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(@NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(int count, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(@NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(@NotNull @NotNull Material ingredient)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(@NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(int count, @NotNull @NotNull Material ingredient)`
- `@NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(int count, @NotNull @NotNull MaterialData ingredient)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(@NotNull @NotNull Material ingredient, int rawdata)`
- `@Deprecated @NotNull public @NotNull ShapelessRecipe removeIngredient&#8203;(int count, @NotNull @NotNull Material ingredient, int rawdata)`
- `@NotNull public @NotNull ItemStack getResult()`
- `@NotNull public @NotNull List<ItemStack> getIngredientList()`
- `@NotNull public @NotNull List<RecipeChoice> getChoiceList()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull String getGroup()`
- `public void setGroup&#8203;(@NotNull @NotNull String group)`
