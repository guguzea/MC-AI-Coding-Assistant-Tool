---
title: "org.bukkit.event.entity.EntityTeleportEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityTeleportEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityTeleportEvent**
`public class EntityTeleportEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityTeleportEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @Nullable @Nullable Location to)`
- `@NotNull public @NotNull Location getFrom()`
- `public void setFrom(@NotNull @NotNull Location from)`
- `@Nullable public @Nullable Location getTo()`
- `public void setTo(@Nullable @Nullable Location to)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
