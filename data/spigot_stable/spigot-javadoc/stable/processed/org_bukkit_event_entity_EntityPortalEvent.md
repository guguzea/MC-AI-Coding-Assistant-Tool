---
title: "org.bukkit.event.entity.EntityPortalEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityPortalEvent**
`public class EntityPortalEvent extends EntityTeleportEvent`
- `public EntityPortalEvent(@NotNull Entity entity, @NotNull Location from, @Nullable Location to)`
- `public EntityPortalEvent(@NotNull Entity entity, @NotNull Location from, @Nullable Location to, int searchRadius)`
- `public EntityPortalEvent(@NotNull Entity entity, @NotNull Location from, @Nullable Location to, int searchRadius, boolean canCreatePortal, int creationRadius)`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean canCreatePortal)`
- `public void setCreationRadius(int creationRadius)`
- `public int getCreationRadius()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
