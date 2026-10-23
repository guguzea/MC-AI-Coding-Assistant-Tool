---
title: "org.bukkit.Chunk"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/Chunk.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `int getX()`
- `int getZ()`
- `default long getChunkKey()`
- `static long getChunkKey(@NotNull @NotNull Location loc)`
- `static long getChunkKey(int x, int z)`
- `@NotNull @NotNull World getWorld()`
- `@NotNull @NotNull Block getBlock(int x, int y, int z)`
- `@NotNull @NotNull ChunkSnapshot getChunkSnapshot()`
- `@NotNull @NotNull ChunkSnapshot getChunkSnapshot(boolean includeMaxblocky, boolean includeBiome, boolean includeBiomeTempRain)`
- `@NotNull @NotNull ChunkSnapshot getChunkSnapshot(boolean includeMaxblocky, boolean includeBiome, boolean includeBiomeTempRain, boolean includeLightData)`
- `boolean isEntitiesLoaded()`
- `@NotNull @NotNull Entity @NotNull [] getEntities()`
- `@NotNull default @NotNull BlockState @NotNull [] getTileEntities()`
- `@NotNull @NotNull BlockState @NotNull [] getTileEntities(boolean useSnapshot)`
- `@NotNull @NotNull Collection<BlockState> getTileEntities(@NotNull Predicate<? super Block> blockPredicate, boolean useSnapshot)`
- `boolean isGenerated()`
- `boolean isLoaded()`
- `boolean load(boolean generate)`
- `boolean load()`
- `boolean unload(boolean save)`
- `boolean unload()`
- `boolean isSlimeChunk()`
- `boolean isForceLoaded()`
- `void setForceLoaded(boolean forced)`
- `boolean addPluginChunkTicket(@NotNull @NotNull Plugin plugin)`
- `boolean removePluginChunkTicket(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Collection<Plugin> getPluginChunkTickets()`
- `long getInhabitedTime()`
- `void setInhabitedTime(long ticks)`
- `boolean contains(@NotNull @NotNull BlockData block)`
- `boolean contains(@NotNull @NotNull Biome biome)`
- `@NotNull @NotNull Chunk.LoadLevel getLoadLevel()`
- `@NotNull @NotNull Collection<GeneratedStructure> getStructures()`
- `@NotNull @NotNull Collection<GeneratedStructure> getStructures(@NotNull @NotNull Structure structure)`
- `@NotNull @NotNull Collection<Player> getPlayersSeeingChunk()`
