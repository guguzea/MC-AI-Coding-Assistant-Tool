---
title: "org.bukkit.event.entity.EntityMountEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityMountEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityMountEvent**
`public class EntityMountEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityMountEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Entity mount)`
- `@NotNull public @NotNull Entity getMount()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
