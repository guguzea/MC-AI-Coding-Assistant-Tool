---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.entity.EntityDamageEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityDamageEvent(org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, double)`
- `public org.bukkit.event.entity.EntityDamageEvent(org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, org.bukkit.damage.DamageSource, double)`
- `public org.bukkit.event.entity.EntityDamageEvent(org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, java.lang.Double>, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, ? extends com.google.common.base.Function<? super java.lang.Double, java.lang.Double>>)`
- `public org.bukkit.event.entity.EntityDamageEvent(org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, org.bukkit.damage.DamageSource, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, java.lang.Double>, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, ? extends com.google.common.base.Function<? super java.lang.Double, java.lang.Double>>)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public double getOriginalDamage(org.bukkit.event.entity.EntityDamageEvent$DamageModifier) throws java.lang.IllegalArgumentException`
- `public void setDamage(org.bukkit.event.entity.EntityDamageEvent$DamageModifier, double) throws java.lang.IllegalArgumentException, java.lang.UnsupportedOperationException`
- `public double getDamage(org.bukkit.event.entity.EntityDamageEvent$DamageModifier) throws java.lang.IllegalArgumentException`
- `public boolean isApplicable(org.bukkit.event.entity.EntityDamageEvent$DamageModifier) throws java.lang.IllegalArgumentException`
- `public double getDamage()`
- `public final double getFinalDamage()`
- `public void setDamage(double)`
- `public org.bukkit.event.entity.EntityDamageEvent$DamageCause getCause()`
- `public org.bukkit.damage.DamageSource getDamageSource()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
