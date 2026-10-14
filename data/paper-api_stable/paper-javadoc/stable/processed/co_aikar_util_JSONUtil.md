---
title: "co.aikar.util.JSONUtil"
package: "co.aikar.util"
source: https://jd.papermc.io/paper/26.3/co/aikar/util/JSONUtil.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class JSONUtil**
`@Deprecated(forRemoval=true) public final class JSONUtil extends Object`
- `@NotNull public static @NotNull JSONUtil.JSONPair pair(@NotNull @NotNull String key, @Nullable @Nullable Object obj)`
- `@NotNull public static @NotNull JSONUtil.JSONPair pair(long key, @Nullable @Nullable Object obj)`
- `@NotNull public static @NotNull Map<String,Object> createObject(@NotNull @NotNull JSONUtil.JSONPair... data)`
- `@NotNull public static @NotNull Map<String,Object> appendObjectData(@NotNull @NotNull Map parent, @NotNull @NotNull JSONUtil.JSONPair... data)`
- `@NotNull public static @NotNull List toArray(@NotNull @NotNull Object... data)`
- `@NotNull public static <E> @NotNull List toArrayMapper(@NotNull E[] collection, @NotNull @NotNull Function<E,Object> mapper)`
- `@NotNull public static <E> @NotNull List toArrayMapper(@NotNull @NotNull Iterable<E> collection, @NotNull @NotNull Function<E,Object> mapper)`
- `@NotNull public static <E> @NotNull Map toObjectMapper(@NotNull E[] collection, @NotNull @NotNull Function<E, JSONUtil.JSONPair> mapper)`
- `@NotNull public static <E> @NotNull Map toObjectMapper(@NotNull @NotNull Iterable<E> collection, @NotNull @NotNull Function<E, JSONUtil.JSONPair> mapper)`
