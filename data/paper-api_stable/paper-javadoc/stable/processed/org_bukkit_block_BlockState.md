---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/BlockState.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlockState**
`public interface BlockState extends Metadatable`
- `@NotNull @NotNull Block getBlock()`
- `@NotNull @Deprecated(forRemoval=true, since="1.13") @NotNull MaterialData getData()`
- `@NotNull @NotNull BlockData getBlockData()`
- `@NotNull @NotNull BlockState copy()`
- `@NotNull @NotNull BlockState copy(@NotNull @NotNull Location location)`
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
- `@NotNull default @NotNull @Unmodifiable Collection<ItemStack> getDrops()`
- `@NotNull default @NotNull @Unmodifiable Collection<ItemStack> getDrops(@Nullable @Nullable ItemStack tool)`
- `@NotNull @NotNull @Unmodifiable Collection<ItemStack> getDrops(@Nullable @Nullable ItemStack tool, @Nullable @Nullable Entity entity)`
- `boolean isSuffocating()`
