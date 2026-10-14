---
title: "org.bukkit.inventory.meta.SpawnEggMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/SpawnEggMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SpawnEggMeta**
`public interface SpawnEggMeta extends ItemMeta`
- `@Deprecated(since="1.13", forRemoval=true) @Contract("-> fail") EntityType getSpawnedType()`
- `@Deprecated(since="1.13", forRemoval=true) @Contract("_ -> fail") void setSpawnedType(EntityType type)`
- `@Nullable @Nullable EntitySnapshot getSpawnedEntity()`
- `void setSpawnedEntity(@NotNull @NotNull EntitySnapshot snapshot)`
- `@Nullable @Nullable EntityType getCustomSpawnedType()`
- `void setCustomSpawnedType(@Nullable @Nullable EntityType type)`
- `@NotNull @NotNull SpawnEggMeta clone()`
