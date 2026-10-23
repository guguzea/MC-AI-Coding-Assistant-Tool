---
title: "io.papermc.paper.math.Position"
package: "io.papermc.paper.math"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/math/Position.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `static final FinePosition FINE_ZERO`
- `static final BlockPosition BLOCK_ZERO`
- `int blockX()`
- `int blockY()`
- `int blockZ()`
- `double x()`
- `double y()`
- `double z()`
- `boolean isBlock()`
- `boolean isFine()`
- `@NotNull @NotNull Position offset(int x, int y, int z)`
- `@NotNull @NotNull FinePosition offset(double x, double y, double z)`
- `@Contract(value="-> new", pure=true) @NotNull default @NotNull FinePosition toCenter()`
- `@Contract(pure=true) @NotNull @NotNull BlockPosition toBlock()`
- `@Contract(value="-> new", pure=true) @NotNull default @NotNull Vector toVector()`
- `@Contract(value="_ -> new", pure=true) @NotNull default @NotNull Location toLocation(@NotNull @NotNull World world)`
- `@Contract(value="_, _, _ -> new", pure=true) @NotNull static @NotNull BlockPosition block(int x, int y, int z)`
- `@Contract(value="_ -> new", pure=true) @NotNull static @NotNull BlockPosition block(@NotNull @NotNull Location location)`
- `@Contract(value="_, _, _ -> new", pure=true) @NotNull static @NotNull FinePosition fine(double x, double y, double z)`
- `@Contract(value="_ -> new", pure=true) @NotNull static @NotNull FinePosition fine(@NotNull @NotNull Location location)`
