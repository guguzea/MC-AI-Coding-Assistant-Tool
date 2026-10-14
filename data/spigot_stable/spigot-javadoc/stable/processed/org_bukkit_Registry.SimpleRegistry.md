---
title: "org.bukkit.Registry.SimpleRegistry"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Registry.SimpleRegistry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Registry.SimpleRegistry<T extends Enum<T> & Keyed>**
`public static final class Registry.SimpleRegistry<T extends Enum<T> & Keyed> extends Object implements Registry<T>`
- `protected SimpleRegistry(@NotNull Class<T> type)`
- `protected SimpleRegistry(@NotNull Class<T> type, @NotNull Predicate<T> predicate)`
- `@Nullable public T get(@NotNull NamespacedKey key)`
- `@NotNull public T getOrThrow(@NotNull NamespacedKey key)`
- `@NotNull public Stream<T> stream()`
- `@NotNull public Iterator<T> iterator()`
- `@Internal @Deprecated(since="1.20.6", forRemoval=true) public Class<T> getType()`
