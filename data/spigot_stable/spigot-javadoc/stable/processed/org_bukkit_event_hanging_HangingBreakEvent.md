---
title: "org.bukkit.event.hanging.HangingBreakEvent"
package: "org.bukkit.event.hanging"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/hanging/HangingBreakEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class HangingBreakEvent**
`public class HangingBreakEvent extends HangingEvent implements Cancellable`
- `public HangingBreakEvent(@NotNull Hanging hanging, @NotNull HangingBreakEvent.RemoveCause cause)`
- `@NotNull public HangingBreakEvent.RemoveCause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
