---
title: "org.bukkit.block.Block"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/block/Block.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated byte getData()`
- `@NotNull @NotNull BlockData getBlockData()`
- `@NotNull @NotNull Block getRelative&#8203;(int modX, int modY, int modZ)`
- `@NotNull @NotNull Block getRelative&#8203;(@NotNull @NotNull BlockFace face)`
- `@NotNull @NotNull Block getRelative&#8203;(@NotNull @NotNull BlockFace face, int distance)`
- `@NotNull @NotNull Material getType()`
- `byte getLightLevel()`
- `byte getLightFromSky()`
- `byte getLightFromBlocks()`
- `@NotNull @NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `default long getBlockKey()`
- `static long getBlockKey&#8203;(int x, int y, int z)`
- `static int getBlockKeyX&#8203;(long packed)`
- `static int getBlockKeyY&#8203;(long packed)`
- `static int getBlockKeyZ&#8203;(long packed)`
- `boolean isValidTool&#8203;(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable @Nullable Location getLocation&#8203;(@Nullable @Nullable Location loc)`
- `@NotNull @NotNull Chunk getChunk()`
- `void setBlockData&#8203;(@NotNull @NotNull BlockData data)`
- `void setBlockData&#8203;(@NotNull @NotNull BlockData data, boolean applyPhysics)`
- `void setType&#8203;(@NotNull @NotNull Material type)`
- `void setType&#8203;(@NotNull @NotNull Material type, boolean applyPhysics)`
- `@Nullable @Nullable BlockFace getFace&#8203;(@NotNull @NotNull Block block)`
- `@NotNull @NotNull BlockState getState()`
- `@NotNull @NotNull BlockState getState&#8203;(boolean useSnapshot)`
- `@NotNull @NotNull Biome getBiome()`
- `void setBiome&#8203;(@NotNull @NotNull Biome bio)`
- `boolean isBlockPowered()`
- `boolean isBlockIndirectlyPowered()`
- `boolean isBlockFacePowered&#8203;(@NotNull @NotNull BlockFace face)`
- `boolean isBlockFaceIndirectlyPowered&#8203;(@NotNull @NotNull BlockFace face)`
- `int getBlockPower&#8203;(@NotNull @NotNull BlockFace face)`
- `int getBlockPower()`
- `boolean isEmpty()`
- `boolean isLiquid()`
- `boolean isBuildable()`
- `boolean isBurnable()`
- `boolean isReplaceable()`
- `boolean isSolid()`
- `double getTemperature()`
- `double getHumidity()`
- `@NotNull @NotNull PistonMoveReaction getPistonMoveReaction()`
- `boolean breakNaturally()`
- `boolean breakNaturally&#8203;(@Nullable @Nullable ItemStack tool)`
- `boolean breakNaturally&#8203;(@NotNull @NotNull ItemStack tool, boolean triggerEffect)`
- `boolean applyBoneMeal&#8203;(@NotNull @NotNull BlockFace face)`
- `@NotNull @NotNull Collection<ItemStack> getDrops()`
- `@NotNull @NotNull Collection<ItemStack> getDrops&#8203;(@Nullable @Nullable ItemStack tool)`
- `@NotNull @NotNull Collection<ItemStack> getDrops&#8203;(@NotNull @NotNull ItemStack tool, @Nullable @Nullable Entity entity)`
- `boolean isPreferredTool&#8203;(@NotNull @NotNull ItemStack tool)`
- `boolean isPassable()`
- `@Nullable @Nullable RayTraceResult rayTrace&#8203;(@NotNull @NotNull Location start, @NotNull @NotNull Vector direction, double maxDistance, @NotNull @NotNull FluidCollisionMode fluidCollisionMode)`
- `@NotNull @NotNull BoundingBox getBoundingBox()`
- `@NotNull BlockSoundGroup getSoundGroup()`
- `@NotNull @NotNull String getTranslationKey()`
- `@NotNull default @org.jetbrains.annotations.NotNull float getDestroySpeed&#8203;(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull @org.jetbrains.annotations.NotNull float getDestroySpeed&#8203;(@NotNull @NotNull ItemStack itemStack, boolean considerEnchants)`
