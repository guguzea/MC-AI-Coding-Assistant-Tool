---
title: "co.aikar.util.LoadingMap"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/1.16.5/co/aikar/util/LoadingMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public LoadingMap&#8203;(@NotNull @NotNull Map<K,&#8203;V> backingMap, @NotNull Function<K,&#8203;V> loader)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> of&#8203;(@NotNull @NotNull Map<K,&#8203;V> backingMap, @NotNull @NotNull Function<K,&#8203;V> loader)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newAutoMap&#8203;(@NotNull @NotNull Map<K,&#8203;V> backingMap, @Nullable @Nullable Class<? extends K> keyClass, @NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newAutoMap&#8203;(@NotNull @NotNull Map<K,&#8203;V> backingMap, @NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashAutoMap&#8203;(@Nullable @Nullable Class<? extends K> keyClass, @NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashAutoMap&#8203;(@NotNull @NotNull Class<? extends V> valueClass)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashAutoMap&#8203;(@Nullable @Nullable Class<? extends K> keyClass, @NotNull @NotNull Class<? extends V> valueClass, int initialCapacity, float loadFactor)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashAutoMap&#8203;(@NotNull @NotNull Class<? extends V> valueClass, int initialCapacity, float loadFactor)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashMap&#8203;(@NotNull @NotNull Function<K,&#8203;V> loader)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashMap&#8203;(@NotNull @NotNull Function<K,&#8203;V> loader, int initialCapacity)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newHashMap&#8203;(@NotNull @NotNull Function<K,&#8203;V> loader, int initialCapacity, float loadFactor)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newIdentityHashMap&#8203;(@NotNull @NotNull Function<K,&#8203;V> loader)`
- `@NotNull public static <K,&#8203; V> @NotNull Map<K,&#8203;V> newIdentityHashMap&#8203;(@NotNull @NotNull Function<K,&#8203;V> loader, int initialCapacity)`
- `public int size()`
- `public boolean isEmpty()`
- `public boolean containsKey&#8203;(@Nullable @Nullable Object key)`
- `public boolean containsValue&#8203;(@Nullable @Nullable Object value)`
- `@Nullable public V get&#8203;(@Nullable @Nullable Object key)`
- `@Nullable public V put&#8203;(@Nullable K key, @Nullable V value)`
- `@Nullable public V remove&#8203;(@Nullable @Nullable Object key)`
- `public void putAll&#8203;(@NotNull @NotNull Map<? extends K,&#8203;? extends V> m)`
- `public void clear()`
- `@NotNull public @NotNull Set<K> keySet()`
- `@NotNull public @NotNull Collection<V> values()`
- `public boolean equals&#8203;(@Nullable @Nullable Object o)`
- `public int hashCode()`
- `@NotNull public @NotNull Set<Map.Entry<K,&#8203;V>> entrySet()`
- `@NotNull public @NotNull LoadingMap<K,&#8203;V> clone()`
