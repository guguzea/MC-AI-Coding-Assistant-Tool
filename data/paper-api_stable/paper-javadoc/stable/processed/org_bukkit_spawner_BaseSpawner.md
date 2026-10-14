---
title: "org.bukkit.spawner.BaseSpawner"
package: "org.bukkit.spawner"
source: https://jd.papermc.io/paper/26.3/org/bukkit/spawner/BaseSpawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BaseSpawner**
`@NullMarked public interface BaseSpawner`
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
- `void setSpawnedEntity(SpawnerEntry spawnerEntry)`
- `void addPotentialSpawn(EntitySnapshot snapshot, int weight, @Nullable SpawnRule spawnRule)`
- `void addPotentialSpawn(SpawnerEntry spawnerEntry)`
- `void setPotentialSpawns(Collection<SpawnerEntry> entries)`
- `List<SpawnerEntry> getPotentialSpawns()`
