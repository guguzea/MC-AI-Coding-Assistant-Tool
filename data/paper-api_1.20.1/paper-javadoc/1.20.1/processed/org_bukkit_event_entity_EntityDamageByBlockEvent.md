---
title: "org.bukkit.event.entity.EntityDamageByBlockEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityDamageByBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `@Internal public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage, @Nullable BlockState damagerBlockState)`
- `public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions)`
- `@Internal public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier,? extends Function<? super Double,Double>> modifierFunctions, @Nullable BlockState damagerBlockState)`
- `@Nullable public @Nullable Block getDamager()`
- `@Nullable public BlockState getDamagerBlockState()`
