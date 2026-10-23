---
title: "io.papermc.paper.datacomponent.item.WrittenBookContent.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/WrittenBookContent.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder title(String title)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder filteredTitle(Filtered<String> title)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder author(String author)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder generation(@org.checkerframework.common.value.qual.IntRange(from=0L, to=3L) int generation)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder resolved(boolean resolved)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder addPage(ComponentLike page)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder addPages(List<? extends ComponentLike> page)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder addFilteredPage(Filtered<? extends ComponentLike> page)`
- `@Contract(value="_ -> this", mutates="this") WrittenBookContent.Builder addFilteredPages(List<Filtered<? extends ComponentLike>> pages)`
