---
title: "org.bukkit.event.entity.EnderDragonChangePhaseEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.entity.EnderDragonChangePhaseEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EnderDragonChangePhaseEvent(org.bukkit.entity.EnderDragon, org.bukkit.entity.EnderDragon$Phase, org.bukkit.entity.EnderDragon$Phase)`
- `public org.bukkit.entity.EnderDragon getEntity()`
- `public org.bukkit.entity.EnderDragon$Phase getCurrentPhase()`
- `public org.bukkit.entity.EnderDragon$Phase getNewPhase()`
- `public void setNewPhase(org.bukkit.entity.EnderDragon$Phase)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public org.bukkit.entity.Entity getEntity()`
