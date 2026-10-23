---
title: "org.bukkit.event.entity.EntityPotionEffectEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
