---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/block/BlockState.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Block getBlock()`
- `@NotNull @Deprecated @NotNull MaterialData getData()`
- `@NotNull @NotNull BlockData getBlockData()`
- `@NotNull @NotNull Material getType()`
- `byte getLightLevel()`
- `@NotNull @NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `@NotNull @NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable @Nullable Location getLocation(@Nullable @Nullable Location loc)`
- `@NotNull @NotNull Chunk getChunk()`
- `@Deprecated void setData(@NotNull @NotNull MaterialData data)`
- `void setBlockData(@NotNull @NotNull BlockData data)`
- `void setType(@NotNull @NotNull Material type)`
- `boolean update()`
- `boolean update(boolean force)`
- `boolean update(boolean force, boolean applyPhysics)`
- `@Deprecated byte getRawData()`
- `@Deprecated void setRawData(byte data)`
- `boolean isPlaced()`
- `boolean isCollidable()`
- `@NotNull @Unmodifiable Collection<ItemStack> getDrops()`
- `@NotNull @Unmodifiable Collection<ItemStack> getDrops(@Nullable ItemStack tool)`
- `@NotNull @Unmodifiable Collection<ItemStack> getDrops(@NotNull ItemStack tool, @Nullable Entity entity)`
