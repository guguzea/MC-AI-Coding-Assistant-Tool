---
title: "org.bukkit.Chunk"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.Chunk`
- `public abstract int getX()`
- `public abstract int getZ()`
- `public abstract org.bukkit.World getWorld()`
- `public abstract org.bukkit.block.Block getBlock(int, int, int)`
- `public abstract org.bukkit.ChunkSnapshot getChunkSnapshot()`
- `public abstract org.bukkit.ChunkSnapshot getChunkSnapshot(boolean, boolean, boolean)`
- `public abstract org.bukkit.entity.Entity[] getEntities()`
- `public abstract org.bukkit.block.BlockState[] getTileEntities()`
- `public abstract boolean isLoaded()`
- `public abstract boolean load(boolean)`
- `public abstract boolean load()`
- `public abstract boolean unload(boolean, boolean)`
- `public abstract boolean unload(boolean)`
- `public abstract boolean unload()`
- `public abstract boolean isSlimeChunk()`
