---
title: "org.bukkit.event.entity.CreeperPowerEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.entity.CreeperPowerEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.CreeperPowerEvent(org.bukkit.entity.Creeper, org.bukkit.entity.LightningStrike, org.bukkit.event.entity.CreeperPowerEvent$PowerCause)`
- `public org.bukkit.event.entity.CreeperPowerEvent(org.bukkit.entity.Creeper, org.bukkit.event.entity.CreeperPowerEvent$PowerCause)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.entity.Creeper getEntity()`
- `public org.bukkit.entity.LightningStrike getLightning()`
- `public org.bukkit.event.entity.CreeperPowerEvent$PowerCause getCause()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
