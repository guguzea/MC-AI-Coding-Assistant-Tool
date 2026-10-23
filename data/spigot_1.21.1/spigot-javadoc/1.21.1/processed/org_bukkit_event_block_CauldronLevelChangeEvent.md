---
title: "org.bukkit.event.block.CauldronLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.block.CauldronLevelChangeEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.CauldronLevelChangeEvent(org.bukkit.block.Block, org.bukkit.entity.Entity, org.bukkit.event.block.CauldronLevelChangeEvent$ChangeReason, org.bukkit.block.BlockState)`
- `public org.bukkit.entity.Entity getEntity()`
- `public org.bukkit.event.block.CauldronLevelChangeEvent$ChangeReason getReason()`
- `public org.bukkit.block.BlockState getNewState()`
- `public int getOldLevel()`
- `public int getNewLevel()`
- `public void setNewLevel(int)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
