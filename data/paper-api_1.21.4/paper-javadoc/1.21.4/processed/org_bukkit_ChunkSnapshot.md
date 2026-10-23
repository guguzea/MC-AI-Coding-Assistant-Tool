---
title: "org.bukkit.ChunkSnapshot"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/ChunkSnapshot.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `int getX()`
- `int getZ()`
- `@NotNull @NotNull String getWorldName()`
- `@NotNull @NotNull Material getBlockType(int x, int y, int z)`
- `@NotNull @NotNull BlockData getBlockData(int x, int y, int z)`
- `@Deprecated(since="1.6.2", forRemoval=true) int getData(int x, int y, int z)`
- `int getBlockSkyLight(int x, int y, int z)`
- `int getBlockEmittedLight(int x, int y, int z)`
- `int getHighestBlockYAt(int x, int z)`
- `@NotNull @Deprecated(since="1.15") @NotNull Biome getBiome(int x, int z)`
- `@NotNull @NotNull Biome getBiome(int x, int y, int z)`
- `@Deprecated(since="1.15") double getRawBiomeTemperature(int x, int z)`
- `double getRawBiomeTemperature(int x, int y, int z)`
- `long getCaptureFullTime()`
- `boolean isSectionEmpty(int sy)`
- `boolean contains(@NotNull @NotNull BlockData block)`
- `boolean contains(@NotNull @NotNull Biome biome)`
