---
title: "io.papermc.paper.registry.set.RegistryValueSet"
package: "io.papermc.paper.registry.set"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/set/RegistryValueSet.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryValueSet<T>**
`public sealed interface RegistryValueSet<T> extends Iterable<T>, RegistrySet<T>`
- `default int size()`
- `@Unmodifiable Collection<T> values()`
- `default Iterator<T> iterator()`
