---
title: "org.bukkit.event.entity.EntityDamageEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public class org.bukkit.event.entity.EntityDamageEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityDamageEvent(org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, double)`
- `public org.bukkit.event.entity.EntityDamageEvent(org.bukkit.entity.Entity, org.bukkit.event.entity.EntityDamageEvent$DamageCause, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, java.lang.Double>, java.util.Map<org.bukkit.event.entity.EntityDamageEvent$DamageModifier, ? extends com.google.common.base.Function<? super java.lang.Double, java.lang.Double>>)`
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
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
