---
title: "org.bukkit.event.entity.EntityDamageByEntityEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityDamageByEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public EntityDamageByEntityEvent(@NotNull @NotNull Entity damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `@Deprecated public EntityDamageByEntityEvent(@NotNull @NotNull Entity damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions)`
- `public EntityDamageByEntityEvent(@NotNull @NotNull Entity damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions, boolean critical)`
- `public boolean isCritical()`
- `@NotNull public @NotNull Entity getDamager()`
