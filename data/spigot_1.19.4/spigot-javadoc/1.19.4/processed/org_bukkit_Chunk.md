---
title: "org.bukkit.Chunk"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.Chunk extends org.bukkit.persistence.PersistentDataHolder`
- `public abstract int getX()`
- `public abstract int getZ()`
- `public abstract org.bukkit.World getWorld()`
- `public abstract org.bukkit.block.Block getBlock(int, int, int)`
- `public abstract org.bukkit.ChunkSnapshot getChunkSnapshot()`
- `public abstract org.bukkit.ChunkSnapshot getChunkSnapshot(boolean, boolean, boolean)`
- `public abstract boolean isEntitiesLoaded()`
- `public abstract org.bukkit.entity.Entity[] getEntities()`
- `public abstract org.bukkit.block.BlockState[] getTileEntities()`
- `public abstract boolean isGenerated()`
- `public abstract boolean isLoaded()`
- `public abstract boolean load(boolean)`
- `public abstract boolean load()`
- `public abstract boolean unload(boolean)`
- `public abstract boolean unload()`
- `public abstract boolean isSlimeChunk()`
- `public abstract boolean isForceLoaded()`
- `public abstract void setForceLoaded(boolean)`
- `public abstract boolean addPluginChunkTicket(org.bukkit.plugin.Plugin)`
- `public abstract boolean removePluginChunkTicket(org.bukkit.plugin.Plugin)`
- `public abstract java.util.Collection<org.bukkit.plugin.Plugin> getPluginChunkTickets()`
- `public abstract long getInhabitedTime()`
- `public abstract void setInhabitedTime(long)`
- `public abstract boolean contains(org.bukkit.block.data.BlockData)`
- `public abstract boolean contains(org.bukkit.block.Biome)`
- `public abstract org.bukkit.Chunk$LoadLevel getLoadLevel()`
