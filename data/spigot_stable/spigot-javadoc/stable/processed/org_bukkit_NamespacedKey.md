---
title: "org.bukkit.NamespacedKey"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/NamespacedKey.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class NamespacedKey**
`public final class NamespacedKey extends Object`
- `public static final String MINECRAFT`
- `public static final String BUKKIT`
- `@Internal public NamespacedKey(@NotNull String namespace, @NotNull String key)`
- `public NamespacedKey(@NotNull Plugin plugin, @NotNull String key)`
- `@NotNull public String getNamespace()`
- `@NotNull public String getKey()`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `@Internal @NotNull @Deprecated(since="1.20.5") public static NamespacedKey randomKey()`
- `@NotNull public static NamespacedKey minecraft(@NotNull String key)`
- `@Nullable public static NamespacedKey fromString(@NotNull String string, @Nullable Plugin defaultNamespace)`
- `@Nullable public static NamespacedKey fromString(@NotNull String key)`
