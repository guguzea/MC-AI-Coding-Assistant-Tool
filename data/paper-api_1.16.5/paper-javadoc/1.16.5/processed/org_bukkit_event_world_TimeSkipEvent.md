---
title: "org.bukkit.event.world.TimeSkipEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/world/TimeSkipEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public TimeSkipEvent&#8203;(@NotNull @NotNull World world, @NotNull @NotNull TimeSkipEvent.SkipReason skipReason, @NotNull @org.jetbrains.annotations.NotNull long skipAmount)`
- `@NotNull public @NotNull TimeSkipEvent.SkipReason getSkipReason()`
- `public long getSkipAmount()`
- `public void setSkipAmount&#8203;(long skipAmount)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
