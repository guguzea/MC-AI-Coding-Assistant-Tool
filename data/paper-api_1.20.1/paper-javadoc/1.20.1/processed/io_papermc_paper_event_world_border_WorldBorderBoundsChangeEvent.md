---
title: "io.papermc.paper.event.world.border.WorldBorderBoundsChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/world/border/WorldBorderBoundsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public WorldBorderBoundsChangeEvent(@NotNull @NotNull World world, @NotNull @NotNull WorldBorder worldBorder, @NotNull @NotNull WorldBorderBoundsChangeEvent.Type type, double oldSize, double newSize, long duration)`
- `@NotNull public @NotNull WorldBorderBoundsChangeEvent.Type getType()`
- `public double getOldSize()`
- `public double getNewSize()`
- `public void setNewSize(double newSize)`
- `public long getDuration()`
- `public void setDuration(long duration)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
