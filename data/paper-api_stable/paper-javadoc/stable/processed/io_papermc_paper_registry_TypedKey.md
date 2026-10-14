---
title: "io.papermc.paper.registry.TypedKey"
package: "io.papermc.paper.registry"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/TypedKey.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TypedKey<T>**
`@NullMarked public sealed interface TypedKey<T> extends Key`
- `Key key()`
- `RegistryKey<T> registryKey()`
- `static <T> TypedKey<T> create(RegistryKey<T> registryKey, Key key)`
- `static <T> TypedKey<T> create(RegistryKey<T> registryKey, @KeyPattern String key)`
