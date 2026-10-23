---
title: "org.bukkit.event.entity.LingeringPotionSplashEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.entity.LingeringPotionSplashEvent extends org.bukkit.event.entity.ProjectileHitEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.LingeringPotionSplashEvent(org.bukkit.entity.ThrownPotion, org.bukkit.entity.AreaEffectCloud)`
- `public org.bukkit.event.entity.LingeringPotionSplashEvent(org.bukkit.entity.ThrownPotion, org.bukkit.entity.Entity, org.bukkit.block.Block, org.bukkit.block.BlockFace, org.bukkit.entity.AreaEffectCloud)`
- `public org.bukkit.entity.ThrownPotion getEntity()`
- `public org.bukkit.entity.AreaEffectCloud getAreaEffectCloud()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Projectile getEntity()`
- `public org.bukkit.entity.Entity getEntity()`
