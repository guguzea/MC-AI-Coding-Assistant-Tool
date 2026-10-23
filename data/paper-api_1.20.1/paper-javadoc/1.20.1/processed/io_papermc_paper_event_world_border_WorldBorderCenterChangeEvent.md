---
title: "io.papermc.paper.event.world.border.WorldBorderCenterChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/world/border/WorldBorderCenterChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public WorldBorderCenterChangeEvent(@NotNull @NotNull World world, @NotNull @NotNull WorldBorder worldBorder, @NotNull @NotNull Location oldCenter, @NotNull @NotNull Location newCenter)`
- `@NotNull public @NotNull Location getOldCenter()`
- `@NotNull public @NotNull Location getNewCenter()`
- `public void setNewCenter(@NotNull @NotNull Location newCenter)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
