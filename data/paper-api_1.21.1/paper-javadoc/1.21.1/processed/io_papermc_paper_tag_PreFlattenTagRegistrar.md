---
title: "io.papermc.paper.tag.PreFlattenTagRegistrar"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/tag/PreFlattenTagRegistrar.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `RegistryKey<T> registryKey()`
- `@Contract(value="-> new", pure=true) @Unmodifiable Map<TagKey<T>,Collection<TagEntry<T>>> getAllTags()`
- `@Contract(pure=true) boolean hasTag(TagKey<T> tagKey)`
- `@Contract(value="_ -> new", pure=true) @Unmodifiable List<TagEntry<T>> getTag(TagKey<T> tagKey)`
- `@Contract(mutates="this") void addToTag(TagKey<T> tagKey, Collection<TagEntry<T>> entries)`
- `@Contract(mutates="this") void setTag(TagKey<T> tagKey, Collection<TagEntry<T>> entries)`
