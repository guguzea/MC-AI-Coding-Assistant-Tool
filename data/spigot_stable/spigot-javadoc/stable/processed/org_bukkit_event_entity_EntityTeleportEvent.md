---
title: "org.bukkit.event.entity.EntityTeleportEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityTeleportEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityTeleportEvent**
`public class EntityTeleportEvent extends EntityEvent implements Cancellable`
- `public EntityTeleportEvent(@NotNull Entity what, @NotNull Location from, @Nullable Location to)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Location getFrom()`
- `public void setFrom(@NotNull Location from)`
- `@Nullable public Location getTo()`
- `public void setTo(@Nullable Location to)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
