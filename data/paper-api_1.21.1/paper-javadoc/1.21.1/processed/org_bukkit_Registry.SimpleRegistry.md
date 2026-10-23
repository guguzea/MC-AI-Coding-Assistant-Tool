---
title: "org.bukkit.Registry.SimpleRegistry"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/Registry.SimpleRegistry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `protected SimpleRegistry(@NotNull @NotNull Class<T> type)`
- `protected SimpleRegistry(@NotNull @NotNull Class<T> type, @NotNull @NotNull Predicate<T> predicate)`
- `@Nullable public T get(@NotNull @NotNull NamespacedKey key)`
- `@NotNull public T getOrThrow(@NotNull @NotNull NamespacedKey key)`
- `@NotNull public @NotNull Stream<T> stream()`
- `@NotNull public @NotNull Iterator<T> iterator()`
- `@Internal @Deprecated(since="1.20.6", forRemoval=true) public Class<T> getType()`
- `@NotNull public @NotNull NamespacedKey getKey(@NotNull T value)`
- `public boolean hasTag(@NotNull TagKey<T> key)`
- `public @NotNull Tag<T> getTag(@NotNull TagKey<T> key)`
