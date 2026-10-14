---
title: "org.bukkit.inventory.RecipeChoice.MaterialChoice"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/RecipeChoice.MaterialChoice.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class RecipeChoice.MaterialChoice**
`@Obsolete(since="1.21.11") public static sealed class RecipeChoice.MaterialChoice extends Object implements RecipeChoice`
- `protected MaterialChoice()`
- `public MaterialChoice(Material choice)`
- `public MaterialChoice(Material... choices)`
- `public MaterialChoice(Tag<Material> choices)`
- `public MaterialChoice(List<Material> choices)`
- `public boolean test(ItemStack t)`
- `@Deprecated(since="1.13.1") public ItemStack getItemStack()`
- `public List<Material> getChoices()`
- `public RecipeChoice.MaterialChoice clone()`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `public RecipeChoice validate(boolean allowEmptyRecipes)`
