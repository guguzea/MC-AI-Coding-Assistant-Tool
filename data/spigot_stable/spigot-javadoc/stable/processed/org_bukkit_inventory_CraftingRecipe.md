---
title: "org.bukkit.inventory.CraftingRecipe"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/CraftingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class CraftingRecipe**
`public abstract class CraftingRecipe extends Object implements Recipe, Keyed`
- `protected CraftingRecipe(@NotNull NamespacedKey key, @NotNull ItemStack result)`
- `@NotNull public NamespacedKey getKey()`
- `@NotNull public ItemStack getResult()`
- `@NotNull public String getGroup()`
- `public void setGroup(@NotNull String group)`
- `@NotNull public CraftingBookCategory getCategory()`
- `public void setCategory(@NotNull CraftingBookCategory category)`
- `@Internal @NotNull protected static ItemStack checkResult(@NotNull ItemStack result)`
