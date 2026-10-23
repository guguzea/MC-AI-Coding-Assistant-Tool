---
title: "io.papermc.paper.datacomponent.item.WrittenBookContent"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/WrittenBookContent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_, _ -> new", pure=true) static WrittenBookContent.Builder writtenBookContent(String title, String author)`
- `@Contract(value="_, _ -> new", pure=true) static WrittenBookContent.Builder writtenBookContent(Filtered<String> title, String author)`
- `@Contract(pure=true) Filtered<String> title()`
- `@Contract(pure=true) String author()`
- `@Contract(pure=true) @org.checkerframework.common.value.qual.IntRange(from=0L, to=3L) int generation()`
- `@Contract(pure=true) @Unmodifiable List<Filtered<Component>> pages()`
- `@Contract(pure=true) boolean resolved()`
