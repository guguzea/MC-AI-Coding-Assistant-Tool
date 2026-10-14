---
title: "org.bukkit.event.entity.EntityDismountEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityDismountEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDismountEvent**
`public class EntityDismountEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityDismountEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Entity dismounted)`
- `@Internal public EntityDismountEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Entity dismounted, boolean isCancellable)`
- `@NotNull public @NotNull Entity getDismounted()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancellable()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
