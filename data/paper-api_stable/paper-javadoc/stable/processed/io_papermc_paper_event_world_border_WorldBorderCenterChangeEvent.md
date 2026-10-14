---
title: "io.papermc.paper.event.world.border.WorldBorderCenterChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/world/border/WorldBorderCenterChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WorldBorderCenterChangeEvent**
`@NullMarked public class WorldBorderCenterChangeEvent extends WorldBorderEvent implements Cancellable`
- `@Internal public WorldBorderCenterChangeEvent(World world, WorldBorder worldBorder, Location oldCenter, Location newCenter)`
- `public Location getOldCenter()`
- `public Location getNewCenter()`
- `public void setNewCenter(Location newCenter)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
