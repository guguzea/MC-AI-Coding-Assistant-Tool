---
title: "org.bukkit.event.block.FluidLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/FluidLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class FluidLevelChangeEvent**
`public class FluidLevelChangeEvent extends BlockEvent implements Cancellable`
- `public FluidLevelChangeEvent(@NotNull Block theBlock, @NotNull BlockData newData)`
- `@NotNull public BlockData getNewData()`
- `public void setNewData(@NotNull BlockData newData)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
