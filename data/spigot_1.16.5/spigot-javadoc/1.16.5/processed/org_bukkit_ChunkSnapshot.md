---
title: "org.bukkit.ChunkSnapshot"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.ChunkSnapshot`
- `public abstract int getX()`
- `public abstract int getZ()`
- `public abstract java.lang.String getWorldName()`
- `public abstract org.bukkit.Material getBlockType(int, int, int)`
- `public abstract org.bukkit.block.data.BlockData getBlockData(int, int, int)`
- `public abstract int getData(int, int, int)`
- `public abstract int getBlockSkyLight(int, int, int)`
- `public abstract int getBlockEmittedLight(int, int, int)`
- `public abstract int getHighestBlockYAt(int, int)`
- `public abstract org.bukkit.block.Biome getBiome(int, int)`
- `public abstract org.bukkit.block.Biome getBiome(int, int, int)`
- `public abstract double getRawBiomeTemperature(int, int)`
- `public abstract double getRawBiomeTemperature(int, int, int)`
- `public abstract long getCaptureFullTime()`
- `public abstract boolean isSectionEmpty(int)`
- `public abstract boolean contains(org.bukkit.block.data.BlockData)`
