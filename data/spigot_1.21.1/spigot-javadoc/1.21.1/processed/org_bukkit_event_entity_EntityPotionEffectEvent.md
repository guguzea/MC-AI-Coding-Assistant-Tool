---
title: "org.bukkit.event.entity.EntityPotionEffectEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.entity.EntityPotionEffectEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityPotionEffectEvent(org.bukkit.entity.LivingEntity, org.bukkit.potion.PotionEffect, org.bukkit.potion.PotionEffect, org.bukkit.event.entity.EntityPotionEffectEvent$Cause, org.bukkit.event.entity.EntityPotionEffectEvent$Action, boolean)`
- `public org.bukkit.potion.PotionEffect getOldEffect()`
- `public org.bukkit.potion.PotionEffect getNewEffect()`
- `public org.bukkit.event.entity.EntityPotionEffectEvent$Cause getCause()`
- `public org.bukkit.event.entity.EntityPotionEffectEvent$Action getAction()`
- `public org.bukkit.potion.PotionEffectType getModifiedType()`
- `public boolean isOverride()`
- `public void setOverride(boolean)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
