---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/inventory/ShapedRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public ShapedRecipe(@NotNull @NotNull ItemStack result)`
- `public ShapedRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull ShapedRecipe shape(@NotNull @NotNull String... shape)`
- `@NotNull @Deprecated public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull Material ingredient)`
- `@Deprecated @NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull Material ingredient, int raw)`
- `@NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull ItemStack item)`
- `@Deprecated @NotNull public @NotNull Map<Character,ItemStack> getIngredientMap()`
- `@NotNull public @NotNull Map<Character,RecipeChoice> getChoiceMap()`
- `@NotNull public @NotNull String[] getShape()`
