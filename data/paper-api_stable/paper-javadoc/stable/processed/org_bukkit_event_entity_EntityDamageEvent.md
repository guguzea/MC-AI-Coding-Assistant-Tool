---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDamageEvent**
`public class EntityDamageEvent extends EntityEvent implements Cancellable`
- `@Internal @Deprecated(since="1.20.4", forRemoval=true) public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `@Internal @Deprecated(forRemoval=true) public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, double damage)`
- `@Internal @Deprecated(since="1.20.4", forRemoval=true) public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `@Internal public EntityDamageEvent(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `public double getOriginalDamage(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public void setDamage(@NotNull @NotNull EntityDamageEvent.DamageModifier type, double damage) throws IllegalArgumentException, UnsupportedOperationException`
- `public double getDamage(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public boolean isApplicable(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public double getDamage()`
- `public final double getFinalDamage()`
- `public void setDamage(double damage)`
- `@NotNull public @NotNull EntityDamageEvent.DamageCause getCause()`
- `@NotNull public @NotNull DamageSource getDamageSource()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
