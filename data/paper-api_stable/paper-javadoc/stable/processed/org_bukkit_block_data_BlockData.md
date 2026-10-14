---
title: "org.bukkit.block.data.BlockData"
package: "org.bukkit.block.data"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/data/BlockData.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlockData**
`public interface BlockData extends Cloneable`
- `@NotNull @NotNull Material getMaterial()`
- `@NotNull @NotNull String getAsString()`
- `@NotNull @NotNull String getAsString(boolean hideUnspecified)`
- `@NotNull @NotNull BlockData merge(@NotNull @NotNull BlockData data)`
- `boolean matches(@Nullable @Nullable BlockData data)`
- `@NotNull @NotNull BlockData clone()`
- `@NotNull @NotNull SoundGroup getSoundGroup()`
- `int getLightEmission()`
- `boolean isOccluding()`
- `boolean requiresCorrectToolForDrops()`
- `boolean isPreferredTool(@NotNull @NotNull ItemStack tool)`
- `@NotNull @NotNull PistonMoveReaction getPistonMoveReaction()`
- `boolean isSupported(@NotNull @NotNull Block block)`
- `boolean isSupported(@NotNull @NotNull Location location)`
- `boolean isFaceSturdy(@NotNull @NotNull BlockFace face, @NotNull @NotNull BlockSupport support)`
- `@NotNull VoxelShape getCollisionShape(@NotNull @NotNull Location location)`
- `@NotNull @NotNull Color getMapColor()`
- `@NotNull @NotNull Material getPlacementMaterial()`
- `void rotate(@NotNull @NotNull StructureRotation rotation)`
- `void mirror(@NotNull @NotNull Mirror mirror)`
- `void copyTo(@NotNull @NotNull BlockData other)`
- `@NotNull @NotNull BlockState createBlockState()`
- `default float getDestroySpeed(@NotNull @NotNull ItemStack itemStack)`
- `float getDestroySpeed(@NotNull @NotNull ItemStack itemStack, boolean considerEnchants)`
- `boolean isRandomlyTicked()`
- `boolean isReplaceable()`
