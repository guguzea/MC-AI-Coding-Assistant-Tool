---
title: "io.papermc.paper.tag.EntitySetTag"
package: "io.papermc.paper.tag"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/tag/EntitySetTag.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public EntitySetTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull Predicate<EntityType> filter)`
- `public EntitySetTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull EntityType... values)`
- `public EntitySetTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull Collection<EntityType> values)`
- `public EntitySetTag(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull Collection<EntityType> values, @NotNull @NotNull Predicate<EntityType>... globalPredicates)`
- `@NotNull protected @NotNull Set<EntityType> getAllPossibleValues()`
- `@NotNull protected @NotNull String getName(@NotNull @NotNull EntityType value)`
