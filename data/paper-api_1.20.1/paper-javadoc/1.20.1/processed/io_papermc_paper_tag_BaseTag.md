---
title: "io.papermc.paper.tag.BaseTag"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/tag/BaseTag.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `protected final NamespacedKey key`
- `protected final Set<T extends Keyed> tagged`
- `public BaseTag(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull Predicate<T> filter)`
- `public BaseTag(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull T... values)`
- `public BaseTag(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull Collection<T> values)`
- `public BaseTag(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull Collection<T> values, @NotNull @NotNull Predicate<T>... globalPredicates)`
- `@NotNull public C lock()`
- `public boolean isLocked()`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull Set<T> getValues()`
- `public boolean isTagged(@NotNull T item)`
- `@NotNull public C add(@NotNull @NotNull Tag<T>... tags)`
- `@NotNull public C add(@NotNull @NotNull T... values)`
- `@NotNull public C add(@NotNull @NotNull Collection<T> collection)`
- `@NotNull public C add(@NotNull @NotNull Predicate<T> filter)`
- `@NotNull public C contains(@NotNull @NotNull String with)`
- `@NotNull public C endsWith(@NotNull @NotNull String with)`
- `@NotNull public C startsWith(@NotNull @NotNull String with)`
- `@NotNull public C not(@NotNull @NotNull Tag<T>... tags)`
- `@NotNull public C not(@NotNull @NotNull T... values)`
- `@NotNull public C not(@NotNull @NotNull Collection<T> values)`
- `@NotNull public C not(@NotNull @NotNull Predicate<T> filter)`
- `@NotNull public C notContains(@NotNull @NotNull String with)`
- `@NotNull public C notEndsWith(@NotNull @NotNull String with)`
- `@NotNull public C notStartsWith(@NotNull @NotNull String with)`
- `@NotNull public C ensureSize(@NotNull @NotNull String label, int size)`
- `@NotNull protected abstract @NotNull Set<T> getAllPossibleValues()`
- `@NotNull protected abstract @NotNull String getName(@NotNull T value)`
