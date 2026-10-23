---
title: "org.bukkit.block.Block"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.block.Block extends org.bukkit.metadata.Metadatable`
- `public abstract byte getData()`
- `public abstract org.bukkit.block.data.BlockData getBlockData()`
- `public abstract org.bukkit.block.Block getRelative(int, int, int)`
- `public abstract org.bukkit.block.Block getRelative(org.bukkit.block.BlockFace)`
- `public abstract org.bukkit.block.Block getRelative(org.bukkit.block.BlockFace, int)`
- `public abstract org.bukkit.Material getType()`
- `public abstract byte getLightLevel()`
- `public abstract byte getLightFromSky()`
- `public abstract byte getLightFromBlocks()`
- `public abstract org.bukkit.World getWorld()`
- `public abstract int getX()`
- `public abstract int getY()`
- `public abstract int getZ()`
- `public abstract org.bukkit.Location getLocation()`
- `public abstract org.bukkit.Location getLocation(org.bukkit.Location)`
- `public abstract org.bukkit.Chunk getChunk()`
- `public abstract void setBlockData(org.bukkit.block.data.BlockData)`
- `public abstract void setBlockData(org.bukkit.block.data.BlockData, boolean)`
- `public abstract void setType(org.bukkit.Material)`
- `public abstract void setType(org.bukkit.Material, boolean)`
- `public abstract org.bukkit.block.BlockFace getFace(org.bukkit.block.Block)`
- `public abstract org.bukkit.block.BlockState getState()`
- `public abstract org.bukkit.block.Biome getBiome()`
- `public abstract void setBiome(org.bukkit.block.Biome)`
- `public abstract boolean isBlockPowered()`
- `public abstract boolean isBlockIndirectlyPowered()`
- `public abstract boolean isBlockFacePowered(org.bukkit.block.BlockFace)`
- `public abstract boolean isBlockFaceIndirectlyPowered(org.bukkit.block.BlockFace)`
- `public abstract int getBlockPower(org.bukkit.block.BlockFace)`
- `public abstract int getBlockPower()`
- `public abstract boolean isEmpty()`
- `public abstract boolean isLiquid()`
- `public abstract double getTemperature()`
- `public abstract double getHumidity()`
- `public abstract org.bukkit.block.PistonMoveReaction getPistonMoveReaction()`
- `public abstract boolean breakNaturally()`
- `public abstract boolean breakNaturally(org.bukkit.inventory.ItemStack)`
- `public abstract boolean applyBoneMeal(org.bukkit.block.BlockFace)`
- `public abstract java.util.Collection<org.bukkit.inventory.ItemStack> getDrops()`
- `public abstract java.util.Collection<org.bukkit.inventory.ItemStack> getDrops(org.bukkit.inventory.ItemStack)`
- `public abstract java.util.Collection<org.bukkit.inventory.ItemStack> getDrops(org.bukkit.inventory.ItemStack, org.bukkit.entity.Entity)`
- `public abstract boolean isPreferredTool(org.bukkit.inventory.ItemStack)`
- `public abstract boolean isPassable()`
- `public abstract org.bukkit.util.RayTraceResult rayTrace(org.bukkit.Location, org.bukkit.util.Vector, double, org.bukkit.FluidCollisionMode)`
- `public abstract org.bukkit.util.BoundingBox getBoundingBox()`
