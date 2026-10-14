---
title: "org.bukkit.event.entity.EntityDamageByEntityEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityDamageByEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityDamageByEntityEvent**
`public class EntityDamageByEntityEvent extends EntityDamageEvent`
- `@Deprecated(since="1.20.4", forRemoval=true) public EntityDamageByEntityEvent(@NotNull Entity damager, @NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, double damage)`
- `public EntityDamageByEntityEvent(@NotNull Entity damager, @NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, @NotNull DamageSource damageSource, double damage)`
- `@Deprecated(since="1.20.4", forRemoval=true) public EntityDamageByEntityEvent(@NotNull Entity damager, @NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `public EntityDamageByEntityEvent(@NotNull Entity damager, @NotNull Entity damagee, @NotNull EntityDamageEvent.DamageCause cause, @NotNull DamageSource damageSource, @NotNull Map<EntityDamageEvent.DamageModifier, Double> modifiers, @NotNull Map<EntityDamageEvent.DamageModifier, ? extends Function<? super Double, Double>> modifierFunctions)`
- `@NotNull public Entity getDamager()`
