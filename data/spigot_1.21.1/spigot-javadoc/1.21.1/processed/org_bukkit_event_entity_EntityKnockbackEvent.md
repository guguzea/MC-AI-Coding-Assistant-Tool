---
title: "org.bukkit.event.entity.EntityKnockbackEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.entity.EntityKnockbackEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityKnockbackEvent(org.bukkit.entity.LivingEntity, org.bukkit.event.entity.EntityKnockbackEvent$KnockbackCause, double, org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public org.bukkit.entity.LivingEntity getEntity()`
- `public org.bukkit.event.entity.EntityKnockbackEvent$KnockbackCause getCause()`
- `public double getForce()`
- `public org.bukkit.util.Vector getKnockback()`
- `public org.bukkit.util.Vector getFinalKnockback()`
- `public void setFinalKnockback(org.bukkit.util.Vector)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
