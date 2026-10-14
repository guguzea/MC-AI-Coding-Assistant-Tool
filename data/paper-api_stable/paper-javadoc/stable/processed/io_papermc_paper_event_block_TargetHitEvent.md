---
title: "io.papermc.paper.event.block.TargetHitEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/block/TargetHitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class TargetHitEvent**
`@NullMarked public class TargetHitEvent extends ProjectileHitEvent`
- `@Internal public TargetHitEvent(Projectile projectile, Block block, BlockFace blockFace, int signalStrength)`
- `public @Range(from=0L,to=15L) int getSignalStrength()`
- `public void setSignalStrength(@Range(from=0L,to=15L) int signalStrength)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
