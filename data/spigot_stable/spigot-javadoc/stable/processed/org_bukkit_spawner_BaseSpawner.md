---
title: "org.bukkit.spawner.BaseSpawner"
package: "org.bukkit.spawner"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/spawner/BaseSpawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BaseSpawner**
`public interface BaseSpawner`
- `@Nullable EntityType getSpawnedType()`
- `void setSpawnedType(@Nullable EntityType creatureType)`
- `int getDelay()`
- `void setDelay(int delay)`
- `int getRequiredPlayerRange()`
- `void setRequiredPlayerRange(int requiredPlayerRange)`
- `int getSpawnRange()`
- `void setSpawnRange(int spawnRange)`
- `@Nullable EntitySnapshot getSpawnedEntity()`
- `void setSpawnedEntity(@Nullable EntitySnapshot snapshot)`
- `void setSpawnedEntity(@NotNull SpawnerEntry spawnerEntry)`
- `void addPotentialSpawn(@NotNull EntitySnapshot snapshot, int weight, @Nullable SpawnRule spawnRule)`
- `void addPotentialSpawn(@NotNull SpawnerEntry spawnerEntry)`
- `void setPotentialSpawns(@NotNull Collection<SpawnerEntry> entries)`
- `@NotNull List<SpawnerEntry> getPotentialSpawns()`
