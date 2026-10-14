---
title: "org.bukkit.event.entity.EntityPortalExitEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityPortalExitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityPortalExitEvent**
`public class EntityPortalExitEvent extends EntityTeleportEvent`
- `@Internal public EntityPortalExitEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull Location from, @NotNull @NotNull Location to, @NotNull @NotNull Vector before, @NotNull @NotNull Vector after)`
- `@NotNull public @NotNull Vector getBefore()`
- `@NotNull public @NotNull Vector getAfter()`
- `public void setAfter(@NotNull @NotNull Vector after)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
