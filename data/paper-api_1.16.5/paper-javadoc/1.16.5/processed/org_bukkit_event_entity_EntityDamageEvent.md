---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EntityDamageEvent&#8203;(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `public EntityDamageEvent&#8203;(@NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,&#8203;Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,&#8203;? extends Function<? super Double,&#8203;Double>> modifierFunctions)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `public double getOriginalDamage&#8203;(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public void setDamage&#8203;(@NotNull @NotNull EntityDamageEvent.DamageModifier type, double damage) throws IllegalArgumentException, UnsupportedOperationException`
- `public double getDamage&#8203;(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public boolean isApplicable&#8203;(@NotNull @NotNull EntityDamageEvent.DamageModifier type) throws IllegalArgumentException`
- `public double getDamage()`
- `public final double getFinalDamage()`
- `public void setDamage&#8203;(double damage)`
- `@NotNull public @NotNull EntityDamageEvent.DamageCause getCause()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
