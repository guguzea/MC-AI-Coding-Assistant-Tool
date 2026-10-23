---
title: "io.papermc.paper.tag.BaseTag"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/tag/BaseTag.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected final NamespacedKey key`
- `protected final Set<T extends Keyed> tagged`
- `public BaseTag&#8203;(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull Predicate<T> filter)`
- `public BaseTag&#8203;(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull T... values)`
- `public BaseTag&#8203;(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull Collection<T> values)`
- `public BaseTag&#8203;(@NotNull @NotNull Class<T> clazz, @NotNull @NotNull NamespacedKey key, @NotNull @NotNull Collection<T> values, @NotNull @NotNull Predicate<T>... globalPredicates)`
- `@NotNull public @NotNull NamespacedKey getKey()`
- `@NotNull public @NotNull Set<T> getValues()`
- `public boolean isTagged&#8203;(@NotNull T item)`
- `@NotNull public C add&#8203;(@NotNull @NotNull Tag<T>... tags)`
- `@NotNull public C add&#8203;(@NotNull @NotNull T... values)`
- `@NotNull public C add&#8203;(@NotNull @NotNull Collection<T> collection)`
- `@NotNull public C add&#8203;(@NotNull @NotNull Predicate<T> filter)`
- `@NotNull public C contains&#8203;(@NotNull @NotNull String with)`
- `@NotNull public C endsWith&#8203;(@NotNull @NotNull String with)`
- `@NotNull public C startsWith&#8203;(@NotNull @NotNull String with)`
- `@NotNull public C not&#8203;(@NotNull @NotNull Tag<T>... tags)`
- `@NotNull public C not&#8203;(@NotNull @NotNull T... values)`
- `@NotNull public C not&#8203;(@NotNull @NotNull Collection<T> values)`
- `@NotNull public C not&#8203;(@NotNull @NotNull Predicate<T> filter)`
- `@NotNull public C notContains&#8203;(@NotNull @NotNull String with)`
- `@NotNull public C notEndsWith&#8203;(@NotNull @NotNull String with)`
- `@NotNull public C notStartsWith&#8203;(@NotNull @NotNull String with)`
- `@NotNull public C ensureSize&#8203;(@NotNull @NotNull String label, int size)`
- `@NotNull protected abstract @NotNull Set<T> getAllPossibleValues()`
- `@NotNull protected abstract @NotNull String getName&#8203;(@NotNull T value)`
