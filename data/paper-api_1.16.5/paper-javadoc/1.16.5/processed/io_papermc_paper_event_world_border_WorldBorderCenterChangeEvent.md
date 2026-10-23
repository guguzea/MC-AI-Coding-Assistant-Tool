---
title: "io.papermc.paper.event.world.border.WorldBorderCenterChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/world/border/WorldBorderCenterChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public WorldBorderCenterChangeEvent&#8203;(@NotNull @NotNull World world, @NotNull @NotNull WorldBorder worldBorder, @NotNull @NotNull Location oldCenter, @NotNull @NotNull Location newCenter)`
- `@NotNull public @NotNull Location getOldCenter()`
- `@NotNull public @NotNull Location getNewCenter()`
- `public void setNewCenter&#8203;(@NotNull @NotNull Location newCenter)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
