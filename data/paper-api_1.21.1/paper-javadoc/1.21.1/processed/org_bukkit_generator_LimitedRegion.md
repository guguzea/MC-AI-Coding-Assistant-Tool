---
title: "org.bukkit.generator.LimitedRegion"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/generator/LimitedRegion.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `int getBuffer()`
- `boolean isInRegion(@NotNull @NotNull Location location)`
- `boolean isInRegion(int x, int y, int z)`
- `@NotNull @NotNull List<BlockState> getTileEntities()`
- `default void setBlockData(@NotNull @NotNull Vector vector, @NotNull @NotNull BlockData data)`
- `void setBlockState(int x, int y, int z, @NotNull @NotNull BlockState state)`
- `default void setBlockState(@NotNull @NotNull Vector location, @NotNull @NotNull BlockState state)`
- `@NotNull default @NotNull BlockState getBlockState(@NotNull @NotNull Vector location)`
- `void scheduleBlockUpdate(int x, int y, int z)`
- `default void scheduleBlockUpdate(@NotNull @NotNull Vector location)`
- `void scheduleFluidUpdate(int x, int y, int z)`
- `default void scheduleFluidUpdate(@NotNull @NotNull Vector location)`
- `@NotNull @NotNull World getWorld()`
- `@NotNull default @NotNull BlockData getBlockData(@NotNull @NotNull Vector vector)`
- `int getCenterChunkX()`
- `default int getCenterBlockX()`
- `int getCenterChunkZ()`
- `default int getCenterBlockZ()`
