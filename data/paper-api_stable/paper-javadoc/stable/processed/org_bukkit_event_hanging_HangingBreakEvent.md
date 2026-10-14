---
title: "org.bukkit.event.hanging.HangingBreakEvent"
package: "org.bukkit.event.hanging"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/hanging/HangingBreakEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class HangingBreakEvent**
`public class HangingBreakEvent extends HangingEvent implements Cancellable`
- `@Internal public HangingBreakEvent(@NotNull @NotNull Hanging hanging, @NotNull HangingBreakEvent.RemoveCause cause)`
- `@NotNull public HangingBreakEvent.RemoveCause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
