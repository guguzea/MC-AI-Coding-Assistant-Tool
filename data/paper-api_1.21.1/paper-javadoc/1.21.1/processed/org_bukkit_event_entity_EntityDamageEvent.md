---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/EntityDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, double damage)`
- `@Deprecated(forRemoval=true) public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions)`
- `public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public double getOriginalDamage(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public void setDamage(@NotNull @NotNull EntityDamageEvent.DamageModifier type, double damage) throws IllegalArgumentException, UnsupportedOperationException`
- `public double getDamage(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public boolean isApplicable(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public double getDamage()`
- `public final double getFinalDamage()`
- `public void setDamage(double damage)`
- `@NotNull public @NotNull EntityDamageEvent.DamageCause getCause()`
- `@NotNull public @NotNull DamageSource getDamageSource()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
