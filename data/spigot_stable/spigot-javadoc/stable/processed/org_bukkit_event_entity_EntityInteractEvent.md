---
title: "org.bukkit.event.entity.EntityInteractEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityInteractEvent**
`public class EntityInteractEvent extends EntityEvent implements Cancellable`
- `protected Block block`
- `public EntityInteractEvent(@NotNull Entity entity, @NotNull Block block)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Block getBlock()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
