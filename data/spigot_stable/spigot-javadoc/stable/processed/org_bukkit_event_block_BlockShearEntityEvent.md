---
title: "org.bukkit.event.block.BlockShearEntityEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/BlockShearEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BlockShearEntityEvent**
`public class BlockShearEntityEvent extends BlockEvent implements Cancellable`
- `public BlockShearEntityEvent(@NotNull Block dispenser, @NotNull Entity sheared, @NotNull ItemStack tool)`
- `@NotNull public Entity getEntity()`
- `@NotNull public ItemStack getTool()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
