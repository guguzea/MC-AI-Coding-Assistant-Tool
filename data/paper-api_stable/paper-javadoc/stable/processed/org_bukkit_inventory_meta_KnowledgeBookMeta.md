---
title: "org.bukkit.inventory.meta.KnowledgeBookMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/KnowledgeBookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface KnowledgeBookMeta**
`public interface KnowledgeBookMeta extends ItemMeta`
- `boolean hasRecipes()`
- `@NotNull @NotNull List<NamespacedKey> getRecipes()`
- `void setRecipes(@NotNull @NotNull List<NamespacedKey> recipes)`
- `void addRecipe(@NotNull @NotNull NamespacedKey... recipes)`
- `@NotNull @NotNull KnowledgeBookMeta clone()`
