---
title: "org.bukkit.block.Conduit"
package: "org.bukkit.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Conduit.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Conduit**
`public interface Conduit extends TileState`
- `boolean isActive()`
- `boolean isHunting()`
- `@NotNull Collection<Block> getFrameBlocks()`
- `int getFrameBlockCount()`
- `int getRange()`
- `boolean setTarget(@Nullable LivingEntity target)`
- `@Nullable LivingEntity getTarget()`
- `boolean hasTarget()`
- `@NotNull BoundingBox getHuntingArea()`
