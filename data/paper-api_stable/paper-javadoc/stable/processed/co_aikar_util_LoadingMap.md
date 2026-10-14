---
title: "co.aikar.util.LoadingMap"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/26.3/co/aikar/util/LoadingMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class LoadingMap<K,V>**
`@Deprecated(forRemoval=true) public class LoadingMap<K,V> extends AbstractMap<K,V>`
- `public LoadingMap(@NotNull @NotNull Map<K,V> backingMap, @NotNull Function<K,V> loader)`
- `@NotNull public static <K,V> @NotNull Map<K,V> of(@NotNull @NotNull Map<K,V> backingMap, @NotNull @NotNull Function<K,V> loader)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newAutoMap(@NotNull @NotNull Map<K,V> backingMap, @Nullable @Nullable Class<? extends K> keyClass, @NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newAutoMap(@NotNull @NotNull Map<K,V> backingMap, @NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashAutoMap(@Nullable @Nullable Class<? extends K> keyClass, @NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashAutoMap(@NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashAutoMap(@Nullable @Nullable Class<? extends K> keyClass, @NotNull @NotNull Class<? extends V> valueClass, int initialCapacity, float loadFactor)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashAutoMap(@NotNull @NotNull Class<? extends V> valueClass, int initialCapacity, float loadFactor)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashMap(@NotNull @NotNull Function<K,V> loader)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashMap(@NotNull @NotNull Function<K,V> loader, int initialCapacity)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newHashMap(@NotNull @NotNull Function<K,V> loader, int initialCapacity, float loadFactor)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newIdentityHashMap(@NotNull @NotNull Function<K,V> loader)`
- `@NotNull public static <K,V> @NotNull Map<K,V> newIdentityHashMap(@NotNull @NotNull Function<K,V> loader, int initialCapacity)`
- `public int size()`
- `public boolean isEmpty()`
- `public boolean containsKey(@Nullable @Nullable Object key)`
- `public boolean containsValue(@Nullable @Nullable Object value)`
- `@Nullable public V get(@Nullable @Nullable Object key)`
- `@Nullable public V put(@Nullable K key, @Nullable V value)`
- `@Nullable public V remove(@Nullable @Nullable Object key)`
- `public void putAll(@NotNull @NotNull Map<? extends K, ? extends V> m)`
- `public void clear()`
- `@NotNull public @NotNull Set<K> keySet()`
- `@NotNull public @NotNull Collection<V> values()`
- `public boolean equals(@Nullable @Nullable Object o)`
- `public int hashCode()`
- `@NotNull public @NotNull Set<Map.Entry<K,V>> entrySet()`
- `@NotNull public @NotNull LoadingMap<K,V> clone()`
