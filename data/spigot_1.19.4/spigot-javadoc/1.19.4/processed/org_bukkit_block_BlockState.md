---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.block.BlockState extends org.bukkit.metadata.Metadatable`
- `public abstract org.bukkit.block.Block getBlock()`
- `public abstract org.bukkit.material.MaterialData getData()`
- `public abstract org.bukkit.block.data.BlockData getBlockData()`
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
