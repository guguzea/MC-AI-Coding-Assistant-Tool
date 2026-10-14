---
title: "org.bukkit.event.block.FluidLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/FluidLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class FluidLevelChangeEvent**
`public class FluidLevelChangeEvent extends BlockEvent implements Cancellable`
- `@Internal public FluidLevelChangeEvent(@NotNull @NotNull Block fluid, @NotNull @NotNull BlockData newData)`
- `@NotNull public @NotNull BlockData getNewData()`
- `public void setNewData(@NotNull @NotNull BlockData newData)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
