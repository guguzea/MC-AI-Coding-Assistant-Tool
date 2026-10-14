---
title: "org.bukkit.inventory.meta.WritableBookMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/WritableBookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface WritableBookMeta**
`public interface WritableBookMeta extends ItemMeta, BookLike`
- `boolean hasPages()`
- `@NotNull @NotNull String getPage(int page)`
- `void setPage(int page, @NotNull @NotNull String data)`
- `@NotNull @NotNull List<String> getPages()`
- `void setPages(@NotNull @NotNull List<String> pages)`
- `void setPages(@NotNull @NotNull String... pages)`
- `void addPage(@NotNull @NotNull String... pages)`
- `int getPageCount()`
- `@NotNull @NotNull WritableBookMeta clone()`
