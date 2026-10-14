---
title: "org.bukkit.event.entity.ItemDespawnEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/ItemDespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ItemDespawnEvent**
`public class ItemDespawnEvent extends EntityEvent implements Cancellable`
- `public ItemDespawnEvent(@NotNull Item despawnee, @NotNull Location loc)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Item getEntity()`
- `@NotNull public Location getLocation()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
