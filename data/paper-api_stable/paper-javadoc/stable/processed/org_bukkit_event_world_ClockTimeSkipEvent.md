---
title: "org.bukkit.event.world.ClockTimeSkipEvent"
package: "org.bukkit.event.world"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/world/ClockTimeSkipEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ClockTimeSkipEvent**
`@Experimental @NullMarked public class ClockTimeSkipEvent extends Event implements Cancellable`
- `@Internal public ClockTimeSkipEvent(ClockTimeSkipEvent.SkipReason skipReason, long skipAmount)`
- `public ClockTimeSkipEvent.SkipReason getSkipReason()`
- `public long getSkipAmount()`
- `public void setSkipAmount(long skipAmount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
