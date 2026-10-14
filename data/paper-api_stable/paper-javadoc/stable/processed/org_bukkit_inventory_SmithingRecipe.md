---
title: "org.bukkit.inventory.SmithingRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/SmithingRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class SmithingRecipe**
`public class SmithingRecipe extends Object implements Recipe, Keyed`
- `@Deprecated(since="1.20.1") public SmithingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @Nullable @Nullable RecipeChoice base, @Nullable @Nullable RecipeChoice addition)`
- `@Deprecated public SmithingRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull ItemStack result, @Nullable @Nullable RecipeChoice base, @Nullable @Nullable RecipeChoice addition, boolean copyDataComponents)`
- `@NotNull public @NotNull RecipeChoice getBase()`
- `@NotNull public @NotNull RecipeChoice getAddition()`
- `@NotNull public @NotNull ItemStack getResult()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@Obsolete(since="1.20.5") public boolean willCopyNbt()`
- `public boolean willCopyDataComponents()`
