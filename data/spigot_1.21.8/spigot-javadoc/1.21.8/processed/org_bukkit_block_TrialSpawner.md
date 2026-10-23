---
title: "org.bukkit.block.TrialSpawner"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.block.TrialSpawner extends org.bukkit.block.TileState`
- `public abstract int getCooldownLength()`
- `public abstract void setCooldownLength(int)`
- `public abstract int getRequiredPlayerRange()`
- `public abstract void setRequiredPlayerRange(int)`
- `public abstract java.util.Collection<org.bukkit.entity.Player> getTrackedPlayers()`
- `public abstract boolean isTrackingPlayer(org.bukkit.entity.Player)`
- `public abstract void startTrackingPlayer(org.bukkit.entity.Player)`
- `public abstract void stopTrackingPlayer(org.bukkit.entity.Player)`
- `public abstract java.util.Collection<org.bukkit.entity.Entity> getTrackedEntities()`
- `public abstract boolean isTrackingEntity(org.bukkit.entity.Entity)`
- `public abstract void startTrackingEntity(org.bukkit.entity.Entity)`
- `public abstract void stopTrackingEntity(org.bukkit.entity.Entity)`
- `public abstract boolean isOminous()`
- `public abstract void setOminous(boolean)`
- `public abstract org.bukkit.spawner.TrialSpawnerConfiguration getNormalConfiguration()`
- `public abstract org.bukkit.spawner.TrialSpawnerConfiguration getOminousConfiguration()`
