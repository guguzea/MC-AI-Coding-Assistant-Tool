---
title: "io.papermc.paper.event.world.border.WorldBorderBoundsChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/event/world/border/WorldBorderBoundsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public WorldBorderBoundsChangeEvent(World world, WorldBorder worldBorder, WorldBorderBoundsChangeEvent.Type type, double oldSize, double newSize, long duration)`
- `public WorldBorderBoundsChangeEvent.Type getType()`
- `public double getOldSize()`
- `public double getNewSize()`
- `public void setNewSize(double newSize)`
- `public long getDuration()`
- `public void setDuration(long duration)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
