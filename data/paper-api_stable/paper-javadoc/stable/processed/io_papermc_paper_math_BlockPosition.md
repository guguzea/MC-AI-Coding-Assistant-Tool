---
title: "io.papermc.paper.math.BlockPosition"
package: "io.papermc.paper.math"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/math/BlockPosition.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlockPosition**
`@Experimental public interface BlockPosition extends Position`
- `default double x()`
- `default double y()`
- `default double z()`
- `default boolean isBlock()`
- `default boolean isFine()`
- `default BlockPosition toBlock()`
- `default BlockPosition offset(int x, int y, int z)`
- `default FinePosition offset(double x, double y, double z)`
- `@Contract(value="_ -> new", pure=true) default BlockPosition offset(BlockFace blockFace)`
- `@Contract(pure=true) default BlockPosition offset(BlockFace blockFace, int amount)`
- `@Contract(pure=true) default BlockPosition offset(Axis axis, int amount)`
