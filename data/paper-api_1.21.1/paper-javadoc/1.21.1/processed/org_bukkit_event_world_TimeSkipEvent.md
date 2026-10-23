---
title: "org.bukkit.event.world.TimeSkipEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/world/TimeSkipEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public TimeSkipEvent(@NotNull @NotNull World world, @NotNull @NotNull TimeSkipEvent.SkipReason skipReason, long skipAmount)`
- `@NotNull public @NotNull TimeSkipEvent.SkipReason getSkipReason()`
- `public long getSkipAmount()`
- `public void setSkipAmount(long skipAmount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
