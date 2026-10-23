---
title: "io.papermc.paper.tag.TagEntry"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/tag/TagEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> new", pure=true) static <T> TagEntry<T> valueEntry(TypedKey<T> entryKey)`
- `@Contract(value="_, _ -> new", pure=true) static <T> TagEntry<T> valueEntry(TypedKey<T> entryKey, boolean isRequired)`
- `@Contract(value="_ -> new", pure=true) static <T> TagEntry<T> tagEntry(TagKey<T> tagKey)`
- `@Contract(value="_, _ -> new", pure=true) static <T> TagEntry<T> tagEntry(TagKey<T> tagKey, boolean isRequired)`
- `@Contract(pure=true) boolean isTag()`
- `@Contract(pure=true) boolean isRequired()`
