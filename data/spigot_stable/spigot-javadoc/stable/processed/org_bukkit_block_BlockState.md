---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/BlockState.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BlockState**
`public interface BlockState extends Metadatable`
- `@NotNull Block getBlock()`
- `@NotNull MaterialData getData()`
- `@NotNull BlockData getBlockData()`
- `@NotNull BlockState copy()`
- `@NotNull BlockState copy(@NotNull Location location)`
- `@NotNull Material getType()`
- `byte getLightLevel()`
- `@NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `@NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable Location getLocation(@Nullable Location loc)`
- `@NotNull Chunk getChunk()`
- `void setData(@NotNull MaterialData data)`
- `void setBlockData(@NotNull BlockData data)`
- `void setType(@NotNull Material type)`
- `boolean update()`
- `boolean update(boolean force)`
- `boolean update(boolean force, boolean applyPhysics)`
- `@Deprecated(since="1.6.2") byte getRawData()`
- `@Deprecated(since="1.6.2") void setRawData(byte data)`
- `boolean isPlaced()`
