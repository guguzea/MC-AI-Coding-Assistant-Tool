---
title: "org.bukkit.inventory.ShapedRecipe"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/ShapedRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ShapedRecipe**
`public class ShapedRecipe extends CraftingRecipe`
- `@Deprecated(since="1.12") public ShapedRecipe(@NotNull ItemStack result)`
- `public ShapedRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result)`
- `@NotNull public ShapedRecipe shape(@NotNull String... shape)`
- `@NotNull public ShapedRecipe setIngredient(char key, @NotNull MaterialData ingredient)`
- `@NotNull public ShapedRecipe setIngredient(char key, @NotNull Material ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public ShapedRecipe setIngredient(char key, @NotNull Material ingredient, int raw)`
- `@NotNull public ShapedRecipe setIngredient(char key, @NotNull RecipeChoice ingredient)`
- `@NotNull public Map<Character, ItemStack> getIngredientMap()`
- `@NotNull public Map<Character, RecipeChoice> getChoiceMap()`
- `@NotNull public String[] getShape()`
