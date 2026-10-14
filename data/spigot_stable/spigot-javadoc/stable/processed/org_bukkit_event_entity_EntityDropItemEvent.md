---
title: "org.bukkit.event.entity.EntityDropItemEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityDropItemEvent**
`public class EntityDropItemEvent extends EntityEvent implements Cancellable`
- `public EntityDropItemEvent(@NotNull Entity entity, @NotNull Item drop)`
- `@NotNull public Item getItemDrop()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
