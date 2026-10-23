---
title: "org.bukkit.event.entity.EntityDamageByBlockEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/entity/EntityDamageByBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @Nullable @Nullable BlockState damagerState, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, double damage)`
- `@Deprecated(forRemoval=true) public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions)`
- `public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @Nullable @Nullable BlockState damagerState, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions)`
- `@Nullable public @Nullable Block getDamager()`
- `@Nullable public @Nullable BlockState getDamagerBlockState()`
