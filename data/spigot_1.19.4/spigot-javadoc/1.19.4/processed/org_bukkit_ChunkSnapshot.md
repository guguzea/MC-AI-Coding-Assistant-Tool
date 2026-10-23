---
title: "org.bukkit.ChunkSnapshot"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
