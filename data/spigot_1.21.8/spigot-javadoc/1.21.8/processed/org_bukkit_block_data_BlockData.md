---
title: "org.bukkit.block.data.BlockData"
package: "org.bukkit.block.data"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.block.data.BlockData extends java.lang.Cloneable`
- `public abstract org.bukkit.Material getMaterial()`
- `public abstract java.lang.String getAsString()`
- `public abstract java.lang.String getAsString(boolean)`
- `public abstract org.bukkit.block.data.BlockData merge(org.bukkit.block.data.BlockData)`
- `public abstract boolean matches(org.bukkit.block.data.BlockData)`
- `public abstract org.bukkit.block.data.BlockData clone()`
- `public abstract org.bukkit.SoundGroup getSoundGroup()`
- `public abstract int getLightEmission()`
- `public abstract boolean isOccluding()`
- `public abstract boolean requiresCorrectToolForDrops()`
- `public abstract boolean isPreferredTool(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.block.PistonMoveReaction getPistonMoveReaction()`
- `public abstract boolean isSupported(org.bukkit.block.Block)`
- `public abstract boolean isSupported(org.bukkit.Location)`
- `public abstract boolean isFaceSturdy(org.bukkit.block.BlockFace, org.bukkit.block.BlockSupport)`
- `public abstract org.bukkit.Color getMapColor()`
- `public abstract org.bukkit.Material getPlacementMaterial()`
- `public abstract void rotate(org.bukkit.block.structure.StructureRotation)`
- `public abstract void mirror(org.bukkit.block.structure.Mirror)`
- `public abstract void copyTo(org.bukkit.block.data.BlockData)`
- `public abstract org.bukkit.block.BlockState createBlockState()`
