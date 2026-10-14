---
title: "io.papermc.paper.event.world.border.WorldBorderBoundsChangeEvent"
package: "io.papermc.paper.event.world.border"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/world/border/WorldBorderBoundsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WorldBorderBoundsChangeEvent**
`@NullMarked public class WorldBorderBoundsChangeEvent extends WorldBorderEvent implements Cancellable`
- `@Internal public WorldBorderBoundsChangeEvent(World world, WorldBorder worldBorder, WorldBorderBoundsChangeEvent.Type type, double oldSize, double newSize, long duration)`
- `public WorldBorderBoundsChangeEvent.Type getType()`
- `public double getOldSize()`
- `public double getNewSize()`
- `public void setNewSize(double newSize)`
- `public @Range(from=0L,to=2147483647L) long getDurationTicks()`
- `public void setDurationTicks(@Range(from=0L,to=2147483647L) long duration)`
- `@Deprecated(forRemoval=true, since="1.21.11") public @NonNegative long getDuration()`
- `@Deprecated(forRemoval=true, since="1.21.11") public void setDuration(@NonNegative long duration)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
