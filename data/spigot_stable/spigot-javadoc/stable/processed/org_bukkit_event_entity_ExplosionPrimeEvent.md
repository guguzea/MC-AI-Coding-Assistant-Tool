---
title: "org.bukkit.event.entity.ExplosionPrimeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/ExplosionPrimeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ExplosionPrimeEvent**
`public class ExplosionPrimeEvent extends EntityEvent implements Cancellable`
- `public ExplosionPrimeEvent(@NotNull Entity what, float radius, boolean fire)`
- `public ExplosionPrimeEvent(@NotNull Explosive explosive)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public float getRadius()`
- `public void setRadius(float radius)`
- `public boolean getFire()`
- `public void setFire(boolean fire)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
