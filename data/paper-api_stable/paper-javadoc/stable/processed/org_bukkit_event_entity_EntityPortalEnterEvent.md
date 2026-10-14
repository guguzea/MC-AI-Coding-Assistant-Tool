---
title: "org.bukkit.event.entity.EntityPortalEnterEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityPortalEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityPortalEnterEvent**
`public class EntityPortalEnterEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(since="1.21") public EntityPortalEnterEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location location)`
- `@Internal public EntityPortalEnterEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location location, @NotNull @NotNull PortalType portalType)`
- `@NotNull public @NotNull Location getLocation()`
- `public @NotNull PortalType getPortalType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
