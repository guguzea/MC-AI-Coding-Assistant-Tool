---
title: "io.papermc.paper.math.Position"
package: "io.papermc.paper.math"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/math/Position.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Position**
`@Experimental public interface Position`
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
- `default boolean isFinite()`
- `Position offset(int x, int y, int z)`
- `FinePosition offset(double x, double y, double z)`
- `@Contract(value="-> new", pure=true) default FinePosition toCenter()`
- `@Contract(pure=true) BlockPosition toBlock()`
- `@Contract(value="-> new", pure=true) default Vector toVector()`
- `@Contract(value="_ -> new", pure=true) default Location toLocation(World world)`
- `@Contract(value="_, _, _ -> new", pure=true) static BlockPosition block(int x, int y, int z)`
- `@Contract(value="_ -> new", pure=true) static BlockPosition block(Location location)`
- `@Contract(value="_, _, _ -> new", pure=true) static FinePosition fine(double x, double y, double z)`
- `@Contract(value="_ -> new", pure=true) static FinePosition fine(Location location)`
