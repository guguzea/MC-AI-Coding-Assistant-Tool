---
title: "org.bukkit.spawner.BaseSpawner"
package: "org.bukkit.spawner"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/spawner/BaseSpawner.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable EntityType getSpawnedType()`
- `void setSpawnedType(@Nullable @Nullable EntityType creatureType)`
- `int getDelay()`
- `void setDelay(int delay)`
- `int getRequiredPlayerRange()`
- `void setRequiredPlayerRange(int requiredPlayerRange)`
- `int getSpawnRange()`
- `void setSpawnRange(int spawnRange)`
- `@Nullable @Nullable EntitySnapshot getSpawnedEntity()`
- `void setSpawnedEntity(@Nullable @Nullable EntitySnapshot snapshot)`
- `void setSpawnedEntity(@NotNull @NotNull SpawnerEntry spawnerEntry)`
- `void addPotentialSpawn(@NotNull @NotNull EntitySnapshot snapshot, int weight, @Nullable @Nullable SpawnRule spawnRule)`
- `void addPotentialSpawn(@NotNull @NotNull SpawnerEntry spawnerEntry)`
- `void setPotentialSpawns(@NotNull @NotNull Collection<SpawnerEntry> entries)`
- `@NotNull @NotNull List<SpawnerEntry> getPotentialSpawns()`
