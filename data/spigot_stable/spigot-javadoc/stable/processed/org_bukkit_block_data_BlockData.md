---
title: "org.bukkit.block.data.BlockData"
package: "org.bukkit.block.data"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/data/BlockData.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BlockData**
`public interface BlockData extends Cloneable`
- `@NotNull Material getMaterial()`
- `@NotNull String getAsString()`
- `@NotNull String getAsString(boolean hideUnspecified)`
- `@NotNull BlockData merge(@NotNull BlockData data)`
- `boolean matches(@Nullable BlockData data)`
- `@NotNull BlockData clone()`
- `@NotNull SoundGroup getSoundGroup()`
- `int getLightEmission()`
- `boolean isOccluding()`
- `boolean requiresCorrectToolForDrops()`
- `boolean isPreferredTool(@NotNull ItemStack tool)`
- `@NotNull PistonMoveReaction getPistonMoveReaction()`
- `boolean isSupported(@NotNull Block block)`
- `boolean isSupported(@NotNull Location location)`
- `boolean isFaceSturdy(@NotNull BlockFace face, @NotNull BlockSupport support)`
- `@NotNull Color getMapColor()`
- `@NotNull Material getPlacementMaterial()`
- `void rotate(@NotNull StructureRotation rotation)`
- `void mirror(@NotNull Mirror mirror)`
- `void copyTo(@NotNull BlockData other)`
- `@NotNull BlockState createBlockState()`
