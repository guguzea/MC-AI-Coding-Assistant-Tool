---
title: "org.bukkit.Chunk"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/Chunk.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `Block getBlock(int x, int y, int z)`
- `default long getChunkKey()`
- `ChunkSnapshot getChunkSnapshot()`
- `ChunkSnapshot getChunkSnapshot(boolean includeMaxblocky, boolean includeBiome, boolean includeBiomeTempRain)`
- `Entity[] getEntities()`
- `BlockState[] getTileEntities()`
- `World getWorld()`
- `int getX()`
- `int getZ()`
- `boolean isLoaded()`
- `boolean isSlimeChunk()`
- `boolean load()`
- `boolean load(boolean generate)`
- `boolean unload()`
- `boolean unload(boolean save)`
- `boolean unload(boolean save, boolean safe)`
