---
title: "org.bukkit.event.world.TimeSkipEvent"
package: "org.bukkit.event.world"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/world/TimeSkipEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class TimeSkipEvent**
`public class TimeSkipEvent extends WorldEvent implements Cancellable`
- `public TimeSkipEvent(@NotNull World world, @NotNull TimeSkipEvent.SkipReason skipReason, long skipAmount)`
- `@NotNull public TimeSkipEvent.SkipReason getSkipReason()`
- `public long getSkipAmount()`
- `public void setSkipAmount(long skipAmount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
