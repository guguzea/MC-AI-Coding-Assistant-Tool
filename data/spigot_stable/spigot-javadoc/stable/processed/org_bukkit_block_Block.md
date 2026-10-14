---
title: "org.bukkit.block.Block"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Block.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Block**
`public interface Block extends Metadatable, Translatable`
- `@Deprecated(since="1.6.2") byte getData()`
- `@NotNull BlockData getBlockData()`
- `@NotNull Block getRelative(int modX, int modY, int modZ)`
- `@NotNull Block getRelative(@NotNull BlockFace face)`
- `@NotNull Block getRelative(@NotNull BlockFace face, int distance)`
- `@NotNull Material getType()`
- `byte getLightLevel()`
- `byte getLightFromSky()`
- `byte getLightFromBlocks()`
- `@NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `@NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable Location getLocation(@Nullable Location loc)`
- `@NotNull Chunk getChunk()`
- `void setBlockData(@NotNull BlockData data)`
- `void setBlockData(@NotNull BlockData data, boolean applyPhysics)`
- `void setType(@NotNull Material type)`
- `void setType(@NotNull Material type, boolean applyPhysics)`
- `@Nullable BlockFace getFace(@NotNull Block block)`
- `@NotNull BlockState getState()`
- `@NotNull Biome getBiome()`
- `void setBiome(@NotNull Biome bio)`
- `boolean isBlockPowered()`
- `boolean isBlockIndirectlyPowered()`
- `boolean isBlockFacePowered(@NotNull BlockFace face)`
- `boolean isBlockFaceIndirectlyPowered(@NotNull BlockFace face)`
- `int getBlockPower(@NotNull BlockFace face)`
- `int getBlockPower()`
- `boolean isEmpty()`
- `boolean isLiquid()`
- `double getTemperature()`
- `double getHumidity()`
- `@NotNull PistonMoveReaction getPistonMoveReaction()`
- `boolean breakNaturally()`
- `boolean breakNaturally(@Nullable ItemStack tool)`
- `boolean applyBoneMeal(@NotNull BlockFace face)`
- `@NotNull Collection<ItemStack> getDrops()`
- `@NotNull Collection<ItemStack> getDrops(@Nullable ItemStack tool)`
- `@NotNull Collection<ItemStack> getDrops(@NotNull ItemStack tool, @Nullable Entity entity)`
- `boolean isPreferredTool(@NotNull ItemStack tool)`
- `float getBreakSpeed(@NotNull Player player)`
- `boolean isPassable()`
- `@Nullable RayTraceResult rayTrace(@NotNull Location start, @NotNull Vector direction, double maxDistance, @NotNull FluidCollisionMode fluidCollisionMode)`
- `@NotNull BoundingBox getBoundingBox()`
- `@NotNull VoxelShape getCollisionShape()`
- `boolean canPlace(@NotNull BlockData data)`
