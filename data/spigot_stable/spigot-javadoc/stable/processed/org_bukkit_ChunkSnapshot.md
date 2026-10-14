---
title: "org.bukkit.ChunkSnapshot"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/ChunkSnapshot.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ChunkSnapshot**
`public interface ChunkSnapshot`
- `int getX()`
- `int getZ()`
- `@NotNull String getWorldName()`
- `@NotNull Material getBlockType(int x, int y, int z)`
- `@NotNull BlockData getBlockData(int x, int y, int z)`
- `@Deprecated(since="1.6.2") int getData(int x, int y, int z)`
- `int getBlockSkyLight(int x, int y, int z)`
- `int getBlockEmittedLight(int x, int y, int z)`
- `int getHighestBlockYAt(int x, int z)`
- `@NotNull @Deprecated(since="1.15") Biome getBiome(int x, int z)`
- `@NotNull Biome getBiome(int x, int y, int z)`
- `@Deprecated(since="1.15") double getRawBiomeTemperature(int x, int z)`
- `double getRawBiomeTemperature(int x, int y, int z)`
- `long getCaptureFullTime()`
- `boolean isSectionEmpty(int sy)`
- `boolean contains(@NotNull BlockData block)`
- `boolean contains(@NotNull Biome biome)`
