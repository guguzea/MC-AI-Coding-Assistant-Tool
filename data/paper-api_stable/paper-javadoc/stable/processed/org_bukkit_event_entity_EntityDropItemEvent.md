---
title: "org.bukkit.event.entity.EntityDropItemEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityDropItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDropItemEvent**
`public class EntityDropItemEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityDropItemEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Item drop)`
- `@NotNull public @NotNull Item getItemDrop()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
