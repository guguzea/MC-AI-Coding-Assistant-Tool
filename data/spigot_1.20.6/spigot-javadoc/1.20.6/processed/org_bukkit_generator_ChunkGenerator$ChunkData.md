---
title: "org.bukkit.generator.ChunkGenerator$ChunkData"
package: "org.bukkit.generator"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.generator.ChunkGenerator$ChunkData`
- `public abstract int getMinHeight()`
- `public abstract int getMaxHeight()`
- `public abstract org.bukkit.block.Biome getBiome(int, int, int)`
- `public abstract void setBlock(int, int, int, org.bukkit.Material)`
- `public abstract void setBlock(int, int, int, org.bukkit.material.MaterialData)`
- `public abstract void setBlock(int, int, int, org.bukkit.block.data.BlockData)`
- `public abstract void setRegion(int, int, int, int, int, int, org.bukkit.Material)`
- `public abstract void setRegion(int, int, int, int, int, int, org.bukkit.material.MaterialData)`
- `public abstract void setRegion(int, int, int, int, int, int, org.bukkit.block.data.BlockData)`
- `public abstract org.bukkit.Material getType(int, int, int)`
- `public abstract org.bukkit.material.MaterialData getTypeAndData(int, int, int)`
- `public abstract org.bukkit.block.data.BlockData getBlockData(int, int, int)`
- `public abstract byte getData(int, int, int)`
