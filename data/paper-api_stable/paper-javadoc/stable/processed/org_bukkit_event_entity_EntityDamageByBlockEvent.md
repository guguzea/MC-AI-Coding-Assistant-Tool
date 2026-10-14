---
title: "org.bukkit.event.entity.EntityDamageByBlockEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityDamageByBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityDamageByBlockEvent**
`public class EntityDamageByBlockEvent extends EntityDamageEvent`
- `@Internal @Deprecated(since="1.20.4", forRemoval=true) public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `@Internal @Deprecated(forRemoval=true) public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @Nullable @Nullable BlockState damagerState, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, double damage)`
- `@Internal @Deprecated(since="1.20.4", forRemoval=true) public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `@Internal public EntityDamageByBlockEvent(@Nullable @Nullable Block damager, @Nullable @Nullable BlockState damagerState, @NotNull @NotNull Entity damagee, @NotNull @NotNull EntityDamageEvent.DamageCause cause, @NotNull @NotNull DamageSource damageSource, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `@Nullable public @Nullable Block getDamager()`
- `@Nullable public @Nullable BlockState getDamagerBlockState()`
