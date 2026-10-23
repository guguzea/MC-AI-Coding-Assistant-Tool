---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.block.BlockState extends org.bukkit.metadata.Metadatable`
- `public abstract org.bukkit.block.Block getBlock()`
- `public abstract org.bukkit.material.MaterialData getData()`
- `public abstract org.bukkit.block.data.BlockData getBlockData()`
- `public abstract org.bukkit.block.BlockState copy()`
- `public abstract org.bukkit.block.BlockState copy(org.bukkit.Location)`
- `public abstract org.bukkit.Material getType()`
- `public abstract byte getLightLevel()`
- `public abstract org.bukkit.World getWorld()`
- `public abstract int getX()`
- `public abstract int getY()`
- `public abstract int getZ()`
- `public abstract org.bukkit.Location getLocation()`
- `public abstract org.bukkit.Location getLocation(org.bukkit.Location)`
- `public abstract org.bukkit.Chunk getChunk()`
- `public abstract void setData(org.bukkit.material.MaterialData)`
- `public abstract void setBlockData(org.bukkit.block.data.BlockData)`
- `public abstract void setType(org.bukkit.Material)`
- `public abstract boolean update()`
- `public abstract boolean update(boolean)`
- `public abstract boolean update(boolean, boolean)`
- `public abstract byte getRawData()`
- `public abstract void setRawData(byte)`
- `public abstract boolean isPlaced()`
