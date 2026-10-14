---
title: "org.bukkit.inventory.meta.KnowledgeBookMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/KnowledgeBookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface KnowledgeBookMeta**
`public interface KnowledgeBookMeta extends ItemMeta`
- `boolean hasRecipes()`
- `@NotNull List<NamespacedKey> getRecipes()`
- `void setRecipes(@NotNull List<NamespacedKey> recipes)`
- `void addRecipe(@NotNull NamespacedKey... recipes)`
- `@NotNull KnowledgeBookMeta clone()`
