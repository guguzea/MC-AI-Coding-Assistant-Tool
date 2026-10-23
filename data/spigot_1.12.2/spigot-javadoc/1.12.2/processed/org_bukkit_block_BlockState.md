---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.block.BlockState extends org.bukkit.metadata.Metadatable`
- `public abstract org.bukkit.block.Block getBlock()`
- `public abstract org.bukkit.material.MaterialData getData()`
- `public abstract org.bukkit.Material getType()`
- `public abstract int getTypeId()`
- `public abstract byte getLightLevel()`
- `public abstract org.bukkit.World getWorld()`
- `public abstract int getX()`
- `public abstract int getY()`
- `public abstract int getZ()`
- `public abstract org.bukkit.Location getLocation()`
- `public abstract org.bukkit.Location getLocation(org.bukkit.Location)`
- `public abstract org.bukkit.Chunk getChunk()`
- `public abstract void setData(org.bukkit.material.MaterialData)`
- `public abstract void setType(org.bukkit.Material)`
- `public abstract boolean setTypeId(int)`
- `public abstract boolean update()`
- `public abstract boolean update(boolean)`
- `public abstract boolean update(boolean, boolean)`
- `public abstract byte getRawData()`
- `public abstract void setRawData(byte)`
- `public abstract boolean isPlaced()`
