---
title: "org.bukkit.block.Block"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/block/Block.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `boolean breakNaturally()`
- `boolean breakNaturally(ItemStack tool)`
- `Biome getBiome()`
- `default long getBlockKey()`
- `int getBlockPower()`
- `int getBlockPower(BlockFace face)`
- `Chunk getChunk()`
- `byte getData()`
- `Collection<ItemStack> getDrops()`
- `Collection<ItemStack> getDrops(ItemStack tool)`
- `BlockFace getFace(Block block)`
- `double getHumidity()`
- `byte getLightFromBlocks()`
- `byte getLightFromSky()`
- `byte getLightLevel()`
- `Location getLocation()`
- `Location getLocation(Location loc)`
- `PistonMoveReaction getPistonMoveReaction()`
- `Block getRelative(int modX, int modY, int modZ)`
- `Block getRelative(BlockFace face)`
- `Block getRelative(BlockFace face, int distance)`
- `BlockState getState()`
- `BlockState getState(boolean useSnapshot)`
- `double getTemperature()`
- `Material getType()`
- `int getTypeId()`
- `World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `boolean isBlockFaceIndirectlyPowered(BlockFace face)`
- `boolean isBlockFacePowered(BlockFace face)`
- `boolean isBlockIndirectlyPowered()`
- `boolean isBlockPowered()`
- `boolean isEmpty()`
- `boolean isLiquid()`
- `void setBiome(Biome bio)`
- `void setData(byte data)`
- `void setData(byte data, boolean applyPhysics)`
- `void setType(Material type)`
- `void setType(Material type, boolean applyPhysics)`
- `boolean setTypeId(int type)`
- `boolean setTypeId(int type, boolean applyPhysics)`
- `boolean setTypeIdAndData(int type, byte data, boolean applyPhysics)`
