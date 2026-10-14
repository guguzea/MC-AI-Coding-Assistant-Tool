---
title: "org.bukkit.event.entity.ExplosionPrimeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/ExplosionPrimeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class ExplosionPrimeEvent**
`public class ExplosionPrimeEvent extends EntityEvent implements Cancellable`
- `@Internal public ExplosionPrimeEvent(@NotNull @NotNull Entity entity, float radius, boolean fire)`
- `@Internal public ExplosionPrimeEvent(@NotNull @NotNull Explosive explosive)`
- `public float getRadius()`
- `public void setRadius(float radius)`
- `public boolean getFire()`
- `public void setFire(boolean fire)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
