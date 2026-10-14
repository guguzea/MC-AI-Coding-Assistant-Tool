---
title: "org.bukkit.generator.LimitedRegion"
package: "org.bukkit.generator"
source: https://jd.papermc.io/paper/26.3/org/bukkit/generator/LimitedRegion.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface LimitedRegion**
`public interface LimitedRegion extends RegionAccessor`
- `int getBuffer()`
- `boolean isInRegion(@NotNull @NotNull Location location)`
- `boolean isInRegion(int x, int y, int z)`
- `@NotNull @NotNull List<BlockState> getTileEntities()`
- `void setBlockState(int x, int y, int z, @NotNull @NotNull BlockState state)`
- `default void setBlockState(@NotNull @NotNull Vector location, @NotNull @NotNull BlockState state)`
- `void scheduleBlockUpdate(int x, int y, int z)`
- `default void scheduleBlockUpdate(@NotNull @NotNull Vector location)`
- `void scheduleFluidUpdate(int x, int y, int z)`
- `default void scheduleFluidUpdate(@NotNull @NotNull Vector location)`
- `@NotNull @NotNull World getWorld()`
- `int getCenterChunkX()`
- `default int getCenterBlockX()`
- `int getCenterChunkZ()`
- `default int getCenterBlockZ()`
