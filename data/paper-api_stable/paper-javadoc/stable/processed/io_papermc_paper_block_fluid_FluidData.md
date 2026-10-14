---
title: "io.papermc.paper.block.fluid.FluidData"
package: "io.papermc.paper.block.fluid"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/block/fluid/FluidData.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface FluidData**
`@NullMarked public interface FluidData extends Cloneable`
- `Fluid getFluidType()`
- `FluidData clone()`
- `Vector computeFlowDirection(Location location)`
- `@Range(from=0L,to=8L) int getLevel()`
- `@Range(from=0L,to=1L) float computeHeight(Location location)`
- `boolean isSource()`
