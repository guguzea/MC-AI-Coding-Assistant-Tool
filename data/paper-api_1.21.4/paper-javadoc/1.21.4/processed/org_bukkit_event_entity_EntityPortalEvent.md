---
title: "org.bukkit.event.entity.EntityPortalEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/entity/EntityPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius)`
- `public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius, boolean canCreatePortal, int creationRadius)`
- `@Internal public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius, boolean canCreatePortal, int creationRadius, @NotNull PortalType portalType)`
- `@NotNull public PortalType getPortalType()`
- `@Nullable public @Nullable Location getTo()`
- `public void setTo(@Nullable @Nullable Location to)`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean canCreatePortal)`
- `public void setCreationRadius(int creationRadius)`
- `public int getCreationRadius()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
