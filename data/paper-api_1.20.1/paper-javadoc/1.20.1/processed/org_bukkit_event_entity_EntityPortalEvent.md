---
title: "org.bukkit.event.entity.EntityPortalEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius)`
- `public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius, @NotNull PortalType portalType)`
- `@NotNull public PortalType getPortalType()`
- `@Nullable public @Nullable Location getTo()`
- `public void setTo(@Nullable @Nullable Location to)`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
