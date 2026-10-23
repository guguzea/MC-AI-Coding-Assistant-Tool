---
title: "org.bukkit.event.entity.EntityKnockbackEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/EntityKnockbackEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public EntityKnockbackEvent(@NotNull @NotNull LivingEntity entity, @NotNull @NotNull EntityKnockbackEvent.KnockbackCause cause, double force, @NotNull @NotNull Vector rawKnockback, @NotNull @NotNull Vector knockback)`
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
