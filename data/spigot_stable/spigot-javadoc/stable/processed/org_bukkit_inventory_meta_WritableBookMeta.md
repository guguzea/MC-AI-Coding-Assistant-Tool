---
title: "org.bukkit.inventory.meta.WritableBookMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/WritableBookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface WritableBookMeta**
`public interface WritableBookMeta extends ItemMeta`
- `boolean hasPages()`
- `@NotNull String getPage(int page)`
- `void setPage(int page, @NotNull String data)`
- `@NotNull List<String> getPages()`
- `void setPages(@NotNull List<String> pages)`
- `void setPages(@NotNull String... pages)`
- `void addPage(@NotNull String... pages)`
- `int getPageCount()`
- `@NotNull WritableBookMeta clone()`
