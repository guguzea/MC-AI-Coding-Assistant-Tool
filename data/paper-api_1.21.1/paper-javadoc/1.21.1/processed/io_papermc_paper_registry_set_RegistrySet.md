---
title: "io.papermc.paper.registry.set.RegistrySet"
package: "io.papermc.paper.registry.set"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/registry/set/RegistrySet.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Contract(value="_, _ -> new", pure=true) static <T extends Keyed> RegistryKeySet<T> keySetFromValues(RegistryKey<T> registryKey, Iterable<? extends T> values)`
- `@SafeVarargs static <T extends Keyed> RegistryKeySet<T> keySet(RegistryKey<T> registryKey, TypedKey<T>... keys)`
- `@Contract(value="_, _ -> new", pure=true) static <T extends Keyed> RegistryKeySet<T> keySet(RegistryKey<T> registryKey, Iterable<TypedKey<T>> keys)`
- `RegistryKey<T> registryKey()`
- `int size()`
- `default boolean isEmpty()`
