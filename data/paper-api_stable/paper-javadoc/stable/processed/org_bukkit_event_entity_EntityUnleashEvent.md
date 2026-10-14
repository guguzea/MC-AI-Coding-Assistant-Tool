---
title: "org.bukkit.event.entity.EntityUnleashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityUnleashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityUnleashEvent**
`public class EntityUnleashEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public EntityUnleashEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull EntityUnleashEvent.UnleashReason reason)`
- `@Internal public EntityUnleashEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull EntityUnleashEvent.UnleashReason reason, boolean dropLeash)`
- `@NotNull public @NotNull EntityUnleashEvent.UnleashReason getReason()`
- `public boolean isDropLeash()`
- `public void setDropLeash(boolean dropLeash)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
