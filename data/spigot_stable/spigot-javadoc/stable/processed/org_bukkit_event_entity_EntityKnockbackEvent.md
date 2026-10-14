---
title: "org.bukkit.event.entity.EntityKnockbackEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityKnockbackEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityKnockbackEvent**
`public class EntityKnockbackEvent extends EntityEvent implements Cancellable`
- `public EntityKnockbackEvent(@NotNull LivingEntity entity, @NotNull EntityKnockbackEvent.KnockbackCause cause, double force, @NotNull Vector rawKnockback, @NotNull Vector knockback)`
- `@NotNull public LivingEntity getEntity()`
- `@NotNull public EntityKnockbackEvent.KnockbackCause getCause()`
- `public double getForce()`
- `@NotNull public Vector getKnockback()`
- `@NotNull public Vector getFinalKnockback()`
- `@NotNull public void setFinalKnockback(@NotNull Vector knockback)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
