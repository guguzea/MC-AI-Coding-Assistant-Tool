---
title: "io.papermc.paper.registry.set.RegistryKeySet"
package: "io.papermc.paper.registry.set"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/set/RegistryKeySet.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryKeySet<T extends Keyed>**
`@NonExtendable public non-sealed interface RegistryKeySet<T extends Keyed> extends Iterable<TypedKey<T>>, RegistrySet<T>`
- `default int size()`
- `@Unmodifiable Collection<TypedKey<T>> values()`
- `@Unmodifiable Collection<T> resolve(Registry<T> registry)`
- `boolean contains(TypedKey<T> valueKey)`
- `default Iterator<TypedKey<T>> iterator()`
