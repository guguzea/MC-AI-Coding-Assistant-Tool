---
title: "org.bukkit.event.entity.ItemDespawnEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/ItemDespawnEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ItemDespawnEvent**
`public class ItemDespawnEvent extends EntityEvent implements Cancellable`
- `@Internal public ItemDespawnEvent(@NotNull @NotNull Item despawnee, @NotNull @NotNull Location location)`
- `@NotNull public @NotNull Item getEntity()`
- `@NotNull public @NotNull Location getLocation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
