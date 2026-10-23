---
title: "org.bukkit.ChunkSnapshot"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
- `public abstract boolean contains(org.bukkit.block.Biome)`
