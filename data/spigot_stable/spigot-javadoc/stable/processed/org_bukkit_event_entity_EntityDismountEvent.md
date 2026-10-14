---
title: "org.bukkit.event.entity.EntityDismountEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityDismountEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityDismountEvent**
`public class EntityDismountEvent extends EntityEvent implements Cancellable`
- `public EntityDismountEvent(@NotNull Entity what, @NotNull Entity dismounted)`
- `@NotNull public Entity getDismounted()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
