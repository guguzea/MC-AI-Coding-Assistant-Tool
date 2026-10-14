---
title: "io.papermc.paper.tag.TagEntry"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/tag/TagEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TagEntry<T>**
`@Experimental @NullMarked @NonExtendable public interface TagEntry<T> extends Keyed`
- `@Contract(value="_ -> new", pure=true) static <T> TagEntry<T> valueEntry(TypedKey<T> entryKey)`
- `@Contract(value="_, _ -> new", pure=true) static <T> TagEntry<T> valueEntry(TypedKey<T> entryKey, boolean isRequired)`
- `@Contract(value="_ -> new", pure=true) static <T> TagEntry<T> tagEntry(TagKey<T> tagKey)`
- `@Contract(value="_, _ -> new", pure=true) static <T> TagEntry<T> tagEntry(TagKey<T> tagKey, boolean isRequired)`
- `@Contract(pure=true) boolean isTag()`
- `@Contract(pure=true) boolean isRequired()`
