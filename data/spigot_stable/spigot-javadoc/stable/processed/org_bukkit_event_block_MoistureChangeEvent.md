---
title: "org.bukkit.event.block.MoistureChangeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/MoistureChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class MoistureChangeEvent**
`public class MoistureChangeEvent extends BlockEvent implements Cancellable`
- `public MoistureChangeEvent(@NotNull Block block, @NotNull BlockState newState)`
- `@NotNull public BlockState getNewState()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
