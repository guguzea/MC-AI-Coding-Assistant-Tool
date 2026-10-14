---
title: "org.bukkit.inventory.SmithingTrimRecipe"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/SmithingTrimRecipe.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class SmithingTrimRecipe**
`public class SmithingTrimRecipe extends SmithingRecipe implements ComplexRecipe`
- `public SmithingTrimRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull RecipeChoice template, @NotNull @NotNull RecipeChoice base, @NotNull @NotNull RecipeChoice addition, @NotNull @NotNull TrimPattern pattern)`
- `public SmithingTrimRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull RecipeChoice template, @NotNull @NotNull RecipeChoice base, @NotNull @NotNull RecipeChoice addition, @NotNull @NotNull TrimPattern pattern, boolean copyDataComponents)`
- `@Deprecated(since="1.21.5", forRemoval=true) public SmithingTrimRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull RecipeChoice template, @NotNull @NotNull RecipeChoice base, @NotNull @NotNull RecipeChoice addition)`
- `@Deprecated(since="1.21.5", forRemoval=true) public SmithingTrimRecipe(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull RecipeChoice template, @NotNull @NotNull RecipeChoice base, @NotNull @NotNull RecipeChoice addition, boolean copyDataComponents)`
- `@NotNull public @NotNull RecipeChoice getTemplate()`
- `@NotNull public @NotNull TrimPattern getTrimPattern()`
