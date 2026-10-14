---
title: "io.papermc.paper.datacomponent.item.WrittenBookContent"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/WrittenBookContent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface WrittenBookContent**
`@NonExtendable public interface WrittenBookContent extends BookLike`
- `@Contract(value="_, _ -> new", pure=true) static WrittenBookContent.Builder writtenBookContent(String title, String author)`
- `@Contract(value="_, _ -> new", pure=true) static WrittenBookContent.Builder writtenBookContent(Filtered<String> title, String author)`
- `@Contract(pure=true) Filtered<String> title()`
- `@Contract(pure=true) String author()`
- `@Contract(pure=true) @IntRange(from=0L,to=3L) int generation()`
- `@Contract(pure=true) @Unmodifiable List<Filtered<Component>> pages()`
- `@Contract(pure=true) boolean resolved()`
