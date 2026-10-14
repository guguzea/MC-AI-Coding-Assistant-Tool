---
title: "org.bukkit.block.Block"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Block.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Block**
`public interface Block extends Metadatable, Translatable, Translatable`
- `@Deprecated(since="1.6.2", forRemoval=true) byte getData()`
- `@NotNull @NotNull BlockData getBlockData()`
- `@NotNull @NotNull Block getRelative(int modX, int modY, int modZ)`
- `@NotNull @NotNull Block getRelative(@NotNull @NotNull BlockFace face)`
- `@NotNull @NotNull Block getRelative(@NotNull @NotNull BlockFace face, int distance)`
- `@NotNull @NotNull Material getType()`
- `byte getLightLevel()`
- `byte getLightFromSky()`
- `byte getLightFromBlocks()`
- `@NotNull @NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `@Deprecated(since="1.18.1") default long getBlockKey()`
- `@Deprecated(since="1.18.1") static long getBlockKey(int x, int y, int z)`
- `@Deprecated(since="1.18.1") static int getBlockKeyX(long packed)`
- `@Deprecated(since="1.18.1") static int getBlockKeyY(long packed)`
- `@Deprecated(since="1.18.1") static int getBlockKeyZ(long packed)`
- `@Deprecated(since="1.21", forRemoval=true) boolean isValidTool(@NotNull @NotNull ItemStack tool)`
- `@NotNull @NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable @Nullable Location getLocation(@Nullable @Nullable Location loc)`
- `@NotNull @NotNull Chunk getChunk()`
- `void setBlockData(@NotNull @NotNull BlockData data)`
- `void setBlockData(@NotNull @NotNull BlockData data, boolean applyPhysics)`
- `void setType(@NotNull @NotNull Material type)`
- `void setType(@NotNull @NotNull Material type, boolean applyPhysics)`
- `@Nullable @Nullable BlockFace getFace(@NotNull @NotNull Block block)`
- `@NotNull @NotNull BlockState getState()`
- `@NotNull @NotNull BlockState getState(boolean useSnapshot)`
- `@NotNull @NotNull Biome getBiome()`
- `@NotNull @NotNull Biome getComputedBiome()`
- `void setBiome(@NotNull @NotNull Biome bio)`
- `boolean isBlockPowered()`
- `boolean isBlockIndirectlyPowered()`
- `boolean isBlockFacePowered(@NotNull @NotNull BlockFace face)`
- `boolean isBlockFaceIndirectlyPowered(@NotNull @NotNull BlockFace face)`
- `int getBlockPower(@NotNull @NotNull BlockFace face)`
- `default int getBlockPower()`
- `boolean isEmpty()`
- `boolean isLiquid()`
- `boolean isBuildable()`
- `boolean isBurnable()`
- `boolean isReplaceable()`
- `boolean isSolid()`
- `boolean isCollidable()`
- `double getTemperature()`
- `double getHumidity()`
- `@NotNull @NotNull PistonMoveReaction getPistonMoveReaction()`
- `boolean breakNaturally()`
- `boolean breakNaturally(@Nullable @Nullable ItemStack tool)`
- `default boolean breakNaturally(boolean triggerEffect)`
- `boolean breakNaturally(boolean triggerEffect, boolean dropExperience)`
- `default boolean breakNaturally(@NotNull @NotNull ItemStack tool, boolean triggerEffect)`
- `boolean breakNaturally(@NotNull @NotNull ItemStack tool, boolean triggerEffect, boolean dropExperience)`
- `boolean breakNaturally(@NotNull @NotNull ItemStack tool, boolean triggerEffect, boolean dropExperience, boolean forceEffect)`
- `void tick()`
- `void fluidTick()`
- `void randomTick()`
- `boolean applyBoneMeal(@NotNull @NotNull BlockFace face)`
- `@NotNull @NotNull Collection<ItemStack> getDrops()`
- `@NotNull @NotNull Collection<ItemStack> getDrops(@Nullable @Nullable ItemStack tool)`
- `@NotNull @NotNull Collection<ItemStack> getDrops(@Nullable @Nullable ItemStack tool, @Nullable @Nullable Entity entity)`
- `boolean isPreferredTool(@NotNull @NotNull ItemStack tool)`
- `float getBreakSpeed(@NotNull @NotNull Player player)`
- `boolean isPassable()`
- `@Nullable @Nullable RayTraceResult rayTrace(@NotNull @NotNull Location start, @NotNull @NotNull Vector direction, double maxDistance, @NotNull @NotNull FluidCollisionMode fluidCollisionMode)`
- `@NotNull @NotNull BoundingBox getBoundingBox()`
- `@NotNull @NotNull VoxelShape getCollisionShape()`
- `boolean canPlace(@NotNull @NotNull BlockData data)`
- `@NotNull @Deprecated(forRemoval=true, since="1.18.2") BlockSoundGroup getSoundGroup()`
- `@NotNull SoundGroup getBlockSoundGroup()`
- `@NotNull @Deprecated(forRemoval=true) @NotNull String getTranslationKey()`
- `default float getDestroySpeed(@NotNull @NotNull ItemStack itemStack)`
- `default float getDestroySpeed(@NotNull @NotNull ItemStack itemStack, boolean considerEnchants)`
- `boolean isSuffocating()`
