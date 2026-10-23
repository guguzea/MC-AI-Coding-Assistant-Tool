---
title: "org.bukkit.inventory.meta.BookMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/meta/BookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `boolean hasTitle()`
- `@Nullable @Nullable String getTitle()`
- `boolean setTitle&#8203;(@Nullable @Nullable String title)`
- `boolean hasAuthor()`
- `@Nullable @Nullable String getAuthor()`
- `void setAuthor&#8203;(@Nullable @Nullable String author)`
- `boolean hasGeneration()`
- `@Nullable @Nullable BookMeta.Generation getGeneration()`
- `void setGeneration&#8203;(@Nullable @Nullable BookMeta.Generation generation)`
- `boolean hasPages()`
- `@Nullable Component title()`
- `@NotNull @NotNull BookMeta title&#8203;(@Nullable Component title)`
- `@Nullable Component author()`
- `@NotNull @NotNull BookMeta author&#8203;(@Nullable Component author)`
- `@NotNull Component page&#8203;(int page)`
- `void page&#8203;(int page, @NotNull Component data)`
- `void addPages&#8203;(@NotNull @NotNull Component... pages)`
- `@NonNull BookMeta.BookMetaBuilder toBuilder()`
- `@NotNull @Deprecated @NotNull String getPage&#8203;(int page)`
- `@Deprecated void setPage&#8203;(int page, @NotNull @NotNull String data)`
- `@NotNull @Deprecated @NotNull List<String> getPages()`
- `@Deprecated void setPages&#8203;(@NotNull @NotNull List<String> pages)`
- `@Deprecated void setPages&#8203;(@NotNull @NotNull String... pages)`
- `@Deprecated void addPage&#8203;(@NotNull @NotNull String... pages)`
- `int getPageCount()`
- `@NotNull @NotNull BookMeta clone()`
- `@NotNull @NotNull BookMeta.Spigot spigot()`
