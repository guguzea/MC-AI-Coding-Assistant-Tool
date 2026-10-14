---
title: "org.bukkit.inventory.ShapelessRecipe"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/ShapelessRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ShapelessRecipe**
`public class ShapelessRecipe extends CraftingRecipe`
- `@Deprecated(since="1.12") public ShapelessRecipe(@NotNull ItemStack result)`
- `public ShapelessRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result)`
- `@NotNull public ShapelessRecipe addIngredient(@NotNull MaterialData ingredient)`
- `@NotNull public ShapelessRecipe addIngredient(@NotNull Material ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public ShapelessRecipe addIngredient(@NotNull Material ingredient, int rawdata)`
- `@NotNull public ShapelessRecipe addIngredient(int count, @NotNull MaterialData ingredient)`
- `@NotNull public ShapelessRecipe addIngredient(int count, @NotNull Material ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public ShapelessRecipe addIngredient(int count, @NotNull Material ingredient, int rawdata)`
- `@NotNull public ShapelessRecipe addIngredient(@NotNull RecipeChoice ingredient)`
- `@NotNull public ShapelessRecipe removeIngredient(@NotNull RecipeChoice ingredient)`
- `@NotNull public ShapelessRecipe removeIngredient(@NotNull Material ingredient)`
- `@NotNull public ShapelessRecipe removeIngredient(@NotNull MaterialData ingredient)`
- `@NotNull public ShapelessRecipe removeIngredient(int count, @NotNull Material ingredient)`
- `@NotNull public ShapelessRecipe removeIngredient(int count, @NotNull MaterialData ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public ShapelessRecipe removeIngredient(@NotNull Material ingredient, int rawdata)`
- `@Deprecated(since="1.6.2") @NotNull public ShapelessRecipe removeIngredient(int count, @NotNull Material ingredient, int rawdata)`
- `@NotNull public List<ItemStack> getIngredientList()`
- `@NotNull public List<RecipeChoice> getChoiceList()`
