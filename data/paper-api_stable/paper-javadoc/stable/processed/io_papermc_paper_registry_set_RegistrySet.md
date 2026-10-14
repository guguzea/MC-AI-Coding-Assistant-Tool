---
title: "io.papermc.paper.registry.set.RegistrySet"
package: "io.papermc.paper.registry.set"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/set/RegistrySet.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistrySet<T>**
`public sealed interface RegistrySet<T> permits RegistryKeySet<T>, RegistryValueSet<T>`
- `@Contract(value="_, _ -> new", pure=true) static <T> RegistryValueSet<T> valueSet(RegistryKey<T> registryKey, Iterable<? extends T> values)`
- `@Contract(value="_, _ -> new", pure=true) static <T extends Keyed> RegistryKeySet<T> keySetFromValues(RegistryKey<T> registryKey, Iterable<? extends T> values)`
- `@SafeVarargs static <T extends Keyed> RegistryKeySet<T> keySet(RegistryKey<T> registryKey, TypedKey<T>... keys)`
- `@Contract(value="_, _ -> new", pure=true) static <T extends Keyed> RegistryKeySet<T> keySet(RegistryKey<T> registryKey, Iterable<TypedKey<T>> keys)`
- `RegistryKey<T> registryKey()`
- `int size()`
- `default boolean isEmpty()`
