---
title: "org.bukkit.inventory.meta.SpawnEggMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/SpawnEggMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface SpawnEggMeta**
`public interface SpawnEggMeta extends ItemMeta`
- `@Deprecated(since="1.13") @Contract("-> fail") EntityType getSpawnedType()`
- `@Deprecated(since="1.13") @Contract("_ -> fail") void setSpawnedType(EntityType type)`
- `@Nullable EntitySnapshot getSpawnedEntity()`
- `void setSpawnedEntity(@NotNull EntitySnapshot snapshot)`
- `@NotNull SpawnEggMeta clone()`
