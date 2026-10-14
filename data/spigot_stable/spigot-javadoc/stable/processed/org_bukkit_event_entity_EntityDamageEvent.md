---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityDamageEvent**
`public class EntityDamageEvent extends EntityEvent implements Cancellable`
- `@Deprecated(since="1.20.4", forRemoval=true) public EntityDamageEvent(@NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `public EntityDamageEvent(@NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, @NotNull DamageSource damageSource, double damage)`
- `@Deprecated(since="1.20.4", forRemoval=true) public EntityDamageEvent(@NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `public EntityDamageEvent(@NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, @NotNull DamageSource damageSource, @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public double getOriginalDamage(@NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public void setDamage(@NotNull EntityDamageEvent.DamageModifier type, double damage) throws IllegalArgumentException, UnsupportedOperationException`
- `public double getDamage(@NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public boolean isApplicable(@NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public double getDamage()`
- `public final double getFinalDamage()`
- `public void setDamage(double damage)`
- `@NotNull public EntityDamageEvent.DamageCause getCause()`
- `@NotNull public DamageSource getDamageSource()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
