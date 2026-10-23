---
title: "org.bukkit.Chunk"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/Chunk.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `int getX()`
- `int getZ()`
- `default long getChunkKey()`
- `static long getChunkKey&#8203;(@NotNull @NotNull Location loc)`
- `static long getChunkKey&#8203;(int x, int z)`
- `@NotNull @NotNull World getWorld()`
- `@NotNull @NotNull Block getBlock&#8203;(int x, int y, int z)`
- `@NotNull @NotNull ChunkSnapshot getChunkSnapshot()`
- `@NotNull @NotNull ChunkSnapshot getChunkSnapshot&#8203;(boolean includeMaxblocky, boolean includeBiome, boolean includeBiomeTempRain)`
- `@NotNull @NotNull Entity[] getEntities()`
- `@NotNull default @NotNull BlockState[] getTileEntities()`
- `@NotNull @NotNull BlockState[] getTileEntities&#8203;(boolean useSnapshot)`
- `@NotNull @NotNull Collection<BlockState> getTileEntities&#8203;(@NotNull @NotNull Predicate<Block> blockPredicate, boolean useSnapshot)`
- `boolean isLoaded()`
- `boolean load&#8203;(boolean generate)`
- `boolean load()`
- `boolean unload&#8203;(boolean save)`
- `boolean unload()`
- `boolean isSlimeChunk()`
- `boolean isForceLoaded()`
- `void setForceLoaded&#8203;(boolean forced)`
- `boolean addPluginChunkTicket&#8203;(@NotNull @NotNull Plugin plugin)`
- `boolean removePluginChunkTicket&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Collection<Plugin> getPluginChunkTickets()`
- `long getInhabitedTime()`
- `void setInhabitedTime&#8203;(long ticks)`
- `boolean contains&#8203;(@NotNull @NotNull BlockData block)`
