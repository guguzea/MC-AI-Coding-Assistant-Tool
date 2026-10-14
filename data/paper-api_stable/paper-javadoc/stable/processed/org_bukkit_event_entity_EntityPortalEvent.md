---
title: "org.bukkit.event.entity.EntityPortalEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityPortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityPortalEvent**
`public class EntityPortalEvent extends EntityTeleportEvent`
- `@Internal public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `@Internal public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius)`
- `@Internal public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius, boolean canCreatePortal, int creationRadius)`
- `@Internal public EntityPortalEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to, int searchRadius, boolean canCreatePortal, int creationRadius, @NotNull @NotNull PortalType portalType)`
- `@Nullable public @Nullable Location getTo()`
- `public void setTo(@Nullable @Nullable Location to)`
- `@NotNull public @NotNull PortalType getPortalType()`
- `public void setSearchRadius(int searchRadius)`
- `public int getSearchRadius()`
- `public boolean getCanCreatePortal()`
- `public void setCanCreatePortal(boolean canCreatePortal)`
- `public void setCreationRadius(int creationRadius)`
- `public int getCreationRadius()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
