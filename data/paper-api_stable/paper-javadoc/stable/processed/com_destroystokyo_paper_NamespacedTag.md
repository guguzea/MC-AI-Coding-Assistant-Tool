---
title: "com.destroystokyo.paper.NamespacedTag"
package: "com.destroystokyo.paper"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/NamespacedTag.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class NamespacedTag**
`@Deprecated(forRemoval=true, since="1.20.6") public final class NamespacedTag extends Object implements Namespaced`
- `public static final String MINECRAFT`
- `public static final String BUKKIT`
- `@Deprecated public NamespacedTag(@NotNull @NotNull String namespace, @NotNull @NotNull String key)`
- `public NamespacedTag(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String key)`
- `@NotNull public @NotNull String getNamespace()`
- `@NotNull public @NotNull String getKey()`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `@Deprecated @Internal public static NamespacedTag randomKey()`
- `@NotNull public static @NotNull NamespacedTag minecraft(@NotNull @NotNull String key)`
