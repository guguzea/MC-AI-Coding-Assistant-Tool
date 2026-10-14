---
title: "org.bukkit.event.entity.EntityChangeBlockEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityChangeBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityChangeBlockEvent**
`public class EntityChangeBlockEvent extends EntityEvent implements Cancellable`
- `public EntityChangeBlockEvent(@NotNull Entity what, @NotNull Block block, @NotNull BlockData to)`
- `@NotNull public Block getBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Material getTo()`
- `@NotNull public BlockData getBlockData()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
