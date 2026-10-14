---
title: "org.bukkit.inventory.meta.BookMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/BookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BookMeta**
`public interface BookMeta extends WritableBookMeta`
- `boolean hasTitle()`
- `@Nullable String getTitle()`
- `boolean setTitle(@Nullable String title)`
- `boolean hasAuthor()`
- `@Nullable String getAuthor()`
- `void setAuthor(@Nullable String author)`
- `boolean hasGeneration()`
- `@Nullable BookMeta.Generation getGeneration()`
- `void setGeneration(@Nullable BookMeta.Generation generation)`
- `@NotNull BookMeta clone()`
- `@NotNull BookMeta.Spigot spigot()`
