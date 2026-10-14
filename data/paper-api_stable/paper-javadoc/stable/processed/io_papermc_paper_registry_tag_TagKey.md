---
title: "io.papermc.paper.registry.tag.TagKey"
package: "io.papermc.paper.registry.tag"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/tag/TagKey.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TagKey<T>**
`@NullMarked public sealed interface TagKey<T> extends Keyed`
- `@Contract(value="_, _ -> new", pure=true) static <T> TagKey<T> create(RegistryKey<T> registryKey, Key key)`
- `static <T> TagKey<T> create(RegistryKey<T> registryKey, @KeyPattern String key)`
- `RegistryKey<T> registryKey()`
