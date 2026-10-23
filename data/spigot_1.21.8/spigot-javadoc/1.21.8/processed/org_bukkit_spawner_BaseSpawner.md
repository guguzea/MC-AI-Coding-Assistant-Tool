---
title: "org.bukkit.spawner.BaseSpawner"
package: "org.bukkit.spawner"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
