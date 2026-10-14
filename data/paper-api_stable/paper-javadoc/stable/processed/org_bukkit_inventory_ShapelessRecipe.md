---
title: "org.bukkit.inventory.ShapelessRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/ShapelessRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ShapelessRecipe**
`public class ShapelessRecipe extends CraftingRecipe`
- `@Deprecated(since="1.12") public ShapelessRecipe(@NotNull @NotNull ItemStack result)`
- `public ShapelessRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull @Deprecated public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull Material ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public @NotNull ShapelessRecipe addIngredient(@NotNull @NotNull Material ingredient, int rawdata)`
- `@NotNull @Deprecated public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull MaterialData ingredient)`
- `@NotNull public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull Material ingredient)`
- `@Deprecated(since="1.6.2") @NotNull public @NotNull ShapelessRecipe addIngredient(int count, @NotNull @NotNull Material ingredient, int rawdata)`
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
- `@Deprecated(since="1.6.2") @NotNull public @NotNull ShapelessRecipe removeIngredient(@NotNull @NotNull Material ingredient, int rawdata)`
- `@Deprecated(since="1.6.2") @NotNull public @NotNull ShapelessRecipe removeIngredient(int count, @NotNull @NotNull Material ingredient, int rawdata)`
- `@Deprecated @NotNull public @NotNull List<ItemStack> getIngredientList()`
- `@NotNull public @NotNull List<RecipeChoice> getChoiceList()`
