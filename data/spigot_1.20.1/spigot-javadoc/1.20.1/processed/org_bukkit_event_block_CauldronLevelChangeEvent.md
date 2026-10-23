---
title: "org.bukkit.event.block.CauldronLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
