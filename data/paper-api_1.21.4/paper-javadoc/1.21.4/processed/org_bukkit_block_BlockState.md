---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/block/BlockState.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Block getBlock()`
- `@NotNull @Deprecated(forRemoval=true, since="1.13") @NotNull MaterialData getData()`
- `@NotNull @NotNull BlockData getBlockData()`
- `@NotNull @Experimental @NotNull BlockState copy()`
- `@NotNull @Experimental @NotNull BlockState copy(@NotNull @NotNull Location location)`
- `@NotNull @NotNull Material getType()`
- `byte getLightLevel()`
- `@NotNull @NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `@NotNull @NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable @Nullable Location getLocation(@Nullable @Nullable Location loc)`
- `@NotNull @NotNull Chunk getChunk()`
- `@Deprecated(forRemoval=true, since="1.13") void setData(@NotNull @NotNull MaterialData data)`
- `void setBlockData(@NotNull @NotNull BlockData data)`
- `void setType(@NotNull @NotNull Material type)`
- `boolean update()`
- `boolean update(boolean force)`
- `boolean update(boolean force, boolean applyPhysics)`
- `@Deprecated(since="1.6.2", forRemoval=true) byte getRawData()`
- `@Deprecated(since="1.6.2", forRemoval=true) void setRawData(byte data)`
- `boolean isPlaced()`
- `boolean isCollidable()`
- `@NotNull default @Unmodifiable Collection<ItemStack> getDrops()`
- `@NotNull default @Unmodifiable Collection<ItemStack> getDrops(@Nullable ItemStack tool)`
- `@NotNull @Unmodifiable Collection<ItemStack> getDrops(@Nullable ItemStack tool, @Nullable Entity entity)`
