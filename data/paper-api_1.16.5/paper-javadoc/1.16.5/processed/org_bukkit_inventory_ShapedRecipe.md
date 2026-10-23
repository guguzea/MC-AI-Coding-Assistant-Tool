---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/ShapedRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public ShapedRecipe&#8203;(@NotNull @NotNull ItemStack result)`
- `public ShapedRecipe&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull ShapedRecipe shape&#8203;(@NotNull @NotNull String... shape)`
- `@NotNull public @NotNull ShapedRecipe setIngredient&#8203;(char key, @NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapedRecipe setIngredient&#8203;(char key, @NotNull @NotNull Material ingredient)`
- `@Deprecated @NotNull public @NotNull ShapedRecipe setIngredient&#8203;(char key, @NotNull @NotNull Material ingredient, int raw)`
- `@NotNull public @NotNull ShapedRecipe setIngredient&#8203;(char key, @NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapedRecipe setIngredient&#8203;(char key, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull Map<Character,&#8203;ItemStack> getIngredientMap()`
- `@NotNull public @NotNull Map<Character,&#8203;RecipeChoice> getChoiceMap()`
- `@NotNull public @NotNull String[] getShape()`
- `@NotNull public @NotNull ItemStack getResult()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull String getGroup()`
- `public void setGroup&#8203;(@NotNull @NotNull String group)`
