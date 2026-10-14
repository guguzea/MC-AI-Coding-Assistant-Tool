---
title: "org.bukkit.inventory.CraftingRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/CraftingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class CraftingRecipe**
`public abstract class CraftingRecipe extends Object implements Recipe, Keyed`
- `protected CraftingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result)`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull ItemStack getResult()`
- `@NotNull public @NotNull String getGroup()`
- `public void setGroup(@NotNull @NotNull String group)`
- `@NotNull public @NotNull CraftingBookCategory getCategory()`
- `public void setCategory(@NotNull @NotNull CraftingBookCategory category)`
- `@Internal @NotNull protected static @NotNull ItemStack checkResult(@NotNull @NotNull ItemStack result)`
