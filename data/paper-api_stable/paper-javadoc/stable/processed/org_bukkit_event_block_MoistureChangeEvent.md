---
title: "org.bukkit.event.block.MoistureChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/MoistureChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class MoistureChangeEvent**
`public class MoistureChangeEvent extends BlockEvent implements Cancellable`
- `@Internal public MoistureChangeEvent(@NotNull @NotNull Block block, @NotNull @NotNull BlockState newState)`
- `@NotNull public @NotNull BlockState getNewState()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
