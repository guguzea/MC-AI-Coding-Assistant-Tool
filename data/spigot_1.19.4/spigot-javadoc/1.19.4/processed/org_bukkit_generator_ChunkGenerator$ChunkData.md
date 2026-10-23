---
title: "org.bukkit.generator.ChunkGenerator$ChunkData"
package: "org.bukkit.generator"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
