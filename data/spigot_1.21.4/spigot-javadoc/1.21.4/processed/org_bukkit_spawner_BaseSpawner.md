---
title: "org.bukkit.spawner.BaseSpawner"
package: "org.bukkit.spawner"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.spawner.BaseSpawner`
- `public abstract org.bukkit.entity.EntityType getSpawnedType()`
- `public abstract void setSpawnedType(org.bukkit.entity.EntityType)`
- `public abstract int getDelay()`
- `public abstract void setDelay(int)`
- `public abstract int getRequiredPlayerRange()`
- `public abstract void setRequiredPlayerRange(int)`
- `public abstract int getSpawnRange()`
- `public abstract void setSpawnRange(int)`
- `public abstract org.bukkit.entity.EntitySnapshot getSpawnedEntity()`
- `public abstract void setSpawnedEntity(org.bukkit.entity.EntitySnapshot)`
- `public abstract void setSpawnedEntity(org.bukkit.block.spawner.SpawnerEntry)`
- `public abstract void addPotentialSpawn(org.bukkit.entity.EntitySnapshot, int, org.bukkit.block.spawner.SpawnRule)`
- `public abstract void addPotentialSpawn(org.bukkit.block.spawner.SpawnerEntry)`
- `public abstract void setPotentialSpawns(java.util.Collection<org.bukkit.block.spawner.SpawnerEntry>)`
- `public abstract java.util.List<org.bukkit.block.spawner.SpawnerEntry> getPotentialSpawns()`
