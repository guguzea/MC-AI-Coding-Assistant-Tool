---
title: "co.aikar.util.LoadingIntMap"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/26.3/co/aikar/util/LoadingIntMap.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class LoadingIntMap<V>**
`@Deprecated(forRemoval=true) public class LoadingIntMap<V> extends it.unimi.dsi.fastutil.ints.Int2ObjectOpenHashMap<V>`
- `public LoadingIntMap(@NotNull @NotNull Function<Integer,V> loader)`
- `public LoadingIntMap(int expectedSize, @NotNull @NotNull Function<Integer,V> loader)`
- `public LoadingIntMap(int expectedSize, float loadFactor, @NotNull @NotNull Function<Integer,V> loader)`
- `@Nullable public V get(int key)`
