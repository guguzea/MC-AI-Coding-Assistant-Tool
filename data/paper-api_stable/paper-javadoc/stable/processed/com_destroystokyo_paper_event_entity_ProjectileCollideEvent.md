---
title: "com.destroystokyo.paper.event.entity.ProjectileCollideEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/entity/ProjectileCollideEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ProjectileCollideEvent**
`@Deprecated(since="1.19.3") public class ProjectileCollideEvent extends EntityEvent implements Cancellable`
- `@Internal public ProjectileCollideEvent(@NotNull @NotNull Projectile projectile, @NotNull @NotNull Entity collidedWith)`
- `@NotNull public @NotNull Projectile getEntity()`
- `@NotNull public @NotNull Entity getCollidedWith()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull HandlerList getHandlers()`
