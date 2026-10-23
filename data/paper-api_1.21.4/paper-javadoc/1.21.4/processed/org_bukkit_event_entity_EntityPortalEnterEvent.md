---
title: "org.bukkit.event.entity.EntityPortalEnterEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/entity/EntityPortalEnterEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(since="1.21") public EntityPortalEnterEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location location)`
- `@Internal public EntityPortalEnterEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location location, @NotNull PortalType portalType)`
- `@NotNull public @NotNull Location getLocation()`
- `public @NotNull PortalType getPortalType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
