---
title: "org.bukkit.block.CreatureSpawner"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.block.CreatureSpawner extends org.bukkit.block.TileState`
- `public abstract org.bukkit.entity.EntityType getSpawnedType()`
- `public abstract void setSpawnedType(org.bukkit.entity.EntityType)`
- `public abstract void setCreatureTypeByName(java.lang.String)`
- `public abstract java.lang.String getCreatureTypeName()`
- `public abstract int getDelay()`
- `public abstract void setDelay(int)`
- `public abstract int getMinSpawnDelay()`
- `public abstract void setMinSpawnDelay(int)`
- `public abstract int getMaxSpawnDelay()`
- `public abstract void setMaxSpawnDelay(int)`
- `public abstract int getSpawnCount()`
- `public abstract void setSpawnCount(int)`
- `public abstract int getMaxNearbyEntities()`
- `public abstract void setMaxNearbyEntities(int)`
- `public abstract int getRequiredPlayerRange()`
- `public abstract void setRequiredPlayerRange(int)`
- `public abstract int getSpawnRange()`
- `public abstract void setSpawnRange(int)`
- `public abstract org.bukkit.entity.EntitySnapshot getSpawnedEntity()`
- `public abstract void setSpawnedEntity(org.bukkit.entity.EntitySnapshot)`
- `public abstract void addPotentialSpawn(org.bukkit.entity.EntitySnapshot, int, org.bukkit.block.spawner.SpawnRule)`
- `public abstract void addPotentialSpawn(org.bukkit.block.spawner.SpawnerEntry)`
- `public abstract void setPotentialSpawns(java.util.Collection<org.bukkit.block.spawner.SpawnerEntry>)`
- `public abstract java.util.List<org.bukkit.block.spawner.SpawnerEntry> getPotentialSpawns()`
