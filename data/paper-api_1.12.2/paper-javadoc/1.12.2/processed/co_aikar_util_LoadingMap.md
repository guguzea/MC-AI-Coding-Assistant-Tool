---
title: "co.aikar.util.LoadingMap"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/1.12.2/co/aikar/util/LoadingMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static class LoadingMap.Feeder<T>`
- `void clear()`
- `LoadingMap<K,V> clone()`
- `boolean containsKey(Object key)`
- `boolean containsValue(Object value)`
- `Set<Map.Entry<K,V>> entrySet()`
- `boolean equals(Object o)`
- `V get(Object key)`
- `int hashCode()`
- `boolean isEmpty()`
- `Set<K> keySet()`
- `static <K,V> Map<K,V> newAutoMap(Map<K,V> backingMap, Class<? extends K> keyClass, Class<? extends V> valueClass)`
- `static <K,V> Map<K,V> newAutoMap(Map<K,V> backingMap, Class<? extends V> valueClass)`
- `static <K,V> Map<K,V> newHashAutoMap(Class<? extends K> keyClass, Class<? extends V> valueClass)`
- `static <K,V> Map<K,V> newHashAutoMap(Class<? extends K> keyClass, Class<? extends V> valueClass, int initialCapacity, float loadFactor)`
- `static <K,V> Map<K,V> newHashAutoMap(Class<? extends V> valueClass)`
- `static <K,V> Map<K,V> newHashAutoMap(Class<? extends V> valueClass, int initialCapacity, float loadFactor)`
- `static <K,V> Map<K,V> newHashMap(Function<K,V> loader)`
- `static <K,V> Map<K,V> newHashMap(Function<K,V> loader, int initialCapacity)`
- `static <K,V> Map<K,V> newHashMap(Function<K,V> loader, int initialCapacity, float loadFactor)`
- `static <K,V> Map<K,V> newIdentityHashMap(Function<K,V> loader)`
- `static <K,V> Map<K,V> newIdentityHashMap(Function<K,V> loader, int initialCapacity)`
- `static <K,V> Map<K,V> of(Map<K,V> backingMap, Function<K,V> loader)`
- `V put(K key, V value)`
- `void putAll(Map<? extends K,? extends V> m)`
- `V remove(Object key)`
- `int size()`
- `Collection<V> values()`
