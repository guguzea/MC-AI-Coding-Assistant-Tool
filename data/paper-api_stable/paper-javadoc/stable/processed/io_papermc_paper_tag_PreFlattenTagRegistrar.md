---
title: "io.papermc.paper.tag.PreFlattenTagRegistrar"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/tag/PreFlattenTagRegistrar.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PreFlattenTagRegistrar<T>**
`@Experimental @NullMarked @NonExtendable public interface PreFlattenTagRegistrar<T> extends Registrar`
- `RegistryKey<T> registryKey()`
- `@Contract(value="-> new", pure=true) @Unmodifiable Map<TagKey<T>, Collection<TagEntry<T>>> getAllTags()`
- `@Contract(pure=true) boolean hasTag(TagKey<T> tagKey)`
- `@Contract(value="_ -> new", pure=true) @Unmodifiable List<TagEntry<T>> getTag(TagKey<T> tagKey)`
- `@Contract(mutates="this") void addToTag(TagKey<T> tagKey, Collection<TagEntry<T>> entries)`
- `@Contract(mutates="this") void setTag(TagKey<T> tagKey, Collection<TagEntry<T>> entries)`
