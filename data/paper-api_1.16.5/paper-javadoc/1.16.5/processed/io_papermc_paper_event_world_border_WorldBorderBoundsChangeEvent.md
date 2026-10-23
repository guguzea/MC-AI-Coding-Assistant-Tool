---
title: "io.papermc.paper.event.world.border.WorldBorderBoundsChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/world/border/WorldBorderBoundsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public WorldBorderBoundsChangeEvent&#8203;(@NotNull @NotNull World world, @NotNull @NotNull WorldBorder worldBorder, @NotNull @NotNull WorldBorderBoundsChangeEvent.Type type, double oldSize, double newSize, long duration)`
- `@NotNull public @NotNull WorldBorderBoundsChangeEvent.Type getType()`
- `public double getOldSize()`
- `public double getNewSize()`
- `public void setNewSize&#8203;(double newSize)`
- `public long getDuration()`
- `public void setDuration&#8203;(long duration)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
