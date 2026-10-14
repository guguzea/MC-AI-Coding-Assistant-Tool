---
title: "org.bukkit.Chunk"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Chunk.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Chunk**
`public interface Chunk extends PersistentDataHolder`
- `int getX()`
- `int getZ()`
- `@NotNull World getWorld()`
- `@NotNull Block getBlock(int x, int y, int z)`
- `@NotNull ChunkSnapshot getChunkSnapshot()`
- `@NotNull ChunkSnapshot getChunkSnapshot(boolean includeMaxblocky, boolean includeBiome, boolean includeBiomeTempRain)`
- `boolean isEntitiesLoaded()`
- `@NotNull Entity[] getEntities()`
- `@NotNull BlockState[] getTileEntities()`
- `boolean isGenerated()`
- `boolean isLoaded()`
- `boolean load(boolean generate)`
- `boolean load()`
- `boolean unload(boolean save)`
- `boolean unload()`
- `boolean isSlimeChunk()`
- `boolean isForceLoaded()`
- `void setForceLoaded(boolean forced)`
- `boolean addPluginChunkTicket(@NotNull Plugin plugin)`
- `boolean removePluginChunkTicket(@NotNull Plugin plugin)`
- `@NotNull Collection<Plugin> getPluginChunkTickets()`
- `long getInhabitedTime()`
- `void setInhabitedTime(long ticks)`
- `boolean contains(@NotNull BlockData block)`
- `boolean contains(@NotNull Biome biome)`
- `@NotNull Chunk.LoadLevel getLoadLevel()`
- `@NotNull Collection<GeneratedStructure> getStructures()`
- `@NotNull Collection<GeneratedStructure> getStructures(@NotNull Structure structure)`
- `@NotNull Collection<Player> getPlayersSeeingChunk()`
