---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/ShapedRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ShapedRecipe**
`public class ShapedRecipe extends CraftingRecipe`
- `@Deprecated(since="1.12") public ShapedRecipe(@NotNull @NotNull ItemStack result)`
- `public ShapedRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull ShapedRecipe shape(@NotNull @NotNull String... shape)`
- `@NotNull @Deprecated public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull Material ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull Material ingredient, int raw)`
- `@NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull RecipeChoice ingredient)`
- `@NotNull public @NotNull ShapedRecipe setIngredient(char key, @NotNull @NotNull ItemStack item)`
- `@Deprecated @NotNull public @NotNull Map<Character, ItemStack> getIngredientMap()`
- `@NotNull public @NotNull Map<Character, RecipeChoice> getChoiceMap()`
- `@NotNull public @NotNull String @NotNull [] getShape()`
