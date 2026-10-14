---
title: "org.bukkit.NamespacedKey"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/NamespacedKey.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class NamespacedKey**
`public final class NamespacedKey extends Object implements Key, Namespaced`
- `public static final String MINECRAFT`
- `public static final String BUKKIT`
- `public NamespacedKey(@NotNull @NotNull String namespace, @NotNull @NotNull String key)`
- `public NamespacedKey(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String key)`
- `@NotNull public @NotNull String getNamespace()`
- `@NotNull public @NotNull String getKey()`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `@Internal @NotNull @Deprecated(since="1.20.5") public static @NotNull NamespacedKey randomKey()`
- `@NotNull public static @NotNull NamespacedKey minecraft(@NotNull @NotNull String key)`
- `@Nullable public static @Nullable NamespacedKey fromString(@NotNull @NotNull String string, @Nullable @Nullable Plugin defaultNamespace)`
- `@Nullable public static @Nullable NamespacedKey fromString(@NotNull @NotNull String key)`
- `@NotNull public @NotNull String namespace()`
- `@NotNull public @NotNull String value()`
- `@NotNull public @NotNull String asString()`
