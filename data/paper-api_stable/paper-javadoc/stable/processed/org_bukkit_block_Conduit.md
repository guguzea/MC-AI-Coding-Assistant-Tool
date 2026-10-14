---
title: "org.bukkit.block.Conduit"
package: "org.bukkit.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/Conduit.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Conduit**
`public interface Conduit extends TileState`
- `boolean isActive()`
- `boolean isHunting()`
- `@NotNull @NotNull Collection<Block> getFrameBlocks()`
- `int getFrameBlockCount()`
- `int getRange()`
- `boolean setTarget(@Nullable @Nullable LivingEntity target)`
- `@Nullable @Nullable LivingEntity getTarget()`
- `boolean hasTarget()`
- `@NotNull @NotNull BoundingBox getHuntingArea()`
