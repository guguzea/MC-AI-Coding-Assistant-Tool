---
title: "org.bukkit.inventory.meta.BookMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/inventory/meta/BookMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `boolean hasTitle()`
- `@Nullable @Nullable String getTitle()`
- `boolean setTitle(@Nullable @Nullable String title)`
- `boolean hasAuthor()`
- `@Nullable @Nullable String getAuthor()`
- `void setAuthor(@Nullable @Nullable String author)`
- `boolean hasGeneration()`
- `@Nullable @Nullable BookMeta.Generation getGeneration()`
- `void setGeneration(@Nullable @Nullable BookMeta.Generation generation)`
- `@NotNull @NotNull BookMeta clone()`
- `@Deprecated @NotNull @NotNull String getPage(int page)`
- `@Deprecated void setPage(int page, @NotNull @NotNull String data)`
- `@Deprecated @NotNull @NotNull List<String> getPages()`
- `@Deprecated void setPages(@NotNull @NotNull List<String> pages)`
- `@Deprecated void setPages(@NotNull @NotNull String... pages)`
- `@Deprecated void addPage(@NotNull @NotNull String... pages)`
- `@Nullable Component title()`
- `@Contract(value="_ -> this", pure=false) @NotNull @NotNull BookMeta title(@Nullable Component title)`
- `@Nullable Component author()`
- `@Contract(value="_ -> this", pure=false) @NotNull @NotNull BookMeta author(@Nullable Component author)`
- `@NotNull Component page(int page)`
- `void page(int page, @NotNull Component data)`
- `void addPages(@NotNull Component @NotNull ... pages)`
- `@NotNull @NotNull BookMeta.BookMetaBuilder toBuilder()`
- `@NotNull @NotNull BookMeta.Spigot spigot()`
