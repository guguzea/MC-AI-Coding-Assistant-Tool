---
title: "io.papermc.paper.math.BlockPosition"
package: "io.papermc.paper.math"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/math/BlockPosition.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `default double x()`
- `default double y()`
- `default double z()`
- `default boolean isBlock()`
- `default boolean isFine()`
- `@NotNull default @NotNull BlockPosition toBlock()`
- `@NotNull default @NotNull BlockPosition offset(int x, int y, int z)`
- `@NotNull default @NotNull FinePosition offset(double x, double y, double z)`
- `@Contract(value="_ -> new", pure=true) @NotNull default @NotNull BlockPosition offset(@NotNull @NotNull BlockFace blockFace)`
- `@Contract(pure=true) @NotNull default @NotNull BlockPosition offset(@NotNull @NotNull BlockFace blockFace, int amount)`
- `@Contract(pure=true) @NotNull default @NotNull BlockPosition offset(@NotNull @NotNull Axis axis, int amount)`
