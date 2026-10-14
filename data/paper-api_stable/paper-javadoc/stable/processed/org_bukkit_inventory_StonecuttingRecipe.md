---
title: "org.bukkit.inventory.StonecuttingRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/StonecuttingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class StonecuttingRecipe**
`public class StonecuttingRecipe extends Object implements Recipe, Keyed`
- `public StonecuttingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @NotNull @NotNull Material source)`
- `public StonecuttingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @NotNull @NotNull RecipeChoice input)`
- `@NotNull public @NotNull StonecuttingRecipe setInput(@NotNull @NotNull Material input)`
- `@Deprecated @NotNull public @NotNull ItemStack getInput()`
- `@NotNull public @NotNull StonecuttingRecipe setInputChoice(@NotNull @NotNull RecipeChoice input)`
- `@NotNull public @NotNull RecipeChoice getInputChoice()`
- `@NotNull public @NotNull ItemStack getResult()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull @Deprecated(since="26.1") public @NotNull String getGroup()`
- `@Deprecated(since="26.1") public void setGroup(@NotNull @NotNull String group)`
