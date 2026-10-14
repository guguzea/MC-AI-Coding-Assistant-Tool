---
title: "org.bukkit.event.entity.EntityKnockbackEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityKnockbackEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityKnockbackEvent**
`@Deprecated(forRemoval=true) public class EntityKnockbackEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityKnockbackEvent(@NotNull @NotNull LivingEntity entity, @NotNull @NotNull EntityKnockbackEvent.KnockbackCause cause, double force, @NotNull @NotNull Vector rawKnockback, @NotNull @NotNull Vector knockback)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull EntityKnockbackEvent.KnockbackCause getCause()`
- `public double getForce()`
- `@NotNull public @NotNull Vector getKnockback()`
- `@NotNull public @NotNull Vector getFinalKnockback()`
- `@NotNull public void setFinalKnockback(@NotNull @NotNull Vector knockback)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
