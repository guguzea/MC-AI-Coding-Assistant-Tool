---
title: "org.bukkit.event.entity.EntityInteractEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityInteractEvent**
`public class EntityInteractEvent extends EntityEvent implements Cancellable`
- `protected Block block`
- `@Internal public EntityInteractEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Block block)`
- `@NotNull public @NotNull Block getBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
