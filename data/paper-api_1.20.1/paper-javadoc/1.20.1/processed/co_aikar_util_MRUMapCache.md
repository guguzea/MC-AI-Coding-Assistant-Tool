---
title: "co.aikar.util.MRUMapCache"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/1.20.1/co/aikar/util/MRUMapCache.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public MRUMapCache(@NotNull @NotNull Map<K,V> backingMap)`
- `public int size()`
- `public boolean isEmpty()`
- `public boolean containsKey(@Nullable @Nullable Object key)`
- `public boolean containsValue(@Nullable @Nullable Object value)`
- `@Nullable public V get(@Nullable @Nullable Object key)`
- `@Nullable public V put(@Nullable K key, @Nullable V value)`
- `@Nullable public V remove(@Nullable @Nullable Object key)`
- `public void putAll(@NotNull @NotNull Map<? extends K,? extends V> m)`
- `public void clear()`
- `@NotNull public @NotNull Set<K> keySet()`
- `@NotNull public @NotNull Collection<V> values()`
- `@NotNull public @NotNull Set<Map.Entry<K,V>> entrySet()`
- `@NotNull public static <K, V> @NotNull Map<K,V> of(@NotNull @NotNull Map<K,V> map)`
