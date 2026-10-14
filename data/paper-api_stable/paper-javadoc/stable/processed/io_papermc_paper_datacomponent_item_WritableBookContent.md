---
title: "io.papermc.paper.datacomponent.item.WritableBookContent"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/WritableBookContent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface WritableBookContent**
`@NonExtendable public interface WritableBookContent extends BookLike`
- `@Contract(value="-> new", pure=true) static WritableBookContent.Builder writeableBookContent()`
- `@Contract(pure=true) @Unmodifiable List<Filtered<String>> pages()`
