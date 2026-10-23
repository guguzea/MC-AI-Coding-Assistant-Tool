---
title: "org.bukkit.block.BlockState"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/block/BlockState.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull Block getBlock()`
- `@NotNull @NotNull MaterialData getData()`
- `@NotNull @NotNull BlockData getBlockData()`
- `@NotNull @NotNull Material getType()`
- `byte getLightLevel()`
- `@NotNull @NotNull World getWorld()`
- `int getX()`
- `int getY()`
- `int getZ()`
- `@NotNull @NotNull Location getLocation()`
- `@Contract("null -> null; !null -> !null") @Nullable @Nullable Location getLocation&#8203;(@Nullable @Nullable Location loc)`
- `@NotNull @NotNull Chunk getChunk()`
- `void setData&#8203;(@NotNull @NotNull MaterialData data)`
- `void setBlockData&#8203;(@NotNull @NotNull BlockData data)`
- `void setType&#8203;(@NotNull @NotNull Material type)`
- `boolean update()`
- `boolean update&#8203;(boolean force)`
- `boolean update&#8203;(boolean force, boolean applyPhysics)`
- `@Deprecated byte getRawData()`
- `@Deprecated void setRawData&#8203;(byte data)`
- `boolean isPlaced()`
